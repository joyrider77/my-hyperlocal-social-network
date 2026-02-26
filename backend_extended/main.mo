import Cycles "mo:base/ExperimentalCycles";
import AccessControl "authorization/access-control";
import Registry "blob-storage/registry";
import InviteLinksModule "invite-links/invite-links-module";
import UserApproval "user-approval/approval";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";




actor Main {
  let accessControlState = AccessControl.initState();
  let inviteState = InviteLinksModule.initState();
  let registry = Registry.new();
  let approvalState = UserApproval.initState(accessControlState);

  var dashboardName : Text = "Mein Hyperlokales Soziales Netzwerk";
  var networkLogo : ?Text = null;
  var defaultPreviewImage : ?Text = null;

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();
  var removedUsers = principalMap.empty<Bool>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    language : Text;
    profilePhoto : ?Text;
    theme : Text;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public query func getAllUserProfiles() : async [(Principal, UserProfile)] {
    Iter.toArray(principalMap.entries(userProfiles));
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can register file references");
    };
    Registry.add(registry, path, hash);
  };

  public query ({ caller }) func getFileReference(path : Text) : async Registry.FileReference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get file references");
    };
    Registry.get(registry, path);
  };

  public query ({ caller }) func listFileReferences() : async [Registry.FileReference] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can list file references");
    };
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can drop file references");
    };
    Registry.remove(registry, path);
  };

  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };

  public type CalendarEvent = {
    id : Text;
    title : Text;
    date : Time.Time;
    description : ?Text;
    createdBy : Principal;
  };

  public type ChatMessage = {
    id : Text;
    sender : Principal;
    message : Text;
    timestamp : Time.Time;
    readBy : [Principal];
    links : [Text];
    mediaPath : ?Text;
  };

  public type Media = {
    id : Text;
    title : Text;
    description : ?Text;
    filePath : Text;
    uploadedBy : Principal;
    isVideo : Bool;
  };

  public type Link = {
    id : Text;
    url : Text;
    title : Text;
    description : ?Text;
    addedBy : Principal;
    previewImage : ?Text;
    tags : [Text];
  };

  public type InviteLogEntry = {
    id : Text;
    admin : Principal;
    inviteCode : Text;
    timestamp : Time.Time;
  };

  public type EmojiReaction = {
    emoji : Text;
    user : Principal;
  };

  public type Album = {
    id : Text;
    title : Text;
    createdBy : Principal;
    mediaIds : [Text];
  };

  public type Reminder = {
    id : Text;
    title : Text;
    date : Time.Time;
    description : ?Text;
    createdBy : Principal;
  };

  public type Poll = {
    id : Text;
    question : Text;
    options : [Text];
    votes : [Nat];
    createdBy : Principal;
    isClosed : Bool;
    createdAt : Time.Time;
    duration : Nat;
    voters : [Principal];
  };

  public type BadgeCriteria = {
    id : Text;
    name : Text;
    description : Text;
    icon : Text;
    requiredCount : Nat;
    activityType : Text;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  var calendarEvents = textMap.empty<CalendarEvent>();
  var chatMessages = textMap.empty<ChatMessage>();
  var media = textMap.empty<Media>();
  var links = textMap.empty<Link>();
  var inviteLog = textMap.empty<InviteLogEntry>();
  var mediaReactions = textMap.empty<[EmojiReaction]>();
  var albums = textMap.empty<Album>();
  var reminders = textMap.empty<Reminder>();
  var polls = textMap.empty<Poll>();
  var badgeCriteria = textMap.empty<BadgeCriteria>();

  public shared ({ caller }) func createCalendarEvent(title : Text, date : Time.Time, description : ?Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create calendar events");
    };
    let id = Text.concat("event-", debug_show (Time.now()));
    let event : CalendarEvent = {
      id;
      title;
      date;
      description;
      createdBy = caller;
    };
    calendarEvents := textMap.put(calendarEvents, id, event);
    id;
  };

  public query ({ caller }) func getCalendarEvents() : async [CalendarEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get calendar events");
    };
    Iter.toArray(textMap.vals(calendarEvents));
  };

  public shared ({ caller }) func sendMessage(message : Text, mediaPath : ?Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can send messages");
    };
    let id = Text.concat("message-", debug_show (Time.now()));

    let chatMessage : ChatMessage = {
      id;
      sender = caller;
      message;
      timestamp = Time.now();
      readBy = [caller];
      links = [];
      mediaPath;
    };
    chatMessages := textMap.put(chatMessages, id, chatMessage);
    id;
  };

  public shared ({ caller }) func deleteMessage(messageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete messages");
    };

    switch (textMap.get(chatMessages, messageId)) {
      case (null) { Debug.trap("Message not found") };
      case (?message) {
        if (message.sender != caller) {
          Debug.trap("Unauthorized: Only the sender can delete this message");
        };
        chatMessages := textMap.delete(chatMessages, messageId);
      };
    };
  };

  public shared ({ caller }) func editMessage(messageId : Text, newMessage : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can edit messages");
    };

    switch (textMap.get(chatMessages, messageId)) {
      case (null) { Debug.trap("Message not found") };
      case (?message) {
        if (message.sender != caller) {
          Debug.trap("Unauthorized: Only the sender can edit this message");
        };
        let updatedMessage : ChatMessage = {
          message with message = newMessage
        };
        chatMessages := textMap.put(chatMessages, messageId, updatedMessage);
      };
    };
  };

  public query ({ caller }) func getChatMessages() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get chat messages");
    };
    Iter.toArray(textMap.vals(chatMessages));
  };

  public query ({ caller }) func getUnreadMessageCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get unread message count");
    };

    let messages = Iter.toArray(textMap.vals(chatMessages));
    var count = 0;
    for (message in messages.vals()) {
      if (Array.find(message.readBy, func(user : Principal) : Bool { user == caller }) == null) {
        count += 1;
      };
    };
    count;
  };

  public shared ({ caller }) func markMessageAsRead(messageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can mark messages as read");
    };

    switch (textMap.get(chatMessages, messageId)) {
      case (null) { Debug.trap("Message not found") };
      case (?message) {
        if (Array.find(message.readBy, func(user : Principal) : Bool { user == caller }) == null) {
          let updatedMessage : ChatMessage = {
            message with readBy = Array.append(message.readBy, [caller])
          };
          chatMessages := textMap.put(chatMessages, messageId, updatedMessage);
        };
      };
    };
  };

  public shared ({ caller }) func markAllMessagesAsRead() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can mark messages as read");
    };

    let messages = Iter.toArray(textMap.vals(chatMessages));
    for (message in messages.vals()) {
      if (Array.find(message.readBy, func(user : Principal) : Bool { user == caller }) == null) {
        let updatedMessage : ChatMessage = {
          message with readBy = Array.append(message.readBy, [caller])
        };
        chatMessages := textMap.put(chatMessages, message.id, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func addMedia(title : Text, description : ?Text, filePath : Text, isVideo : Bool) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add media");
    };
    let id = Text.concat("media-", debug_show (Time.now()));
    let mediaItem : Media = {
      id;
      title;
      description;
      filePath;
      uploadedBy = caller;
      isVideo;
    };
    media := textMap.put(media, id, mediaItem);
    id;
  };

  public shared ({ caller }) func deleteMedia(mediaId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete media");
    };

    switch (textMap.get(media, mediaId)) {
      case (null) { Debug.trap("Media not found") };
      case (?mediaItem) {
        if (mediaItem.uploadedBy != caller) {
          Debug.trap("Unauthorized: Only the uploader can delete this media");
        };
        media := textMap.delete(media, mediaId);
      };
    };
  };

  public query ({ caller }) func getMedia() : async [Media] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get media");
    };

    let allMedia = Iter.toArray(textMap.vals(media));
    let albumMediaIds = Array.flatten(Array.map(Iter.toArray(textMap.vals(albums)), func(a : Album) : [Text] { a.mediaIds }));

    Array.filter(
      allMedia,
      func(mediaItem : Media) : Bool {
        Array.find(albumMediaIds, func(id : Text) : Bool { id == mediaItem.id }) == null;
      },
    );
  };

  public shared ({ caller }) func addLink(url : Text, title : Text, description : ?Text, previewImage : ?Text, tags : [Text]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add links");
    };
    let id = Text.concat("link-", debug_show (Time.now()));
    let link : Link = {
      id;
      url;
      title;
      description;
      addedBy = caller;
      previewImage;
      tags;
    };
    links := textMap.put(links, id, link);
    id;
  };

  public shared ({ caller }) func editLink(id : Text, url : Text, title : Text, description : ?Text, previewImage : ?Text, tags : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can edit links");
    };
    switch (textMap.get(links, id)) {
      case (null) { Debug.trap("Link not found") };
      case (?link) {
        if (link.addedBy != caller) {
          Debug.trap("Unauthorized: Only the creator can edit this link");
        };
        let updatedLink : Link = {
          id;
          url;
          title;
          description;
          addedBy = caller;
          previewImage;
          tags;
        };
        links := textMap.put(links, id, updatedLink);
      };
    };
  };

  public shared ({ caller }) func deleteLink(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete links");
    };
    switch (textMap.get(links, id)) {
      case (null) { Debug.trap("Link not found") };
      case (?link) {
        if (link.addedBy != caller) {
          Debug.trap("Unauthorized: Only the creator can delete this link");
        };
        links := textMap.delete(links, id);
      };
    };
  };

  public query ({ caller }) func getLinks() : async [Link] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get links");
    };
    Iter.toArray(textMap.vals(links));
  };

  public query ({ caller }) func getLinksByTag(tag : Text) : async [Link] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get links by tag");
    };
    let allLinks = Iter.toArray(textMap.vals(links));
    Array.filter(
      allLinks,
      func(link : Link) : Bool {
        Array.find(link.tags, func(t : Text) : Bool { t == tag }) != null;
      },
    );
  };

  public query ({ caller }) func getAllTags() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get all tags");
    };
    let allLinks = Iter.toArray(textMap.vals(links));
    var tags : [Text] = [];
    for (link in allLinks.vals()) {
      tags := Array.append(tags, link.tags);
    };
    tags;
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    if (principalMap.get(removedUsers, caller) == ?true) {
      Debug.trap("Ihr Konto wurde entfernt. Bitte wenden Sie sich an einen Administrator, um eine erneute Genehmigung zu erhalten.");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    if (status == #rejected) {
      userProfiles := principalMap.delete(userProfiles, user);
      removedUsers := principalMap.put(removedUsers, user, true);

      let userEvents = Iter.toArray(textMap.vals(calendarEvents));
      for (event in userEvents.vals()) {
        if (event.createdBy == user) {
          calendarEvents := textMap.delete(calendarEvents, event.id);
        };
      };

      let userMessages = Iter.toArray(textMap.vals(chatMessages));
      for (message in userMessages.vals()) {
        if (message.sender == user) {
          chatMessages := textMap.delete(chatMessages, message.id);
        };
      };

      let userMedia = Iter.toArray(textMap.vals(media));
      for (mediaItem in userMedia.vals()) {
        if (mediaItem.uploadedBy == user) {
          media := textMap.delete(media, mediaItem.id);
        };
      };

      let userLinks = Iter.toArray(textMap.vals(links));
      for (link in userLinks.vals()) {
        if (link.addedBy == user) {
          links := textMap.delete(links, link.id);
        };
      };

      let userAlbums = Iter.toArray(textMap.vals(albums));
      for (album in userAlbums.vals()) {
        if (album.createdBy == user) {
          albums := textMap.delete(albums, album.id);
        };
      };

      let mediaReactionEntries = Iter.toArray(textMap.entries(mediaReactions));
      for ((mediaId, reactions) in mediaReactionEntries.vals()) {
        let filteredReactions = Array.filter(
          reactions,
          func(reaction : EmojiReaction) : Bool {
            reaction.user != user;
          },
        );
        mediaReactions := textMap.put(mediaReactions, mediaId, filteredReactions);
      };
    };

    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public query func getDashboardName() : async Text {
    dashboardName;
  };

  public shared ({ caller }) func setDashboardName(newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set dashboard name");
    };
    dashboardName := newName;
  };

  public query func getNetworkLogo() : async ?Text {
    networkLogo;
  };

  public shared ({ caller }) func setNetworkLogo(logoPath : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set network logo");
    };
    networkLogo := ?logoPath;
  };

  public query func getDefaultPreviewImage() : async ?Text {
    defaultPreviewImage;
  };

  public shared ({ caller }) func setDefaultPreviewImage(imagePath : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set default preview image");
    };
    defaultPreviewImage := ?imagePath;
  };

  public query ({ caller }) func getInviteLog() : async [InviteLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view invite log");
    };
    Iter.toArray(textMap.vals(inviteLog));
  };

  public shared ({ caller }) func addEmojiReaction(mediaId : Text, emoji : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add emoji reactions");
    };

    switch (textMap.get(mediaReactions, mediaId)) {
      case (null) {
        let newReaction : EmojiReaction = {
          emoji;
          user = caller;
        };
        mediaReactions := textMap.put(mediaReactions, mediaId, [newReaction]);
      };
      case (?reactions) {
        let filtered = Iter.filter(
          Iter.fromArray(reactions),
          func(reaction : EmojiReaction) : Bool {
            reaction.emoji == emoji and reaction.user == caller
          },
        );

        switch (filtered.next()) {
          case (null) {
            let newReaction : EmojiReaction = {
              emoji;
              user = caller;
            };
            mediaReactions := textMap.put(mediaReactions, mediaId, Array.append(reactions, [newReaction]));
          };
          case (?_) {
            Debug.trap("You have already reacted with this emoji");
          };
        };
      };
    };
  };

  public shared ({ caller }) func removeEmojiReaction(mediaId : Text, emoji : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can remove emoji reactions");
    };

    switch (textMap.get(mediaReactions, mediaId)) {
      case (null) { Debug.trap("No reactions found for this media") };
      case (?reactions) {
        let filteredReactions = Array.filter(
          reactions,
          func(reaction : EmojiReaction) : Bool {
            not (reaction.emoji == emoji and reaction.user == caller);
          },
        );

        if (filteredReactions.size() == reactions.size()) {
          Debug.trap("You have not reacted with this emoji");
        } else {
          mediaReactions := textMap.put(mediaReactions, mediaId, filteredReactions);
        };
      };
    };
  };

  public query ({ caller }) func getMediaReactions(mediaId : Text) : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get media reactions");
    };

    switch (textMap.get(mediaReactions, mediaId)) {
      case (null) { [] };
      case (?reactions) {
        let emojiMap = OrderedMap.Make<Text>(Text.compare);
        var emojiCount = emojiMap.empty<Nat>();

        for (reaction in reactions.vals()) {
          switch (emojiMap.get(emojiCount, reaction.emoji)) {
            case (null) {
              emojiCount := emojiMap.put(emojiCount, reaction.emoji, 1);
            };
            case (?count) {
              emojiCount := emojiMap.put(emojiCount, reaction.emoji, count + 1);
            };
          };
        };

        Iter.toArray(emojiMap.entries(emojiCount));
      };
    };
  };

  public shared ({ caller }) func createAlbum(title : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create albums");
    };
    let id = Text.concat("album-", debug_show (Time.now()));
    let album : Album = {
      id;
      title;
      createdBy = caller;
      mediaIds = [];
    };
    albums := textMap.put(albums, id, album);
    id;
  };

  public shared ({ caller }) func addMediaToAlbum(albumId : Text, mediaId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add media to albums");
    };

    switch (textMap.get(albums, albumId)) {
      case (null) { Debug.trap("Album not found") };
      case (?album) {
        if (album.createdBy != caller) {
          Debug.trap("Unauthorized: Only the creator can add media to this album");
        };

        let updatedAlbum : Album = {
          album with mediaIds = Array.append(album.mediaIds, [mediaId])
        };
        albums := textMap.put(albums, albumId, updatedAlbum);
      };
    };
  };

  public shared ({ caller }) func removeMediaFromAlbum(albumId : Text, mediaId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can remove media from albums");
    };

    switch (textMap.get(albums, albumId)) {
      case (null) { Debug.trap("Album not found") };
      case (?album) {
        if (album.createdBy != caller) {
          Debug.trap("Unauthorized: Only the creator can remove media from this album");
        };

        let updatedMediaIds = Array.filter(
          album.mediaIds,
          func(id : Text) : Bool {
            id != mediaId;
          },
        );

        let updatedAlbum : Album = {
          album with mediaIds = updatedMediaIds
        };
        albums := textMap.put(albums, albumId, updatedAlbum);
      };
    };
  };

  public query ({ caller }) func getAlbums() : async [Album] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get albums");
    };
    Iter.toArray(textMap.vals(albums));
  };

  public query ({ caller }) func getAlbumMedia(albumId : Text) : async [Media] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get album media");
    };

    switch (textMap.get(albums, albumId)) {
      case (null) { Debug.trap("Album not found") };
      case (?album) {
        let allMedia = Iter.toArray(textMap.vals(media));
        Array.filter(
          allMedia,
          func(mediaItem : Media) : Bool {
            Array.find(album.mediaIds, func(id : Text) : Bool { id == mediaItem.id }) != null;
          },
        );
      };
    };
  };

  public shared ({ caller }) func removeUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove users");
    };

    userProfiles := principalMap.delete(userProfiles, user);
    removedUsers := principalMap.put(removedUsers, user, true);

    let userEvents = Iter.toArray(textMap.vals(calendarEvents));
    for (event in userEvents.vals()) {
      if (event.createdBy == user) {
        calendarEvents := textMap.delete(calendarEvents, event.id);
      };
    };

    let userMessages = Iter.toArray(textMap.vals(chatMessages));
    for (message in userMessages.vals()) {
      if (message.sender == user) {
        chatMessages := textMap.delete(chatMessages, message.id);
      };
    };

    let userMedia = Iter.toArray(textMap.vals(media));
    for (mediaItem in userMedia.vals()) {
      if (mediaItem.uploadedBy == user) {
        media := textMap.delete(media, mediaItem.id);
      };
    };

    let userLinks = Iter.toArray(textMap.vals(links));
    for (link in userLinks.vals()) {
      if (link.addedBy == user) {
        links := textMap.delete(links, link.id);
      };
    };

    let userAlbums = Iter.toArray(textMap.vals(albums));
    for (album in userAlbums.vals()) {
      if (album.createdBy == user) {
        albums := textMap.delete(albums, album.id);
      };
    };

    let mediaReactionEntries = Iter.toArray(textMap.entries(mediaReactions));
    for ((mediaId, reactions) in mediaReactionEntries.vals()) {
      let filteredReactions = Array.filter(
        reactions,
        func(reaction : EmojiReaction) : Bool {
          reaction.user != user;
        },
      );
      mediaReactions := textMap.put(mediaReactions, mediaId, filteredReactions);
    };
  };

  public shared ({ caller }) func registerUser() : async () {
    if (principalMap.get(removedUsers, caller) == ?true) {
      Debug.trap("Ihr Konto wurde entfernt. Bitte wenden Sie sich an einen Administrator, um eine erneute Genehmigung zu erhalten.");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func updateMediaPath(messageId : Text, mediaPath : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update media path");
    };

    switch (textMap.get(chatMessages, messageId)) {
      case (null) { Debug.trap("Message not found") };
      case (?message) {
        if (message.sender != caller) {
          Debug.trap("Unauthorized: Only the sender can update this message");
        };
        let updatedMessage : ChatMessage = {
          message with mediaPath = ?mediaPath
        };
        chatMessages := textMap.put(chatMessages, messageId, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func createReminder(title : Text, date : Time.Time, description : ?Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create reminders");
    };
    let id = Text.concat("reminder-", debug_show (Time.now()));
    let reminder : Reminder = {
      id;
      title;
      date;
      description;
      createdBy = caller;
    };
    reminders := textMap.put(reminders, id, reminder);
    id;
  };

  public query ({ caller }) func getReminders() : async [Reminder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get reminders");
    };
    Iter.toArray(textMap.vals(reminders));
  };

  public shared ({ caller }) func deleteReminder(reminderId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete reminders");
    };

    switch (textMap.get(reminders, reminderId)) {
      case (null) { Debug.trap("Reminder not found") };
      case (?reminder) {
        if (reminder.createdBy != caller) {
          Debug.trap("Unauthorized: Only the creator can delete this reminder");
        };
        reminders := textMap.delete(reminders, reminderId);
      };
    };
  };

  public shared ({ caller }) func createPoll(question : Text, options : [Text], duration : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create polls");
    };
    let id = Text.concat("poll-", debug_show (Time.now()));
    let poll : Poll = {
      id;
      question;
      options;
      votes = Array.tabulate(options.size(), func(_ : Nat) : Nat { 0 });
      createdBy = caller;
      isClosed = false;
      createdAt = Time.now();
      duration;
      voters = [];
    };
    polls := textMap.put(polls, id, poll);
    id;
  };

  public shared ({ caller }) func votePoll(pollId : Text, optionIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can vote in polls");
    };

    switch (textMap.get(polls, pollId)) {
      case (null) { Debug.trap("Poll not found") };
      case (?poll) {
        let currentTime = Time.now();
        let pollEndTime = poll.createdAt + (poll.duration * 3600 * 1000000000);

        if (poll.isClosed or currentTime > pollEndTime) {
          Debug.trap("Poll is closed");
        };
        if (optionIndex >= poll.options.size()) {
          Debug.trap("Invalid option index");
        };

        if (Array.find(poll.voters, func(voter : Principal) : Bool { voter == caller }) != null) {
          Debug.trap("You have already voted in this poll");
        };

        let updatedVotes = Array.tabulate<Nat>(
          poll.votes.size(),
          func(i : Nat) : Nat {
            if (i == optionIndex) { poll.votes[i] + 1 } else { poll.votes[i] };
          },
        );

        let updatedVoters = Array.append(poll.voters, [caller]);

        let updatedPoll : Poll = {
          poll with votes = updatedVotes;
          voters = updatedVoters;
        };
        polls := textMap.put(polls, pollId, updatedPoll);
      };
    };
  };

  public shared ({ caller }) func closePoll(pollId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can close polls");
    };

    switch (textMap.get(polls, pollId)) {
      case (null) { Debug.trap("Poll not found") };
      case (?poll) {
        if (poll.createdBy != caller) {
          Debug.trap("Unauthorized: Only the creator can close this poll");
        };
        let updatedPoll : Poll = {
          poll with isClosed = true
        };
        polls := textMap.put(polls, pollId, updatedPoll);
      };
    };
  };

  public query ({ caller }) func getPolls() : async [Poll] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get polls");
    };
    Iter.toArray(textMap.vals(polls));
  };

  public query ({ caller }) func getPoll(pollId : Text) : async ?Poll {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get poll");
    };
    textMap.get(polls, pollId);
  };

  public shared ({ caller }) func createBadgeCriteria(name : Text, description : Text, icon : Text, requiredCount : Nat, activityType : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create badge criteria");
    };
    let id = Text.concat("badge-", debug_show (Time.now()));
    let criteria : BadgeCriteria = {
      id;
      name;
      description;
      icon;
      requiredCount;
      activityType;
    };
    badgeCriteria := textMap.put(badgeCriteria, id, criteria);
    id;
  };

  public shared ({ caller }) func editBadgeCriteria(badgeId : Text, name : Text, description : Text, icon : Text, requiredCount : Nat, activityType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can edit badge criteria");
    };

    switch (textMap.get(badgeCriteria, badgeId)) {
      case (null) { Debug.trap("Badge criteria not found") };
      case (?criteria) {
        let updatedCriteria : BadgeCriteria = {
          criteria with name;
          description;
          icon;
          requiredCount;
          activityType;
        };
        badgeCriteria := textMap.put(badgeCriteria, badgeId, updatedCriteria);
      };
    };
  };

  public shared ({ caller }) func deleteBadgeCriteria(badgeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete badge criteria");
    };

    switch (textMap.get(badgeCriteria, badgeId)) {
      case (null) { Debug.trap("Badge criteria not found") };
      case (?_) {
        badgeCriteria := textMap.delete(badgeCriteria, badgeId);
      };
    };
  };

  public query ({ caller }) func getBadgeCriteria() : async [BadgeCriteria] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get badge criteria");
    };
    Iter.toArray(textMap.vals(badgeCriteria));
  };

