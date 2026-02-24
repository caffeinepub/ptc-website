import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Ad, AdWatch, WithdrawalRequest } from '../backend';

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

// ─── Ads ─────────────────────────────────────────────────────────────────────

export function useGetAvailableAds() {
  const { actor, isFetching } = useActor();

  return useQuery<Ad[]>({
    queryKey: ['availableAds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableAds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAd(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Ad | null>({
    queryKey: ['ad', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getAd(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetCallerAdWatches() {
  const { actor, isFetching } = useActor();

  return useQuery<AdWatch[]>({
    queryKey: ['callerAdWatches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerAdWatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimAd(adId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerAdWatches'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export function useGetDashboardStats() {
  const { actor, isFetching } = useActor();

  return useQuery<{ totalBalance: bigint; adsWatchedToday: bigint; totalAdsWatched: bigint }>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Withdrawals ─────────────────────────────────────────────────────────────

export function useGetCallerWithdrawalHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['callerWithdrawalHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerWithdrawalHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestWithdrawal(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['callerWithdrawalHistory'] });
    },
  });
}
