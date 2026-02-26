import React, { useState } from 'react';
import { useGetCallerUserProfile, useGetPolls, useCreatePoll, useVotePoll, useClosePoll, useGetUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Vote, X, Users, BarChart3, Clock, CheckCircle, Lock, Eye, Timer } from 'lucide-react';
import { useTranslations } from '../utils/translations';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import AnimatedIcon from './AnimatedIcon';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function PollsView() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: polls } = useGetPolls();
  const createPoll = useCreatePoll();
  const votePoll = useVotePoll();
  const closePoll = useClosePoll();
  const { identity } = useInternetIdentity();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState('24'); // Default to 24 hours
  const [isCreating, setIsCreating] = useState(false);
  const [showStatistics, setShowStatistics] = useState<string | null>(null);
  const t = useTranslations(userProfile?.language);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || options.filter(opt => opt.trim()).length < 2) return;

    setIsCreating(true);
    
    try {
      await createPoll.mutateAsync({
        question: question.trim(),
        options: options.filter(opt => opt.trim()),
        duration: parseInt(duration)
      });
      
      toast.success('Umfrage wurde erfolgreich erstellt!');
      setQuestion('');
      setOptions(['', '']);
      setDuration('24');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await votePoll.mutateAsync({ pollId, optionIndex });
      toast.success('Ihre Stimme wurde erfolgreich abgegeben!');
    } catch (error: any) {
      if (error.message.includes('already voted')) {
        toast.error('Sie haben bereits bei dieser Umfrage abgestimmt!');
      } else {
        toast.error(`Fehler: ${error.message}`);
      }
    }
  };

  const handleClosePoll = async (pollId: string) => {
    try {
      await closePoll.mutateAsync(pollId);
      toast.success('Umfrage wurde geschlossen!');
    } catch (error: any) {
      toast.error(`Fehler: ${error.message}`);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setDuration('24');
    setIsCreating(false);
  };

  const sortedPolls = polls?.sort((a, b) => Number(b.createdAt - a.createdAt)) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ic-heading ic-heading-lg mb-2">
            {t.polls}
          </h2>
          <p className="text-muted-foreground text-lg">
            Erstelle Umfragen und sammle Meinungen vom Netzwerk
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="ic-button">
              <Plus className="w-5 h-5 mr-2" />
              {t.createPoll}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{t.createPoll}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-sm font-medium">{t.pollQuestion}</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Was möchtest du fragen?"
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.pollOptions}</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required={index < 2}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addOption}
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-medium">Umfragedauer</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Wähle die Dauer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Stunde</SelectItem>
                    <SelectItem value="12">12 Stunden</SelectItem>
                    <SelectItem value="24">24 Stunden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isCreating || !question.trim() || options.filter(opt => opt.trim()).length < 2}
                >
                  {isCreating ? 'Erstelle...' : t.createPollButton}
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

      {/* Polls List */}
      <div className="space-y-4">
        {!sortedPolls || sortedPolls.length === 0 ? (
          <Card className="ic-tile relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 opacity-50"></div>
            <CardContent className="p-12 text-center relative z-10">
              <AnimatedIcon icon={Vote} size={48} animation="ic-animate-float" className="text-blue-400 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Noch keine Umfragen vorhanden</p>
              <p className="text-sm text-muted-foreground mt-1">
                Erstelle die erste Umfrage für dein Netzwerk!
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedPolls.map((poll) => (
            <PollCard 
              key={poll.id} 
              poll={poll} 
              onVote={(optionIndex) => handleVote(poll.id, optionIndex)}
              onClose={() => handleClosePoll(poll.id)}
              onShowStatistics={() => setShowStatistics(poll.id)}
              isVoting={votePoll.isPending}
              isClosing={closePoll.isPending}
              currentUserPrincipal={currentUserPrincipal}
              showStatistics={showStatistics === poll.id}
              onHideStatistics={() => setShowStatistics(null)}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PollCard({ 
  poll, 
  onVote, 
  onClose,
  onShowStatistics,
  isVoting, 
  isClosing,
  currentUserPrincipal,
  showStatistics,
  onHideStatistics,
  t 
}: { 
  poll: any; 
  onVote: (optionIndex: number) => void; 
  onClose: () => void;
  onShowStatistics: () => void;
  isVoting: boolean;
  isClosing: boolean;
  currentUserPrincipal?: string;
  showStatistics: boolean;
  onHideStatistics: () => void;
  t: any;
}) {
  const { data: creatorProfile } = useGetUserProfile(poll.createdBy);
  const totalVotes = poll.votes.reduce((sum: bigint, votes: bigint) => sum + votes, BigInt(0));
  const hasVoted = poll.voters.some((voter: any) => voter.toString() === currentUserPrincipal);
  const currentTime = Date.now();
  const pollEndTime = Number(poll.createdAt / BigInt(1000000)) + (Number(poll.duration) * 60 * 60 * 1000);
  const isExpired = poll.isClosed || currentTime > pollEndTime;
  const canVote = !hasVoted && !isExpired;
  const isCreator = poll.createdBy.toString() === currentUserPrincipal;
  const creatorName = creatorProfile?.name || `Benutzer ${poll.createdBy.toString().slice(0, 8)}...`;

  // Calculate time remaining
  const timeRemaining = Math.max(0, pollEndTime - currentTime);
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Card className="ic-tile relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 opacity-50"></div>
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl ic-shadow">
              <AnimatedIcon icon={Vote} size={20} animation="ic-animate-bounce-3d" className="text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{poll.question}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isExpired ? 'secondary' : 'default'} className="text-xs">
                  {isExpired ? (
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Geschlossen
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {hoursRemaining > 0 ? `${hoursRemaining}h ${minutesRemaining}m` : `${minutesRemaining}m`}
                    </div>
                  )}
                </Badge>
                {hasVoted && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Abgestimmt
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isCreator && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShowStatistics}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                Statistik
              </Button>
            )}
            {isCreator && !isExpired && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isClosing}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {isClosing ? 'Schließe...' : 'Schließen'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0 relative z-10">
        {showStatistics && isCreator ? (
          <PollStatistics poll={poll} onClose={onHideStatistics} />
        ) : (
          <div className="space-y-3">
            {poll.options.map((option: string, index: number) => {
              const votes = Number(poll.votes[index] || BigInt(0));
              const percentage = Number(totalVotes) > 0 ? (votes / Number(totalVotes)) * 100 : 0;
              const isUserChoice = hasVoted && poll.voters.some((voter: any) => voter.toString() === currentUserPrincipal);
              
              return (
                <div key={index} className="space-y-2">
                  {canVote ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVote(index)}
                      disabled={isVoting}
                      className="w-full justify-start text-purple-700 border-purple-200 hover:bg-purple-100"
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      {option}
                    </Button>
                  ) : (
                    <div className={`p-3 rounded-lg border ${
                      isUserChoice ? 'bg-purple-100 border-purple-300' : 'bg-white/60 border-purple-200'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${
                          isUserChoice ? 'font-medium text-purple-900' : 'text-purple-700'
                        }`}>
                          {option}
                        </span>
                        <span className="text-xs text-purple-600">
                          {votes} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-200">
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <Users className="w-4 h-4" />
            <span>{Number(totalVotes)} {Number(totalVotes) === 1 ? 'Stimme' : 'Stimmen'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-600">
            <span>von {creatorName}</span>
            <Clock className="w-4 h-4" />
            <span>{format(new Date(Number(poll.createdAt / BigInt(1000000))), 'dd.MM.yyyy', { locale: de })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PollStatistics({ poll, onClose }: { poll: any; onClose: () => void }) {
  const totalVotes = poll.votes.reduce((sum: bigint, votes: bigint) => sum + votes, BigInt(0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-purple-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Detaillierte Statistik
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white/80 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-purple-600">Gesamtstimmen:</span>
            <span className="font-medium ml-2">{Number(totalVotes)}</span>
          </div>
          <div>
            <span className="text-purple-600">Teilnehmer:</span>
            <span className="font-medium ml-2">{poll.voters.length}</span>
          </div>
          <div>
            <span className="text-purple-600">Dauer:</span>
            <span className="font-medium ml-2">{Number(poll.duration)} Stunden</span>
          </div>
          <div>
            <span className="text-purple-600">Status:</span>
            <span className="font-medium ml-2">{poll.isClosed ? 'Geschlossen' : 'Aktiv'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium text-purple-800">Abstimmungsverteilung:</h5>
          {poll.options.map((option: string, index: number) => {
            const votes = Number(poll.votes[index] || BigInt(0));
            const percentage = Number(totalVotes) > 0 ? (votes / Number(totalVotes)) * 100 : 0;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">{option}</span>
                  <span className="text-purple-600">{votes} Stimmen ({Math.round(percentage)}%)</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {poll.voters.length > 0 && (
          <div className="pt-2 border-t border-purple-200">
            <h5 className="font-medium text-purple-800 mb-2">Teilnehmer:</h5>
            <div className="text-xs text-purple-600 space-y-1">
              {poll.voters.map((voter: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  <UserDisplay principal={voter} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserDisplay({ principal }: { principal: any }) {
  const { data: userProfile } = useGetUserProfile(principal);
  
  return (
    <span>
      {userProfile?.name || `Benutzer ${principal.toString().slice(0, 8)}...`}
    </span>
  );
}
