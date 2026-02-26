import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserActivity {
    action: string;
    detail: string;
    timestamp: bigint;
}
export interface AdminPanel {
    disputes: Array<Dispute>;
    teachers: Array<AdminTeacherInfo>;
    commissionRate: number;
}
export interface AdminTeacherInfo {
    status: TeacherStatus;
    principal: Principal;
    profile: TeacherProfile;
}
export interface SearchParams {
    subject?: string;
    maxHourlyRate?: number;
    language?: string;
    minExperience?: bigint;
    grade?: string;
    onlyVisible?: boolean;
}
export interface UserRecord {
    principal: Principal;
    joinTimestamp: bigint;
    name: string;
    role: string;
    isSuspended: boolean;
}
export interface Transaction {
    subject: string;
    netPayout: number;
    date: bigint;
    student: string;
    commissionRate: number;
    amount: number;
}
export interface TeacherProfile {
    bio: string;
    timezone: string;
    teachingStyle: string;
    grades: Array<string>;
    subjects: Array<string>;
    hourlyRate: number;
    languages: Array<string>;
    fullName: string;
    qualifications: string;
    averageRating: number;
    experienceYears: bigint;
    isVisible: boolean;
    certifications: string;
    demoVideo: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Wallet {
    pendingPayments: number;
    availableBalance: number;
    totalEarnings: number;
    transactions: Array<Transaction>;
}
export interface StudentProfile {
    bio: string;
    subjects: Array<string>;
    fullName: string;
    grade: string;
}
export interface Session {
    status: SessionStatus;
    duration: bigint;
    subject: string;
    sessionType: SessionType;
    scheduledTime: bigint;
    teacher: Principal;
    meetingLink: string;
    grade: string;
    notes: string;
    studentCount: bigint;
}
export interface PerformanceRecord {
    subject: string;
    date: bigint;
    attended: boolean;
    ratingGiven: number;
    grade: string;
    sessionId: bigint;
}
export interface Dispute {
    status: DisputeStatus;
    description: string;
    session: bigint;
}
export interface Analytics {
    topSubjects: Array<string>;
    growthPercentage: number;
    averageRating: number;
    earningsPerMonth: Array<number>;
    totalSessions: bigint;
    retentionRate: number;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface WeeklySnapshot {
    topSubjects: Array<string>;
    activeSessions: bigint;
    totalUsers: bigint;
    totalEarnings: number;
    weekStart: bigint;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum DisputeStatus {
    resolved = "resolved",
    open = "open",
    rejected = "rejected"
}
export enum SessionStatus {
    scheduled = "scheduled",
    cancelled = "cancelled",
    completed = "completed"
}
export enum SessionType {
    group = "group",
    oneToOne = "oneToOne"
}
export enum TeacherStatus {
    pending = "pending",
    approved = "approved",
    suspended = "suspended"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDispute(dispute: Dispute): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(profile: TeacherProfile): Promise<void>;
    createSession(session: Session): Promise<bigint>;
    generateWeeklySnapshot(): Promise<WeeklySnapshot>;
    getAdminPanel(): Promise<AdminPanel>;
    getAllPerformanceRecords(): Promise<Array<[Principal, Array<PerformanceRecord>]>>;
    getAllStudentProfiles(): Promise<Array<[Principal, StudentProfile]>>;
    getAllUserActivities(): Promise<Array<[Principal, Array<UserActivity>]>>;
    getAllUserRecords(): Promise<Array<UserRecord>>;
    getAnalytics(): Promise<Analytics | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLatestWeeklySnapshot(): Promise<WeeklySnapshot | null>;
    getPerformanceRecords(user: Principal): Promise<Array<PerformanceRecord>>;
    getProfile(): Promise<TeacherProfile | null>;
    getStudentProfile(): Promise<StudentProfile | null>;
    getTeacherProfile(teacher: Principal): Promise<TeacherProfile | null>;
    getUserActivity(user: Principal): Promise<Array<UserActivity>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletSummary(): Promise<Wallet | null>;
    getWeeklySnapshots(): Promise<Array<WeeklySnapshot>>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listActiveTeachers(): Promise<Array<Principal>>;
    listAllTeachersAdmin(): Promise<Array<AdminTeacherInfo>>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listSessions(): Promise<Array<[bigint, Session]>>;
    listTransactions(): Promise<Array<Transaction>>;
    logUserActivity(action: string, detail: string): Promise<void>;
    recordWeeklySnapshot(snapshot: WeeklySnapshot): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveStudentProfile(profile: StudentProfile): Promise<void>;
    searchTeachers(searchParams: SearchParams): Promise<Array<TeacherProfile>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setCommissionRate(rate: number): Promise<void>;
    submitPerformanceRecord(record: PerformanceRecord): Promise<void>;
    submitWithdrawalRequest(amount: number): Promise<void>;
    toggleUserSuspension(principal: Principal): Promise<void>;
    updateProfile(profile: TeacherProfile): Promise<void>;
    updateSession(id: bigint, session: Session): Promise<void>;
}
