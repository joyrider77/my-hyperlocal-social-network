import { useGetCalendarEvents, useGetUserProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFileUrl } from '../blob-storage/FileStorage';
import { ArrowLeft, Calendar, Clock, User, MapPin, FileText, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTranslations } from '../utils/translations';

interface CalendarDetailViewProps {
  eventId: string | null;
  onBack: () => void;
}

export default function CalendarDetailView({ eventId, onBack }: CalendarDetailViewProps) {
  const { data: events, isLoading } = useGetCalendarEvents();
  const { data: userProfile } = useGetCallerUserProfile();
  const t = useTranslations(userProfile?.language);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const event = events?.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">Termin nicht gefunden</h2>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Der angeforderte Termin konnte nicht gefunden werden.</p>
            <Button onClick={onBack} className="mt-4">
              Zurück zur Übersicht
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const eventDate = new Date(Number(event.date / BigInt(1000000)));
  const isUpcoming = eventDate > new Date();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Termin-Details</h2>
          <p className="text-sm text-muted-foreground">
            Vollständige Informationen zu diesem Termin
          </p>
        </div>
      </div>

      {/* Event Details Card */}
      <Card className={`overflow-hidden shadow-lg border-0 ${
        isUpcoming 
          ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-l-blue-500' 
          : 'bg-gradient-to-br from-background to-muted/20'
      }`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${isUpcoming ? 'bg-blue-200' : 'bg-muted'}`}>
                <Calendar className={`w-6 h-6 ${isUpcoming ? 'text-blue-700' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                {isUpcoming && (
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800 border-0">
                    <Clock className="w-3 h-3 mr-1" />
                    Anstehend
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Date and Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-muted/50">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Datum</p>
                  <p className="font-semibold text-lg">
                    {format(eventDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-muted/50">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uhrzeit</p>
                  <p className="font-semibold text-lg">
                    {format(eventDate, 'HH:mm')} Uhr
                  </p>
                </div>
              </div>
            </div>

            {/* Creator Information */}
            <div className="space-y-4">
              <EventCreatorCard creatorPrincipal={event.createdBy} />
              
              {/* Event Status */}
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-muted/50">
                <div className={`p-2 rounded-lg ${isUpcoming ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <UserCheck className={`w-5 h-5 ${isUpcoming ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">
                    {isUpcoming ? 'Steht bevor' : 'Vergangen'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Beschreibung</h3>
              </div>
              <div className="p-4 bg-white/50 rounded-lg border border-muted/50">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Time Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Zeitinformationen</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 rounded-lg border border-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Verbleibende Zeit</p>
                <p className="font-semibold">
                  {isUpcoming ? (
                    <TimeUntilEvent eventDate={eventDate} />
                  ) : (
                    <span className="text-gray-600">Termin ist vorbei</span>
                  )}
                </p>
              </div>
              <div className="p-4 bg-white/50 rounded-lg border border-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Wochentag</p>
                <p className="font-semibold">
                  {format(eventDate, 'EEEE', { locale: de })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-muted/50">
            <Button onClick={onBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EventCreatorCard({ creatorPrincipal }: { creatorPrincipal: any }) {
  const { data: creatorProfile } = useGetUserProfile(creatorPrincipal);
  const { data: profilePhotoUrl } = useFileUrl(creatorProfile?.profilePhoto || '');
  
  const creatorName = creatorProfile?.name || `Benutzer ${creatorPrincipal.toString().slice(0, 8)}...`;

  return (
    <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-muted/50">
      <Avatar className="w-10 h-10 ring-2 ring-primary/20">
        <AvatarImage src={profilePhotoUrl || undefined} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
          <User className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-muted-foreground">Erstellt von</p>
        <p className="font-semibold">{creatorName}</p>
      </div>
    </div>
  );
}

function TimeUntilEvent({ eventDate }: { eventDate: Date }) {
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return <span className="text-gray-600">Termin ist vorbei</span>;
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return <span className="text-blue-600">{diffDays} Tag{diffDays !== 1 ? 'e' : ''}</span>;
  } else if (diffHours > 0) {
    return <span className="text-orange-600">{diffHours} Stunde{diffHours !== 1 ? 'n' : ''}</span>;
  } else {
    return <span className="text-red-600">{diffMinutes} Minute{diffMinutes !== 1 ? 'n' : ''}</span>;
  }
}
