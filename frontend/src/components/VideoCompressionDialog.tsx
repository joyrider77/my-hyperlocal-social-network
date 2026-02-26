import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Video, Zap, CheckCircle, XCircle, Volume2, Clock, FileVideo, Headphones, Music } from 'lucide-react';
import { VideoCompressor, CompressionProgress, formatFileSize, isVideoCompressionSupported } from '../utils/videoCompression';

interface VideoCompressionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: File;
  onCompressionComplete: (compressedFile: File) => void;
  onCompressionDeclined: () => void;
  autoUpload?: boolean;
}

export default function VideoCompressionDialog({
  isOpen,
  onClose,
  file,
  onCompressionComplete,
  onCompressionDeclined,
  autoUpload = false
}: VideoCompressionDialogProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<CompressionProgress>({ progress: 0, stage: 'analyzing' });
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);

  const fileSizeMB = file.size / (1024 * 1024);
  const isSupported = isVideoCompressionSupported();

  const handleCompress = async () => {
    if (!isSupported) {
      setCompressionError('Videokomprimierung wird von Ihrem Browser nicht unterstützt.');
      return;
    }

    setIsCompressing(true);
    setCompressionError(null);
    setCompressedFile(null);

    try {
      const compressor = new VideoCompressor();
      const compressed = await compressor.compressVideo(
        file,
        {
          maxSizeMB: 45, // Target 45MB to stay well under 50MB limit
          maxWidthOrHeight: 1920,
          quality: 0.8 // Higher quality to preserve video and audio
        },
        setCompressionProgress
      );

      setCompressedFile(compressed);
      setIsCompressing(false);

      // Automatically proceed with the compressed file
      onCompressionComplete(compressed);
      onClose();
    } catch (error) {
      console.error('Compression error:', error);
      setCompressionError(error instanceof Error ? error.message : 'Unbekannter Fehler bei der Komprimierung');
      setIsCompressing(false);
    }
  };

  const handleDecline = () => {
    onCompressionDeclined();
    onClose();
  };

  const handleCancel = () => {
    // Allow canceling during compression
    if (isCompressing) {
      setIsCompressing(false);
      setCompressionProgress({ progress: 0, stage: 'analyzing' });
    }
    onCompressionDeclined();
    onClose();
  };

  const getStageText = (stage: string) => {
    switch (stage) {
      case 'analyzing':
        return 'Video wird analysiert...';
      case 'compressing':
        return 'Video wird komprimiert...';
      case 'finalizing':
        return 'Komprimierung wird abgeschlossen...';
      default:
        return 'Verarbeitung läuft...';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleCancel();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Video zu groß
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File size info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  Das ausgewählte Video ist zu groß
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Aktuelle Größe: <strong>{formatFileSize(file.size)}</strong>
                </p>
                <p className="text-xs text-orange-700">
                  Maximale Größe: <strong>50 MB</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced compression option with audio emphasis */}
          {!isCompressing && !compressedFile && !compressionError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    Intelligente Komprimierung mit Audio-Erhaltung
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Unsere erweiterte Komprimierung behält die <strong>vollständige Videolänge</strong>, 
                    den <strong>Originalton</strong> und die <strong>Lautstärkeregelung</strong> bei.
                  </p>
                  
                  {/* Enhanced feature highlights */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Clock className="w-3 h-3" />
                      <span>Originale Videolänge wird beibehalten</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Volume2 className="w-3 h-3" />
                      <span>Audio bleibt vollständig erhalten</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Headphones className="w-3 h-3" />
                      <span>Lautstärkeregelung funktioniert einwandfrei</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <Music className="w-3 h-3" />
                      <span>Hohe Audio-Qualität (192 kbps)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <FileVideo className="w-3 h-3" />
                      <span>Optimierte Video-Qualität für beste Ergebnisse</span>
                    </div>
                  </div>
                  
                  {!isSupported && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Ihr Browser unterstützt keine Videokomprimierung mit Audio-Erhaltung.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Compression progress */}
          {isCompressing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">
                  {getStageText(compressionProgress.stage)}
                </span>
              </div>
              <Progress value={compressionProgress.progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(compressionProgress.progress)}% abgeschlossen
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    <span>Audio und Videolänge werden vollständig beibehalten</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <Volume2 className="w-3 h-3" />
                    <span>Lautstärkeregelung wird nach der Komprimierung funktionieren</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compression error */}
          {compressionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    Komprimierung fehlgeschlagen
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {compressionError}
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Tipp: Stellen Sie sicher, dass Ihr Browser Audio-/Video-Aufnahme unterstützt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Initial state - show compress and cancel options */}
          {!isCompressing && !compressedFile && !compressionError && (
            <>
              <Button
                variant="outline"
                onClick={handleDecline}
                className="w-full sm:w-auto"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleCompress}
                disabled={!isSupported}
                className="w-full sm:w-auto"
              >
                <Zap className="w-4 h-4 mr-2" />
                Video komprimieren
              </Button>
            </>
          )}

          {/* During compression - always allow canceling */}
          {isCompressing && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Abbrechen
            </Button>
          )}

          {/* After compression error - allow retry or cancel */}
          {compressionError && (
            <>
              <Button
                variant="outline"
                onClick={handleDecline}
                className="w-full sm:w-auto"
              >
                Anderes Video wählen
              </Button>
              <Button
                onClick={() => {
                  setCompressionError(null);
                  handleCompress();
                }}
                disabled={!isSupported}
                className="w-full sm:w-auto"
              >
                <Zap className="w-4 h-4 mr-2" />
                Erneut versuchen
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
