import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitRSVP, useRequestApproval, useGetDashboardName, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Calendar, MessageCircle, Camera, Link, FileText, UserPlus, CheckCircle, ArrowLeft, MapPin, Globe, Shield, Zap, Star, ChevronRight, Sparkles, Hexagon, Layers, Cpu, Vote, Bell, Award } from 'lucide-react';
import { useTranslations, languages } from '../utils/translations';
import AnimatedIcon from './AnimatedIcon';

const themes = [
  { code: 'tokyo', name: 'Tokyo' },
  { code: 'royal-blue', name: 'Royal Blue' },
  { code: 'cyber-bunker', name: 'Cyber Bunker' },
];

export default function LoginScreen() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: dashboardName } = useGetDashboardName();
  const [currentStep, setCurrentStep] = useState<'main' | 'invite-form' | 'profile-setup' | 'success'>('main');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [language, setLanguage] = useState('de');
  const [theme, setTheme] = useState('tokyo');
  const [isProcessing, setIsProcessing] = useState(false);
  const submitRSVP = useSubmitRSVP();
  const requestApproval = useRequestApproval();
  const saveProfile = useSaveCallerUserProfile();
  const t = useTranslations(language);

  const isLoggingIn = loginStatus === 'logging-in';

  // Auto-populate invite code from URL and show invite form
  useEffect(() => {
    const codeFromUrl = new URLSearchParams(window.location.search).get('code');
    if (codeFromUrl) {
      setInviteCode(codeFromUrl);
      setCurrentStep('invite-form');
    }
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !name.trim() || !inviteCode.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // First, submit the RSVP (this can be done without authentication)
      await submitRSVP.mutateAsync({ name: name.trim(), attending: true, inviteCode: inviteCode.trim() });
      
      // Then login the user
      await login();
      
      // Move to profile setup step
      setCurrentStep('profile-setup');
    } catch (error) {
      console.error('Error during invite process:', error);
      setIsProcessing(false);
    }
  };

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || isProcessing) return;

    setIsProcessing(true);

    try {
      // Save the user profile
      await saveProfile.mutateAsync({ 
        name: name.trim(),
        language,
        theme
      });
      
      // Request approval (this will create a pending approval request)
      await requestApproval.mutateAsync();
      
      setCurrentStep('success');
    } catch (error) {
      console.error('Error in profile setup:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToMain = () => {
    setCurrentStep('main');
    setName('');
    setInviteCode('');
    setLanguage('de');
    setTheme('tokyo');
    setIsProcessing(false);
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleRegularLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        // Handle already authenticated case
        window.location.reload();
      }
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* IC-style Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="ic-card w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ic-shadow-lg">
              <AnimatedIcon icon={CheckCircle} size={32} animation="ic-animate-pulse-3d" className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 ic-heading">{t.thankYou}</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              {t.requestSubmitted}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {t.adminWillProcess}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full ic-button">
              {t.back}
            </Button>
          </CardContent>
        </div>
      </div>
    );
  }

  if (currentStep === 'profile-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* IC-style Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="ic-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 ic-shadow-lg">
              <AnimatedIcon icon={UserPlus} size={32} animation="ic-animate-bounce-3d" className="text-white" />
            </div>
            <CardTitle className="text-2xl ic-heading">{t.createProfile}</CardTitle>
            <p className="text-muted-foreground text-lg">
              {t.welcomeToNetwork}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSetup} className="space-y-6">
              <div>
                <Label htmlFor="profileName" className="text-lg font-medium">{t.yourName}</Label>
                <Input
                  id="profileName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.howToCallYou}
                  required
                  disabled={isProcessing}
                  className="ic-input mt-2"
                />
              </div>

              <div>
                <Label htmlFor="profileLanguage" className="text-lg font-medium">{t.language}</Label>
                <Select value={language} onValueChange={setLanguage} disabled={isProcessing}>
                  <SelectTrigger className="ic-input mt-2">
                    <SelectValue placeholder={t.chooseLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl flag-emoji">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profileTheme" className="text-lg font-medium">{t.theme}</Label>
                <Select value={theme} onValueChange={setTheme} disabled={isProcessing}>
                  <SelectTrigger className="ic-input mt-2">
                    <SelectValue placeholder={t.chooseTheme} />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((themeOption) => (
                      <SelectItem key={themeOption.code} value={themeOption.code}>
                        {themeOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full ic-button"
                disabled={isProcessing || !name.trim()}
              >
                {isProcessing ? t.processing : t.createProfileButton}
              </Button>

              {(saveProfile.error || requestApproval.error) && (
                <p className="text-sm text-destructive text-center">
                  {t.error}: {saveProfile.error?.message || requestApproval.error?.message}
                </p>
              )}
            </form>
          </CardContent>
        </div>
      </div>
    );
  }

  if (currentStep === 'invite-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* IC-style Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="ic-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 ic-shadow-lg">
              <AnimatedIcon icon={Users} size={32} animation="ic-animate-bounce-3d" className="text-white" />
            </div>
            <CardTitle className="text-2xl ic-heading">{t.networkInvitation}</CardTitle>
            <p className="text-muted-foreground text-lg">
              {t.invitedToNetwork}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-medium">{t.name}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.howToCallYou}
                  required
                  disabled={isProcessing}
                  autoFocus
                  className="ic-input mt-2"
                />
              </div>
              <div>
                <Label htmlFor="inviteCode" className="text-lg font-medium">{t.inviteCode}</Label>
                <Input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder={t.enterInviteCode}
                  required
                  disabled={isProcessing}
                  className="ic-input mt-2"
                />
              </div>
              <Button
                type="submit"
                className="w-full ic-button"
                disabled={isProcessing || isLoggingIn || !name.trim() || !inviteCode.trim()}
              >
                {isProcessing || isLoggingIn ? t.joining : t.join}
              </Button>
              {(submitRSVP.error) && (
                <p className="text-sm text-destructive text-center">
                  {t.error}: {submitRSVP.error.message}
                </p>
              )}
            </form>
            <div className="mt-6 pt-6 border-t text-center">
              <Button
                variant="ghost"
                onClick={handleBackToMain}
                className="text-sm"
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: t.calendar,
      description: t.sharedCalendarDesc,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: t.chat,
      description: t.directCommunicationDesc,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Camera,
      title: t.photos,
      description: t.shareMemoriesDesc,
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Link,
      title: t.links,
      description: t.collectLinksDesc,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Vote,
      title: t.pollsAndVoting,
      description: t.pollsDesc,
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Bell,
      title: t.remindersAndNotifications,
      description: t.remindersDesc,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Award,
      title: t.badgesAndLeaderboard,
      description: t.badgesDesc,
      gradient: 'from-pink-500 to-red-500'
    }
  ];

  const benefits = [
    {
      icon: MapPin,
      title: t.hyperlocalDesc.split(' ')[0],
      description: t.hyperlocalDesc
    },
    {
      icon: Shield,
      title: t.privateSecure,
      description: t.privateSecureDesc
    },
    {
      icon: Zap,
      title: t.easyToUseDesc.split(' ')[0],
      description: t.easyToUseDesc
    },
    {
      icon: Globe,
      title: t.multilingualDesc.split(' ')[2] || t.multilingualDesc.split(' ')[0],
      description: t.multilingualDesc
    }
  ];

  // Get current language info for display
  const currentLanguageInfo = languages.find(lang => lang.code === language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* IC-style Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl ic-animate-float"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl ic-animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl ic-animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-48 ic-glass backdrop-blur-sm">
            <SelectValue>
              {currentLanguageInfo && (
                <div className="flex items-center gap-3">
                  <span className="text-xl flag-emoji">{currentLanguageInfo.flag}</span>
                  <span>{currentLanguageInfo.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-3">
                  <span className="text-xl flag-emoji">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hero Section */}
      <section className="relative px-8 pt-24 pb-16 text-center overflow-hidden">
        {/* Logo/Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 ic-shadow-xl ic-animate-float">
          <AnimatedIcon icon={Hexagon} size={48} animation="ic-animate-spin-3d" className="text-white" />
        </div>

        {/* Main Headline */}
        <h1 className="ic-heading ic-heading-xl mb-8 leading-tight">
          {dashboardName || t.hyperlocalSocialNetwork}
        </h1>

        {/* Subtitle */}
        <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
          {t.connectWithLocalCommunity}
        </p>

        {/* Key Benefits */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 ic-shadow">
            <AnimatedIcon icon={MapPin} size={20} animation="ic-animate-pulse-3d" className="mr-3" />
            {t.inviteOnly}
          </Badge>
          <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 ic-shadow">
            <AnimatedIcon icon={Shield} size={20} animation="ic-animate-pulse-3d" className="mr-3" />
            {t.privateSecure}
          </Badge>
          <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 ic-shadow">
            <AnimatedIcon icon={Users} size={20} animation="ic-animate-pulse-3d" className="mr-3" />
            {t.realCommunity}
          </Badge>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
          <Button
            onClick={handleRegularLogin}
            disabled={isLoggingIn}
            className="flex-1 h-16 text-xl font-semibold ic-button"
            size="lg"
          >
            {isLoggingIn ? t.signingIn : t.signIn}
            <AnimatedIcon icon={ChevronRight} size={24} animation="ic-animate-bounce-3d" className="ml-3" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep('invite-form')}
            className="flex-1 h-16 text-xl font-semibold ic-glass backdrop-blur-sm border-2 border-indigo-200 hover:border-indigo-300"
            disabled={isLoggingIn}
            size="lg"
          >
            <AnimatedIcon icon={UserPlus} size={24} animation="ic-animate-bounce-3d" className="mr-3" />
            {t.haveInvitation}
          </Button>
        </div>

        <p className="text-lg text-gray-500 mt-6 font-medium">
          {t.signInToAccess}
        </p>
      </section>

      {/* Enhanced Features Carousel with New Functions */}
      <section className="px-8 py-16 bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="ic-heading ic-heading-lg text-center mb-12">
            {t.everythingYourCommunityNeeds}
          </h2>
          
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent className="bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-md rounded-3xl p-4 ic-shadow-lg border border-white/30">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="ic-card h-full border-0 ic-shadow-lg bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 ic-shadow`}>
                        <AnimatedIcon icon={feature.icon} size={32} animation="ic-animate-bounce-3d" className="text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex ic-nav" />
            <CarouselNext className="hidden md:flex ic-nav" />
          </Carousel>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="px-8 py-16 ic-glass">
        <div className="max-w-5xl mx-auto">
          <h2 className="ic-heading ic-heading-lg text-center mb-16">
            {t.whyHyperlocalNetwork}
          </h2>
          
          <div className="ic-grid ic-grid-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-6 ic-card p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center shrink-0 ic-shadow">
                  <AnimatedIcon icon={benefit.icon} size={24} animation="ic-animate-pulse-3d" className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="ic-heading ic-heading-lg mb-6">
            {t.readyToJoinCommunity}
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-medium">
            {t.signUpOrUseInvitation}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
            <Button
              onClick={handleRegularLogin}
              disabled={isLoggingIn}
              className="flex-1 h-16 text-xl font-semibold ic-button"
              size="lg"
            >
              {isLoggingIn ? t.signingIn : t.signIn}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentStep('invite-form')}
              className="flex-1 h-16 text-xl font-semibold ic-glass backdrop-blur-sm border-2 border-indigo-200 hover:border-indigo-300"
              disabled={isLoggingIn}
            >
              {t.haveInvitation}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200/50 ic-glass backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-3 text-lg text-gray-500">
            <span>© 2025. {t.builtWithLove}</span>
            <AnimatedIcon icon={Heart} size={20} animation="ic-animate-pulse-3d" className="text-red-500" />
            <span>{t.using}</span>
            <a 
              href="https://caffeine.ai" 
              className="text-indigo-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
