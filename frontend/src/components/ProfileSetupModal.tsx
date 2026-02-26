import { useState } from 'react';
import { useSaveCallerUserProfile, useRequestApproval } from '../hooks/useQueries';
import { useFileUpload } from '../blob-storage/FileStorage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Camera } from 'lucide-react';
import { languages } from '../utils/translations';

interface ProfileSetupModalProps {
  onComplete: () => void;
}

const themes = [
  { code: 'tokyo', name: 'Tokyo' },
  { code: 'royal-blue', name: 'Royal Blue' },
  { code: 'cyber-bunker', name: 'Cyber Bunker' },
];

export default function ProfileSetupModal({ onComplete }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('de');
  const [theme, setTheme] = useState('tokyo');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();
  const requestApproval = useRequestApproval();
  const { uploadFile, isUploading } = useFileUpload();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (5MB limit for profile photos)
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximale Dateigröße für Profilbilder: 5 MB');
        return;
      }
      setProfilePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Bitte wählen Sie eine gültige Bilddatei aus (JPG, PNG, GIF, WebP)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      let profilePhotoPath: string | undefined;
      
      if (profilePhoto) {
        const filePath = `profile-photos/${Date.now()}-${profilePhoto.name}`;
        await uploadFile(filePath, profilePhoto);
        profilePhotoPath = filePath;
      }

      // First save the profile
      await saveProfile.mutateAsync({ 
        name: name.trim(),
        language,
        theme,
        profilePhoto: profilePhotoPath || undefined
      });

      // Then request approval (which automatically creates a pending approval request)
      await requestApproval.mutateAsync();

      onComplete();
    } catch (error) {
      console.error('Profile setup failed:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Willkommen im Netzwerk!</DialogTitle>
          <p className="text-center text-muted-foreground">
            Erstelle dein Profil
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profilePhotoPreview || undefined} />
              <AvatarFallback>
                <Camera className="w-8 h-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="profilePhoto" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Upload className="w-4 h-4" />
                Profilbild hochladen
              </div>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </Label>
            {profilePhoto && (
              <p className="text-xs text-muted-foreground">
                {profilePhoto.name} ({(profilePhoto.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Dein Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gib deinen Namen ein"
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="language">Sprache</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Wähle deine Sprache" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Wähle dein Theme" />
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
            className="w-full"
            disabled={saveProfile.isPending || requestApproval.isPending || isUploading || !name.trim()}
          >
            {saveProfile.isPending || requestApproval.isPending || isUploading ? 'Speichert...' : 'Profil erstellen'}
          </Button>
          {(saveProfile.error || requestApproval.error) && (
            <p className="text-sm text-destructive text-center">
              Fehler: {saveProfile.error?.message || requestApproval.error?.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
