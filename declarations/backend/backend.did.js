export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const Time = IDL.Int;
  const Media = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'filePath' : IDL.Text,
    'isVideo' : IDL.Bool,
    'uploadedBy' : IDL.Principal,
  });
  const Album = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'createdBy' : IDL.Principal,
    'mediaIds' : IDL.Vec(IDL.Text),
  });
  const RSVP = IDL.Record({
    'name' : IDL.Text,
    'inviteCode' : IDL.Text,
    'timestamp' : Time,
    'attending' : IDL.Bool,
  });
  const UserProfile = IDL.Record({
    'theme' : IDL.Text,
    'name' : IDL.Text,
    'profilePhoto' : IDL.Opt(IDL.Text),
    'language' : IDL.Text,
  });
  const BadgeCriteria = IDL.Record({
    'id' : IDL.Text,
    'requiredCount' : IDL.Nat,
    'activityType' : IDL.Text,
    'icon' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const CalendarEvent = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'date' : Time,
    'createdBy' : IDL.Principal,
    'description' : IDL.Opt(IDL.Text),
  });
  const ChatMessage = IDL.Record({
    'id' : IDL.Text,
    'sender' : IDL.Principal,
    'links' : IDL.Vec(IDL.Text),
    'message' : IDL.Text,
    'timestamp' : Time,
    'mediaPath' : IDL.Opt(IDL.Text),
    'readBy' : IDL.Vec(IDL.Principal),
  });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const InviteCode = IDL.Record({
    'created' : Time,
    'code' : IDL.Text,
    'used' : IDL.Bool,
  });
  const InviteLogEntry = IDL.Record({
    'id' : IDL.Text,
    'admin' : IDL.Principal,
    'inviteCode' : IDL.Text,
    'timestamp' : Time,
  });
  const Link = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'previewImage' : IDL.Opt(IDL.Text),
    'title' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'addedBy' : IDL.Principal,
  });
  const Poll = IDL.Record({
    'id' : IDL.Text,
    'duration' : IDL.Nat,
    'question' : IDL.Text,
    'votes' : IDL.Vec(IDL.Nat),
    'createdAt' : Time,
    'createdBy' : IDL.Principal,
    'voters' : IDL.Vec(IDL.Principal),
    'isClosed' : IDL.Bool,
    'options' : IDL.Vec(IDL.Text),
  });
  const Reminder = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'date' : Time,
    'createdBy' : IDL.Principal,
    'description' : IDL.Opt(IDL.Text),
  });
  const ApprovalStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const UserApprovalInfo = IDL.Record({
    'status' : ApprovalStatus,
    'principal' : IDL.Principal,
  });
  return IDL.Service({
    'addEmojiReaction' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'addLink' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Vec(IDL.Text),
        ],
        [IDL.Text],
        [],
      ),
    'addMedia' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Text, IDL.Bool],
        [IDL.Text],
        [],
      ),
    'addMediaToAlbum' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'closePoll' : IDL.Func([IDL.Text], [], []),
    'createAlbum' : IDL.Func([IDL.Text], [IDL.Text], []),
    'createBadgeCriteria' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text],
        [IDL.Text],
        [],
      ),
    'createCalendarEvent' : IDL.Func(
        [IDL.Text, Time, IDL.Opt(IDL.Text)],
        [IDL.Text],
        [],
      ),
    'createPoll' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Nat],
        [IDL.Text],
        [],
      ),
    'createReminder' : IDL.Func(
        [IDL.Text, Time, IDL.Opt(IDL.Text)],
        [IDL.Text],
        [],
      ),
    'deleteBadgeCriteria' : IDL.Func([IDL.Text], [], []),
    'deleteLink' : IDL.Func([IDL.Text], [], []),
    'deleteMedia' : IDL.Func([IDL.Text], [], []),
    'deleteMessage' : IDL.Func([IDL.Text], [], []),
    'deleteReminder' : IDL.Func([IDL.Text], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'editBadgeCriteria' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text],
        [],
        [],
      ),
    'editLink' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Vec(IDL.Text),
        ],
        [],
        [],
      ),
    'editMessage' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'generateInviteCode' : IDL.Func([], [IDL.Text], []),
    'getAlbumMedia' : IDL.Func([IDL.Text], [IDL.Vec(Media)], ['query']),
    'getAlbums' : IDL.Func([], [IDL.Vec(Album)], ['query']),
    'getAllRSVPs' : IDL.Func([], [IDL.Vec(RSVP)], ['query']),
    'getAllTags' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getAllUserProfiles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, UserProfile))],
        ['query'],
      ),
    'getBadgeCriteria' : IDL.Func([], [IDL.Vec(BadgeCriteria)], ['query']),
    'getCalendarEvents' : IDL.Func([], [IDL.Vec(CalendarEvent)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getChatMessages' : IDL.Func([], [IDL.Vec(ChatMessage)], ['query']),
    'getDashboardName' : IDL.Func([], [IDL.Text], ['query']),
    'getDefaultPreviewImage' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getInviteCodes' : IDL.Func([], [IDL.Vec(InviteCode)], ['query']),
    'getInviteLog' : IDL.Func([], [IDL.Vec(InviteLogEntry)], ['query']),
    'getLinks' : IDL.Func([], [IDL.Vec(Link)], ['query']),
    'getLinksByTag' : IDL.Func([IDL.Text], [IDL.Vec(Link)], ['query']),
    'getMedia' : IDL.Func([], [IDL.Vec(Media)], ['query']),
    'getMediaReactions' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'getNetworkLogo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'getPoll' : IDL.Func([IDL.Text], [IDL.Opt(Poll)], ['query']),
    'getPolls' : IDL.Func([], [IDL.Vec(Poll)], ['query']),
    'getReminders' : IDL.Func([], [IDL.Vec(Reminder)], ['query']),
    'getUnreadMessageCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isCallerApproved' : IDL.Func([], [IDL.Bool], ['query']),
    'listApprovals' : IDL.Func([], [IDL.Vec(UserApprovalInfo)], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'markAllMessagesAsRead' : IDL.Func([], [], []),
    'markMessageAsRead' : IDL.Func([IDL.Text], [], []),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'registerUser' : IDL.Func([], [], []),
    'removeEmojiReaction' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'removeMediaFromAlbum' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'removeUser' : IDL.Func([IDL.Principal], [], []),
    'requestApproval' : IDL.Func([], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'sendMessage' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [IDL.Text], []),
    'setApproval' : IDL.Func([IDL.Principal, ApprovalStatus], [], []),
    'setDashboardName' : IDL.Func([IDL.Text], [], []),
    'setDefaultPreviewImage' : IDL.Func([IDL.Text], [], []),
    'setNetworkLogo' : IDL.Func([IDL.Text], [], []),
    'submitRSVP' : IDL.Func([IDL.Text, IDL.Bool, IDL.Text], [], []),
    'updateMediaPath' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'votePoll' : IDL.Func([IDL.Text, IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
