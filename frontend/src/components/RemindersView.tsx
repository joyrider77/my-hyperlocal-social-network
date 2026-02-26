import React, { useState } from 'react';
import { useGetCallerUserProfile, useGetReminders, useCreateReminder, useDeleteReminder } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Calendar, Clock, Gift, Trash2, Edit } from 'lucide-react';
import { useTranslations } from '../utils/translations';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import AnimatedIcon from './AnimatedIcon';

export default function RemindersView() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: reminders } = useGetReminders();
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const t = useTranslations(userProfile?.language);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    setIsCreating(true);
    
    try {
      const reminderDate = new Date(`${date}T${time}`);
      
      await createReminder.mutateAsync({
        title: title.trim(),
        date: reminderDate,
        description: description.trim() || undefined,
      });
      
      toast.success('Erinnerung wurde erstellt!');
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder.mutateAsync(id);
      toast.success('Erinnerung wurde gelöscht!');
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ic-heading ic-heading-lg mb-2">
            {t.reminders}
          </h2>
          <p className="text-muted-foreground text-lg">
            Verpasse keine wichtigen Termine und Geburtstage!
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="ic-button">
              <Plus className="w-5 h-5 mr-2" />
              {t.createReminder}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">{t.createReminder}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">{t.reminderTitle}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Woran soll erinnert werden?"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium">{t.reminderDate}</Label>
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
                  <Label htmlFor="time" className="text-sm font-medium">{t.reminderTime}</Label>
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
                  placeholder="Zusätzliche Details..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isCreating || !title.trim() || !date || !time}
                >
                  {isCreating ? t.processing : t.createReminderButton}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  {t.cancel}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {!reminders || reminders.length === 0 ? (
          <Card className="ic-tile relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
            <CardContent className="p-12 text-center relative z-10">
              <AnimatedIcon icon={Bell} size={48} animation="ic-animate-float" className="text-blue-400 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t.noRemindersYet}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.createFirstReminder}
              </p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard 
              key={reminder.id} 
              reminder={reminder} 
              onDelete={() => handleDeleteReminder(reminder.id)}
              isDeleting={deleteReminder.isPending}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ReminderCard({ reminder, onDelete, isDeleting, t }: { 
  reminder: any; 
  onDelete: () => void; 
  isDeleting: boolean;
  t: any;
}) {
  const reminderDate = new Date(Number(reminder.date / BigInt(1000000)));
  const isToday = format(reminderDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isTomorrow = format(reminderDate, 'yyyy-MM-dd') === format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  return (
    <Card className="ic-tile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl ic-shadow`}>
              <AnimatedIcon icon={Bell} size={24} animation="ic-animate-bounce-3d" className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{reminder.title}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(reminderDate, 'dd.MM.yyyy', { locale: de })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{format(reminderDate, 'HH:mm')}</span>
                </div>
              </div>

              {(isToday || isTomorrow) && (
                <Badge variant="secondary" className={`text-xs ${
                  isToday ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {isToday ? t.today : t.tomorrow}
                </Badge>
              )}

              {reminder.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {reminder.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive h-8 w-8"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.deleteReminder}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bist du sicher, dass du diese Erinnerung löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Löscht...' : t.delete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
