import { type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { backend as _backend, createActor as _createActor, canisterId as _canisterId, CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return {
        __kind__: "Some",
        value: value
    };
}
function none(): None {
    return {
        __kind__: "None"
    };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) {
        throw new Error("unwrap: none");
    }
    return option.value;
}
function candid_some<T>(value: T): [T] {
    return [
        value
    ];
}
function candid_none<T>(): [] {
    return [];
}
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}
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
export function createActor(canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never): backendInterface {
    const actor = _createActor(canisterId, options);
    return new Backend(actor, processError);
}
export const canisterId = _canisterId;
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
import type { ApprovalStatus as _ApprovalStatus, CalendarEvent as _CalendarEvent, ChatMessage as _ChatMessage, Link as _Link, Media as _Media, Poll as _Poll, Reminder as _Reminder, Time as _Time, UserApprovalInfo as _UserApprovalInfo, UserProfile as _UserProfile, UserRole as _UserRole } from "declarations/backend/backend.did.d.ts";
class Backend implements backendInterface {
    private actor: ActorSubclass<_SERVICE>;
    constructor(actor?: ActorSubclass<_SERVICE>, private processError?: (error: unknown) => never){
        this.actor = actor ?? _backend;
    }
    async addEmojiReaction(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addEmojiReaction(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addEmojiReaction(arg0, arg1);
            return result;
        }
    }
    async addLink(arg0: string, arg1: string, arg2: string | null, arg3: string | null, arg4: Array<string>): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.addLink(arg0, arg1, to_candid_opt_n1(arg2), to_candid_opt_n1(arg3), arg4);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addLink(arg0, arg1, to_candid_opt_n1(arg2), to_candid_opt_n1(arg3), arg4);
            return result;
        }
    }
    async addMedia(arg0: string, arg1: string | null, arg2: string, arg3: boolean): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.addMedia(arg0, to_candid_opt_n1(arg1), arg2, arg3);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addMedia(arg0, to_candid_opt_n1(arg1), arg2, arg3);
            return result;
        }
    }
    async addMediaToAlbum(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addMediaToAlbum(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addMediaToAlbum(arg0, arg1);
            return result;
        }
    }
    async assignCallerUserRole(arg0: Principal, arg1: UserRole): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n2(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n2(arg1));
            return result;
        }
    }
    async closePoll(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.closePoll(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.closePoll(arg0);
            return result;
        }
    }
    async createAlbum(arg0: string): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createAlbum(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createAlbum(arg0);
            return result;
        }
    }
    async createBadgeCriteria(arg0: string, arg1: string, arg2: string, arg3: bigint, arg4: string): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createBadgeCriteria(arg0, arg1, arg2, arg3, arg4);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createBadgeCriteria(arg0, arg1, arg2, arg3, arg4);
            return result;
        }
    }
    async createCalendarEvent(arg0: string, arg1: Time, arg2: string | null): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createCalendarEvent(arg0, arg1, to_candid_opt_n1(arg2));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createCalendarEvent(arg0, arg1, to_candid_opt_n1(arg2));
            return result;
        }
    }
    async createPoll(arg0: string, arg1: Array<string>, arg2: bigint): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createPoll(arg0, arg1, arg2);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createPoll(arg0, arg1, arg2);
            return result;
        }
    }
    async createReminder(arg0: string, arg1: Time, arg2: string | null): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.createReminder(arg0, arg1, to_candid_opt_n1(arg2));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.createReminder(arg0, arg1, to_candid_opt_n1(arg2));
            return result;
        }
    }
    async deleteBadgeCriteria(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteBadgeCriteria(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteBadgeCriteria(arg0);
            return result;
        }
    }
    async deleteLink(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteLink(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteLink(arg0);
            return result;
        }
    }
    async deleteMedia(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteMedia(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteMedia(arg0);
            return result;
        }
    }
    async deleteMessage(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteMessage(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteMessage(arg0);
            return result;
        }
    }
    async deleteReminder(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteReminder(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteReminder(arg0);
            return result;
        }
    }
    async dropFileReference(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.dropFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.dropFileReference(arg0);
            return result;
        }
    }
    async editBadgeCriteria(arg0: string, arg1: string, arg2: string, arg3: string, arg4: bigint, arg5: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.editBadgeCriteria(arg0, arg1, arg2, arg3, arg4, arg5);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.editBadgeCriteria(arg0, arg1, arg2, arg3, arg4, arg5);
            return result;
        }
    }
    async editLink(arg0: string, arg1: string, arg2: string, arg3: string | null, arg4: string | null, arg5: Array<string>): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.editLink(arg0, arg1, arg2, to_candid_opt_n1(arg3), to_candid_opt_n1(arg4), arg5);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.editLink(arg0, arg1, arg2, to_candid_opt_n1(arg3), to_candid_opt_n1(arg4), arg5);
            return result;
        }
    }
    async editMessage(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.editMessage(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.editMessage(arg0, arg1);
            return result;
        }
    }
    async generateInviteCode(): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.generateInviteCode();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.generateInviteCode();
            return result;
        }
    }
    async getAlbumMedia(arg0: string): Promise<Array<Media>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAlbumMedia(arg0);
                return from_candid_vec_n4(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAlbumMedia(arg0);
            return from_candid_vec_n4(result);
        }
    }
    async getAlbums(): Promise<Array<Album>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAlbums();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAlbums();
            return result;
        }
    }
    async getAllRSVPs(): Promise<Array<RSVP>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllRSVPs();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllRSVPs();
            return result;
        }
    }
    async getAllTags(): Promise<Array<string>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllTags();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllTags();
            return result;
        }
    }
    async getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllUserProfiles();
                return from_candid_vec_n8(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllUserProfiles();
            return from_candid_vec_n8(result);
        }
    }
    async getBadgeCriteria(): Promise<Array<BadgeCriteria>> {
        if (this.processError) {
            try {
                const result = await this.actor.getBadgeCriteria();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getBadgeCriteria();
            return result;
        }
    }
    async getCalendarEvents(): Promise<Array<CalendarEvent>> {
        if (this.processError) {
            try {
                const result = await this.actor.getCalendarEvents();
                return from_candid_vec_n12(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCalendarEvents();
            return from_candid_vec_n12(result);
        }
    }
    async getCallerUserProfile(): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserProfile();
                return from_candid_opt_n15(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserProfile();
            return from_candid_opt_n15(result);
        }
    }
    async getCallerUserRole(): Promise<UserRole> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserRole();
                return from_candid_UserRole_n16(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserRole();
            return from_candid_UserRole_n16(result);
        }
    }
    async getChatMessages(): Promise<Array<ChatMessage>> {
        if (this.processError) {
            try {
                const result = await this.actor.getChatMessages();
                return from_candid_vec_n18(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getChatMessages();
            return from_candid_vec_n18(result);
        }
    }
    async getDashboardName(): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.getDashboardName();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getDashboardName();
            return result;
        }
    }
    async getDefaultPreviewImage(): Promise<string | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getDefaultPreviewImage();
                return from_candid_opt_n7(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getDefaultPreviewImage();
            return from_candid_opt_n7(result);
        }
    }
    async getFileReference(arg0: string): Promise<FileReference> {
        if (this.processError) {
            try {
                const result = await this.actor.getFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getFileReference(arg0);
            return result;
        }
    }
    async getInviteCodes(): Promise<Array<InviteCode>> {
        if (this.processError) {
            try {
                const result = await this.actor.getInviteCodes();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getInviteCodes();
            return result;
        }
    }
    async getInviteLog(): Promise<Array<InviteLogEntry>> {
        if (this.processError) {
            try {
                const result = await this.actor.getInviteLog();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getInviteLog();
            return result;
        }
    }
    async getLinks(): Promise<Array<Link>> {
        if (this.processError) {
            try {
                const result = await this.actor.getLinks();
                return from_candid_vec_n21(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getLinks();
            return from_candid_vec_n21(result);
        }
    }
    async getLinksByTag(arg0: string): Promise<Array<Link>> {
        if (this.processError) {
            try {
                const result = await this.actor.getLinksByTag(arg0);
                return from_candid_vec_n21(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getLinksByTag(arg0);
            return from_candid_vec_n21(result);
        }
    }
    async getMedia(): Promise<Array<Media>> {
        if (this.processError) {
            try {
                const result = await this.actor.getMedia();
                return from_candid_vec_n4(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getMedia();
            return from_candid_vec_n4(result);
        }
    }
    async getMediaReactions(arg0: string): Promise<Array<[string, bigint]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getMediaReactions(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getMediaReactions(arg0);
            return result;
        }
    }
    async getNetworkLogo(): Promise<string | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getNetworkLogo();
                return from_candid_opt_n7(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getNetworkLogo();
            return from_candid_opt_n7(result);
        }
    }
    async getPoll(arg0: string): Promise<Poll | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getPoll(arg0);
                return from_candid_opt_n24(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getPoll(arg0);
            return from_candid_opt_n24(result);
        }
    }
    async getPolls(): Promise<Array<Poll>> {
        if (this.processError) {
            try {
                const result = await this.actor.getPolls();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getPolls();
            return result;
        }
    }
    async getReminders(): Promise<Array<Reminder>> {
        if (this.processError) {
            try {
                const result = await this.actor.getReminders();
                return from_candid_vec_n25(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getReminders();
            return from_candid_vec_n25(result);
        }
    }
    async getUnreadMessageCount(): Promise<bigint> {
        if (this.processError) {
            try {
                const result = await this.actor.getUnreadMessageCount();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getUnreadMessageCount();
            return result;
        }
    }
    async getUserProfile(arg0: Principal): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getUserProfile(arg0);
                return from_candid_opt_n15(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getUserProfile(arg0);
            return from_candid_opt_n15(result);
        }
    }
    async initializeAccessControl(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.initializeAccessControl();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.initializeAccessControl();
            return result;
        }
    }
    async isCallerAdmin(): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.isCallerAdmin();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.isCallerAdmin();
            return result;
        }
    }
    async isCallerApproved(): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.isCallerApproved();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.isCallerApproved();
            return result;
        }
    }
    async listApprovals(): Promise<Array<UserApprovalInfo>> {
        if (this.processError) {
            try {
                const result = await this.actor.listApprovals();
                return from_candid_vec_n27(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.listApprovals();
            return from_candid_vec_n27(result);
        }
    }
    async listFileReferences(): Promise<Array<FileReference>> {
        if (this.processError) {
            try {
                const result = await this.actor.listFileReferences();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.listFileReferences();
            return result;
        }
    }
    async markAllMessagesAsRead(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.markAllMessagesAsRead();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.markAllMessagesAsRead();
            return result;
        }
    }
    async markMessageAsRead(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.markMessageAsRead(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.markMessageAsRead(arg0);
            return result;
        }
    }
    async registerFileReference(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.registerFileReference(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.registerFileReference(arg0, arg1);
            return result;
        }
    }
    async registerUser(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.registerUser();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.registerUser();
            return result;
        }
    }
    async removeEmojiReaction(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.removeEmojiReaction(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.removeEmojiReaction(arg0, arg1);
            return result;
        }
    }
    async removeMediaFromAlbum(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.removeMediaFromAlbum(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.removeMediaFromAlbum(arg0, arg1);
            return result;
        }
    }
    async removeUser(arg0: Principal): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.removeUser(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.removeUser(arg0);
            return result;
        }
    }
    async requestApproval(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.requestApproval();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.requestApproval();
            return result;
        }
    }
    async saveCallerUserProfile(arg0: UserProfile): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.saveCallerUserProfile(to_candid_UserProfile_n32(arg0));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.saveCallerUserProfile(to_candid_UserProfile_n32(arg0));
            return result;
        }
    }
    async sendMessage(arg0: string, arg1: string | null): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.sendMessage(arg0, to_candid_opt_n1(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.sendMessage(arg0, to_candid_opt_n1(arg1));
            return result;
        }
    }
    async setApproval(arg0: Principal, arg1: ApprovalStatus): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.setApproval(arg0, to_candid_ApprovalStatus_n34(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.setApproval(arg0, to_candid_ApprovalStatus_n34(arg1));
            return result;
        }
    }
    async setDashboardName(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.setDashboardName(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.setDashboardName(arg0);
            return result;
        }
    }
    async setDefaultPreviewImage(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.setDefaultPreviewImage(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.setDefaultPreviewImage(arg0);
            return result;
        }
    }
    async setNetworkLogo(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.setNetworkLogo(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.setNetworkLogo(arg0);
            return result;
        }
    }
    async submitRSVP(arg0: string, arg1: boolean, arg2: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.submitRSVP(arg0, arg1, arg2);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.submitRSVP(arg0, arg1, arg2);
            return result;
        }
    }
    async updateMediaPath(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateMediaPath(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateMediaPath(arg0, arg1);
            return result;
        }
    }
    async votePoll(arg0: string, arg1: bigint): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.votePoll(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.votePoll(arg0, arg1);
            return result;
        }
    }
}
export const backend: backendInterface = new Backend();
function from_candid_ApprovalStatus_n30(value: _ApprovalStatus): ApprovalStatus {
    return from_candid_variant_n31(value);
}
function from_candid_CalendarEvent_n13(value: _CalendarEvent): CalendarEvent {
    return from_candid_record_n14(value);
}
function from_candid_ChatMessage_n19(value: _ChatMessage): ChatMessage {
    return from_candid_record_n20(value);
}
function from_candid_Link_n22(value: _Link): Link {
    return from_candid_record_n23(value);
}
function from_candid_Media_n5(value: _Media): Media {
    return from_candid_record_n6(value);
}
function from_candid_Reminder_n26(value: _Reminder): Reminder {
    return from_candid_record_n14(value);
}
function from_candid_UserApprovalInfo_n28(value: _UserApprovalInfo): UserApprovalInfo {
    return from_candid_record_n29(value);
}
function from_candid_UserProfile_n10(value: _UserProfile): UserProfile {
    return from_candid_record_n11(value);
}
function from_candid_UserRole_n16(value: _UserRole): UserRole {
    return from_candid_variant_n17(value);
}
function from_candid_opt_n15(value: [] | [_UserProfile]): UserProfile | null {
    return value.length === 0 ? null : from_candid_UserProfile_n10(value[0]);
}
function from_candid_opt_n24(value: [] | [_Poll]): Poll | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(value: [] | [string]): string | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_record_n11(value: {
    theme: string;
    name: string;
    profilePhoto: [] | [string];
    language: string;
}): {
    theme: string;
    name: string;
    profilePhoto?: string;
    language: string;
} {
    return {
        theme: value.theme,
        name: value.name,
        profilePhoto: record_opt_to_undefined(from_candid_opt_n7(value.profilePhoto)),
        language: value.language
    };
}
function from_candid_record_n14(value: {
    id: string;
    title: string;
    date: _Time;
    createdBy: Principal;
    description: [] | [string];
}): {
    id: string;
    title: string;
    date: Time;
    createdBy: Principal;
    description?: string;
} {
    return {
        id: value.id,
        title: value.title,
        date: value.date,
        createdBy: value.createdBy,
        description: record_opt_to_undefined(from_candid_opt_n7(value.description))
    };
}
function from_candid_record_n20(value: {
    id: string;
    sender: Principal;
    links: Array<string>;
    message: string;
    timestamp: _Time;
    mediaPath: [] | [string];
    readBy: Array<Principal>;
}): {
    id: string;
    sender: Principal;
    links: Array<string>;
    message: string;
    timestamp: Time;
    mediaPath?: string;
    readBy: Array<Principal>;
} {
    return {
        id: value.id,
        sender: value.sender,
        links: value.links,
        message: value.message,
        timestamp: value.timestamp,
        mediaPath: record_opt_to_undefined(from_candid_opt_n7(value.mediaPath)),
        readBy: value.readBy
    };
}
function from_candid_record_n23(value: {
    id: string;
    url: string;
    previewImage: [] | [string];
    title: string;
    tags: Array<string>;
    description: [] | [string];
    addedBy: Principal;
}): {
    id: string;
    url: string;
    previewImage?: string;
    title: string;
    tags: Array<string>;
    description?: string;
    addedBy: Principal;
} {
    return {
        id: value.id,
        url: value.url,
        previewImage: record_opt_to_undefined(from_candid_opt_n7(value.previewImage)),
        title: value.title,
        tags: value.tags,
        description: record_opt_to_undefined(from_candid_opt_n7(value.description)),
        addedBy: value.addedBy
    };
}
function from_candid_record_n29(value: {
    status: _ApprovalStatus;
    principal: Principal;
}): {
    status: ApprovalStatus;
    principal: Principal;
} {
    return {
        status: from_candid_ApprovalStatus_n30(value.status),
        principal: value.principal
    };
}
function from_candid_record_n6(value: {
    id: string;
    title: string;
    description: [] | [string];
    filePath: string;
    isVideo: boolean;
    uploadedBy: Principal;
}): {
    id: string;
    title: string;
    description?: string;
    filePath: string;
    isVideo: boolean;
    uploadedBy: Principal;
} {
    return {
        id: value.id,
        title: value.title,
        description: record_opt_to_undefined(from_candid_opt_n7(value.description)),
        filePath: value.filePath,
        isVideo: value.isVideo,
        uploadedBy: value.uploadedBy
    };
}
function from_candid_tuple_n9(value: [Principal, _UserProfile]): [Principal, UserProfile] {
    return [
        value[0],
        from_candid_UserProfile_n10(value[1])
    ];
}
function from_candid_variant_n17(value: {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
}): UserRole {
    return "admin" in value ? UserRole.admin : "user" in value ? UserRole.user : "guest" in value ? UserRole.guest : value;
}
function from_candid_variant_n31(value: {
    pending: null;
} | {
    approved: null;
} | {
    rejected: null;
}): ApprovalStatus {
    return "pending" in value ? ApprovalStatus.pending : "approved" in value ? ApprovalStatus.approved : "rejected" in value ? ApprovalStatus.rejected : value;
}
function from_candid_vec_n12(value: Array<_CalendarEvent>): Array<CalendarEvent> {
    return value.map((x)=>from_candid_CalendarEvent_n13(x));
}
function from_candid_vec_n18(value: Array<_ChatMessage>): Array<ChatMessage> {
    return value.map((x)=>from_candid_ChatMessage_n19(x));
}
function from_candid_vec_n21(value: Array<_Link>): Array<Link> {
    return value.map((x)=>from_candid_Link_n22(x));
}
function from_candid_vec_n25(value: Array<_Reminder>): Array<Reminder> {
    return value.map((x)=>from_candid_Reminder_n26(x));
}
function from_candid_vec_n27(value: Array<_UserApprovalInfo>): Array<UserApprovalInfo> {
    return value.map((x)=>from_candid_UserApprovalInfo_n28(x));
}
function from_candid_vec_n4(value: Array<_Media>): Array<Media> {
    return value.map((x)=>from_candid_Media_n5(x));
}
function from_candid_vec_n8(value: Array<[Principal, _UserProfile]>): Array<[Principal, UserProfile]> {
    return value.map((x)=>from_candid_tuple_n9(x));
}
function to_candid_ApprovalStatus_n34(value: ApprovalStatus): _ApprovalStatus {
    return to_candid_variant_n35(value);
}
function to_candid_UserProfile_n32(value: UserProfile): _UserProfile {
    return to_candid_record_n33(value);
}
function to_candid_UserRole_n2(value: UserRole): _UserRole {
    return to_candid_variant_n3(value);
}
function to_candid_opt_n1(value: string | null): [] | [string] {
    return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n33(value: {
    theme: string;
    name: string;
    profilePhoto?: string;
    language: string;
}): {
    theme: string;
    name: string;
    profilePhoto: [] | [string];
    language: string;
} {
    return {
        theme: value.theme,
        name: value.name,
        profilePhoto: value.profilePhoto ? candid_some(value.profilePhoto) : candid_none(),
        language: value.language
    };
}
function to_candid_variant_n3(value: UserRole): {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
} {
    return value == UserRole.admin ? {
        admin: null
    } : value == UserRole.user ? {
        user: null
    } : value == UserRole.guest ? {
        guest: null
    } : value;
}
function to_candid_variant_n35(value: ApprovalStatus): {
    pending: null;
} | {
    approved: null;
} | {
    rejected: null;
} {
    return value == ApprovalStatus.pending ? {
        pending: null
    } : value == ApprovalStatus.approved ? {
        approved: null
    } : value == ApprovalStatus.rejected ? {
        rejected: null
    } : value;
}

