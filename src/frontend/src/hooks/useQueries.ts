import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  TeacherProfile,
  Session,
  Analytics,
  AdminPanel,
  UserProfile,
  Dispute,
  ApprovalStatus,
  UserApprovalInfo,
} from '../backend';
import { ApprovalStatus as ApprovalStatusEnum } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

// ─── User Profile ────────────────────────────────────────────────────────────

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

// ─── Auth / Approval ─────────────────────────────────────────────────────────

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
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
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    },
  });
}

// ─── Teacher Profile ──────────────────────────────────────────────────────────

export function useGetProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<TeacherProfile | null>({
    queryKey: ['teacherProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: TeacherProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: TeacherProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherProfile'] });
    },
  });
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export function useListSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Session]>>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: Session) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSession(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useUpdateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, session }: { id: bigint; session: Session }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSession(id, session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export function useGetWalletSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['walletSummary'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWalletSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWithdrawalRequest(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletSummary'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function useGetAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<Analytics | null>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useGetAdminPanel() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminPanel>({
    queryKey: ['adminPanel'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminPanel();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanel'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    },
  });
}

export function useSetCommissionRate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rate: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setCommissionRate(rate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanel'] });
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
    retry: false,
  });
}

export function useAddDispute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dispute: Dispute) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDispute(dispute);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanel'] });
    },
  });
}

// ─── User Registry ────────────────────────────────────────────────────────────

export function useGetAllUserRecords() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allUserRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserActivity(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userActivity', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getUserActivity(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useGetUserPerformanceRecords(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['performanceRecords', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getPerformanceRecords(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useToggleUserSuspension() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleUserSuspension(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUserRecords'] });
    },
  });
}

// ─── Student Performance ──────────────────────────────────────────────────────

export function useGetAllPerformanceRecords() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allPerformanceRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPerformanceRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllStudentProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allStudentProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudentProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Weekly Snapshots ─────────────────────────────────────────────────────────

export function useGetWeeklySnapshots() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['weeklySnapshots'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeeklySnapshots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordWeeklySnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshot: import('../backend').WeeklySnapshot) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordWeeklySnapshot(snapshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklySnapshots'] });
    },
  });
}

export function useGenerateWeeklySnapshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateWeeklySnapshot();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklySnapshots'] });
    },
  });
}
