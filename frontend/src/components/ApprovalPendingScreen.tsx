import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRequestApproval, useGetCallerUserProfile, useListApprovals } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslations } from '../utils/translations';
import { ApprovalStatus } from '../backend';

export default function ApprovalPendingScreen() {
  const { clear, identity } = useInternetIdentity();
  const requestApproval = useRequestApproval();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: approvals } = useListApprovals();
  const queryClient = useQueryClient();
  const t = useTranslations(userProfile?.language);

  // Check if current user has been rejected
  const currentUserPrincipal = identity?.getPrincipal().toString();
  const userApproval = approvals?.find(approval => 
    approval.principal.toString() === currentUserPrincipal
  );
  const isRejected = userApproval?.status === ApprovalStatus.rejected;

  // Auto-logout and clear data when rejected
  useEffect(() => {
    if (isRejected) {
      const handleRejection = async () => {
        // Wait a moment to show the rejection message
        setTimeout(async () => {
          await clear();
          queryClient.clear();
        }, 5000); // Show rejection message for 5 seconds before auto-logout
      };
      handleRejection();
    }
  }, [isRejected, clear, queryClient]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleRequestApproval = () => {
    requestApproval.mutate();
  };

  // Show rejection notification
  if (isRejected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-800">Anfrage abgelehnt</CardTitle>
            <p className="text-red-600">
              Ihre Registrierungsanfrage wurde von einem Administrator abgelehnt.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Was passiert jetzt?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Alle Ihre Daten wurden aus dem System entfernt</li>
                    <li>• Sie werden automatisch abgemeldet</li>
                    <li>• Bei erneuter Registrierung ist eine neue Genehmigung erforderlich</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Sie werden in wenigen Sekunden automatisch abgemeldet.
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Jetzt abmelden
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <footer className="absolute bottom-6 left-0 right-0 text-center text-sm text-muted-foreground">
          © 2025. Built with <Heart className="w-4 h-4 inline text-red-500" /> using{' '}
          <a href="https://caffeine.ai" className="text-primary hover:underline">
            caffeine.ai
          </a>
        </footer>
      </div>
    );
  }

  // Show normal pending approval screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">{t.approvalPending}</CardTitle>
          <p className="text-muted-foreground">
            {t.accessPending}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {t.accessPendingDesc}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Was passiert als nächstes?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Ein Administrator wird deine Anfrage prüfen</li>
                  <li>• Du erhältst automatisch Zugang nach der Genehmigung</li>
                  <li>• Keine weitere Aktion von dir erforderlich</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleRequestApproval}
            disabled={requestApproval.isPending}
            className="w-full"
            variant="outline"
          >
            {requestApproval.isPending ? t.sending : t.requestApprovalAgain}
          </Button>
          
          {requestApproval.error && (
            <p className="text-sm text-destructive text-center">
              {t.error}: {requestApproval.error.message}
            </p>
          )}
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full"
          >
            {t.logout}
          </Button>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-sm text-muted-foreground">
        © 2025. Built with <Heart className="w-4 h-4 inline text-red-500" /> using{' '}
        <a href="https://caffeine.ai" className="text-primary hover:underline">
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
