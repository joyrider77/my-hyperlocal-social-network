import { useState } from 'react';
import { useGetAllRSVPs, useGetInviteCodes, useGenerateInviteCode, useListApprovals, useSetApproval, useGetDashboardName, useSetDashboardName, useGetUserProfile, useGetAllUserProfiles, useGetCallerUserProfile, useRemoveUser, useGetNetworkLogo, useSetNetworkLogo, useGetDefaultPreviewImage, useSetDefaultPreviewImage, useGetBadgeCriteria, useCreateBadgeCriteria, useEditBadgeCriteria, useDeleteBadgeCriteria, useGetCallerUserRole } from '../hooks/useQueries';
import { useFileUrl, useFileUpload } from '../blob-storage/FileStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Plus, Copy, Check, UserCheck, UserX, Clock, Settings, Edit, UserPlus, User, MessageCircle, Trash2, Upload, Image as ImageIcon, Award, Target, Crown, Camera, Calendar, Link, Star, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';
import { ApprovalStatus, UserRole } from '../backend';
import { useTranslations } from '../utils/translations';

const activityTypes = [
  { value: 'chat', label: 'Chat-Nachrichten', icon: MessageCircle },
  { value: 'photos', label: 'Medien-Uploads', icon: Camera },
  { value: 'calendar', label: 'Kalendertermine', icon: Calendar },
  { value: 'links', label: 'Link-Sammlung', icon: Link },
];

const badgeIcons = [
  { value: 'MessageCircle', label: 'Chat', icon: MessageCircle },
  { value: 'Camera', label: 'Kamera', icon: Camera },
  { value: 'Calendar', label: 'Kalender', icon: Calendar },
  { value: 'Link', label: 'Link', icon: Link },
  { value: 'Award', label: 'Auszeichnung', icon: Award },
  { value: 'Star', label: 'Stern', icon: Star },
  { value: 'Trophy', label: 'Pokal', icon: Trophy },
  { value: 'Crown', label: 'Krone', icon: Crown },
];

