import React, { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, Upload, Camera, Save, Edit, Calendar } from 'lucide-react';
import { useTranslations, languages } from '../utils/translations';

interface ProfileViewProps {
  onBack: () => void;
}

const themes = [
  { code: 'tokyo', name: 'Tokyo' },
  { code: 'royal-blue', name: 'Royal Blue' },
  { code: 'cyber-bunker', name: 'Cyber Bunker' },
];

export default function ProfileView({ onBack }: ProfileViewProps) {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { data: currentProfilePhotoUrl } = useFileUrl(userProfile?.profilePhoto || '');
  const saveProfile = useSaveCallerUserProfile();
  const { uploadFile, isUploading } = useFileUpload();
  const t = useTranslations(userProfile?.language);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('de');
  const [theme, setTheme] = useState('tokyo');
  const [birthday, setBirthday] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  // Initialize form when profile loads
  React.useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setLanguage(userProfile.language);
      setTheme(userProfile.theme || 'tokyo');
      // Birthday will be added when backend supports it
      setBirthday(''); // userProfile.birthday || ''
    }
  }, [userProfile]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (5MB limit for profile photos)
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximale Dateigröße für Profilbilder: 5 MB');
        return;
      }
      setNewProfilePhoto(file);
      
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

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      let profilePhotoPath = userProfile?.profilePhoto;
      
      if (newProfilePhoto) {
        const filePath = `profile-photos/${Date.now()}-${newProfilePhoto.name}`;
        await uploadFile(filePath, newProfilePhoto);
        profilePhotoPath = filePath;
      }

      saveProfile.mutate(
        { 
          name: name.trim(),
          language,
          theme,
          profilePhoto: profilePhotoPath
          // birthday will be added when backend supports it
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            setNewProfilePhoto(null);
            setProfilePhotoPreview(null);
            // Apply theme change immediately
            document.documentElement.setAttribute('data-theme', theme);
          },
        }
      );
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setName(userProfile.name);
      setLanguage(userProfile.language);
      setTheme(userProfile.theme || 'tokyo');
      setBirthday(''); // userProfile.birthday || ''
    }
    setNewProfilePhoto(null);
    setProfilePhotoPreview(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">{t.profile}</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === userProfile?.language);
  const currentTheme = themes.find(t => t.code === (userProfile?.theme || 'tokyo'))?.name || 'Tokyo';
  const displayPhotoUrl = profilePhotoPreview || currentProfilePhotoUrl;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">{t.profile}</h2>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Edit className="w-4 h-4 mr-2" />
            {t.edit}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t.myProfile}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={displayPhotoUrl || undefined} />
              <AvatarFallback>
                <User className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="text-center">
                <Label htmlFor="profilePhoto" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Upload className="w-4 h-4" />
                    {t.changeProfilePhoto}
                  </div>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </Label>
                {newProfilePhoto && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {newProfilePhoto.name} ({(newProfilePhoto.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t.name}</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.yourName}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">
                  {userProfile?.name || t.notSet}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="language">{t.language}</Label>
              {isEditing ? (
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.chooseLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg flag-emoji">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">
                  {currentLanguage && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg flag-emoji">{currentLanguage.flag}</span>
                      <span>{currentLanguage.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="theme">{t.theme}</Label>
              {isEditing ? (
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
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
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">
                  {currentTheme}
                </div>
              )}
            </div>

            {/* Birthday Field - Ready for backend implementation */}
            <div>
              <Label htmlFor="birthday" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.birthday}
              </Label>
              {isEditing ? (
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder={t.chooseBirthday}
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">
                  {birthday || t.notSet}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Wird für Geburtstags-Erinnerungen verwendet
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={saveProfile.isPending || isUploading || !name.trim()}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveProfile.isPending || isUploading ? t.saving : t.save}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={saveProfile.isPending || isUploading}
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          )}

          {saveProfile.error && (
            <p className="text-sm text-destructive text-center">
              {t.error}: {saveProfile.error.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
