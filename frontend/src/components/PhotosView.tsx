import React, { useState } from 'react';
import { useGetMedia, useAddMedia, useDeleteMedia, useGetMediaReactions, useAddMediaReaction, useRemoveMediaReaction, useGetAlbums, useCreateAlbum, useGetAlbumMedia, useAddMediaToAlbum, useRemoveMediaFromAlbum, useGetCallerUserProfile } from '../hooks/useQueries';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Camera, Upload, Image as ImageIcon, Video as VideoIcon, X, ChevronLeft, ChevronRight, Info, Trash2, Heart, ThumbsUp, Smile, Star, FolderPlus, Folder, ArrowLeft, MoveUp, Play, Pause } from 'lucide-react';
import { useTranslations } from '../utils/translations';
import { toast } from 'sonner';
import VideoCompressionDialog from './VideoCompressionDialog';
import FullScreenMediaView from './FullScreenMediaView';

const emojiReactions = [
  { emoji: '❤️', icon: Heart, label: 'Herz' },
  { emoji: '👍', icon: ThumbsUp, label: 'Daumen hoch' },
  { emoji: '😊', icon: Smile, label: 'Lächeln' },
  { emoji: '⭐', icon: Star, label: 'Stern' },
];

type View = 'overview' | 'album';

export default function PhotosView() {
  const { data: media, isLoading: mediaLoading } = useGetMedia();
  const { data: albums, isLoading: albumsLoading } = useGetAlbums();
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const addMedia = useAddMedia();
  const deleteMedia = useDeleteMedia();
  const createAlbum = useCreateAlbum();
  const addMediaToAlbum = useAddMediaToAlbum();
  const { uploadFile, isUploading } = useFileUpload();
  const t = useTranslations(userProfile?.language);
  
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isCompressionDialogOpen, setIsCompressionDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<any>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [wasCompressed, setWasCompressed] = useState(false);

  const currentUserPrincipal = identity?.getPrincipal().toString();
  const mediaPerPage = 6;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset compression state
    setWasCompressed(false);

    if (file.type.startsWith('image/')) {
      // Check file size (10MB limit for images)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Die Bilddatei ist zu groß. Maximale Dateigröße: 10 MB');
        return;
      }
      setSelectedFile(file);
      setFileType('image');
    } else if (file.type.startsWith('video/')) {
      // Check file size (50MB limit for videos)
      if (file.size > 50 * 1024 * 1024) {
        // Show compression dialog for large videos
        setSelectedFile(file);
        setFileType('video');
        setIsCompressionDialogOpen(true);
        return;
      }
      setSelectedFile(file);
      setFileType('video');
    } else {
      toast.error('Bitte wählen Sie eine gültige Bild- oder Videodatei aus');
    }
  };

  const handleCompressionComplete = (compressedFile: File) => {
    setSelectedFile(compressedFile);
    setFileType('video');
    setWasCompressed(true);
    setIsCompressionDialogOpen(false);
    
    toast.success('Video wurde erfolgreich komprimiert! Sie können jetzt einen Titel eingeben und das Video hinzufügen.');
  };

  const handleCompressionDeclined = () => {
    // Reset file selection and close compression dialog
    setSelectedFile(null);
    setFileType(null);
    setWasCompressed(false);
    setIsCompressionDialogOpen(false);
    
    // Keep the main dialog open so user can select a different file
    toast.info('Sie können ein anderes Video auswählen oder ein kleineres Video (unter 50 MB) verwenden.');
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile || !fileType) return;

    try {
      const isVideo = fileType === 'video';
      const folderName = isVideo ? 'videos' : 'photos';
      const filePath = `${folderName}/${Date.now()}-${selectedFile.name}`;
      
      // Upload the file first
      await uploadFile(filePath, selectedFile);

      // Then add it to the backend
      await addMedia.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        filePath,
        isVideo,
      });

      // Reset form state
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setFileType(null);
      setIsMediaDialogOpen(false);
      
      // Show appropriate success message based on whether video was compressed
      if (isVideo && wasCompressed) {
        toast.success('Komprimiertes Video wurde erfolgreich hochgeladen und ist jetzt in der Galerie verfügbar!');
      } else if (isVideo) {
        toast.success('Video wurde erfolgreich hochgeladen und ist jetzt in der Galerie verfügbar!');
      } else {
        toast.success('Bild wurde erfolgreich hochgeladen und ist jetzt in der Galerie verfügbar!');
      }
      
      setWasCompressed(false);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Fehler beim Hochladen des ${fileType === 'video' ? 'Videos' : 'Bildes'}: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;

    createAlbum.mutate(albumTitle.trim(), {
      onSuccess: () => {
        setAlbumTitle('');
        setIsAlbumDialogOpen(false);
        toast.success('Album wurde erfolgreich erstellt!');
      },
    });
  };

  const handleDeleteMedia = (mediaId: string) => {
    deleteMedia.mutate(mediaId, {
      onSuccess: () => {
        toast.success('Medium wurde erfolgreich gelöscht!');
      },
      onError: (error) => {
        console.error('Delete media error:', error);
        toast.error(`Fehler beim Löschen des Mediums: ${error.message}`);
      },
    });
  };

  const canDeleteMedia = (mediaItem: any): boolean => {
    if (!currentUserPrincipal) return false;
    return mediaItem.uploadedBy.toString() === currentUserPrincipal;
  };

  const openFullscreen = (mediaItem: any, mediaList: any[]) => {
    const mediaIndex = mediaList.findIndex(m => m.id === mediaItem.id) || 0;
    setCurrentMediaIndex(mediaIndex);
    setFullscreenMedia({ media: mediaItem, mediaList });
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
    setCurrentMediaIndex(0);
  };

  const navigateMedia = (newIndex: number) => {
    if (!fullscreenMedia?.mediaList || fullscreenMedia.mediaList.length <= 1) return;
    
    if (newIndex >= 0 && newIndex < fullscreenMedia.mediaList.length) {
      setCurrentMediaIndex(newIndex);
      setFullscreenMedia({
        ...fullscreenMedia,
        media: fullscreenMedia.mediaList[newIndex]
      });
    }
  };

  const openAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentView('album');
  };

  const backToOverview = () => {
    setCurrentView('overview');
    setSelectedAlbumId(null);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setWasCompressed(false);
  };

  if (mediaLoading || albumsLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="aspect-square bg-muted animate-pulse rounded-t-lg"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'album' && selectedAlbumId) {
    return <AlbumView albumId={selectedAlbumId} onBack={backToOverview} onOpenFullscreen={openFullscreen} t={t} />;
  }

  // Paginate media
  const totalPages = Math.ceil((media?.length || 0) / mediaPerPage);
  const paginatedMedia = media?.slice(currentPage * mediaPerPage, (currentPage + 1) * mediaPerPage) || [];

  return (
    <>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Medien</h2>
          <div className="flex gap-2">
            <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Album erstellen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAlbumSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="albumTitle">Album-Titel</Label>
                    <Input
                      id="albumTitle"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Album-Name eingeben"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createAlbum.isPending}
                  >
                    {createAlbum.isPending ? 'Erstellt...' : 'Album erstellen'}
                  </Button>
                  {createAlbum.error && (
                    <p className="text-sm text-destructive">
                      Fehler: {createAlbum.error.message}
                    </p>
                  )}
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog 
              open={isMediaDialogOpen} 
              onOpenChange={(open) => {
                setIsMediaDialogOpen(open);
                if (!open) {
                  // Reset form when dialog closes
                  setTitle('');
                  setDescription('');
                  clearSelectedFile();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Medien hinzufügen
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Bild oder Video hinzufügen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleMediaSubmit} className="space-y-4">
                  {/* Upload Requirements Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Upload-Anforderungen:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Bilder: Max. 10 MB (JPG, PNG, GIF, WebP)</li>
                          <li>• Videos: Max. 50 MB (MP4, WebM, MOV)</li>
                          <li>• Bei größeren Videos wird automatisch eine Komprimierung angeboten</li>
                          <li>• Empfohlene Auflösung: bis zu 4000x4000 Pixel</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="media">Bild oder Video auswählen</Label>
                    <Input
                      id="media"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi"
                      onChange={handleFileSelect}
                      required={!selectedFile}
                    />
                    {selectedFile && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-center gap-2">
                          {fileType === 'video' ? (
                            <VideoIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-green-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-green-800">
                              <strong>{selectedFile.name}</strong>
                              {wasCompressed && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">komprimiert</span>}
                            </p>
                            <p className="text-xs text-green-600">
                              Typ: {fileType === 'video' ? 'Video' : 'Bild'} | Größe: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearSelectedFile}
                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={fileType === 'video' ? 'Beschreibe das Video' : 'Beschreibe das Bild'}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Beschreibung (optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Weitere Details..."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={addMedia.isPending || isUploading || !selectedFile || !title.trim()}
                  >
                    {addMedia.isPending || isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Lädt hoch...
                      </div>
                    ) : (
                      fileType === 'video' ? 'Video hinzufügen' : 'Bild hinzufügen'
                    )}
                  </Button>
                  {addMedia.error && (
                    <p className="text-sm text-destructive">
                      Fehler: {addMedia.error.message}
                    </p>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="media">Bilder & Videos</TabsTrigger>
            <TabsTrigger value="albums">Alben</TabsTrigger>
          </TabsList>
          
          <TabsContent value="media" className="space-y-4">
            {/* Media Grid */}
            {media?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center gap-2 mb-4">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                    <VideoIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Noch keine Bilder oder Videos vorhanden</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Teile die ersten Netzwerkerinnerungen!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {paginatedMedia.map((mediaItem) => (
                    <MediaCard 
                      key={mediaItem.id} 
                      media={mediaItem} 
                      onOpenFullscreen={(mediaItem) => openFullscreen(mediaItem, media || [])}
                      onDelete={handleDeleteMedia}
                      canDelete={canDeleteMedia(mediaItem)}
                      showAlbumActions={true}
                      t={t}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Seite {currentPage + 1} von {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="albums" className="space-y-4">
            {/* Albums Grid */}
            {albums?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Noch keine Alben vorhanden</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Erstelle das erste Album!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {albums?.map((album) => (
                  <AlbumCard 
                    key={album.id} 
                    album={album} 
                    onClick={() => openAlbum(album.id)}
                    t={t}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Compression Dialog */}
      {selectedFile && isCompressionDialogOpen && (
        <VideoCompressionDialog
          isOpen={isCompressionDialogOpen}
          onClose={() => setIsCompressionDialogOpen(false)}
          file={selectedFile}
          onCompressionComplete={handleCompressionComplete}
          onCompressionDeclined={handleCompressionDeclined}
        />
      )}

      {/* Fullscreen Media Modal */}
      {fullscreenMedia && (
        <FullScreenMediaView
          isOpen={true}
          onClose={closeFullscreen}
          mediaPath={fullscreenMedia.media.filePath}
          isVideo={fullscreenMedia.media.isVideo}
          mediaList={fullscreenMedia.mediaList?.map((m: any) => ({ path: m.filePath, isVideo: m.isVideo })) || []}
          currentIndex={currentMediaIndex}
          onNavigate={navigateMedia}
        />
      )}
    </>
  );
}

function AlbumView({ albumId, onBack, onOpenFullscreen, t }: { albumId: string; onBack: () => void; onOpenFullscreen: (media: any, mediaList: any[]) => void; t: any }) {
  const { data: albums } = useGetAlbums();
  const { data: albumMedia, isLoading } = useGetAlbumMedia(albumId);
  const removeMediaFromAlbum = useRemoveMediaFromAlbum();
  const { identity } = useInternetIdentity();

  const currentUserPrincipal = identity?.getPrincipal().toString();
  const album = albums?.find(a => a.id === albumId);

  const handleRemoveFromAlbum = (mediaId: string) => {
    removeMediaFromAlbum.mutate({ albumId, mediaId });
  };

  const canManageAlbum = (album: any): boolean => {
    if (!currentUserPrincipal || !album) return false;
    return album.createdBy.toString() === currentUserPrincipal;
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{album?.title}</h2>
          <p className="text-sm text-muted-foreground">
            {albumMedia?.length || 0} {albumMedia?.length === 1 ? 'Medium' : 'Medien'}
          </p>
        </div>
      </div>

      {/* Album Media */}
      {albumMedia?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center gap-2 mb-4">
              <Camera className="w-12 h-12 text-muted-foreground" />
              <VideoIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Noch keine Medien in diesem Album</p>
            <p className="text-sm text-muted-foreground mt-1">
              Füge Bilder und Videos aus der Hauptübersicht hinzu!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {albumMedia?.map((mediaItem) => (
            <MediaCard 
              key={mediaItem.id} 
              media={mediaItem} 
              onOpenFullscreen={(mediaItem) => onOpenFullscreen(mediaItem, albumMedia || [])}
              onDelete={() => {}}
              canDelete={false}
              showAlbumActions={false}
              albumActions={canManageAlbum(album) ? {
                onRemoveFromAlbum: () => handleRemoveFromAlbum(mediaItem.id)
              } : undefined}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AlbumCard({ album, onClick, t }: { album: any; onClick: () => void; t: any }) {
  const { data: albumMedia } = useGetAlbumMedia(album.id);
  const { data: firstMediaUrl } = useFileUrl(albumMedia?.[0]?.filePath || '');
  const firstMedia = albumMedia?.[0];

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-0">
        <div className="aspect-square bg-muted flex items-center justify-center relative">
          {firstMediaUrl ? (
            <>
              {firstMedia?.isVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={firstMediaUrl}
                    className="w-full h-full object-cover rounded-t-lg"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-t-lg">
                    <VideoIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={firstMediaUrl}
                  alt={album.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              )}
            </>
          ) : (
            <Folder className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-1">{album.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {albumMedia?.length || 0} {(albumMedia?.length || 0) === 1 ? 'Medium' : 'Medien'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MediaCard({ 
  media, 
  onOpenFullscreen, 
  onDelete, 
  canDelete,
  showAlbumActions = false,
  albumActions,
  t
}: { 
  media: any; 
  onOpenFullscreen: (media: any) => void;
  onDelete: (mediaId: string) => void;
  canDelete: boolean;
  showAlbumActions?: boolean;
  albumActions?: {
    onRemoveFromAlbum: () => void;
  };
  t: any;
}) {
  const { data: mediaUrl, isLoading } = useFileUrl(media.filePath);
  const { data: reactions } = useGetMediaReactions(media.id);
  const { data: albums } = useGetAlbums();
  const addReaction = useAddMediaReaction();
  const removeReaction = useRemoveMediaReaction();
  const addMediaToAlbum = useAddMediaToAlbum();
  const { identity } = useInternetIdentity();
  const [showAlbumSelect, setShowAlbumSelect] = useState(false);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleReaction = (emoji: string) => {
    const existingReaction = reactions?.find(([reactionEmoji]) => reactionEmoji === emoji);
    const hasUserReacted = existingReaction && Number(existingReaction[1]) > 0;

    if (hasUserReacted) {
      removeReaction.mutate({ mediaId: media.id, emoji }, {
        onError: (error) => {
          if (error.message.includes('You have not reacted with this emoji')) {
            addReaction.mutate({ mediaId: media.id, emoji });
          }
        },
      });
    } else {
      addReaction.mutate({ mediaId: media.id, emoji }, {
        onError: (error) => {
          if (error.message.includes('You have already reacted with this emoji')) {
            removeReaction.mutate({ mediaId: media.id, emoji });
          }
        },
      });
    }
  };

  const handleAddToAlbum = (albumId: string) => {
    addMediaToAlbum.mutate({ albumId, mediaId: media.id }, {
      onSuccess: () => {
        setShowAlbumSelect(false);
        toast.success(`${media.isVideo ? 'Video' : 'Bild'} wurde zum Album hinzugefügt!`);
      },
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="aspect-square bg-muted flex items-center justify-center cursor-pointer relative"
          onClick={() => onOpenFullscreen(media)}
        >
          {isLoading ? (
            <div className="animate-pulse bg-muted w-full h-full flex items-center justify-center">
              {media.isVideo ? (
                <VideoIcon className="w-8 h-8 text-muted-foreground" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          ) : mediaUrl ? (
            <>
              {media.isVideo ? (
                <div className="relative w-full h-full">
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <VideoIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={mediaUrl}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              )}
            </>
          ) : (
            media.isVideo ? (
              <VideoIcon className="w-8 h-8 text-muted-foreground" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm line-clamp-2 flex-1">{media.title}</h3>
            <div className="flex gap-1 ml-2 shrink-0">
              {showAlbumActions && (
                <Dialog open={showAlbumSelect} onOpenChange={setShowAlbumSelect}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <FolderPlus className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Zu Album hinzufügen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {albums?.map((album) => (
                        <Button
                          key={album.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleAddToAlbum(album.id)}
                          disabled={addMediaToAlbum.isPending}
                        >
                          <Folder className="w-4 h-4 mr-2" />
                          {album.title}
                        </Button>
                      ))}
                      {albums?.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Noch keine Alben vorhanden
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {albumActions && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={albumActions.onRemoveFromAlbum}
                  className="h-6 w-6 text-orange-600 hover:text-orange-700"
                  title="Aus Album entfernen"
                >
                  <MoveUp className="w-3 h-3" />
                </Button>
              )}
              
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-6 w-6"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{media.isVideo ? 'Video löschen' : 'Bild löschen'}</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bist du sicher, dass du {media.isVideo ? 'dieses Video' : 'dieses Bild'} löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(media.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          
          {media.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {media.description}
            </p>
          )}
          
          {/* Emoji Reactions */}
          <div className="flex gap-1 flex-wrap">
            {emojiReactions.map((reaction) => {
              const reactionData = reactions?.find(([emoji]) => emoji === reaction.emoji);
              const count = reactionData ? Number(reactionData[1]) : 0;
              
              return (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-primary/10 flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReaction(reaction.emoji);
                  }}
                  disabled={addReaction.isPending || removeReaction.isPending}
                >
                  {reaction.emoji}
                  {count > 0 && <span className="text-xs">{count}</span>}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
