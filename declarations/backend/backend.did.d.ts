import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Album {
  'id' : string,
  'title' : string,
  'createdBy' : Principal,
  'mediaIds' : Array<string>,
}
export type ApprovalStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export interface BadgeCriteria {
  'id' : string,
  'requiredCount' : bigint,
  'activityType' : string,
  'icon' : string,
  'name' : string,
  'description' : string,
}
export interface CalendarEvent {
  'id' : string,
  'title' : string,
  'date' : Time,
  'createdBy' : Principal,
  'description' : [] | [string],
}
export interface ChatMessage {
  'id' : string,
  'sender' : Principal,
  'links' : Array<string>,
  'message' : string,
  'timestamp' : Time,
  'mediaPath' : [] | [string],
  'readBy' : Array<Principal>,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface InviteCode {
  'created' : Time,
  'code' : string,
  'used' : boolean,
}
export interface InviteLogEntry {
  'id' : string,
  'admin' : Principal,
  'inviteCode' : string,
  'timestamp' : Time,
}
export interface Link {
  'id' : string,
  'url' : string,
  'previewImage' : [] | [string],
  'title' : string,
  'tags' : Array<string>,
  'description' : [] | [string],
  'addedBy' : Principal,
}
export interface Media {
  'id' : string,
  'title' : string,
  'description' : [] | [string],
  'filePath' : string,
  'isVideo' : boolean,
  'uploadedBy' : Principal,
}
export interface Poll {
  'id' : string,
  'duration' : bigint,
  'question' : string,
  'votes' : Array<bigint>,
  'createdAt' : Time,
  'createdBy' : Principal,
  'voters' : Array<Principal>,
  'isClosed' : boolean,
  'options' : Array<string>,
}
export interface RSVP {
  'name' : string,
  'inviteCode' : string,
  'timestamp' : Time,
  'attending' : boolean,
}
export interface Reminder {
  'id' : string,
  'title' : string,
  'date' : Time,
  'createdBy' : Principal,
  'description' : [] | [string],
}
export type Time = bigint;
export interface UserApprovalInfo {
  'status' : ApprovalStatus,
  'principal' : Principal,
}
export interface UserProfile {
  'theme' : string,
  'name' : string,
  'profilePhoto' : [] | [string],
  'language' : string,
}
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface _SERVICE {
  'addEmojiReaction' : ActorMethod<[string, string], undefined>,
  'addLink' : ActorMethod<
    [string, string, [] | [string], [] | [string], Array<string>],
    string
  >,
  'addMedia' : ActorMethod<[string, [] | [string], string, boolean], string>,
  'addMediaToAlbum' : ActorMethod<[string, string], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'closePoll' : ActorMethod<[string], undefined>,
  'createAlbum' : ActorMethod<[string], string>,
  'createBadgeCriteria' : ActorMethod<
    [string, string, string, bigint, string],
    string
  >,
  'createCalendarEvent' : ActorMethod<[string, Time, [] | [string]], string>,
  'createPoll' : ActorMethod<[string, Array<string>, bigint], string>,
  'createReminder' : ActorMethod<[string, Time, [] | [string]], string>,
  'deleteBadgeCriteria' : ActorMethod<[string], undefined>,
  'deleteLink' : ActorMethod<[string], undefined>,
  'deleteMedia' : ActorMethod<[string], undefined>,
  'deleteMessage' : ActorMethod<[string], undefined>,
  'deleteReminder' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'editBadgeCriteria' : ActorMethod<
    [string, string, string, string, bigint, string],
    undefined
  >,
  'editLink' : ActorMethod<
    [string, string, string, [] | [string], [] | [string], Array<string>],
    undefined
  >,
  'editMessage' : ActorMethod<[string, string], undefined>,
  'generateInviteCode' : ActorMethod<[], string>,
  'getAlbumMedia' : ActorMethod<[string], Array<Media>>,
  'getAlbums' : ActorMethod<[], Array<Album>>,
  'getAllRSVPs' : ActorMethod<[], Array<RSVP>>,
  'getAllTags' : ActorMethod<[], Array<string>>,
  'getAllUserProfiles' : ActorMethod<[], Array<[Principal, UserProfile]>>,
  'getBadgeCriteria' : ActorMethod<[], Array<BadgeCriteria>>,
  'getCalendarEvents' : ActorMethod<[], Array<CalendarEvent>>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getChatMessages' : ActorMethod<[], Array<ChatMessage>>,
  'getDashboardName' : ActorMethod<[], string>,
  'getDefaultPreviewImage' : ActorMethod<[], [] | [string]>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getInviteCodes' : ActorMethod<[], Array<InviteCode>>,
  'getInviteLog' : ActorMethod<[], Array<InviteLogEntry>>,
  'getLinks' : ActorMethod<[], Array<Link>>,
  'getLinksByTag' : ActorMethod<[string], Array<Link>>,
  'getMedia' : ActorMethod<[], Array<Media>>,
  'getMediaReactions' : ActorMethod<[string], Array<[string, bigint]>>,
  'getNetworkLogo' : ActorMethod<[], [] | [string]>,
  'getPoll' : ActorMethod<[string], [] | [Poll]>,
  'getPolls' : ActorMethod<[], Array<Poll>>,
  'getReminders' : ActorMethod<[], Array<Reminder>>,
  'getUnreadMessageCount' : ActorMethod<[], bigint>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'isCallerApproved' : ActorMethod<[], boolean>,
  'listApprovals' : ActorMethod<[], Array<UserApprovalInfo>>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'markAllMessagesAsRead' : ActorMethod<[], undefined>,
  'markMessageAsRead' : ActorMethod<[string], undefined>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'registerUser' : ActorMethod<[], undefined>,
  'removeEmojiReaction' : ActorMethod<[string, string], undefined>,
  'removeMediaFromAlbum' : ActorMethod<[string, string], undefined>,
  'removeUser' : ActorMethod<[Principal], undefined>,
  'requestApproval' : ActorMethod<[], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'sendMessage' : ActorMethod<[string, [] | [string]], string>,
  'setApproval' : ActorMethod<[Principal, ApprovalStatus], undefined>,
  'setDashboardName' : ActorMethod<[string], undefined>,
  'setDefaultPreviewImage' : ActorMethod<[string], undefined>,
  'setNetworkLogo' : ActorMethod<[string], undefined>,
  'submitRSVP' : ActorMethod<[string, boolean, string], undefined>,
  'updateMediaPath' : ActorMethod<[string, string], undefined>,
  'votePoll' : ActorMethod<[string, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
