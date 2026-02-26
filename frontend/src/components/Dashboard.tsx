import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCurrentUserAdmin, useGetDashboardName, useGetNetworkLogo } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Home, Calendar, MessageCircle, Camera, Link, Settings, LogOut, Users, User, Sparkles, Zap, Star, Hexagon, Award, Bell, Vote, Menu, X } from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import CalendarView from './CalendarView';
import CalendarDetailView from './CalendarDetailView';
import ChatView from './ChatView';
import PhotosView from './PhotosView';
import LinksView from './LinksView';
import AdminView from './AdminView';
import ProfileView from './ProfileView';
import GamificationView from './GamificationView';
import RemindersView from './RemindersView';
import PollsView from './PollsView';
import ThreeBackground from './ThreeBackground';
import AnimatedIcon from './AnimatedIcon';
import { useTranslations } from '../utils/translations';

type View = 'overview' | 'calendar' | 'calendar-detail' | 'chat' | 'photos' | 'links' | 'admin' | 'profile' | 'gamification' | 'reminders' | 'polls';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCurrentUserAdmin();
  const { data: dashboardName } = useGetDashboardName();
  const { data: networkLogo } = useGetNetworkLogo();
  const { data: profilePhotoUrl } = useFileUrl(userProfile?.profilePhoto || '');
  const { data: networkLogoUrl } = useFileUrl(networkLogo || '');
  const queryClient = useQueryClient();
  const t = useTranslations(userProfile?.language);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleNavigateToChat = () => {
    setCurrentView('chat');
  };

  const handleNavigateToCalendarDetail = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('calendar-detail');
  };

  const handleBackFromCalendarDetail = () => {
    setSelectedEventId(null);
    setCurrentView('overview');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setShowMobileMenu(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview onNavigateToChat={handleNavigateToChat} onNavigateToCalendarDetail={handleNavigateToCalendarDetail} />;
      case 'calendar':
        return <CalendarView />;
      case 'calendar-detail':
        return <CalendarDetailView eventId={selectedEventId} onBack={handleBackFromCalendarDetail} />;
      case 'chat':
        return <ChatView />;
      case 'photos':
        return <PhotosView />;
      case 'links':
        return <LinksView />;
      case 'admin':
        return <AdminView />;
      case 'profile':
        return <ProfileView onBack={() => setCurrentView('overview')} />;
      case 'gamification':
        return <GamificationView />;
      case 'reminders':
        return <RemindersView />;
      case 'polls':
        return <PollsView />;
      default:
        return <DashboardOverview onNavigateToChat={handleNavigateToChat} onNavigateToCalendarDetail={handleNavigateToCalendarDetail} />;
    }
  };

  const navItems = [
    { 
      id: 'overview' as View, 
      icon: Home, 
      label: t.overview, 
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      animation: 'ic-animate-glow' as const 
    },
    { 
      id: 'calendar' as View, 
      icon: Calendar, 
      label: t.calendar, 
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      animation: 'ic-animate-bounce-3d' as const 
    },
    { 
      id: 'chat' as View, 
      icon: MessageCircle, 
      label: t.chat, 
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      animation: 'ic-animate-pulse-3d' as const 
    },
    { 
      id: 'photos' as View, 
      icon: Camera, 
      label: t.photos, 
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      animation: 'ic-animate-float' as const 
    },
    { 
      id: 'links' as View, 
      icon: Link, 
      label: t.links, 
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      animation: 'ic-animate-bounce-3d' as const 
    },
  ];

  const specialFeatures = [
    {
      id: 'gamification' as View,
      icon: Award,
      label: t.badges,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100'
    },
    {
      id: 'reminders' as View,
      icon: Bell,
      label: t.reminders,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'polls' as View,
      icon: Vote,
      label: t.polls,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  // Hide bottom navigation for calendar detail view
  const showBottomNavigation = currentView !== 'calendar-detail';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* IC-style Background with Gradients */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Enhanced 3D Background */}
      <ThreeBackground theme={userProfile?.theme} />
      
      {/* IC-style Header - Optimized for Mobile */}
      <header className="ic-glass border-b border-white/20 p-3 sm:p-4 lg:p-6 shrink-0 ic-shadow-lg backdrop-blur-xl relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-1 min-w-0">
            {/* Enhanced Network Logo */}
            {networkLogoUrl && (
              <div className="ic-tile p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl ic-shadow hover:scale-105 transition-transform duration-300 shrink-0">
                <img
                  src={networkLogoUrl}
                  alt="Network Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="ic-heading text-lg sm:text-xl lg:text-2xl xl:text-3xl ic-animate-gradient truncate">
                {dashboardName || 'My Hyperlocal Social Network'}
              </h1>
              {userProfile && (
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex items-center gap-1 sm:gap-2 lg:gap-3 mt-1 font-medium truncate">
                  <AnimatedIcon icon={Sparkles} size={14} animation="ic-animate-glow" className="text-indigo-500 shrink-0" />
                  <span className="truncate">{t.welcome.replace('Willkommen', 'Hallo')}, {userProfile.name}!</span>
                  <AnimatedIcon icon={Zap} size={12} animation="ic-animate-pulse-3d" className="text-purple-500 shrink-0" />
                </p>
              )}
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
            {/* Mobile Menu Toggle - Enhanced for better touch interaction */}
            <div className="sm:hidden">
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ic-nav w-12 h-12 touch-manipulation active:scale-95 transition-transform"
                  >
                    <AnimatedIcon 
                      icon={showMobileMenu ? X : Menu} 
                      size={20} 
                      animation="ic-animate-bounce-3d" 
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-left">Menü</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-2">
                      {/* Special Features */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Zusätzliche Funktionen</h3>
                        {specialFeatures.map((feature) => (
                          <Button
                            key={feature.id}
                            variant="ghost"
                            onClick={() => handleViewChange(feature.id)}
                            className={`w-full justify-start gap-3 h-12 touch-manipulation active:scale-95 transition-all ${
                              currentView === feature.id 
                                ? `${feature.bgColor} ${feature.color} shadow-md` 
                                : `hover:bg-muted/50 ${feature.hoverColor}`
                            }`}
                          >
                            <AnimatedIcon 
                              icon={feature.icon} 
                              size={20} 
                              animation={currentView === feature.id ? 'ic-animate-glow' : 'ic-animate-float'} 
                              className={currentView === feature.id ? feature.color : 'text-muted-foreground'} 
                            />
                            <span className="font-medium">{feature.label}</span>
                            {currentView === feature.id && (
                              <div className="ml-auto">
                                <AnimatedIcon icon={Star} size={16} animation="ic-animate-pulse-3d" className={feature.color} />
                              </div>
                            )}
                          </Button>
                        ))}
                      </div>

                      {/* User Actions */}
                      <div className="space-y-1 pt-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">Benutzer</h3>
                        
                        {/* Profile */}
                        <Button
                          variant="ghost"
                          onClick={() => handleViewChange('profile')}
                          className={`w-full justify-start gap-3 h-12 touch-manipulation active:scale-95 transition-all ${
                            currentView === 'profile' ? 'bg-indigo-50 text-indigo-600 shadow-md' : 'hover:bg-muted/50'
                          }`}
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={profilePhotoUrl || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{t.profile}</span>
                          {currentView === 'profile' && (
                            <div className="ml-auto">
                              <AnimatedIcon icon={Star} size={16} animation="ic-animate-pulse-3d" className="text-indigo-600" />
                            </div>
                          )}
                        </Button>
                        
                        {/* Admin */}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            onClick={() => handleViewChange('admin')}
                            className={`w-full justify-start gap-3 h-12 touch-manipulation active:scale-95 transition-all ${
                              currentView === 'admin' ? 'bg-red-50 text-red-600 shadow-md' : 'hover:bg-muted/50'
                            }`}
                          >
                            <AnimatedIcon 
                              icon={Users} 
                              size={20} 
                              animation={currentView === 'admin' ? 'ic-animate-pulse-3d' : 'ic-animate-float'} 
                              className={currentView === 'admin' ? 'text-red-600' : 'text-muted-foreground'} 
                            />
                            <span className="font-medium">{t.admin}</span>
                            {currentView === 'admin' && (
                              <div className="ml-auto">
                                <AnimatedIcon icon={Star} size={16} animation="ic-animate-pulse-3d" className="text-red-600" />
                              </div>
                            )}
                          </Button>
                        )}

                        {/* Logout */}
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleLogout();
                            setShowMobileMenu(false);
                          }}
                          className="w-full justify-start gap-3 h-12 text-destructive hover:bg-red-50 hover:text-destructive touch-manipulation active:scale-95 transition-all"
                        >
                          <AnimatedIcon icon={LogOut} size={20} animation="ic-animate-bounce-3d" />
                          <span className="font-medium">{t.logout}</span>
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Action Buttons - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1 lg:gap-2">
              {/* Special Feature Buttons */}
              {specialFeatures.map((feature) => (
                <Button
                  key={feature.id}
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView(feature.id)}
                  className={`ic-nav text-muted-foreground ${feature.hoverColor} transition-all duration-300 hover:scale-110 w-10 h-10 lg:w-12 lg:h-12 ${
                    currentView === feature.id ? `active ${feature.color} ${feature.bgColor} ic-shadow-neon` : ''
                  }`}
                >
                  <AnimatedIcon 
                    icon={feature.icon} 
                    size={16} 
                    animation={currentView === feature.id ? 'ic-animate-glow' : 'ic-animate-float'} 
                  />
                </Button>
              ))}

              {/* Enhanced Profile Avatar */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('profile')}
                className={`ic-nav hover:bg-indigo-500/10 transition-all duration-300 hover:scale-110 w-10 h-10 lg:w-12 lg:h-12 ${
                  currentView === 'profile' ? 'active ic-shadow-neon' : ''
                }`}
              >
                <Avatar className="w-8 h-8 lg:w-10 lg:h-10 ring-2 ring-indigo-500/30 ic-shadow-lg hover:ic-shadow-xl transition-all duration-300">
                  <AvatarImage src={profilePhotoUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                    <AnimatedIcon icon={User} size={16} animation="ic-animate-float" />
                  </AvatarFallback>
                </Avatar>
              </Button>
              
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView('admin')}
                  className={`ic-nav text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110 w-10 h-10 lg:w-12 lg:h-12 ${
                    currentView === 'admin' ? 'active text-red-600 bg-red-50 ic-shadow-neon' : ''
                  }`}
                >
                  <AnimatedIcon icon={Users} size={16} animation="ic-animate-pulse-3d" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="ic-nav text-muted-foreground hover:text-destructive hover:bg-red-50 transition-all duration-300 hover:scale-110 w-10 h-10 lg:w-12 lg:h-12"
              >
                <AnimatedIcon icon={LogOut} size={16} animation="ic-animate-bounce-3d" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden ic-animate-fade-in ${showBottomNavigation ? 'pb-20 sm:pb-22 md:pb-24' : ''}`}>
        {renderView()}
      </main>

      {/* IC-style Bottom Navigation - Enhanced for smartphones */}
      {showBottomNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 ic-glass border-t border-white/20 z-50 ic-shadow-xl backdrop-blur-xl">
          <div className="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4">
            <div className="flex justify-around items-center max-w-lg mx-auto">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`ic-nav-mobile flex flex-col items-center transition-all duration-500 touch-manipulation active:scale-95 ${
                      isActive
                        ? `active bg-gradient-to-br ${item.gradient} text-white scale-105 ic-shadow-neon`
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50 hover:scale-105'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      userSelect: 'none'
                    }}
                  >
                    <div className="relative mb-1">
                      <AnimatedIcon 
                        icon={item.icon} 
                        size={isActive ? 20 : 18} 
                        animation={isActive ? item.animation : 'ic-animate-float'}
                        className={isActive ? 'text-white' : ''} 
                      />
                      {isActive && (
                        <div className="absolute -top-1 -right-1">
                          <AnimatedIcon icon={Star} size={8} animation="ic-animate-pulse-3d" className="text-yellow-300" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-semibold leading-tight text-center ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="flex gap-1 mt-1">
                        <div className="w-1 h-1 bg-current rounded-full ic-animate-pulse-3d"></div>
                        <div className="w-1 h-1 bg-current rounded-full ic-animate-pulse-3d" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-current rounded-full ic-animate-pulse-3d" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
