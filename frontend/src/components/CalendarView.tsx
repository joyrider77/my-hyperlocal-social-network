import { useState } from 'react';
import { useGetCalendarEvents, useCreateCalendarEvent, useEditCalendarEvent, useDeleteCalendarEvent, useGetCallerUserProfile, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Calendar, Clock, User, Edit, Trash2, Save, X, CalendarDays, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTranslations } from '../utils/translations';
import { useQueryClient } from '@tanstack/react-query';

export default function CalendarView() {
  const { data: events, isLoading } = useGetCalendarEvents();
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const createEvent = useCreateCalendarEvent();
  const editEvent = useEditCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const t = useTranslations(userProfile?.language);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    const dateTime = new Date(`${date}T${time}`);
    const timestamp = BigInt(dateTime.getTime() * 1000000); // Convert to nanoseconds

    if (editingEvent) {
      editEvent.mutate(
        {
          id: editingEvent.id,
          title: title.trim(),
          date: timestamp,
          description: description.trim() || null,
        },
        {
          onSuccess: () => {
            resetForm();
            // Refresh calendar events to show latest changes
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
          },
          onError: (error) => {
            console.error('Edit event error:', error);
            // For now, just show an alert since backend doesn't support editing yet
            alert(t.error + ': Bearbeitung von Terminen ist noch nicht verfügbar. Diese Funktion wird bald hinzugefügt.');
          },
        }
      );
    } else {
      createEvent.mutate(
        {
          title: title.trim(),
          date: timestamp,
          description: description.trim() || null,
        },
        {
          onSuccess: () => {
            resetForm();
            // Refresh calendar events to show latest changes
            queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
          },
        }
      );
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (event: any) => {
    const eventDate = new Date(Number(event.date / BigInt(1000000)));
    setEditingEvent(event);
    setTitle(event.title);
    setDate(format(eventDate, 'yyyy-MM-dd'));
    setTime(format(eventDate, 'HH:mm'));
    setDescription(event.description || '');
    setIsDialogOpen(true);
  };

  const handleDelete = (eventId: string) => {
    deleteEvent.mutate(eventId, {
      onSuccess: () => {
        // Refresh calendar events to show latest changes
        queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
      },
      onError: (error) => {
        console.error('Delete event error:', error);
        // For now, just show an alert since backend doesn't support deleting yet
        alert(t.error + ': Löschen von Terminen ist noch nicht verfügbar. Diese Funktion wird bald hinzugefügt.');
      },
    });
  };

  const canEditEvent = (event: any): boolean => {
    if (!currentUserPrincipal) return false;
    return event.createdBy.toString() === currentUserPrincipal;
  };

  const sortedEvents = events?.sort((a, b) => Number(a.date - b.date)) || [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t.networkCalendar}
          </h2>
          <p className="text-muted-foreground mt-1">
            Verwalte gemeinsame Termine und Events
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              {t.event}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingEvent ? t.editEvent : t.newEvent}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">{t.title}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.whatIsHappening}
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium">{t.date}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm font-medium">{t.time}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  {t.description} ({t.optional})
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.moreDetails}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={createEvent.isPending || editEvent.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createEvent.isPending || editEvent.isPending 
                    ? t.saving
                    : editingEvent 
                      ? t.saveChanges
                      : t.createEvent
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
              </div>
              {(createEvent.error || editEvent.error) && (
                <p className="text-sm text-destructive">
                  {t.error}: {createEvent.error?.message || editEvent.error?.message}
                </p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-muted-foreground text-lg font-medium">{t.noEvents}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t.createFirstEvent}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedEvents.map((event) => {
            const eventDate = new Date(Number(event.date / BigInt(1000000)));
            const isUpcoming = eventDate > new Date();
            const canEdit = canEditEvent(event);
            
            return (
              <EventCard 
                key={event.id} 
                event={event} 
                eventDate={eventDate}
                isUpcoming={isUpcoming}
                canEdit={canEdit}
                onEdit={() => handleEdit(event)}
                onDelete={() => handleDelete(event.id)}
                isDeleting={deleteEvent.isPending}
                t={t}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function EventCard({ 
  event, 
  eventDate, 
  isUpcoming, 
  canEdit, 
  onEdit, 
  onDelete, 
  isDeleting,
  t 
}: { 
  event: any; 
  eventDate: Date; 
  isUpcoming: boolean; 
  canEdit: boolean; 
  onEdit: () => void; 
  onDelete: () => void; 
  isDeleting: boolean;
  t: any;
}) {
  const { data: creatorProfile } = useGetUserProfile(event.createdBy);
  const creatorName = creatorProfile?.name || `Benutzer ${event.createdBy.toString().slice(0, 8)}...`;

  return (
    <Card className={`overflow-hidden shadow-lg border-0 transition-all duration-200 hover:shadow-xl ${
      isUpcoming 
        ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-l-blue-500' 
        : 'bg-gradient-to-br from-background to-muted/20'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-2 rounded-xl ${isUpcoming ? 'bg-blue-200' : 'bg-muted'}`}>
                <Calendar className={`w-5 h-5 ${isUpcoming ? 'text-blue-700' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-foreground">{event.title}</h3>
                {isUpcoming && (
                  <Badge variant="secondary" className="mt-2 bg-blue-200 text-blue-800 border-0">
                    Anstehend
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {format(eventDate, 'dd.MM.yyyy', { locale: de })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {format(eventDate, 'HH:mm')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="w-4 h-4" />
                <span>Erstellt von <span className="font-medium text-foreground">{creatorName}</span></span>
              </div>
            </div>

            {event.description && (
              <div className="p-4 bg-muted/30 rounded-lg border border-muted/50">
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-6">
            {isUpcoming && (
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            )}
            {canEdit && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-9 w-9 hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-red-100 h-9 w-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.deleteEvent}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.deleteEventDescription}
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
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
