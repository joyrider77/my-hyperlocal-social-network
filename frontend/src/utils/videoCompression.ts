// Video compression utility for client-side video compression with enhanced audio preservation
export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight?: number;
  quality?: number;
  fileType?: string;
}

export interface CompressionProgress {
  progress: number;
  stage: 'analyzing' | 'compressing' | 'finalizing';
}

export class VideoCompressor {
  async compressVideo(
    file: File,
    options: CompressionOptions,
    onProgress?: (progress: CompressionProgress) => void
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      
      // Configure video element for optimal audio/video processing
      video.preload = 'metadata';
      video.muted = false; // Keep unmuted to preserve audio during processing
      video.crossOrigin = 'anonymous';
      video.playsInline = true;
      
      video.onloadedmetadata = async () => {
        try {
          onProgress?.({ progress: 10, stage: 'analyzing' });
          
          // Calculate target dimensions
          const { width, height } = this.calculateDimensions(
            video.videoWidth,
            video.videoHeight,
            options.maxWidthOrHeight || 1920
          );

          // Calculate target bitrate based on file size and duration
          const targetBitrate = this.calculateBitrate(options, video.duration);
          
          onProgress?.({ progress: 20, stage: 'compressing' });
          
          // Create optimized media stream with proper audio/video handling
          const stream = await this.createOptimizedStream(video, width, height);
          
          // Configure MediaRecorder with enhanced audio/video settings
          const mimeType = this.getSupportedMimeType();
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: targetBitrate,
            audioBitsPerSecond: 192000 // Higher audio bitrate for better quality
          });

          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            onProgress?.({ progress: 90, stage: 'finalizing' });
            
            const blob = new Blob(chunks, { type: mimeType });
            const compressedFile = new File([blob], this.generateFileName(file.name), {
              type: blob.type,
              lastModified: Date.now()
            });

            // Clean up streams
            stream.getTracks().forEach(track => track.stop());

            onProgress?.({ progress: 100, stage: 'finalizing' });
            resolve(compressedFile);
          };

          mediaRecorder.onerror = (event) => {
            // Clean up streams on error
            stream.getTracks().forEach(track => track.stop());
            reject(new Error('Fehler bei der Videokomprimierung: ' + (event as any).error?.message || 'Unbekannter Fehler'));
          };

          // Start recording
          mediaRecorder.start(1000); // Record in 1-second chunks for better stability
          
          // Play video at normal speed to preserve duration and audio sync
          video.currentTime = 0;
          video.playbackRate = 1.0;
          video.volume = 1.0; // Ensure full volume for audio capture
          
          // Start playback
          const playPromise = video.play();
          if (playPromise) {
            await playPromise.catch((error) => {
              console.warn('Autoplay prevented, continuing with manual playback:', error);
            });
          }

          // Track progress during recording
          const progressInterval = setInterval(() => {
            if (video.duration > 0) {
              const progress = Math.min(80, 20 + (video.currentTime / video.duration) * 60);
              onProgress?.({ progress, stage: 'compressing' });
            }
          }, 500);

          // Stop recording when video ends
          video.onended = () => {
            clearInterval(progressInterval);
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
          };