type __CAFFEINE_STORAGE_RefillInformation = {
    proposed_top_up_amount: ?Nat;
};

type __CAFFEINE_STORAGE_RefillResult = {
    success: ?Bool;
    topped_up_amount: ?Nat;
};

    public shared (msg) func __CAFFEINE_STORAGE_refillCashier(refill_information: ?__CAFFEINE_STORAGE_RefillInformation) : async __CAFFEINE_STORAGE_RefillResult {
    let cashier = Principal.fromText("72ch2-fiaaa-aaaar-qbsvq-cai");
    
    assert (cashier == msg.caller);
    
    let current_balance = Cycles.balance();
    let reserved_cycles : Nat = 400_000_000_000;
    
    let current_free_cycles_count : Nat = Nat.sub(current_balance, reserved_cycles);
    
    let cycles_to_send : Nat = switch (refill_information) {
        case null { current_free_cycles_count };
        case (?info) {
            switch (info.proposed_top_up_amount) {
                case null { current_free_cycles_count };
                case (?proposed) { Nat.min(proposed, current_free_cycles_count) };
            }
        };
    };

    let target_canister = actor(Principal.toText(cashier)) : actor {
        account_top_up_v1 : ({ account : Principal }) -> async ();
    };
    
    let current_principal = Principal.fromActor(Main);
    
    await (with cycles = cycles_to_send) target_canister.account_top_up_v1({ account = current_principal });
    
    return {
        success = ?true;
        topped_up_amount = ?cycles_to_send;
    };
};
    public shared (msg) func __CAFFEINE_STORAGE_blobsToRemove() : async [Text] {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    
    Registry.getBlobsToRemove(registry);
};
    public shared (msg) func __CAFFEINE_STORAGE_blobsRemoved(hashes : [Text]) : async Nat {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    
    Registry.clearBlobsRemoved(registry, hashes);
};
    public shared (msg) func __CAFFEINE_STORAGE_updateGatewayPrincipals() : async () {
    await Registry.requireAuthorized(registry, msg.caller, "72ch2-fiaaa-aaaar-qbsvq-cai");
    await Registry.updateGatewayPrincipals(registry, "72ch2-fiaaa-aaaar-qbsvq-cai");
};
};

