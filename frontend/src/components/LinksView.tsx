import { useState } from 'react';
import { useGetLinks, useAddLink, useEditLink, useDeleteLink, useGetUserProfile, useGetCallerUserProfile, useFetchLinkPreview, useGetDefaultPreviewImage, useGetAllTags } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Link as LinkIcon, ExternalLink, Edit, Trash2, User, Save, X, Image as ImageIcon, Globe, Tag, Filter, FilterX } from 'lucide-react';
import { useTranslations } from '../utils/translations';

// Internet Computer logo as fallback
const IC_LOGO_URL = 'https://internetcomputer.org/img/IC_logo_horizontal.svg';

export default function LinksView() {
  const { data: links, isLoading } = useGetLinks();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: defaultPreviewImage } = useGetDefaultPreviewImage();
  const { data: defaultPreviewImageUrl } = useFileUrl(defaultPreviewImage || '');
  const { data: allTags } = useGetAllTags();
  const { identity } = useInternetIdentity();
  const addLink = useAddLink();
  const editLink = useEditLink();
  const deleteLink = useDeleteLink();
  const fetchPreview = useFetchLinkPreview();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('');
  const t = useTranslations(userProfile?.language);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  // Filter links based on selected tag - show ALL links when no filter is selected
  const filteredLinks = selectedTagFilter 
    ? links?.filter(link => link.tags.includes(selectedTagFilter))
    : links; // Show all links when no filter is selected

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    
    // Auto-fetch preview when URL is entered
    if (newUrl.trim() && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
      setIsFetchingPreview(true);
      try {
        const preview = await fetchPreview.mutateAsync(newUrl.trim());
        setPreviewImage(preview);
      } catch (error) {
        console.error('Failed to fetch preview:', error);
        setPreviewImage(null);
      } finally {
        setIsFetchingPreview(false);
      }
    } else {
      setPreviewImage(null);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    // Add https:// if no protocol is specified
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (editingLink) {
      editLink.mutate(
        {
          id: editingLink.id,
          url: formattedUrl,
          title: title.trim(),
          description: description.trim() || null,
          previewImage,
          tags,
        },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    } else {
      addLink.mutate(
        {
          url: formattedUrl,
          title: title.trim(),
          description: description.trim() || null,
          previewImage,
          tags,
        },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    }
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setTags([]);
    setNewTag('');
    setPreviewImage(null);
    setEditingLink(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (link: any) => {
    setEditingLink(link);
    setUrl(link.url);
    setTitle(link.title);
    setDescription(link.description || '');
    setTags(link.tags || []);
    setPreviewImage(link.previewImage || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (linkId: string) => {
    deleteLink.mutate(linkId);
  };

  const canEditLink = (link: any): boolean => {
    if (!currentUserPrincipal) return false;
    return link.addedBy.toString() === currentUserPrincipal;
  };

  const clearTagFilter = () => {
    setSelectedTagFilter('');
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.linkCollection}</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t.link}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? t.editLink : t.addLink}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="url">{t.url}</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
                {isFetchingPreview && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Lade Vorschau...
                  </p>
                )}
              </div>

              {/* Preview Image Display */}
              {previewImage && (
                <div className="space-y-2">
                  <Label>Vorschaubild</Label>
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Link Vorschau"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={() => setPreviewImage(null)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setPreviewImage(null)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="title">{t.title}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Beschreibender Titel"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">{t.description} ({t.optional})</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.whyInteresting}
                  rows={3}
                />
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <Label>Tags</Label>
                
                {/* Existing Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Neuen Tag hinzufügen..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || tags.includes(newTag.trim())}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Existing Tags from All Links (for quick selection) */}
                {allTags && allTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Vorhandene Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(allTags))
                        .filter(tag => !tags.includes(tag))
                        .slice(0, 10)
                        .map((tag, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              if (!tags.includes(tag)) {
                                setTags([...tags, tag]);
                              }
                            }}
                          >
                            + {tag}
                          </Button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={addLink.isPending || editLink.isPending || isFetchingPreview}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {addLink.isPending || editLink.isPending 
                    ? t.saving
                    : editingLink 
                      ? t.saveChanges
                      : t.addLink
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
              </div>
              {(addLink.error || editLink.error) && (
                <p className="text-sm text-destructive">
                  {t.error}: {addLink.error?.message || editLink.error?.message}
                </p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tag Filter */}
      {allTags && allTags.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Nach Tag filtern:</Label>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Select value={selectedTagFilter} onValueChange={setSelectedTagFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tag auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(allTags)).sort().map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTagFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTagFilter}
                    className="flex items-center gap-1"
                  >
                    <FilterX className="w-4 h-4" />
                    Filter entfernen
                  </Button>
                )}
              </div>
            </div>
            {selectedTagFilter && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Gefiltert nach:</span>
                <Badge variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {selectedTagFilter}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({filteredLinks?.length || 0} {filteredLinks?.length === 1 ? 'Link' : 'Links'})
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {filteredLinks?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {selectedTagFilter 
                  ? `Keine Links mit dem Tag "${selectedTagFilter}" gefunden`
                  : t.noLinks
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTagFilter 
                  ? 'Versuche einen anderen Tag oder entferne den Filter'
                  : t.collectInterestingLinks
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLinks?.map((link) => (
            <LinkCard 
              key={link.id} 
              link={link} 
              canEdit={canEditLink(link)}
              onEdit={() => handleEdit(link)}
              onDelete={() => handleDelete(link.id)}
              isDeleting={deleteLink.isPending}
              defaultPreviewImageUrl={defaultPreviewImageUrl}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LinkCard({ 
  link, 
  canEdit, 
  onEdit, 
  onDelete, 
  isDeleting,
  defaultPreviewImageUrl,
  t
}: { 
  link: any; 
  canEdit: boolean; 
  onEdit: () => void; 
  onDelete: () => void;
  isDeleting: boolean;
  defaultPreviewImageUrl?: string;
  t: any;
}) {
  const { data: creatorProfile } = useGetUserProfile(link.addedBy);
  const creatorName = creatorProfile?.name || `Benutzer ${link.addedBy.toString().slice(0, 8)}...`;
  const [imageError, setImageError] = useState(false);

  // Determine which image to show
  const getPreviewImage = () => {
    if (imageError || !link.previewImage) {
      // Use custom default preview image if available, otherwise use IC logo
      return defaultPreviewImageUrl || IC_LOGO_URL;
    }
    return link.previewImage;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if we should use object-contain (for fallback images) or object-cover (for regular previews)
  const getImageObjectFit = () => {
    if (imageError || !link.previewImage) {
      // Use object-contain for fallback images to ensure they're fully visible
      return 'object-contain';
    }
    return 'object-cover';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Preview Image */}
          <div className="shrink-0">
            <img
              src={getPreviewImage()}
              alt={link.title}
              className={`w-20 h-20 ${getImageObjectFit()} rounded-lg border`}
              onError={handleImageError}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg truncate flex-1 pr-2">{link.title}</h3>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.openLink}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                {canEdit && (
                  <>
                    <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.deleteLinkConfirm}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t.deleteLinkDescription}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Löscht...' : t.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-primary hover:underline mb-2 truncate">
              {link.url}
            </p>
            {link.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{link.description}</p>
            )}
            
            {/* Tags */}
            {link.tags && link.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {link.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{t.by} {creatorName}</span>
              </div>
              {canEdit && (
                <span className="text-primary font-medium">{t.canEditLink}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
