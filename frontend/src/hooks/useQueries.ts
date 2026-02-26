import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useActor } from './useActor';
import { CalendarEvent, ChatMessage, Media, Link, UserProfile, RSVP, InviteCode, Time, UserApprovalInfo, ApprovalStatus, InviteLogEntry, Album, UserRole, Reminder, Poll, BadgeCriteria } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Get user profile by principal
export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

// Get all user profiles
export function useGetAllUserProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ['allUserProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Role Queries
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin Queries
export function useIsCurrentUserAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCurrentUserAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Dashboard Name Queries
export function useGetDashboardName() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['dashboardName'],
    queryFn: async () => {
      if (!actor) return 'Mein Hyperlokales Soziales Netzwerk';
      return actor.getDashboardName();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetDashboardName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDashboardName(newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardName'] });
    },
  });
}

// Network Logo Queries
export function useGetNetworkLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['networkLogo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNetworkLogo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetNetworkLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logoPath: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setNetworkLogo(logoPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkLogo'] });
    },
  });
}

// Default Preview Image Queries
export function useGetDefaultPreviewImage() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['defaultPreviewImage'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDefaultPreviewImage();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetDefaultPreviewImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imagePath: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setDefaultPreviewImage(imagePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaultPreviewImage'] });
    },
  });
}

// Approval Queries
export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000, // Check approval status every 2 seconds
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

// Register User (for new users without profile)
export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000, // Refresh every 3 seconds for admin to see status changes
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: string; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      const userPrincipal = Principal.fromText(user);
      return actor.setApproval(userPrincipal, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['inviteLog'] });
    },
  });
}

// User Removal
export function useRemoveUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.removeUser(principal);
    },
    onSuccess: () => {
      // Invalidate all relevant queries after user removal
      queryClient.invalidateQueries({ queryKey: ['allUserProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

// Invite Log Queries
export function useGetInviteLog() {
  const { actor, isFetching } = useActor();

  return useQuery<InviteLogEntry[]>({
    queryKey: ['inviteLog'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInviteLog();
    },
    enabled: !!actor && !isFetching,
  });
}

// Calendar Queries
export function useGetCalendarEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<CalendarEvent[]>({
    queryKey: ['calendarEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCalendarEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCalendarEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, date, description }: { title: string; date: Time; description: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCalendarEvent(title, date, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

// Note: These would need backend implementation
export function useEditCalendarEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, date, description }: { id: string; title: string; date: Time; description: string | null }) => {
      // This would need backend implementation
      throw new Error('Edit calendar event not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // This would need backend implementation
      throw new Error('Delete calendar event not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

// Chat Queries
export function useGetChatMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });
}

export function useGetUnreadMessageCount() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['unreadMessageCount'],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getUnreadMessageCount();
      return Number(count);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

export function useMarkMessageAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markMessageAsRead(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessageCount'] });
    },
  });
}

export function useMarkAllMessagesAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.markAllMessagesAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessageCount'] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, mediaPath }: { message: string; mediaPath?: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(message, mediaPath || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessageCount'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessageCount'] });
    },
  });
}

export function useEditMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, newMessage }: { messageId: string; newMessage: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editMessage(messageId, newMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

// Media Queries (renamed from Photo to Media)
export function useGetMedia() {
  const { actor, isFetching } = useActor();

  return useQuery<Media[]>({
    queryKey: ['media'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMedia();
    },
    enabled: !!actor && !isFetching,
  });
}

// Keep old function name for backward compatibility
export function useGetPhotos() {
  return useGetMedia();
}

export function useAddMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, filePath, isVideo }: { title: string; description: string | null; filePath: string; isVideo?: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMedia(title, description, filePath, isVideo || false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

// Keep old function name for backward compatibility
export function useAddPhoto() {
  return useAddMedia();
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMedia(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

// Keep old function name for backward compatibility
export function useDeletePhoto() {
  return useDeleteMedia();
}

// Media Reactions (renamed from Photo Reactions)
export function useGetMediaReactions(mediaId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['mediaReactions', mediaId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMediaReactions(mediaId);
    },
    enabled: !!actor && !isFetching && !!mediaId,
  });
}

// Keep old function name for backward compatibility
export function useGetPhotoReactions(photoId: string) {
  return useGetMediaReactions(photoId);
}

export function useAddMediaReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, emoji }: { mediaId: string; emoji: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEmojiReaction(mediaId, emoji);
    },
    onSuccess: (_, { mediaId }) => {
      queryClient.invalidateQueries({ queryKey: ['mediaReactions', mediaId] });
    },
  });
}

// Keep old function name for backward compatibility
export function useAddPhotoReaction() {
  return useAddMediaReaction();
}