export default function AdminView() {
  const { data: rsvps } = useGetAllRSVPs();
  const { data: inviteCodes } = useGetInviteCodes();
  const { data: approvals } = useListApprovals();
  const { data: dashboardName } = useGetDashboardName();
  const { data: networkLogo } = useGetNetworkLogo();
  const { data: defaultPreviewImage } = useGetDefaultPreviewImage();
  const { data: allUserProfiles } = useGetAllUserProfiles();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: badgeCriteria } = useGetBadgeCriteria();
  const generateInviteCode = useGenerateInviteCode();
  const setApproval = useSetApproval();
  const setDashboardName = useSetDashboardName();
  const setNetworkLogo = useSetNetworkLogo();
  const setDefaultPreviewImage = useSetDefaultPreviewImage();
  const removeUser = useRemoveUser();
  const createBadgeCriteria = useCreateBadgeCriteria();
  const editBadgeCriteria = useEditBadgeCriteria();
  const deleteBadgeCriteria = useDeleteBadgeCriteria();
  const { uploadFile, isUploading } = useFileUpload();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const [isPreviewImageDialogOpen, setIsPreviewImageDialogOpen] = useState(false);
  const [isBadgeDialogOpen, setIsBadgeDialogOpen] = useState(false);
  const [isEditBadgeDialogOpen, setIsEditBadgeDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<any>(null);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<File | null>(null);
  const [badgeName, setBadgeName] = useState('');
  const [badgeDescription, setBadgeDescription] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('Award');
  const [requiredCount, setRequiredCount] = useState(10);
  const [activityType, setActivityType] = useState('chat');
  const t = useTranslations(userProfile?.language);

  const unusedCodes = inviteCodes?.filter(code => !code.used) || [];
  const attendingCount = rsvps?.filter(rsvp => rsvp.attending).length || 0;
  const pendingApprovals = approvals?.filter(approval => approval.status === ApprovalStatus.pending) || [];
  const allApprovals = approvals || [];

  // Create a map of pending approvals by principal for easy lookup
  const pendingApprovalsMap = new Map(
    pendingApprovals.map(approval => [approval.principal.toString(), approval])
  );

  const copyInviteLink = async (code: string) => {
    const link = `${window.location.origin}?code=${code}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedCode(code);
      toast.success('Einladungslink kopiert!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Fehler beim Kopieren');
    }
  };

  const handleApproval = (userPrincipal: string, status: ApprovalStatus) => {
    setApproval.mutate(
      { user: userPrincipal, status },
      {
        onSuccess: () => {
          toast.success(
            status === ApprovalStatus.approved 
              ? 'Beitrittsanfrage wurde genehmigt!' 
              : 'Beitrittsanfrage wurde abgelehnt!'
          );
        },
        onError: (error) => {
          toast.error(`${t.error}: ${error.message}`);
        },
      }
    );
  };

  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDashboardName.trim()) return;

    setDashboardName.mutate(newDashboardName.trim(), {
      onSuccess: () => {
        toast.success('Dashboard-Name wurde aktualisiert!');
        setIsNameDialogOpen(false);
        setNewDashboardName('');
      },
      onError: (error) => {
        toast.error(`${t.error}: ${error.message}`);
      },
    });
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximale Dateigröße für Logos: 5 MB');
        return;
      }
      setSelectedLogo(file);
    } else {
      alert('Bitte wählen Sie eine gültige Bilddatei aus (JPG, PNG, GIF, WebP)');
    }
  };

  const handlePreviewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximale Dateigröße für Vorschaubilder: 5 MB');
        return;
      }
      setSelectedPreviewImage(file);
    } else {
      alert('Bitte wählen Sie eine gültige Bilddatei aus (JPG, PNG, GIF, WebP)');
    }
  };

  const handleLogoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLogo) return;

    try {
      const filePath = `network-logos/${Date.now()}-${selectedLogo.name}`;
      await uploadFile(filePath, selectedLogo);

      setNetworkLogo.mutate(filePath, {
        onSuccess: () => {
          toast.success('Netzwerk-Logo wurde aktualisiert!');
          setIsLogoDialogOpen(false);
          setSelectedLogo(null);
        },
        onError: (error) => {
          toast.error(`${t.error}: ${error.message}`);
        },
      });
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast.error('Fehler beim Hochladen des Logos');
    }
  };

  const handlePreviewImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPreviewImage) return;

    try {
      const filePath = `default-preview-images/${Date.now()}-${selectedPreviewImage.name}`;
      await uploadFile(filePath, selectedPreviewImage);

      setDefaultPreviewImage.mutate(filePath, {
        onSuccess: () => {
          toast.success('Standard-Vorschaubild wurde aktualisiert!');
          setIsPreviewImageDialogOpen(false);
          setSelectedPreviewImage(null);
        },
        onError: (error) => {
          toast.error(`${t.error}: ${error.message}`);
        },
      });
    } catch (error) {
      console.error('Preview image upload failed:', error);
      toast.error('Fehler beim Hochladen des Vorschaubildes');
    }
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeName.trim() || !badgeDescription.trim()) return;

    try {
      await createBadgeCriteria.mutateAsync({
        name: badgeName.trim(),
        description: badgeDescription.trim(),
        icon: badgeIcon,
        requiredCount,
        activityType
      });
      
      toast.success('Abzeichen-Kriterium wurde erstellt!');
      resetBadgeForm();
      setIsBadgeDialogOpen(false);
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    }
  };

  const handleEditBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge || !badgeName.trim() || !badgeDescription.trim()) return;

    try {
      await editBadgeCriteria.mutateAsync({
        badgeId: editingBadge.id,
        name: badgeName.trim(),
        description: badgeDescription.trim(),
        icon: badgeIcon,
        requiredCount,
        activityType
      });
      
      toast.success('Abzeichen-Kriterium wurde bearbeitet!');
      resetBadgeForm();
      setIsEditBadgeDialogOpen(false);
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    }
  };

  const handleDeleteBadge = async (badgeId: string, badgeName: string) => {
    try {
      await deleteBadgeCriteria.mutateAsync(badgeId);
      toast.success(`Abzeichen-Kriterium "${badgeName}" wurde gelöscht!`);
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    }
  };

  const openEditBadgeDialog = (badge: any) => {
    setEditingBadge(badge);
    setBadgeName(badge.name);
    setBadgeDescription(badge.description);
    setBadgeIcon(badge.icon);
    setRequiredCount(Number(badge.requiredCount));
    setActivityType(badge.activityType);
    setIsEditBadgeDialogOpen(true);
  };

  const resetBadgeForm = () => {
    setBadgeName('');
    setBadgeDescription('');
    setBadgeIcon('Award');
    setRequiredCount(10);
    setActivityType('chat');
    setEditingBadge(null);
  };

  const openNameDialog = () => {
    setNewDashboardName(dashboardName || '');
    setIsNameDialogOpen(true);
  };

  const openLogoDialog = () => {
    setSelectedLogo(null);
    setIsLogoDialogOpen(true);
  };

  const openPreviewImageDialog = () => {
    setSelectedPreviewImage(null);
    setIsPreviewImageDialogOpen(true);
  };

  const handleSendDirectMessage = (userPrincipal: string, userName: string) => {
    toast.info(`Direkte Nachrichten an ${userName} sind noch nicht verfügbar. Diese Funktion wird bald hinzugefügt.`);
  };

  const handleRemoveUser = (userPrincipal: string, userName: string) => {
    removeUser.mutate(userPrincipal, {
      onSuccess: () => {
        toast.success(`${userName} wurde erfolgreich aus dem Netzwerk entfernt.`);
      },
      onError: (error) => {
        toast.error(`Fehler beim Entfernen von ${userName}: ${error.message}`);
      },
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.adminArea}</h2>
        <p className="text-muted-foreground">{t.manageInvitations}</p>
      </div>

      {/* Dashboard Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t.dashboardSettings}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dashboard Name */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">{t.dashboardName}</p>
              <p className="text-sm text-muted-foreground">{dashboardName || 'My Hyperlocal Social Network'}</p>
            </div>
            <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={openNameDialog}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t.edit}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.changeDashboardName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNameChange} className="space-y-4">
                  <div>
                    <Label htmlFor="dashboardName">{t.newName}</Label>
                    <Input
                      id="dashboardName"
                      value={newDashboardName}
                      onChange={(e) => setNewDashboardName(e.target.value)}
                      placeholder="Dashboard-Name eingeben"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={setDashboardName.isPending || !newDashboardName.trim()}
                  >
                    {setDashboardName.isPending ? t.saving : t.saveName}
                  </Button>
                  {setDashboardName.error && (
                    <p className="text-sm text-destructive">
                      {t.error}: {setDashboardName.error.message}
                    </p>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Network Logo */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">{t.networkLogo}</p>
                <p className="text-sm text-muted-foreground">
                  {networkLogo ? 'Logo hochgeladen' : 'Kein Logo hochgeladen'}
                </p>
              </div>
              {networkLogo && <NetworkLogoPreview logoPath={networkLogo} />}
            </div>
            <Dialog open={isLogoDialogOpen} onOpenChange={setIsLogoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={openLogoDialog}>
                  <Upload className="w-4 h-4 mr-2" />
                  {t.uploadLogo}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.uploadLogo}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogoUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="logoFile">Logo-Datei auswählen</Label>
                    <Input
                      id="logoFile"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleLogoSelect}
                      required
                    />
                    {selectedLogo && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          <strong>{selectedLogo.name}</strong>
                        </p>
                        <p className="text-xs text-green-600">
                          Größe: {(selectedLogo.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximale Dateigröße: 5 MB. Unterstützte Formate: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={setNetworkLogo.isPending || isUploading || !selectedLogo}
                  >
                    {setNetworkLogo.isPending || isUploading ? 'Lädt hoch...' : 'Logo hochladen'}
                  </Button>
                  {setNetworkLogo.error && (
                    <p className="text-sm text-destructive">
                      {t.error}: {setNetworkLogo.error.message}
                    </p>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Default Preview Image */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">Standard-Vorschaubild für Links</p>
                <p className="text-sm text-muted-foreground">
                  {defaultPreviewImage ? 'Benutzerdefiniertes Vorschaubild hochgeladen' : 'Kein benutzerdefiniertes Vorschaubild'}
                </p>
              </div>
              {defaultPreviewImage && <DefaultPreviewImagePreview imagePath={defaultPreviewImage} />}
            </div>
            <Dialog open={isPreviewImageDialogOpen} onOpenChange={setIsPreviewImageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={openPreviewImageDialog}>
                  <Upload className="w-4 h-4 mr-2" />
                  Vorschaubild hochladen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Standard-Vorschaubild hochladen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePreviewImageUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="previewImageFile">Vorschaubild-Datei auswählen</Label>
                    <Input
                      id="previewImageFile"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handlePreviewImageSelect}
                      required
                    />
                    {selectedPreviewImage && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          <strong>{selectedPreviewImage.name}</strong>
                        </p>
                        <p className="text-xs text-green-600">
                          Größe: {(selectedPreviewImage.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Dieses Bild wird als Standard-Vorschaubild für fehlerhafte oder nicht ladbare Link-Vorschauen verwendet.
                      <br />
                      Maximale Dateigröße: 5 MB. Unterstützte Formate: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={setDefaultPreviewImage.isPending || isUploading || !selectedPreviewImage}
                  >
                    {setDefaultPreviewImage.isPending || isUploading ? 'Lädt hoch...' : 'Vorschaubild hochladen'}
                  </Button>
                  {setDefaultPreviewImage.error && (
                    <p className="text-sm text-destructive">
                      {t.error}: {setDefaultPreviewImage.error.message}
                    </p>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Badge Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t.badgeManagement}
            </CardTitle>
            <Dialog open={isBadgeDialogOpen} onOpenChange={(open) => {
              setIsBadgeDialogOpen(open);
              if (!open) resetBadgeForm();
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Kriterium erstellen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.createBadgeCriteria}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateBadge} className="space-y-4">
                  <div>
                    <Label htmlFor="badgeName">{t.badgeName}</Label>
                    <Input
                      id="badgeName"
                      value={badgeName}
                      onChange={(e) => setBadgeName(e.target.value)}
                      placeholder="z.B. Super Kommunikator"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="badgeDescription">{t.badgeDescription}</Label>
                    <Textarea
                      id="badgeDescription"
                      value={badgeDescription}
                      onChange={(e) => setBadgeDescription(e.target.value)}
                      placeholder="Beschreibung des Abzeichens..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="badgeIcon">{t.badgeIcon}</Label>
                    <Select value={badgeIcon} onValueChange={setBadgeIcon}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {badgeIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="activityType">{t.activityType}</Label>
                    <Select value={activityType} onValueChange={setActivityType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="requiredCount">{t.requiredCount}</Label>
                    <Input
                      id="requiredCount"
                      type="number"
                      min="1"
                      max="1000"
                      value={requiredCount}
                      onChange={(e) => setRequiredCount(parseInt(e.target.value) || 10)}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createBadgeCriteria.isPending || !badgeName.trim() || !badgeDescription.trim()}
                    >
                      {createBadgeCriteria.isPending ? t.processing : 'Erstellen'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsBadgeDialogOpen(false)}
                      disabled={createBadgeCriteria.isPending}
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm text-muted-foreground">
            {t.manageBadgeCriteria}
          </p>
        </CardHeader>
        <CardContent>
          {!badgeCriteria || badgeCriteria.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Noch keine Abzeichen-Kriterien</p>
              <p className="text-sm text-muted-foreground mt-1">
                Erstelle Kriterien für Abzeichen!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {badgeCriteria.map((criteria) => (
                <BadgeCriteriaCard 
                  key={criteria.id} 
                  criteria={criteria} 
                  onEdit={() => openEditBadgeDialog(criteria)}
                  onDelete={() => handleDeleteBadge(criteria.id, criteria.name)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Badge Dialog */}
      <Dialog open={isEditBadgeDialogOpen} onOpenChange={(open) => {
        setIsEditBadgeDialogOpen(open);
        if (!open) resetBadgeForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Abzeichen-Kriterium bearbeiten</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBadge} className="space-y-4">
            <div>
              <Label htmlFor="editBadgeName">{t.badgeName}</Label>
              <Input
                id="editBadgeName"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                placeholder="z.B. Super Kommunikator"
                required
              />
            </div>

            <div>
              <Label htmlFor="editBadgeDescription">{t.badgeDescription}</Label>
              <Textarea
                id="editBadgeDescription"
                value={badgeDescription}
                onChange={(e) => setBadgeDescription(e.target.value)}
                placeholder="Beschreibung des Abzeichens..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="editBadgeIcon">{t.badgeIcon}</Label>
              <Select value={badgeIcon} onValueChange={setBadgeIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {badgeIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        <icon.icon className="w-4 h-4" />
                        {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="editActivityType">{t.activityType}</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="editRequiredCount">{t.requiredCount}</Label>
              <Input
                id="editRequiredCount"
                type="number"
                min="1"
                max="1000"
                value={requiredCount}
                onChange={(e) => setRequiredCount(parseInt(e.target.value) || 10)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={editBadgeCriteria.isPending || !badgeName.trim() || !badgeDescription.trim()}
              >
                {editBadgeCriteria.isPending ? t.processing : 'Speichern'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditBadgeDialogOpen(false)}
                disabled={editBadgeCriteria.isPending}
              >
                {t.cancel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t.userManagement}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.manageAllMembers}
          </p>
        </CardHeader>
        <CardContent>
          {!allUserProfiles || allUserProfiles.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Keine Benutzer gefunden</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allUserProfiles.map(([principal, profile]) => {
                const principalString = principal.toString();
                const pendingApproval = pendingApprovalsMap.get(principalString);
                
                return (
                  <UserManagementCard
                    key={principalString}
                    principal={principal}
                    profile={profile}
                    pendingApproval={pendingApproval}
                    onSendMessage={() => handleSendDirectMessage(principalString, profile.name)}
                    onRemoveUser={() => handleRemoveUser(principalString, profile.name)}
                    onApprove={() => handleApproval(principalString, ApprovalStatus.approved)}
                    onReject={() => handleApproval(principalString, ApprovalStatus.rejected)}
                    isRemoving={removeUser.isPending}
                    isProcessingApproval={setApproval.isPending}
                    t={t}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fixed Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{unusedCodes.length}</div>
            <p className="text-sm text-muted-foreground">Einladungen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{allUserProfiles?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Bestätigt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</div>
            <p className="text-sm text-muted-foreground">Wartende Anfragen</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Join Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {t.manageJoinRequests}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.manageJoinRequestsDesc}
          </p>
        </CardHeader>
        <CardContent>
          {allApprovals.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Keine Beitrittsanfragen vorhanden</p>
              <p className="text-sm text-muted-foreground mt-1">
                Alle Anfragen wurden bereits bearbeitet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                {allApprovals.length} {allApprovals.length === 1 ? 'Beitrittsanfrage' : 'Beitrittsanfragen'} insgesamt
              </div>
              {allApprovals.map(approval => (
                <JoinRequestCard
                  key={approval.principal.toString()}
                  approval={approval}
                  onApprove={() => handleApproval(approval.principal.toString(), ApprovalStatus.approved)}
                  onReject={() => handleApproval(approval.principal.toString(), ApprovalStatus.rejected)}
                  isLoading={setApproval.isPending}
                  t={t}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Codes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t.inviteCodes}
            </CardTitle>
            <Button
              size="sm"
              onClick={() => generateInviteCode.mutate()}
              disabled={generateInviteCode.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              {generateInviteCode.isPending ? t.creatingCode : t.newCode}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {unusedCodes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t.noActiveCodes}
            </p>
          ) : (
            unusedCodes.map(code => (
              <div
                key={code.code}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                    {code.code}
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.created}: {format(new Date(Number(code.created / BigInt(1000000))), 'dd.MM.yyyy HH:mm', { locale: de })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyInviteLink(code.code)}
                  className="shrink-0"
                >
                  {copiedCode === code.code ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))
          )}
          {generateInviteCode.error && (
            <p className="text-sm text-destructive">
              {t.error}: {generateInviteCode.error.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* RSVP History */}
      <Card>
        <CardHeader>
          <CardTitle>{t.invitationHistory}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.invitationHistoryDesc}
          </p>
        </CardHeader>
        <CardContent>
          {rsvps?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t.noRequests}
            </p>
          ) : (
            <div className="space-y-3">
              {rsvps?.map(rsvp => (
                <div
                  key={rsvp.inviteCode}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{rsvp.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(Number(rsvp.timestamp / BigInt(1000000))), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </p>
                  </div>
                  <Badge variant={rsvp.attending ? 'default' : 'secondary'}>
                    {rsvp.attending ? t.wantsToJoin : t.declined}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NetworkLogoPreview({ logoPath }: { logoPath: string }) {
  const { data: logoUrl } = useFileUrl(logoPath);

  if (!logoUrl) {
    return (
      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Network Logo"
      className="w-8 h-8 object-contain rounded"
    />
  );
}

function DefaultPreviewImagePreview({ imagePath }: { imagePath: string }) {
  const { data: imageUrl } = useFileUrl(imagePath);

  if (!imageUrl) {
    return (
      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Default Preview Image"
      className="w-8 h-8 object-contain rounded"
    />
  );
}

function BadgeCriteriaCard({ criteria, onEdit, onDelete }: { criteria: any; onEdit: () => void; onDelete: () => void }) {
  const IconComponent = badgeIcons.find(icon => icon.value === criteria.icon)?.icon || Award;
  const activityType = activityTypes.find(type => type.value === criteria.activityType);

  return (
    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
        <IconComponent className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{criteria.name}</h4>
        <p className="text-sm text-muted-foreground mb-1">{criteria.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {Number(criteria.requiredCount)} {activityType?.label}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Abzeichen-Kriterium löschen</AlertDialogTitle>
              <AlertDialogDescription>
                Bist du sicher, dass du das Abzeichen-Kriterium "{criteria.name}" löschen möchtest? 
                Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function UserManagementCard({ 
  principal, 
  profile, 
  pendingApproval,
  onSendMessage, 
  onRemoveUser,
  onApprove,
  onReject,
  isRemoving,
  isProcessingApproval,
  t
}: { 
  principal: any; 
  profile: any; 
  pendingApproval?: any;
  onSendMessage: () => void; 
  onRemoveUser: () => void;
  onApprove: () => void;
  onReject: () => void;
  isRemoving: boolean;
  isProcessingApproval: boolean;
  t: any;
}) {
  const { data: profilePhotoUrl } = useFileUrl(profile.profilePhoto || '');
  const { data: userRole } = useGetCallerUserRole();

  // Determine if this user is an admin (simplified check)
  const isUserAdmin = userRole === UserRole.admin && principal.toString() === principal.toString();

  return (
    <Card className={pendingApproval ? 'border-l-4 border-l-orange-500' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profilePhotoUrl || undefined} />
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{profile.name}</p>
                {isUserAdmin && (
                  <Badge className="text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Administrator
                  </Badge>
                )}
                {pendingApproval && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {t.waitingForApproval}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {principal.toString().slice(0, 12)}...
              </p>
              <p className="text-xs text-muted-foreground">
                Sprache: {profile.language.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {pendingApproval ? (
              // Show approval buttons for pending users
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={onApprove}
                  disabled={isProcessingApproval}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  {t.approve}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onReject}
                  disabled={isProcessingApproval}
                >
                  <UserX className="w-4 h-4 mr-1" />
                  {t.reject}
                </Button>
              </div>
            ) : (
              // Show regular management buttons for approved users
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSendMessage}
                  disabled={isRemoving}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.message}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={isRemoving}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isRemoving ? 'Entfernt...' : t.remove}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.removeUser}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.removeUserConfirm.replace('aus dem Netzwerk entfernen? Diese Aktion kann nicht rückgängig gemacht werden.', '')}
                        {profile.name} {t.removeUserConfirm}
                        <br /><br />
                        <strong>{t.removeUserWarning.split(':')[0]}:</strong> {t.removeUserWarning.split(':')[1]}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isRemoving}>{t.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onRemoveUser}
                        disabled={isRemoving}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isRemoving ? 'Entfernt...' : t.remove}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JoinRequestCard({ 
  approval, 
  onApprove, 
  onReject, 
  isLoading,
  t
}: { 
  approval: any; 
  onApprove: () => void; 
  onReject: () => void; 
  isLoading: boolean;
  t: any;
}) {
  const { data: userProfile } = useGetUserProfile(approval.principal);
  
  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.pending:
        return (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3 mr-1" />
            Wartend
          </Badge>
        );
      case ApprovalStatus.approved:
        return (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            <UserCheck className="w-3 h-3 mr-1" />
            Genehmigt
          </Badge>
        );
      case ApprovalStatus.rejected:
        return (
          <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
            <UserX className="w-3 h-3 mr-1" />
            Abgelehnt
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className={`border-l-4 ${
      approval.status === ApprovalStatus.pending ? 'border-l-orange-500' :
      approval.status === ApprovalStatus.approved ? 'border-l-green-500' :
      'border-l-red-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                approval.status === ApprovalStatus.pending ? 'bg-orange-100' :
                approval.status === ApprovalStatus.approved ? 'bg-green-100' :
                'bg-red-100'
              }`}>
                <UserPlus className={`w-4 h-4 ${
                  approval.status === ApprovalStatus.pending ? 'text-orange-600' :
                  approval.status === ApprovalStatus.approved ? 'text-green-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <p className="font-medium">
                  {userProfile?.name || 'Neues Netzwerkmitglied'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {approval.principal.toString().slice(0, 12)}...
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(approval.status)}
              <span className="text-xs text-muted-foreground">
                Angefragt am: {format(new Date(), 'dd.MM.yyyy HH:mm', { locale: de })}
              </span>
            </div>
          </div>
          {approval.status === ApprovalStatus.pending && (
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                onClick={onApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserCheck className="w-4 h-4 mr-1" />
                {t.approve}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onReject}
                disabled={isLoading}
              >
                <UserX className="w-4 h-4 mr-1" />
                {t.reject}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
