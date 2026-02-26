import { type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FileReference {
    hash: string;
    path: string;
}
export interface Link {
    id: string;
    url: string;
    previewImage?: string;
    title: string;
    tags: Array<string>;
    description?: string;
    addedBy: Principal;
}
export interface ChatMessage {
    id: string;
    sender: Principal;
    links: Array<string>;
    message: string;
    timestamp: Time;
    mediaPath?: string;
    readBy: Array<Principal>;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface CalendarEvent {
    id: string;
    title: string;
    date: Time;
    createdBy: Principal;
    description?: string;
}
export interface Album {
    id: string;
    title: string;
    createdBy: Principal;
    mediaIds: Array<string>;
}
export interface Media {
    id: string;
    title: string;
    description?: string;
    filePath: string;
    isVideo: boolean;
    uploadedBy: Principal;
}
export interface InviteLogEntry {
    id: string;
    admin: Principal;
    inviteCode: string;
    timestamp: Time;
}
export interface Reminder {
    id: string;
    title: string;
    date: Time;
    createdBy: Principal;
    description?: string;
}
export interface BadgeCriteria {
    id: string;
    requiredCount: bigint;
    activityType: string;
    icon: string;
    name: string;
    description: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export type Time = bigint;
export interface Poll {
    id: string;
    duration: bigint;
    question: string;
    votes: Array<bigint>;
    createdAt: Time;
    createdBy: Principal;
    voters: Array<Principal>;
    isClosed: boolean;
    options: Array<string>;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface UserProfile {
    theme: string;
    name: string;
    profilePhoto?: string;
    language: string;
}
export declare const createActor: (canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never) => backendInterface;
export declare const canisterId: string;
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEmojiReaction(mediaId: string, emoji: string): Promise<void>;
    addLink(url: string, title: string, description: string | null, previewImage: string | null, tags: Array<string>): Promise<string>;
    addMedia(title: string, description: string | null, filePath: string, isVideo: boolean): Promise<string>;
    addMediaToAlbum(albumId: string, mediaId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    closePoll(pollId: string): Promise<void>;
    createAlbum(title: string): Promise<string>;
    createBadgeCriteria(name: string, description: string, icon: string, requiredCount: bigint, activityType: string): Promise<string>;
    createCalendarEvent(title: string, date: Time, description: string | null): Promise<string>;
    createPoll(question: string, options: Array<string>, duration: bigint): Promise<string>;
    createReminder(title: string, date: Time, description: string | null): Promise<string>;
    deleteBadgeCriteria(badgeId: string): Promise<void>;
    deleteLink(id: string): Promise<void>;
    deleteMedia(mediaId: string): Promise<void>;
    deleteMessage(messageId: string): Promise<void>;
    deleteReminder(reminderId: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    editBadgeCriteria(badgeId: string, name: string, description: string, icon: string, requiredCount: bigint, activityType: string): Promise<void>;
    editLink(id: string, url: string, title: string, description: string | null, previewImage: string | null, tags: Array<string>): Promise<void>;
    editMessage(messageId: string, newMessage: string): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAlbumMedia(albumId: string): Promise<Array<Media>>;
    getAlbums(): Promise<Array<Album>>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getAllTags(): Promise<Array<string>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getBadgeCriteria(): Promise<Array<BadgeCriteria>>;
    getCalendarEvents(): Promise<Array<CalendarEvent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(): Promise<Array<ChatMessage>>;
    getDashboardName(): Promise<string>;
    getDefaultPreviewImage(): Promise<string | null>;
    getFileReference(path: string): Promise<FileReference>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getInviteLog(): Promise<Array<InviteLogEntry>>;
    getLinks(): Promise<Array<Link>>;
    getLinksByTag(tag: string): Promise<Array<Link>>;
    getMedia(): Promise<Array<Media>>;
    getMediaReactions(mediaId: string): Promise<Array<[string, bigint]>>;
    getNetworkLogo(): Promise<string | null>;
    getPoll(pollId: string): Promise<Poll | null>;
    getPolls(): Promise<Array<Poll>>;
    getReminders(): Promise<Array<Reminder>>;
    getUnreadMessageCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listFileReferences(): Promise<Array<FileReference>>;
    markAllMessagesAsRead(): Promise<void>;
    markMessageAsRead(messageId: string): Promise<void>;
    registerFileReference(path: string, hash: string): Promise<void>;
    registerUser(): Promise<void>;
    removeEmojiReaction(mediaId: string, emoji: string): Promise<void>;
    removeMediaFromAlbum(albumId: string, mediaId: string): Promise<void>;
    removeUser(user: Principal): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(message: string, mediaPath: string | null): Promise<string>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setDashboardName(newName: string): Promise<void>;
    setDefaultPreviewImage(imagePath: string): Promise<void>;
    setNetworkLogo(logoPath: string): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    updateMediaPath(messageId: string, mediaPath: string): Promise<void>;
    votePoll(pollId: string, optionIndex: bigint): Promise<void>;
}

