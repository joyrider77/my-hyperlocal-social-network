import { useGetDashboardOverview, useGetCallerUserProfile, useGetUserProfile, useGetAllUserProfiles, useGetUnreadMessageCount, useIsCurrentUserAdmin, useGetCallerUserRole, useGetUserBadges, useGetLeaderboard } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageCircle, Link as LinkIcon, Camera, Clock, User, ExternalLink, ChevronRight, Users, Shield, Crown, Sparkles, Zap, Star, Hexagon, Globe, Layers, Cpu, Bell, Award, Vote, Gift, Trophy, Medal, Target, Video } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTranslations } from '../utils/translations';
import { UserRole } from '../backend';
import AnimatedIcon from './AnimatedIcon';
import { LucideIcon } from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateToChat: () => void;
  onNavigateToCalendarDetail: (eventId: string) => void;
}

interface UserBadge {
  icon: LucideIcon;
  color: string;
  name: string;
}

interface UserRoleInfo {
  label: string;
  icon: LucideIcon;
  gradient: string;
  color: string;
}

interface RankStyling {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function DashboardOverview({ onNavigateToChat, onNavigateToCalendarDetail }: DashboardOverviewProps) {
  const { data: overview, isLoading } = useGetDashboardOverview();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allUserProfiles } = useGetAllUserProfiles();
  const { data: unreadCount } = useGetUnreadMessageCount();
  const { data: leaderboard } = useGetLeaderboard();
  const t = useTranslations(userProfile?.language);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ic-card p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const unreadMessageCount = unreadCount || 0;

