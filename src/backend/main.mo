import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  public type TeacherProfile = {
    fullName : Text;
    bio : Text;
    qualifications : Text;
    certifications : Text;
    experienceYears : Nat;
    subjects : [Text];
    grades : [Text];
    languages : [Text];
    teachingStyle : Text;
    demoVideo : Text;
    hourlyRate : Float;
    timezone : Text;
    isVisible : Bool;
    averageRating : Float;
  };

  public type StudentProfile = {
    fullName : Text;
    grade : Text;
    subjects : [Text];
    bio : Text;
  };

  public type Session = {
    sessionType : SessionType;
    subject : Text;
    grade : Text;
    scheduledTime : Int;
    duration : Nat;
    meetingLink : Text;
    status : SessionStatus;
    teacher : Principal;
    studentCount : Nat;
    notes : Text;
  };

  public type Wallet = {
    totalEarnings : Float;
    availableBalance : Float;
    pendingPayments : Float;
    transactions : [Transaction];
  };

  public type Transaction = {
    amount : Float;
    commissionRate : Float;
    netPayout : Float;
    date : Int;
    student : Text;
    subject : Text;
  };

  public type Analytics = {
    totalSessions : Nat;
    retentionRate : Float;
    earningsPerMonth : [Float];
    averageRating : Float;
    topSubjects : [Text];
    growthPercentage : Float;
  };

  public type AdminPanel = {
    commissionRate : Float;
    disputes : [Dispute];
    teachers : [AdminTeacherInfo];
  };

  public type AdminTeacherInfo = {
    principal : Principal;
    status : TeacherStatus;
    profile : TeacherProfile;
  };

  public type Dispute = {
    session : Nat;
    description : Text;
    status : DisputeStatus;
  };

  public type SessionType = {
    #oneToOne;
    #group;
  };

  public type SessionStatus = {
    #scheduled;
    #completed;
    #cancelled;
  };

  public type TeacherStatus = {
    #pending;
    #approved;
    #suspended;
  };

  public type DisputeStatus = {
    #open;
    #resolved;
    #rejected;
  };

  public type UserActivity = {
    action : Text;
    timestamp : Int;
    detail : Text;
  };

  public type UserRecord = {
    principal : Principal;
    name : Text;
    role : Text;
    joinTimestamp : Int;
    isSuspended : Bool;
  };

  public type PerformanceRecord = {
    sessionId : Nat;
    subject : Text;
    grade : Text;
    attended : Bool;
    ratingGiven : Float;
    date : Int;
  };

  public type WeeklySnapshot = {
    weekStart : Int;
    totalUsers : Nat;
    activeSessions : Nat;
    totalEarnings : Float;
    topSubjects : [Text];
  };

  module TeacherProfile {
    public type SearchParams = {
      subject : ?Text;
      grade : ?Text;
      language : ?Text;
      minExperience : ?Nat;
      maxHourlyRate : ?Float;
      onlyVisible : ?Bool;
    };

    public func compareByRating(teacher1 : TeacherProfile, teacher2 : TeacherProfile) : Order.Order {
      Float.compare(teacher2.averageRating, teacher1.averageRating);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let teacherProfiles = Map.empty<Principal, TeacherProfile>();
  let studentProfiles = Map.empty<Principal, StudentProfile>();
  let userRecords = Map.empty<Principal, UserRecord>();
  let performanceRecords = Map.empty<Principal, List.List<PerformanceRecord>>();
  let userActivities = Map.empty<Principal, List.List<UserActivity>>();
  let weeklySnapshots = List.empty<WeeklySnapshot>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);

    let userRecord : UserRecord = {
      principal = caller;
      name = profile.name;
      role = profile.role;
      joinTimestamp = Time.now();
      isSuspended = false;
    };
    userRecords.add(caller, userRecord);
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public shared ({ caller }) func createProfile(profile : TeacherProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can create a teacher profile");
    };
    teacherProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async ?TeacherProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve profiles");
    };
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can retrieve a teacher profile");
    };
    teacherProfiles.get(caller);
  };

  public shared ({ caller }) func updateProfile(profile : TeacherProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can update a teacher profile");
    };
    teacherProfiles.add(caller, profile);
  };

  public query func searchTeachers(searchParams : TeacherProfile.SearchParams) : async [TeacherProfile] {
    let profilesIter = teacherProfiles.values();
    profilesIter.toArray().sort(TeacherProfile.compareByRating);
  };

  public query func getTeacherProfile(teacher : Principal) : async ?TeacherProfile {
    teacherProfiles.get(teacher);
  };

  public query func listActiveTeachers() : async [Principal] {
    let activeTeachers = List.empty<Principal>();
    for ((principal, _) in teacherProfiles.entries()) {
      activeTeachers.add(principal);
    };
    activeTeachers.toArray();
  };

  public shared ({ caller }) func saveStudentProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save student profiles");
    };
    studentProfiles.add(caller, profile);
  };

  public query ({ caller }) func getStudentProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get student profiles");
    };
    studentProfiles.get(caller);
  };

  public query ({ caller }) func getAllStudentProfiles() : async [(Principal, StudentProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all student profiles");
    };
    studentProfiles.toArray();
  };

  let sessions = Map.empty<Nat, Session>();
  var nextSessionId : Nat = 0;

  public shared ({ caller }) func createSession(session : Session) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved teachers can create sessions");
    };
    let id = nextSessionId;
    nextSessionId += 1;
    sessions.add(id, session);
    id;
  };

  public query ({ caller }) func listSessions() : async [(Nat, Session)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list sessions");
    };
    
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return sessions.entries().toArray();
    };
    
    let userSessions = List.empty<(Nat, Session)>();
    for ((id, session) in sessions.entries()) {
      if (session.teacher == caller) {
        userSessions.add((id, session));
      };
    };
    userSessions.toArray();
  };

  public shared ({ caller }) func updateSession(id : Nat, session : Session) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update sessions");
    };
    switch (sessions.get(id)) {
      case null { Runtime.trap("Session not found") };
      case (?existing) {
        if (existing.teacher != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the session teacher or an admin can update this session");
        };
        sessions.add(id, session);
      };
    };
  };

  let wallets = Map.empty<Principal, Wallet>();
  var globalCommissionRate : Float = 0.10;

  public query ({ caller }) func getWalletSummary() : async ?Wallet {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet summaries");
    };
    wallets.get(caller);
  };

  public query ({ caller }) func listTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list transactions");
    };
    switch (wallets.get(caller)) {
      case null { [] };
      case (?wallet) { wallet.transactions };
    };
  };

  public shared ({ caller }) func submitWithdrawalRequest(amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit withdrawal requests");
    };
    switch (wallets.get(caller)) {
      case null { Runtime.trap("Wallet not found") };
      case (?wallet) {
        if (wallet.availableBalance < amount) {
          Runtime.trap("Insufficient balance");
        };
        let updated : Wallet = {
          totalEarnings = wallet.totalEarnings;
          availableBalance = wallet.availableBalance - amount;
          pendingPayments = wallet.pendingPayments + amount;
          transactions = wallet.transactions;
        };
        wallets.add(caller, updated);
      };
    };
  };

  let analyticsStore = Map.empty<Principal, Analytics>();

  public query ({ caller }) func getAnalytics() : async ?Analytics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved teachers can view analytics");
    };
    analyticsStore.get(caller);
  };

  var adminCommissionRate : Float = 0.10;
  let disputeLog = List.empty<Dispute>();

  public query ({ caller }) func getAdminPanel() : async AdminPanel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access the admin panel");
    };
    let teacherList = List.empty<AdminTeacherInfo>();
    for ((principal, profile) in teacherProfiles.entries()) {
      let status : TeacherStatus = if (UserApproval.isApproved(approvalState, principal)) {
        #approved;
      } else {
        #pending;
      };
      teacherList.add({ principal; status; profile });
    };
    {
      commissionRate = adminCommissionRate;
      disputes = disputeLog.toArray();
      teachers = teacherList.toArray();
    };
  };

  public shared ({ caller }) func setCommissionRate(rate : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can adjust the commission rate");
    };
    adminCommissionRate := rate;
    globalCommissionRate := rate;
  };

  public query ({ caller }) func listAllTeachersAdmin() : async [AdminTeacherInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all teachers");
    };
    let teacherList = List.empty<AdminTeacherInfo>();
    for ((principal, profile) in teacherProfiles.entries()) {
      let status : TeacherStatus = if (UserApproval.isApproved(approvalState, principal)) {
        #approved;
      } else {
        #pending;
      };
      teacherList.add({ principal; status; profile });
    };
    teacherList.toArray();
  };

  public shared ({ caller }) func addDispute(dispute : Dispute) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit disputes");
    };
    disputeLog.add(dispute);
  };

  public shared ({ caller }) func logUserActivity(action : Text, detail : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log activity");
    };
    let activity : UserActivity = {
      action;
      timestamp = Time.now();
      detail;
    };
    switch (userActivities.get(caller)) {
      case (null) {
        let newList = List.empty<UserActivity>();
        newList.add(activity);
        userActivities.add(caller, newList);
      };
      case (?list) {
        list.add(activity);
      };
    };
  };

  public query ({ caller }) func getUserActivity(user : Principal) : async [UserActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user activity");
    };
    switch (userActivities.get(user)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public query ({ caller }) func getAllUserActivities() : async [(Principal, [UserActivity])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user activities");
    };
    userActivities.toArray().map(
      func((principal, list)) {
        (principal, list.toArray());
      }
    );
  };

  public query ({ caller }) func getAllUserRecords() : async [UserRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all user records");
    };
    userRecords.values().toArray();
  };

  public shared ({ caller }) func toggleUserSuspension(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can suspend/unsuspend users");
    };
    switch (userRecords.get(principal)) {
      case (null) { Runtime.trap("User record not found") };
      case (?record) {
        let updated : UserRecord = {
          principal = record.principal;
          name = record.name;
          role = record.role;
          joinTimestamp = record.joinTimestamp;
          isSuspended = not record.isSuspended;
        };
        userRecords.add(principal, updated);
      };
    };
  };

  public shared ({ caller }) func submitPerformanceRecord(record : PerformanceRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can submit performance records");
    };
    switch (performanceRecords.get(caller)) {
      case (null) {
        let newList = List.empty<PerformanceRecord>();
        newList.add(record);
        performanceRecords.add(caller, newList);
      };
      case (?list) {
        list.add(record);
      };
    };
  };

  public query ({ caller }) func getPerformanceRecords(user : Principal) : async [PerformanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to view performance records");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own performance records unless you are an admin");
    };
    switch (performanceRecords.get(user)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public query ({ caller }) func getAllPerformanceRecords() : async [(Principal, [PerformanceRecord])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all performance records");
    };
    performanceRecords.toArray().map(
      func((principal, list)) {
        (principal, list.toArray());
      }
    );
  };

  public shared ({ caller }) func recordWeeklySnapshot(snapshot : WeeklySnapshot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record weekly snapshots");
    };
    weeklySnapshots.add(snapshot);
    if (weeklySnapshots.size() > 10) {
      let snapshotsArray = weeklySnapshots.toArray();
      let newList = List.empty<WeeklySnapshot>();
      var i = 0;
      while (i < 10) {
        newList.add(snapshotsArray[i]);
        i += 1;
      };
    };
  };

  public query ({ caller }) func getWeeklySnapshots() : async [WeeklySnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get weekly snapshots");
    };
    weeklySnapshots.toArray();
  };

  public query ({ caller }) func getLatestWeeklySnapshot() : async ?WeeklySnapshot {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get latest weekly snapshot");
    };
    if (weeklySnapshots.isEmpty()) {
      null;
    } else {
      ?weeklySnapshots.toArray()[0];
    };
  };

  public shared ({ caller }) func generateWeeklySnapshot() : async WeeklySnapshot {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate weekly snapshots");
    };

    let totalUsers = userRecords.size();

    var activeSessions = 0;
    for ((_id, session) in sessions.entries()) {
      switch (session.status) {
        case (#scheduled) { activeSessions += 1 };
        case _ {};
      };
    };

    var totalEarnings = 0.0;
    for ((_principal, wallet) in wallets.entries()) {
      totalEarnings += wallet.totalEarnings;
    };

    let subjectCounts = Map.empty<Text, Nat>();

    for ((_id, session) in sessions.entries()) {
      let count = switch (subjectCounts.get(session.subject)) {
        case (null) { 0 };
        case (?existing) { existing };
      };
      subjectCounts.add(session.subject, count + 1);
    };

    let sortedSubjects = subjectCounts.toArray().sort(
      func((subject1, count1), (subject2, count2)) {
        Nat.compare(count2, count1);
      }
    );

    let topSubjects = Array.tabulate(
      if (sortedSubjects.size() <= 3) { sortedSubjects.size() } else { 3 },
      func(i) { sortedSubjects[i].0 },
    );

    let snapshot : WeeklySnapshot = {
      weekStart = Time.now();
      totalUsers;
      activeSessions;
      totalEarnings;
      topSubjects;
    };

    weeklySnapshots.add(snapshot);

    if (weeklySnapshots.size() > 10) {
      let snapshotsArray = weeklySnapshots.toArray();
      let newList = List.empty<WeeklySnapshot>();
      var i = 0;
      while (i < 10) {
        newList.add(snapshotsArray[i]);
        i += 1;
      };
    };

    snapshot;
  };
};
