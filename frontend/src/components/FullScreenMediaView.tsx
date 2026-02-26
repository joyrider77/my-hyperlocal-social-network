import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useFileUrl } from '../blob-storage/FileStorage';

interface FullScreenMediaViewProps {
  isOpen: boolean;
  onClose: () => void;
  mediaPath: string;
  isVideo?: boolean;
  mediaList?: Array<{ path: string; isVideo: boolean }>;
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

export default function FullScreenMediaView({
  isOpen,
  onClose,
  mediaPath,
  isVideo = false,
  mediaList = [],
  currentIndex = 0,
  onNavigate
}: FullScreenMediaViewProps) {
  const { data: mediaUrl, isLoading } = useFileUrl(mediaPath);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasNavigation = mediaList.length > 1;
  const canGoLeft = hasNavigation && currentIndex > 0;
  const canGoRight = hasNavigation && currentIndex < mediaList.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (canGoLeft && onNavigate) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (canGoRight && onNavigate) {
            onNavigate(currentIndex + 1);
          }
          break;
        case ' ':
          e.preventDefault();
          if (isVideo && videoRef.current) {
            togglePlay();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canGoLeft, canGoRight, currentIndex, onNavigate, isVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="flex items-center justify-center h-[80vh]">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!mediaUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="flex items-center justify-center h-[80vh] text-white">
            <p>Medien konnten nicht geladen werden</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          {hasNavigation && (
            <>
              {canGoLeft && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.(currentIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              )}
              {canGoRight && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.(currentIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              )}
            </>
          )}

          {/* Media Content */}
          <div className="w-full h-full flex items-center justify-center p-4">
            {isVideo ? (
              <div className="relative max-w-full max-h-full">
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  className="max-w-full max-h-[90vh] object-contain"
                  controls={false}
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onLoadedData={handleVideoLoad}
                  onClick={togglePlay}
                >
                  Ihr Browser unterstützt das Video-Element nicht.
                </video>
                
                {/* Video Controls - Only one set */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 bg-black/70 rounded-lg p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 w-10 h-10"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 w-10 h-10"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
              </div>
            ) : (
              <img
                src={mediaUrl}
                alt="Vollbild Ansicht"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Media Counter */}
          {hasNavigation && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {mediaList.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
