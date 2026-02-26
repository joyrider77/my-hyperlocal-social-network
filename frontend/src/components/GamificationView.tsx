import React, { useState } from 'react';
import { useGetCallerUserProfile, useGetUserBadges, useGetLeaderboard, useGetBadgeCriteria, useCreateBadgeCriteria, useEditBadgeCriteria, useDeleteBadgeCriteria, useIsCurrentUserAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Star, MessageCircle, Camera, Calendar, Link, Users, Crown, Medal, Target, Plus, Settings, CheckCircle, Edit, Trash2, Video } from 'lucide-react';
import { useTranslations } from '../utils/translations';
import { toast } from 'sonner';
import AnimatedIcon from './AnimatedIcon';

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

export default function GamificationView() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: badges } = useGetUserBadges();
  const { data: leaderboard } = useGetLeaderboard();
  const { data: badgeList } = useGetBadgeCriteria();
  const { data: isAdmin } = useIsCurrentUserAdmin();
  const createBadgeCriteria = useCreateBadgeCriteria();
  const editBadgeCriteria = useEditBadgeCriteria();
  const deleteBadgeCriteria = useDeleteBadgeCriteria();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<any>(null);
  const [badgeName, setBadgeName] = useState('');
  const [badgeDescription, setBadgeDescription] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('Award');
  const [requiredCount, setRequiredCount] = useState(10);
  const [activityType, setActivityType] = useState('chat');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations(userProfile?.language);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeName.trim() || !badgeDescription.trim()) return;

    setIsCreating(true);
    
    try {
      await createBadgeCriteria.mutateAsync({
        name: badgeName.trim(),
        description: badgeDescription.trim(),
        icon: badgeIcon,
        requiredCount,
        activityType
      });
      
      toast.success('Abzeichen-Kriterium wurde erfolgreich erstellt!');
      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(`Fehler beim Erstellen des Abzeichen-Kriteriums: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge || !badgeName.trim() || !badgeDescription.trim()) return;

    setIsEditing(true);
    
    try {
      await editBadgeCriteria.mutateAsync({
        badgeId: editingBadge.id,
        name: badgeName.trim(),
        description: badgeDescription.trim(),
        icon: badgeIcon,
        requiredCount,
        activityType
      });
      
      toast.success('Abzeichen-Kriterium wurde erfolgreich bearbeitet!');
      resetEditForm();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(`Fehler beim Bearbeiten des Abzeichen-Kriteriums: ${error.message}`);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteBadge = async (badgeId: string, badgeName: string) => {
    try {
      await deleteBadgeCriteria.mutateAsync(badgeId);
      toast.success(`Abzeichen-Kriterium "${badgeName}" wurde erfolgreich gelöscht!`);
    } catch (error: any) {
      toast.error(`Fehler beim Löschen des Abzeichen-Kriteriums: ${error.message}`);
    }
  };

  const openEditDialog = (badge: any) => {
    setEditingBadge(badge);
    setBadgeName(badge.name);
    setBadgeDescription(badge.description);
    setBadgeIcon(badge.icon);
    setRequiredCount(Number(badge.requiredCount));
    setActivityType(badge.activityType);
    setIsEditDialogOpen(true);
  };

  const resetCreateForm = () => {
    setBadgeName('');
    setBadgeDescription('');
    setBadgeIcon('Award');
    setRequiredCount(10);
    setActivityType('chat');
    setIsCreating(false);
  };

  const resetEditForm = () => {
    setEditingBadge(null);
    setBadgeName('');
    setBadgeDescription('');
    setBadgeIcon('Award');
    setRequiredCount(10);
    setActivityType('chat');
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="ic-heading ic-heading-lg mb-4">
            Abzeichen & Rangliste
          </h2>
          <p className="text-muted-foreground text-lg">
            Sammle Abzeichen und klettere in der Rangliste nach oben!
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetCreateForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Abzeichen-Kriterium erstellen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Neues Abzeichen-Kriterium erstellen</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBadge} className="space-y-4">
                <div>
                  <Label htmlFor="badgeName">Name des Abzeichens</Label>
                  <Input
                    id="badgeName"
                    value={badgeName}
                    onChange={(e) => setBadgeName(e.target.value)}
                    placeholder="z.B. Super Kommunikator"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="badgeDescription">Beschreibung</Label>
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
                  <Label htmlFor="badgeIcon">Symbol</Label>
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
                  <Label htmlFor="activityType">Aktivitätstyp</Label>
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
                  <Label htmlFor="requiredCount">Erforderliche Anzahl</Label>
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
                    disabled={isCreating || !badgeName.trim() || !badgeDescription.trim()}
                  >
                    {isCreating ? 'Erstellt...' : 'Erstellen'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges">Meine Abzeichen</TabsTrigger>
          <TabsTrigger value="leaderboard">Rangliste</TabsTrigger>
          {isAdmin && <TabsTrigger value="management">Verwaltung</TabsTrigger>}
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          {/* My Badges Section */}
          <Card className="ic-tile relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 opacity-50"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center gap-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl ic-shadow">
                  <AnimatedIcon icon={Award} size={24} animation="ic-animate-glow" className="text-yellow-600" />
                </div>
                <span className="ic-heading text-yellow-900">
                  Meine Abzeichen
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 relative z-10">
              {!badges || badges.length === 0 ? (
                <div className="text-center py-8">
                  <AnimatedIcon icon={Award} size={48} animation="ic-animate-float" className="text-yellow-400 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Noch keine Abzeichen verdient</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sei aktiv im Netzwerk, um dein erstes Abzeichen zu verdienen!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          {/* Leaderboard */}
          <Card className="ic-tile relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 opacity-50"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="flex items-center gap-4 text-xl">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl ic-shadow">
                  <AnimatedIcon icon={Trophy} size={24} animation="ic-animate-bounce-3d" className="text-purple-600" />
                </div>
                <span className="ic-heading text-purple-900">
                  Rangliste
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 relative z-10">
              {!leaderboard || leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <AnimatedIcon icon={Trophy} size={48} animation="ic-animate-float" className="text-purple-400 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Noch keine Rangliste verfügbar</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Beginne mit Aktivitäten, um in der Rangliste zu erscheinen!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((member, index) => (
                    <LeaderboardCard key={member.principal || index} member={member} rank={index + 1} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="management" className="space-y-4">
            {/* Badge Management */}
            <Card className="ic-tile relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 opacity-50"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl ic-shadow">
                    <AnimatedIcon icon={Settings} size={24} animation="ic-animate-spin-3d" className="text-indigo-600" />
                  </div>
                  <span className="ic-heading text-indigo-900">
                    Abzeichen-Verwaltung
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 relative z-10">
                {!badgeList || badgeList.length === 0 ? (
                  <div className="text-center py-8">
                    <AnimatedIcon icon={Target} size={48} animation="ic-animate-float" className="text-indigo-400 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Noch keine Abzeichen-Kriterien erstellt</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Erstelle das erste Abzeichen-Kriterium für dein Netzwerk!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {badgeList.map((badge) => (
                      <BadgeManagementCard 
                        key={badge.id} 
                        badge={badge} 
                        onEdit={() => openEditDialog(badge)}
                        onDelete={() => handleDeleteBadge(badge.id, badge.name)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Badge Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetEditForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Abzeichen-Kriterium bearbeiten</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBadge} className="space-y-4">
            <div>
              <Label htmlFor="editBadgeName">Name des Abzeichens</Label>
              <Input
                id="editBadgeName"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                placeholder="z.B. Super Kommunikator"
                required
              />
            </div>

            <div>
              <Label htmlFor="editBadgeDescription">Beschreibung</Label>
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
              <Label htmlFor="editBadgeIcon">Symbol</Label>
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
              <Label htmlFor="editActivityType">Aktivitätstyp</Label>
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
              <Label htmlFor="editRequiredCount">Erforderliche Anzahl</Label>
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
                disabled={isEditing || !badgeName.trim() || !badgeDescription.trim()}
              >
                {isEditing ? 'Speichert...' : 'Speichern'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isEditing}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BadgeCard({ badge }: { badge: any }) {
  const IconComponent = badge.icon === 'MessageCircle' ? MessageCircle : 
                      badge.icon === 'Camera' ? Camera :
                      badge.icon === 'Calendar' ? Calendar :
                      badge.icon === 'Link' ? Link : Award;

  return (
    <div className={`ic-card p-4 text-center ${badge.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-muted/20'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
        badge.earned ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-muted'
      }`}>
        <AnimatedIcon 
          icon={IconComponent} 
          size={24} 
          animation={badge.earned ? "ic-animate-glow" : "ic-animate-float"} 
          className={badge.earned ? "text-white" : "text-muted-foreground"} 
        />
      </div>
      <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
      <p className="text-xs text-muted-foreground">{badge.description}</p>
      {badge.earned && (
        <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verdient
        </Badge>
      )}
    </div>
  );
}

function LeaderboardCard({ member, rank }: { member: any; rank: number }) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-500' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-400' };
    if (rank === 3) return { icon: Award, color: 'text-orange-500' };
    return { icon: Star, color: 'text-blue-500' };
  };

  const rankInfo = getRankIcon(rank);
  const RankIcon = rankInfo.icon;

  return (
    <div className="ic-card flex items-center gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-muted'
        }`}>
          <AnimatedIcon 
            icon={RankIcon} 
            size={16} 
            animation="ic-animate-pulse-3d" 
            className={rank <= 3 ? "text-white" : rankInfo.color} 
          />
        </div>
        <span className="font-bold text-lg">#{rank}</span>
      </div>
      
      <div className="flex-1">
        <p className="font-semibold">{member.name}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{member.points} Punkte</span>
          <span>{member.badges} Abzeichen</span>
        </div>
      </div>
    </div>
  );
}

function BadgeManagementCard({ badge, onEdit, onDelete }: { badge: any; onEdit: () => void; onDelete: () => void }) {
  const IconComponent = badgeIcons.find(icon => icon.value === badge.icon)?.icon || Award;
  const activityType = activityTypes.find(type => type.value === badge.activityType);

  return (
    <div className="ic-card flex items-center gap-4 p-4">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center ic-shadow">
        <AnimatedIcon icon={IconComponent} size={20} animation="ic-animate-glow" className="text-indigo-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{badge.name}</h4>
        <p className="text-sm text-muted-foreground mb-1">{badge.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {Number(badge.requiredCount)} {activityType?.label}
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
                Bist du sicher, dass du das Abzeichen-Kriterium "{badge.name}" löschen möchtest? 
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