  return (
    <div className="p-6 space-y-8 ic-animate-fade-in">
      {/* IC-style Welcome Section */}
      <div className="ic-tile-gradient text-center py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-16 right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-8 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="relative z-10">
          <div className="mb-6">
            <AnimatedIcon icon={Hexagon} size={48} animation="ic-animate-spin-3d" className="text-white mx-auto mb-4 opacity-80" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white leading-tight">
            {t.welcome}{userProfile ? `, ${userProfile.name}` : ''}!
          </h2>
          <p className="text-white/90 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            {t.networkOverview}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <AnimatedIcon icon={Star} size={20} animation="ic-animate-pulse-3d" className="text-yellow-300" />
              <AnimatedIcon icon={Star} size={20} animation="ic-animate-pulse-3d" className="text-yellow-300" style={{ animationDelay: '0.2s' }} />
              <AnimatedIcon icon={Star} size={20} animation="ic-animate-pulse-3d" className="text-yellow-300" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unread Messages - Prominent placement */}
        <div 
          className="ic-tile-gradient cursor-pointer hover:scale-[1.02] transition-all duration-500 relative overflow-hidden lg:col-span-2" 
          onClick={onNavigateToChat}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-6 left-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl ic-shadow">
                  <AnimatedIcon icon={MessageCircle} size={28} animation="ic-animate-pulse-3d" className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {t.unreadMessages}
                  </h3>
                  <p className="text-white/90 text-lg font-medium">
                    {unreadMessageCount === 0 ? (
                      'Keine neuen Nachrichten'
                    ) : (
                      `${unreadMessageCount} ${unreadMessageCount === 1 ? 'neue Nachricht' : 'neue Nachrichten'}`
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {unreadMessageCount > 0 && (
                  <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center text-lg font-bold ic-shadow ic-animate-pulse-3d">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </div>
                )}
                <AnimatedIcon icon={ChevronRight} size={32} animation="ic-animate-bounce-3d" className="text-white" />
              </div>
            </div>
          </CardContent>
        </div>

        {/* Upcoming Events */}
        <div className="ic-tile relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 opacity-50"></div>
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="flex items-center gap-4 text-xl">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl ic-shadow">
                <AnimatedIcon icon={Calendar} size={24} animation="ic-animate-bounce-3d" className="text-cyan-600" />
              </div>
              <span className="ic-heading text-cyan-900">
                {t.upcomingEvents}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 relative z-10">
            {overview?.upcomingEvents?.length === 0 ? (
              <div className="text-center py-8">
                <AnimatedIcon icon={Calendar} size={40} animation="ic-animate-float" className="text-cyan-400 mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noUpcomingEvents}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {overview?.upcomingEvents?.slice(0, 2).map((event) => {
                  const eventDate = new Date(Number(event.date / BigInt(1000000)));
                  return (
                    <div 
                      key={event.id}
                      className="p-4 bg-white/60 rounded-xl border border-cyan-200/50 cursor-pointer hover:bg-white/80 transition-colors"
                      onClick={() => onNavigateToCalendarDetail(event.id)}
                    >
                      <h4 className="font-semibold text-cyan-900 mb-2">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-cyan-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(eventDate, 'dd.MM.yyyy', { locale: de })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{format(eventDate, 'HH:mm')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(overview?.upcomingEvents?.length || 0) > 2 && (
                  <p className="text-sm text-cyan-600 text-center">
                    +{(overview?.upcomingEvents?.length || 0) - 2} weitere Termine
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </div>

        {/* Latest Link */}
        <div className="ic-tile relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 opacity-50"></div>
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="flex items-center gap-4 text-xl">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl ic-shadow">
                <AnimatedIcon icon={LinkIcon} size={24} animation="ic-animate-float" className="text-orange-600" />
              </div>
              <span className="ic-heading text-orange-900">
                {t.latestLink}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 relative z-10">
            {!overview?.latestLink ? (
              <div className="text-center py-8">
                <AnimatedIcon icon={LinkIcon} size={40} animation="ic-animate-float" className="text-orange-400 mx-auto mb-4" />
                <p className="text-muted-foreground">{t.noLinksYet}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-900 line-clamp-2">{overview.latestLink.title}</h4>
                <p className="text-sm text-orange-700 hover:underline truncate">
                  {overview.latestLink.url}
                </p>
                {overview.latestLink.description && (
                  <p className="text-sm text-orange-800 line-clamp-2">{overview.latestLink.description}</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-orange-600 hover:bg-orange-100 p-2 h-auto"
                >
                  <a
                    href={overview.latestLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Link öffnen
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </div>

      {/* Network Members - Enhanced with badges and ranks */}
      <div className="ic-tile relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
        <CardHeader className="pb-6 relative z-10">
          <CardTitle className="flex items-center gap-4 text-xl">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl ic-shadow">
              <AnimatedIcon icon={Users} size={24} animation="ic-animate-bounce-3d" className="text-blue-600" />
            </div>
            <span className="ic-heading text-blue-900">
              {t.networkMembers}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 relative z-10">
          {!allUserProfiles || allUserProfiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t.noNetworkMembers}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allUserProfiles.slice(0, 8).map(([principal, profile]) => (
                <NetworkMemberCard key={principal.toString()} principal={principal} profile={profile} leaderboard={leaderboard} />
              ))}
              {allUserProfiles.length > 8 && (
                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center pt-4">
                  <p className="text-sm text-blue-600">
                    +{allUserProfiles.length - 8} weitere Mitglieder
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Recent Media - Compact grid */}
      {overview?.recentMedia && overview.recentMedia.length > 0 && (
        <div className="ic-tile relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 opacity-50"></div>
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="flex items-center gap-4 text-xl">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl ic-shadow">
                <AnimatedIcon icon={Camera} size={24} animation="ic-animate-glow" className="text-purple-600" />
              </div>
              <span className="ic-heading text-purple-900">
                Aktuelle Medien
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {overview.recentMedia.map((media) => (
                <RecentMediaCard key={media.id} media={media} />
              ))}
            </div>
          </CardContent>
        </div>
      )}
    </div>
  );
}

function NetworkMemberCard({ principal, profile, leaderboard }: { principal: any; profile: any; leaderboard?: any[] }) {
  const { data: profilePhotoUrl } = useFileUrl(profile.profilePhoto || '');
  const { data: isAdmin } = useIsCurrentUserAdmin();
  const currentUserPrincipal = principal.toString();
  
  // Find user in leaderboard to get rank and points
  const leaderboardEntry = leaderboard?.find(entry => entry.principal === currentUserPrincipal);
  const userRank = leaderboardEntry?.rank || null;
  const userPoints = leaderboardEntry?.points || 0;
  
  // Determine user role
  const getUserRole = (): UserRoleInfo => {
    // Simple admin check - in a real app this would come from backend
    if (isAdmin && currentUserPrincipal === principal.toString()) {
      return { label: 'Administrator', icon: Crown, gradient: 'from-amber-400 to-yellow-500', color: 'text-amber-700' };
    }
    return { label: 'Mitglied', icon: User, gradient: 'from-blue-400 to-indigo-500', color: 'text-blue-700' };
  };

  // Get user's badges based on mock activity data
  const getUserBadges = (): UserBadge[] => {
    const badges: UserBadge[] = [];
    
    // Mock badge logic based on points/activity
    if (userPoints >= 100) {
      badges.push({ icon: MessageCircle, color: 'text-green-600', name: 'Kommunikator' });
    }
    if (userPoints >= 80) {
      badges.push({ icon: Camera, color: 'text-purple-600', name: 'Fotograf' });
    }
    if (userPoints >= 60) {
      badges.push({ icon: Video, color: 'text-red-600', name: 'Videofilmer' });
    }
    if (userPoints >= 40) {
      badges.push({ icon: Calendar, color: 'text-blue-600', name: 'Planer' });
    }
    if (userPoints >= 20) {
      badges.push({ icon: LinkIcon, color: 'text-orange-600', name: 'Sammler' });
    }
    
    return badges.slice(0, 3); // Show max 3 badges
  };

  // Get rank styling
  const getRankStyling = (rank: number | null): RankStyling => {
    if (!rank) return { icon: Target, color: 'text-gray-500', bgColor: 'bg-gray-100' };
    
    if (rank === 1) return { icon: Crown, color: 'text-yellow-600', bgColor: 'bg-gradient-to-br from-yellow-400 to-amber-500' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-600', bgColor: 'bg-gradient-to-br from-gray-300 to-gray-400' };
    if (rank === 3) return { icon: Award, color: 'text-orange-600', bgColor: 'bg-gradient-to-br from-orange-400 to-red-500' };
    if (rank <= 10) return { icon: Star, color: 'text-blue-600', bgColor: 'bg-gradient-to-br from-blue-400 to-indigo-500' };
    
    return { icon: Target, color: 'text-purple-600', bgColor: 'bg-gradient-to-br from-purple-400 to-pink-500' };
  };

  const role = getUserRole();
  const badges = getUserBadges();
  const rankStyling = getRankStyling(userRank);
  const RoleIcon = role.icon;
  const RankIcon = rankStyling.icon;

  return (
    <div className="ic-card flex flex-col gap-4 p-4 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 group-hover:from-white/70 group-hover:to-white/40 transition-all duration-300"></div>
      
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <Avatar className="w-14 h-14 ring-2 ring-indigo-500/30 ic-shadow group-hover:ring-indigo-500/50 transition-all duration-300">
            <AvatarImage src={profilePhotoUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
              <AnimatedIcon icon={User} size={20} animation="ic-animate-float" />
            </AvatarFallback>
          </Avatar>
          
          {/* Rank Badge on Avatar */}
          {userRank && (
            <div className={`absolute -top-1 -right-1 w-6 h-6 ${rankStyling.bgColor} rounded-full flex items-center justify-center ic-shadow border-2 border-white`}>
              <AnimatedIcon icon={RankIcon} size={10} animation="ic-animate-pulse-3d" className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-base">{profile.name}</p>
          <Badge className={`text-xs px-2 py-1 bg-gradient-to-r ${role.gradient} text-white border-0 ic-shadow mt-1`}>
            <AnimatedIcon icon={RoleIcon} size={10} animation="ic-animate-pulse-3d" className="mr-1" />
            {role.label}
          </Badge>
        </div>
      </div>

      {/* Badges Section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Abzeichen</span>
          {badges.length > 0 && (
            <span className="text-xs text-blue-600 font-medium">{badges.length}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 min-h-[32px]">
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <div 
                key={index} 
                className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center ic-shadow hover:scale-110 transition-transform duration-200 group/badge"
                title={badge.name}
              >
                <AnimatedIcon 
                  icon={badge.icon} 
                  size={14} 
                  animation="ic-animate-glow" 
                  className={`${badge.color} group-hover/badge:scale-110 transition-transform duration-200`} 
                />
              </div>
            ))
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>Noch keine Abzeichen</span>
            </div>
          )}
        </div>
      </div>

      {/* Rank and Points Section */}
      <div className="relative z-10 pt-2 border-t border-white/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 ${rankStyling.bgColor} rounded-full flex items-center justify-center ic-shadow`}>
              <AnimatedIcon icon={RankIcon} size={12} animation="ic-animate-pulse-3d" className="text-white" />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">Rang</span>
              <p className="text-sm font-bold text-gray-800">
                {userRank ? `#${userRank}` : 'Unbewertet'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs font-medium text-muted-foreground">Punkte</span>
            <p className="text-sm font-bold text-blue-600">
              {userPoints}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentMediaCard({ media }: { media: any }) {
  const { data: mediaUrl, isLoading } = useFileUrl(media.filePath);

  return (
    <div className="ic-card aspect-square rounded-2xl overflow-hidden ic-shadow hover:ic-shadow-lg transition-all duration-300 hover:scale-105">
      {isLoading ? (
        <div className="w-full h-full animate-pulse bg-muted flex items-center justify-center">
          <AnimatedIcon icon={Camera} size={24} animation="ic-animate-pulse-3d" className="text-muted-foreground" />
        </div>
      ) : mediaUrl ? (
        <>
          {media.isVideo ? (
            <div className="relative w-full h-full">
              <video
                src={mediaUrl}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Video className="w-8 h-8 text-white" />
              </div>
            </div>
          ) : (
            <img
              src={mediaUrl}
              alt={media.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
          <AnimatedIcon icon={media.isVideo ? Video : Camera} size={24} animation="ic-animate-float" className="text-purple-400" />
        </div>
      )}
    </div>
  );
}