          // Fallback timeout to prevent hanging
          setTimeout(() => {
            clearInterval(progressInterval);
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
          }, (video.duration + 10) * 1000); // Video duration + 10 seconds buffer

        } catch (error) {
          reject(error);
        }
      };

      video.onerror = () => reject(new Error('Fehler beim Laden des Videos'));
      video.src = URL.createObjectURL(file);
      video.load();
    });
  }

  private async createOptimizedStream(
    video: HTMLVideoElement, 
    targetWidth: number, 
    targetHeight: number
  ): Promise<MediaStream> {
    // Create canvas for video processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Configure canvas for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Get video stream from canvas with higher frame rate for smoother playback
    const videoStream = canvas.captureStream(30);
    
    // Create a more reliable audio stream using getUserMedia approach
    let audioStream: MediaStream | null = null;
    
    try {
      // Method 1: Try to capture audio directly from the video element
      if ('captureStream' in video) {
        const originalStream = (video as any).captureStream();
        const audioTracks = originalStream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioStream = new MediaStream(audioTracks);
        }
      }
    } catch (error) {
      console.warn('Direct video audio capture failed:', error);
    }

    // Method 2: Fallback to Web Audio API for audio processing
    if (!audioStream) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const destination = audioContext.createMediaStreamDestination();
        
        // Create a gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1.0;
        
        // Connect: source -> gain -> destination
        source.connect(gainNode);
        gainNode.connect(destination);
        
        // Also connect to audio output so we can hear it during processing
        gainNode.connect(audioContext.destination);
        
        audioStream = destination.stream;
      } catch (error) {
        console.warn('Web Audio API audio capture failed:', error);
      }
    }

    // Combine video and audio streams
    const combinedStream = new MediaStream();
    
    // Add video track
    const videoTrack = videoStream.getVideoTracks()[0];
    if (videoTrack) {
      combinedStream.addTrack(videoTrack);
    }
    
    // Add audio track if available
    if (audioStream) {
      const audioTrack = audioStream.getAudioTracks()[0];
      if (audioTrack) {
        combinedStream.addTrack(audioTrack);
      }
    }

    // Enhanced frame drawing with better timing
    let animationId: number;
    const drawFrame = () => {
      if (!video.paused && !video.ended) {
        // Clear canvas and draw video frame
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        animationId = requestAnimationFrame(drawFrame);
      }
    };

    // Start drawing when video plays
    video.addEventListener('play', () => {
      drawFrame();
    });

    // Stop drawing when video pauses or ends
    video.addEventListener('pause', () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });

    video.addEventListener('ended', () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
    
    return combinedStream;
  }

  private getSupportedMimeType(): string {
    // Check for supported video formats with audio codecs in order of preference
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm;codecs=vp9,vorbis',
      'video/webm;codecs=vp8,vorbis',
      'video/webm',
      'video/mp4;codecs=h264,aac',
      'video/mp4;codecs=h264,mp3',
      'video/mp4'
    ];

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }

    return 'video/webm'; // Fallback
  }

  private generateFileName(originalName: string): string {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const supportedMimeType = this.getSupportedMimeType();
    
    if (supportedMimeType.includes('webm')) {
      return `${nameWithoutExt}_compressed.webm`;
    } else if (supportedMimeType.includes('mp4')) {
      return `${nameWithoutExt}_compressed.mp4`;
    }
    
    return `${nameWithoutExt}_compressed.webm`;
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxDimension: number
  ): { width: number; height: number } {
    if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
      return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;
    
    if (originalWidth > originalHeight) {
      return {
        width: maxDimension,
        height: Math.round(maxDimension / aspectRatio)
      };
    } else {
      return {
        width: Math.round(maxDimension * aspectRatio),
        height: maxDimension
      };
    }
  }

  private calculateBitrate(options: CompressionOptions, duration: number): number {
    // Calculate bitrate to achieve target file size while preserving quality
    const targetSizeBits = options.maxSizeMB * 8 * 1024 * 1024;
    const durationSeconds = duration || 60;
    
    // Reserve 25% for audio and container overhead (increased for better audio quality)
    const videoBitrate = (targetSizeBits * 0.75) / durationSeconds;
    
    // Apply quality factor (0.1 to 1.0)
    const quality = options.quality || 0.8; // Higher default quality for better audio/video preservation
    const finalBitrate = videoBitrate * quality;
    
    // Set reasonable bounds (min 750kbps for decent quality, max 12Mbps)
    return Math.max(750000, Math.min(12000000, finalBitrate));
  }
}

// Utility function to check if browser supports video compression with audio
export function isVideoCompressionSupported(): boolean {
  try {
    // Check for MediaRecorder support
    if (!window.MediaRecorder) {
      return false;
    }

    // Check for canvas stream support
    const canvas = document.createElement('canvas');
    if (!canvas.captureStream) {
      return false;
    }

    // Check for Web Audio API support
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      return false;
    }

    // Check for at least one supported video format with audio
    const supportedFormats = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9,vorbis',
      'video/webm;codecs=vp8,vorbis',
      'video/webm',
      'video/mp4;codecs=h264,aac',
      'video/mp4'
    ];

    return supportedFormats.some(format => MediaRecorder.isTypeSupported(format));
  } catch {
    return false;
  }
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
