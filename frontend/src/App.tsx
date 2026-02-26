import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerApproved } from './hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import LoginScreen from './components/LoginScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import ApprovalPendingScreen from './components/ApprovalPendingScreen';
import Dashboard from './components/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showApprovalPending = isAuthenticated && userProfile && !approvalLoading && isApproved === false;

  // Apply user's theme and language when profile loads
  useEffect(() => {
    if (userProfile?.theme) {
      document.documentElement.setAttribute('data-theme', userProfile.theme);
    }
    
    // Set document language based on user profile
    if (userProfile?.language) {
      document.documentElement.lang = userProfile.language;
    }
  }, [userProfile?.theme, userProfile?.language]);

  if (isInitializing || (isAuthenticated && (profileLoading || approvalLoading))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LoginScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  if (showApprovalPending) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ApprovalPendingScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Dashboard />
        {showProfileSetup && (
          <ProfileSetupModal
            onComplete={() => {
              queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
              queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
            }}
          />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