export function useRemoveMediaReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, emoji }: { mediaId: string; emoji: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeEmojiReaction(mediaId, emoji);
    },
    onSuccess: (_, { mediaId }) => {
      queryClient.invalidateQueries({ queryKey: ['mediaReactions', mediaId] });
    },
  });
}

// Keep old function name for backward compatibility
export function useRemovePhotoReaction() {
  return useRemoveMediaReaction();
}

// Album Queries
export function useGetAlbums() {
  const { actor, isFetching } = useActor();

  return useQuery<Album[]>({
    queryKey: ['albums'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlbums();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAlbum(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useGetAlbumMedia(albumId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Media[]>({
    queryKey: ['albumMedia', albumId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAlbumMedia(albumId);
    },
    enabled: !!actor && !isFetching && !!albumId,
  });
}

// Keep old function name for backward compatibility
export function useGetAlbumPhotos(albumId: string) {
  return useGetAlbumMedia(albumId);
}

export function useAddMediaToAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, mediaId }: { albumId: string; mediaId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMediaToAlbum(albumId, mediaId);
    },
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['albumMedia', albumId] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

// Keep old function name for backward compatibility
export function useAddPhotoToAlbum() {
  return useAddMediaToAlbum();
}

export function useRemoveMediaFromAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ albumId, mediaId }: { albumId: string; mediaId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMediaFromAlbum(albumId, mediaId);
    },
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['albumMedia', albumId] });
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

// Keep old function name for backward compatibility
export function useRemovePhotoFromAlbum() {
  return useRemoveMediaFromAlbum();
}

// Link Queries
export function useGetLinks() {
  const { actor, isFetching } = useActor();

  return useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLinksByTag(tag: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Link[]>({
    queryKey: ['linksByTag', tag],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLinksByTag(tag);
    },
    enabled: !!actor && !isFetching && !!tag,
  });
}

export function useGetAllTags() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['allTags'],
    queryFn: async () => {
      if (!actor) return [];
      const tags = await actor.getAllTags();
      // Remove duplicates and sort
      return Array.from(new Set(tags)).sort();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, title, description, previewImage, tags }: { url: string; title: string; description: string | null; previewImage?: string | null; tags: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLink(url, title, description, previewImage || null, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['allTags'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

export function useEditLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, url, title, description, previewImage, tags }: { id: string; url: string; title: string; description: string | null; previewImage?: string | null; tags: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editLink(id, url, title, description, previewImage || null, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['allTags'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

export function useDeleteLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['allTags'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

// Link Preview Fetching
export function useFetchLinkPreview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string): Promise<string | null> => {
      try {
        // Use a CORS proxy service to fetch the page content
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch page');
        }

        const data = await response.json();
        const html = data.contents;

        // Parse HTML to extract Open Graph image
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Try Open Graph image first
        let imageUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        
        // Fallback to Twitter card image
        if (!imageUrl) {
          imageUrl = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
        }
        
        // Fallback to first image in the page
        if (!imageUrl) {
          const firstImg = doc.querySelector('img');
          if (firstImg) {
            imageUrl = firstImg.getAttribute('src');
          }
        }

        // Make sure the image URL is absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          const baseUrl = new URL(url);
          if (imageUrl.startsWith('//')) {
            imageUrl = baseUrl.protocol + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            imageUrl = baseUrl.origin + imageUrl;
          } else {
            imageUrl = baseUrl.origin + '/' + imageUrl;
          }
        }

        return imageUrl || null;
      } catch (error) {
        console.error('Error fetching link preview:', error);
        return null;
      }
    },
  });
}

// Dashboard Overview Query
export function useGetDashboardOverview() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      if (!actor) return null;
      
      const [events, links, media] = await Promise.all([
        actor.getCalendarEvents(),
        actor.getLinks(),
        actor.getMedia(),
      ]);

      // Sort and get latest items
      const upcomingEvents = events
        .filter(event => new Date(Number(event.date / BigInt(1000000))) > new Date())
        .sort((a, b) => Number(a.date - b.date))
        .slice(0, 3);

      const latestLink = links
        .sort((a, b) => a.id.localeCompare(b.id))
        .reverse()[0] || null;

      const recentMedia = media
        .sort((a, b) => a.id.localeCompare(b.id))
        .reverse()
        .slice(0, 4);

      return {
        upcomingEvents,
        latestLink,
        recentMedia,
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Invite/RSVP Queries
export function useSubmitRSVP() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, attending, inviteCode }: { name: string; attending: boolean; inviteCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRSVP(name, attending, inviteCode);
    },
  });
}

