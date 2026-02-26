import { useState, useEffect, useRef } from 'react';
import { useGetChatMessages, useSendMessage, useGetCallerUserProfile, useGetUserProfile, useGetDashboardName, useAddPhoto, useMarkAllMessagesAsRead, useDeleteMessage, useEditMessage, useCreatePoll, useGetPolls, useVotePoll } from '../hooks/useQueries';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Send, MessageCircle, Image as ImageIcon, Video as VideoIcon, Paperclip, ExternalLink, Edit, Trash2, Save, X, Plus, Vote, BarChart3, Users, Play, Pause, File, CheckCircle, Timer, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import EmojiPicker from './EmojiPicker';
import { useTranslations } from '../utils/translations';
import { toast } from 'sonner';
import VideoCompressionDialog from './VideoCompressionDialog';
import FullScreenMediaView from './FullScreenMediaView';

// URL detection regex
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Function to detect URLs in text
const detectUrls = (text: string): string[] => {
  const matches = text.match(URL_REGEX);
  return matches || [];
};

// Function to render text with clickable links
const renderTextWithLinks = (text: string) => {
  const parts = text.split(URL_REGEX);
  return parts.map((part, index) => {
    if (URL_REGEX.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
        >
          {part}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    }
    return part;
  });
};

export default function ChatView() {
  const { data: messages, isLoading } = useGetChatMessages();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: dashboardName } = useGetDashboardName();
  const { data: polls } = useGetPolls();
  const { identity } = useInternetIdentity();
  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();
  const editMessage = useEditMessage();
  const addPhoto = useAddPhoto();
  const markAllAsRead = useMarkAllMessagesAsRead();
  const createPoll = useCreatePoll();
  const votePoll = useVotePoll();
  const { uploadFile, isUploading } = useFileUpload();
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'other' | null>(null);
  const [showUnreadDivider, setShowUnreadDivider] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('24'); // Default to 24 hours
  const [isCompressionDialogOpen, setIsCompressionDialogOpen] = useState(false);
  const [wasCompressed, setWasCompressed] = useState(false);
  const [fullScreenMedia, setFullScreenMedia] = useState<{
    isOpen: boolean;
    mediaPath: string;
    isVideo: boolean;
  }>({ isOpen: false, mediaPath: '', isVideo: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const unreadDividerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations(userProfile?.language);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark all messages as read when component mounts or messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      markAllAsRead.mutate();
    }
  }, [messages?.length]);

  // Handle scroll to hide unread divider
  useEffect(() => {
    const handleScroll = () => {
      if (unreadDividerRef.current) {
        const rect = unreadDividerRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          // Divider is visible, hide it after a short delay
          setTimeout(() => setShowUnreadDivider(false), 1000);
        }
      }
    };

    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMessageMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset compression state
    setWasCompressed(false);

    if (file.type.startsWith('image/')) {
      // Check file size (10MB limit for images)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Die Bilddatei ist zu groß. Maximale Dateigröße: 10 MB');
        return;
      }
      setSelectedFile(file);
      setFileType('image');
    } else if (file.type.startsWith('video/')) {
      // Check file size (50MB limit for videos)
      if (file.size > 50 * 1024 * 1024) {
        // Show compression dialog for large videos
        setSelectedFile(file);
        setFileType('video');
        setIsCompressionDialogOpen(true);
        return;
      }
      setSelectedFile(file);
      setFileType('video');
    } else {
      // Handle other file types (documents, etc.)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Die Datei ist zu groß. Maximale Dateigröße: 10 MB');
        return;
      }
      setSelectedFile(file);
      setFileType('other');
    }
  };

  const handleCompressionComplete = (compressedFile: File) => {
    setSelectedFile(compressedFile);
    setFileType('video');
    setWasCompressed(true);
    setIsCompressionDialogOpen(false);
    
    toast.success('Video wurde erfolgreich komprimiert! Sie können jetzt eine Nachricht eingeben und das Video senden.');
  };

  const handleCompressionDeclined = () => {
    // Reset file selection but keep the chat input accessible
    setSelectedFile(null);
    setFileType(null);
    setWasCompressed(false);
    setIsCompressionDialogOpen(false);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.info('Sie können ein anderes Video auswählen oder ein kleineres Video (unter 50 MB) verwenden.');
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newText = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newText);
      
      // Set cursor position after the emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2) return;

    try {
      const pollId = await createPoll.mutateAsync({
        question: pollQuestion.trim(),
        options: pollOptions.filter(opt => opt.trim()),
        duration: parseInt(pollDuration)
      });

      // Send a chat message about the poll
      const pollMessage = `📊 Neue Umfrage erstellt: "${pollQuestion.trim()}" (Dauer: ${pollDuration} Stunden)`;
      await sendMessage.mutateAsync({ message: pollMessage });

      setPollQuestion('');
      setPollOptions(['', '']);
      setPollDuration('24');
      setShowPollDialog(false);
      toast.success('Umfrage wurde erstellt und im Chat geteilt!');
    } catch (error: any) {
      toast.error(`Fehler beim Erstellen der Umfrage: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      try {
        const now = new Date();
        const chatTitle = `aus Chat vom ${format(now, 'dd.MM.yyyy, HH:mm', { locale: de })}`;
        const messageText = newMessage.trim() || (
          fileType === 'video' ? 'Video geteilt' : 
          fileType === 'image' ? 'Bild geteilt' : 
          'Datei geteilt'
        );
        
        if (fileType === 'video') {
          // Handle video upload
          const filePath = `chat-videos/${Date.now()}-${selectedFile.name}`;
          await uploadFile(filePath, selectedFile);
          
          // Add to photo gallery as video
          await addPhoto.mutateAsync({
            title: chatTitle,
            description: messageText,
            filePath,
            isVideo: true,
          });
          
          // Send chat message with video reference
          sendMessage.mutate({ 
            message: messageText, 
            mediaPath: filePath 
          }, {
            onSuccess: () => {
              setNewMessage('');
              setSelectedFile(null);
              setFileType(null);
              setWasCompressed(false);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              
              if (wasCompressed) {
                toast.success('Komprimiertes Video wurde erfolgreich geteilt!');
              } else {
                toast.success('Video wurde erfolgreich geteilt!');
              }
            },
          });
        } else if (fileType === 'image') {
          // Handle image upload
          const filePath = `chat-images/${Date.now()}-${selectedFile.name}`;
          await uploadFile(filePath, selectedFile);
          
          // Add to photo gallery
          await addPhoto.mutateAsync({
            title: chatTitle,
            description: messageText,
            filePath,
            isVideo: false,
          });
          
          // Send chat message with image reference
          sendMessage.mutate({ 
            message: messageText, 
            mediaPath: filePath 
          }, {
            onSuccess: () => {
              setNewMessage('');
              setSelectedFile(null);
              setFileType(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              toast.success('Bild wurde erfolgreich geteilt!');
            },
          });
        } else {
          // Handle other file types (just send as text message with file info)
          const fileInfo = `📎 ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`;
          const fullMessage = newMessage.trim() ? `${newMessage.trim()}\n\n${fileInfo}` : fileInfo;
          
          sendMessage.mutate({ message: fullMessage }, {
            onSuccess: () => {
              setNewMessage('');
              setSelectedFile(null);
              setFileType(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              toast.success('Datei-Information wurde geteilt!');
            },
          });
        }
      } catch (error) {
        console.error('File upload failed:', error);
        toast.error(`Fehler beim Hochladen der ${fileType === 'video' ? 'Video' : fileType === 'image' ? 'Bild' : 'Datei'}`);
      }
    } else if (newMessage.trim()) {
      // Handle text message - URLs will be automatically detected by the backend
      sendMessage.mutate({ message: newMessage.trim() }, {
        onSuccess: () => {
          setNewMessage('');
        },
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage.mutate(messageId);
    setShowMessageMenu(null);
  };

  const handleEditMessage = (messageId: string, currentMessage: string) => {
    // Extract text content from message (remove image/video prefix if present)
    const imageMatch = currentMessage.match(/\[IMAGE:([^\]]+)\]\s*(.*)/);
    const videoMatch = currentMessage.match(/\[VIDEO:([^\]]+)\]\s*(.*)/);
    let textContent = currentMessage;
    
    if (imageMatch) {
      textContent = imageMatch[2];
    } else if (videoMatch) {
      textContent = videoMatch[2];
    }
    
    setEditingMessageId(messageId);
    setEditingText(textContent);
    setShowMessageMenu(null);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId || !editingText.trim()) return;

    // Find the original message to preserve image/video prefix if it exists
    const originalMessage = messages?.find(m => m.id === editingMessageId);
    if (!originalMessage) return;

    let finalMessage = editingText.trim();
    
    // Preserve media paths in the message
    if (originalMessage.mediaPath) {
      // Check if it's an image or video based on file extension or other logic
      const isVideo = originalMessage.mediaPath.includes('video') || originalMessage.mediaPath.includes('.mp4') || originalMessage.mediaPath.includes('.webm');
      if (isVideo) {
        finalMessage = `[VIDEO:${originalMessage.mediaPath}] ${editingText.trim()}`;
      } else {
        finalMessage = `[IMAGE:${originalMessage.mediaPath}] ${editingText.trim()}`;
      }
    }

    editMessage.mutate(
      { messageId: editingMessageId, newMessage: finalMessage },
      {
        onSuccess: () => {
          setEditingMessageId(null);
          setEditingText('');
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleMessageClick = (messageId: string, isOwnMessage: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwnMessage && editingMessageId !== messageId) {
      setShowMessageMenu(showMessageMenu === messageId ? null : messageId);
    }
  };

  const handleMediaClick = (mediaPath: string, isVideo: boolean) => {
    setFullScreenMedia({
      isOpen: true,
      mediaPath,
      isVideo
    });
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setWasCompressed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string | null) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <VideoIcon className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getFileTypeLabel = (type: string | null) => {
    switch (type) {
      case 'image':
        return 'Bild';
      case 'video':
        return 'Video';
      default:
        return 'Datei';
    }
  };

  const sortedMessages = messages?.sort((a, b) => Number(a.timestamp - b.timestamp)) || [];
  const currentUserPrincipal = identity?.getPrincipal().toString();

  // Find first unread message
  const firstUnreadIndex = sortedMessages.findIndex(message => 
    !message.readBy.some(user => user.toString() === currentUserPrincipal)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">{dashboardName || 'My Hyperlocal Social Network'} - {t.chat}</h2>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{dashboardName || 'My Hyperlocal Social Network'} - {t.chat}</h2>
              <p className="text-sm text-muted-foreground">
                {messages?.length || 0} {t.messages}
              </p>
            </div>
            <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Vote className="w-4 h-4 mr-2" />
                  {t.createPoll}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.createPoll}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePoll} className="space-y-4">
                  <div>
                    <Label htmlFor="pollQuestion">{t.pollQuestion}</Label>
                    <Input
                      id="pollQuestion"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="Was möchtest du fragen?"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>{t.pollOptions}</Label>
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          required={index < 2}
                        />
                        {pollOptions.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePollOption(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 6 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddPollOption}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t.addOption}
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pollDuration">Umfragedauer</Label>
                    <Select value={pollDuration} onValueChange={setPollDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle die Dauer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Stunde</SelectItem>
                        <SelectItem value="12">12 Stunden</SelectItem>
                        <SelectItem value="24">24 Stunden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createPoll.isPending || !pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2}
                    >
                      {createPoll.isPending ? 'Erstelle...' : t.createPollButton}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPollDialog(false)}
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-container">
          {sortedMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t.noMessages}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.startConversation}
              </p>
            </div>
          ) : (
            sortedMessages.map((message, index) => (
              <div key={message.id}>
                {/* Unread Messages Divider */}
                {showUnreadDivider && index === firstUnreadIndex && firstUnreadIndex > 0 && (
                  <div 
                    ref={unreadDividerRef}
                    className="flex items-center gap-4 my-6"
                  >
                    <div className="flex-1 h-px bg-orange-300"></div>
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      {t.unreadMessagesLabel}
                    </div>
                    <div className="flex-1 h-px bg-orange-300"></div>
                  </div>
                )}
                <MessageBubble
                  message={message}
                  isOwnMessage={message.sender.toString() === currentUserPrincipal}
                  isEditing={editingMessageId === message.id}
                  editingText={editingText}
                  showMenu={showMessageMenu === message.id}
                  onEditTextChange={setEditingText}
                  onMessageClick={(e) => handleMessageClick(message.id, message.sender.toString() === currentUserPrincipal, e)}
                  onEdit={() => handleEditMessage(message.id, message.message)}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={() => handleDeleteMessage(message.id)}
                  onMediaClick={handleMediaClick}
                  isDeleting={deleteMessage.isPending}
                  isEditingSaving={editMessage.isPending}
                  polls={polls || []}
                  onVotePoll={(pollId, optionIndex) => votePoll.mutate({ pollId, optionIndex })}
                  currentUserPrincipal={currentUserPrincipal}
                  t={t}
                />
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
          {selectedFile && (
            <div className="mb-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getFileIcon(fileType)}
                <span className="text-sm font-medium">
                  {getFileTypeLabel(fileType)} ausgewählt:
                </span>
                {wasCompressed && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    komprimiert
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelectedFile}
                  className="text-destructive hover:text-destructive ml-auto"
                >
                  Entfernen
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
              {(fileType === 'image' || fileType === 'video') && (
                <p className="text-xs text-muted-foreground mt-1">
                  {fileType === 'video' 
                    ? 'Das Video wird automatisch zur Medien-Galerie hinzugefügt.'
                    : 'Das Bild wird automatisch zur Medien-Galerie hinzugefügt.'
                  }
                </p>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={sendMessage.isPending || isUploading}
              title="Datei anhängen"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <EmojiPicker 
              onEmojiSelect={handleEmojiSelect}
              disabled={sendMessage.isPending || isUploading}
            />
            
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={selectedFile ? `${getFileTypeLabel(fileType)}-Beschreibung...` : t.writeMessage}
              className="flex-1"
              disabled={sendMessage.isPending || isUploading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={sendMessage.isPending || isUploading || (!newMessage.trim() && !selectedFile)}
            >
              {sendMessage.isPending || isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          {sendMessage.error && (
            <p className="text-sm text-destructive mt-2">
              {t.error}: {sendMessage.error.message}
            </p>
          )}
        </div>
      </div>

      {/* Video Compression Dialog */}
      {selectedFile && isCompressionDialogOpen && (
        <VideoCompressionDialog
          isOpen={isCompressionDialogOpen}
          onClose={() => setIsCompressionDialogOpen(false)}
          file={selectedFile}
          onCompressionComplete={handleCompressionComplete}
          onCompressionDeclined={handleCompressionDeclined}
        />
      )}

      {/* Full Screen Media View */}
      <FullScreenMediaView
        isOpen={fullScreenMedia.isOpen}
        onClose={() => setFullScreenMedia({ isOpen: false, mediaPath: '', isVideo: false })}
        mediaPath={fullScreenMedia.mediaPath}
        isVideo={fullScreenMedia.isVideo}
      />
    </>
  );
}

function MessageBubble({ 
  message, 
  isOwnMessage, 
  isEditing,
  editingText,
  showMenu,
  onEditTextChange,
  onMessageClick,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onMediaClick,
  isDeleting,
  isEditingSaving,
  polls,
  onVotePoll,
  currentUserPrincipal,
  t 
}: { 
  message: any; 
  isOwnMessage: boolean;
  isEditing: boolean;
  editingText: string;
  showMenu: boolean;
  onEditTextChange: (text: string) => void;
  onMessageClick: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onMediaClick: (mediaPath: string, isVideo: boolean) => void;
  isDeleting: boolean;
  isEditingSaving: boolean;
  polls: any[];
  onVotePoll: (pollId: string, optionIndex: number) => void;
  currentUserPrincipal?: string;
  t: any;
}) {
  const { data: senderProfile } = useGetUserProfile(message.sender);
  const messageDate = new Date(Number(message.timestamp / BigInt(1000000)));
  
  const senderName = senderProfile?.name || `Benutzer ${message.sender.toString().slice(0, 8)}...`;

  // Check if message contains media
  const hasMedia = message.mediaPath;
  
  // Check if message is about a poll
  const isPollMessage = message.message.includes('📊 Neue Umfrage erstellt:');
  
  let textContent = message.message;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : 'order-1'} relative`}>
        <Card 
          className={`${isOwnMessage ? 'bg-primary text-primary-foreground' : ''} ${
            isOwnMessage && !isEditing ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
          } ${isPollMessage ? 'border-purple-200 bg-purple-50' : ''}`}
          onClick={isOwnMessage && !isEditing ? onMessageClick : undefined}
        >
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-1">
              {!isOwnMessage && (
                <p className={`text-xs font-medium ${
                  isOwnMessage ? 'text-primary-foreground/70' : 'text-primary'
                }`}>
                  {senderName}
                </p>
              )}
            </div>
            
            {/* Media Display */}
            {hasMedia && <ChatMedia mediaPath={message.mediaPath} onMediaClick={onMediaClick} />}
            
            {/* Poll Display */}
            {isPollMessage && <ChatPollDisplay polls={polls} onVotePoll={onVotePoll} currentUserPrincipal={currentUserPrincipal} t={t} />}
            
            {/* Text Content */}
            {!isPollMessage && (
              isEditing ? (
                <div className="space-y-2 mt-2">
                  <Textarea
                    value={editingText}
                    onChange={(e) => onEditTextChange(e.target.value)}
                    className="text-sm resize-none bg-background text-foreground border-border focus:border-ring focus:ring-ring"
                    rows={2}
                    disabled={isEditingSaving}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={onSaveEdit}
                      disabled={isEditingSaving || !editingText.trim()}
                      className={
                        isOwnMessage 
                          ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' 
                          : ''
                      }
                    >
                      {isEditingSaving ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <Save className="w-3 h-3 mr-1" />
                      )}
                      Speichern
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onCancelEdit}
                      disabled={isEditingSaving}
                      className={
                        isOwnMessage 
                          ? 'border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10' 
                          : ''
                      }
                    >
                      <X className="w-3 h-3 mr-1" />
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                textContent && (
                  <div className={`text-sm ${hasMedia ? 'mt-2' : ''} whitespace-pre-wrap`}>
                    {renderTextWithLinks(textContent)}
                  </div>
                )
              )
            )}
            
            <p className={`text-xs mt-1 ${
              isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {format(messageDate, 'dd.MM. HH:mm', { locale: de })}
            </p>
          </CardContent>
        </Card>

        {/* Compact Message Menu */}
        {isOwnMessage && showMenu && !isEditing && !isPollMessage && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2 z-10">
            <div className="bg-white border border-border rounded-lg shadow-lg p-1 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 px-2 text-xs"
                disabled={isDeleting}
              >
                <Edit className="w-3 h-3 mr-1" />
                Bearbeiten
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                    disabled={isDeleting}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Nachricht löschen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bist du sicher, dass du diese Nachricht löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
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
        )}
      </div>
    </div>
  );
}

function ChatMedia({ mediaPath, onMediaClick }: { mediaPath: string; onMediaClick: (path: string, isVideo: boolean) => void }) {
  const { data: mediaUrl, isLoading } = useFileUrl(mediaPath);
  
  // Determine if it's a video based on file path or extension
  const isVideo = mediaPath.includes('video') || mediaPath.includes('.mp4') || mediaPath.includes('.webm') || mediaPath.includes('.mov');

  if (isLoading) {
    return (
      <div className="w-full max-w-[80vw] aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center mb-2">
        {isVideo ? (
          <VideoIcon className="w-8 h-8 text-muted-foreground" />
        ) : (
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
    );
  }

  if (!mediaUrl) {
    return (
      <div className="w-full max-w-[80vw] aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
        {isVideo ? (
          <VideoIcon className="w-8 h-8 text-muted-foreground" />
        ) : (
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[80vw] mb-2 cursor-pointer" onClick={() => onMediaClick(mediaPath, isVideo)}>
      {isVideo ? (
        <div className="relative group">
          <video
            src={mediaUrl}
            className="w-full h-auto rounded-lg"
            style={{ maxWidth: '80vw' }}
            preload="metadata"
          >
            Ihr Browser unterstützt das Video-Element nicht.
          </video>
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      ) : (
        <img
          src={mediaUrl}
          alt="Chat Bild"
          className="w-full h-auto rounded-lg hover:opacity-90 transition-opacity"
          style={{ maxWidth: '80vw' }}
        />
      )}
    </div>
  );
}

function ChatPollDisplay({ polls, onVotePoll, currentUserPrincipal, t }: { polls: any[]; onVotePoll: (pollId: string, optionIndex: number) => void; currentUserPrincipal?: string; t: any }) {
  // Get the most recent poll for display in chat
  const latestPoll = polls.sort((a, b) => Number(b.createdAt - a.createdAt))[0];
  
  if (!latestPoll) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Vote className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Umfrage</span>
        </div>
        <p className="text-purple-700">Umfrage wird geladen...</p>
      </div>
    );
  }

  const totalVotes = latestPoll.votes.reduce((sum: bigint, votes: bigint) => sum + votes, BigInt(0));
  const hasVoted = latestPoll.voters.some((voter: any) => voter.toString() === currentUserPrincipal);
  const currentTime = Date.now();
  const pollEndTime = Number(latestPoll.createdAt / BigInt(1000000)) + (Number(latestPoll.duration) * 60 * 60 * 1000);
  const isExpired = latestPoll.isClosed || currentTime > pollEndTime;

  // Calculate time remaining
  const timeRemaining = Math.max(0, pollEndTime - currentTime);
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Umfrage</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-purple-600">
          {isExpired ? (
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Geschlossen</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>{hoursRemaining > 0 ? `${hoursRemaining}h ${minutesRemaining}m` : `${minutesRemaining}m`}</span>
            </div>
          )}
        </div>
      </div>
      
      <h4 className="font-semibold text-purple-900 mb-3">{latestPoll.question}</h4>
      
      <div className="space-y-2">
        {latestPoll.options.map((option: string, index: number) => {
          const votes = Number(latestPoll.votes[index] || BigInt(0));
          const percentage = Number(totalVotes) > 0 ? (votes / Number(totalVotes)) * 100 : 0;
          
          return (
            <div key={index} className="space-y-1">
              {!hasVoted && !isExpired ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVotePoll(latestPoll.id, index)}
                  className="w-full justify-start text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  <Vote className="w-3 h-3 mr-2" />
                  {option}
                </Button>
              ) : (
                <div className="p-2 rounded border bg-white border-purple-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-purple-700">
                      {option}
                    </span>
                    <span className="text-xs text-purple-600">
                      {votes} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-purple-200">
        <div className="flex items-center gap-1 text-xs text-purple-600">
          <Users className="w-3 h-3" />
          <span>{Number(totalVotes)} Stimmen</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-purple-600">
          <BarChart3 className="w-3 h-3" />
          <span>{isExpired ? 'Beendet' : 'Aktiv'}</span>
        </div>
      </div>
    </div>
  );
}