export function useGetAllRSVPs() {
  const { actor, isFetching } = useActor();

  return useQuery<RSVP[]>({
    queryKey: ['allRSVPs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRSVPs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInviteCodes() {
  const { actor, isFetching } = useActor();

  return useQuery<InviteCode[]>({
    queryKey: ['inviteCodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInviteCodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateInviteCode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCodes'] });
    },
  });
}

// Badge Criteria Queries - Using real backend functionality
export function useGetBadgeCriteria() {
  const { actor, isFetching } = useActor();

  return useQuery<BadgeCriteria[]>({
    queryKey: ['badgeCriteria'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBadgeCriteria();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBadgeCriteria() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, icon, requiredCount, activityType }: { 
      name: string; 
      description: string; 
      icon: string; 
      requiredCount: number; 
      activityType: string; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBadgeCriteria(name, description, icon, BigInt(requiredCount), activityType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeCriteria'] });
    },
  });
}

export function useEditBadgeCriteria() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ badgeId, name, description, icon, requiredCount, activityType }: { 
      badgeId: string; 
      name: string; 
      description: string; 
      icon: string; 
      requiredCount: number; 
      activityType: string; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editBadgeCriteria(badgeId, name, description, icon, BigInt(requiredCount), activityType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeCriteria'] });
    },
  });
}

export function useDeleteBadgeCriteria() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badgeId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBadgeCriteria(badgeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeCriteria'] });
    },
  });
}

// Gamification Queries - Mock implementation until backend is ready
export function useGetUserBadges() {
  return useQuery({
    queryKey: ['userBadges'],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        { id: 'communicator', name: 'Kommunikator', description: '50 Chat-Nachrichten gesendet', icon: 'MessageCircle', earned: true },
        { id: 'photographer', name: 'Medien-Sammler', description: '20 Medien hochgeladen', icon: 'Camera', earned: false },
        { id: 'videofilmer', name: 'Videofilmer', description: '10 Videos hochgeladen', icon: 'Video', earned: false },
      ];
    },
  });
}

export function useGetLeaderboard() {
  const { data: allUserProfiles } = useGetAllUserProfiles();
  const { data: approvals } = useListApprovals();

  return useQuery({
    queryKey: ['leaderboard', allUserProfiles, approvals],
    queryFn: async () => {
      if (!allUserProfiles || !approvals) return [];

      // Get only active (approved) users
      const approvedUsers = approvals
        .filter(approval => approval.status === ApprovalStatus.approved)
        .map(approval => approval.principal.toString());

      // Filter user profiles to only include approved users
      const activeUsers = allUserProfiles.filter(([principal, profile]) => 
        approvedUsers.includes(principal.toString())
      );

      // Mock leaderboard data for active users only
      return activeUsers.map(([principal, profile], index) => ({
        rank: index + 1,
        name: profile.name,
        points: Math.max(150 - (index * 30), 10), // Mock points calculation
        badges: Math.max(3 - index, 0), // Mock badges calculation
        principal: principal.toString()
      })).sort((a, b) => b.points - a.points);
    },
    enabled: !!allUserProfiles && !!approvals,
  });
}

// Reminders Queries - Now using real backend functionality
export function useGetReminders() {
  const { actor, isFetching } = useActor();

  return useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReminders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, date, description }: { 
      title: string; 
      date: Date; 
      description?: string; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      const timeInNanoseconds = BigInt(date.getTime()) * BigInt(1000000);
      return actor.createReminder(title, timeInNanoseconds, description || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReminder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

// Polls Queries - Enhanced with duration support and single voting
export function useGetPolls() {
  const { actor, isFetching } = useActor();

  return useQuery<Poll[]>({
    queryKey: ['polls'],
    queryFn: async () => {
      if (!actor) return [];
      const polls = await actor.getPolls();
      
      // Check for expired polls and auto-close them
      const currentTime = Date.now();
      for (const poll of polls) {
        const pollEndTime = Number(poll.createdAt / BigInt(1000000)) + (Number(poll.duration) * 60 * 60 * 1000);
        if (!poll.isClosed && currentTime > pollEndTime) {
          // Poll has expired, close it
          try {
            await actor.closePoll(poll.id);
          } catch (error) {
            console.error('Failed to auto-close expired poll:', error);
          }
        }
      }
      
      return polls;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Refresh every 10 seconds for real-time voting and expiration
  });
}

export function useGetPoll(pollId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Poll | null>({
    queryKey: ['poll', pollId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPoll(pollId);
    },
    enabled: !!actor && !isFetching && !!pollId,
  });
}

export function useCreatePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, options, duration }: { question: string; options: string[]; duration: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPoll(question, options, BigInt(duration));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}

export function useVotePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.votePoll(pollId, BigInt(optionIndex));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}

export function useClosePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pollId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.closePoll(pollId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
}
