import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Ad {
    id: bigint;
    url: string;
    title: string;
    duration: bigint;
    rewardAmount: bigint;
    description: string;
}
export interface WithdrawalRequest {
    status: Variant_pending_approved_rejected;
    user: Principal;
    amount: bigint;
    requestDate: bigint;
}
export interface UserProfile {
    username: string;
    balance: bigint;
    email: string;
    registrationDate: bigint;
}
export interface AdWatch {
    watchDate: bigint;
    adId: bigint;
    user: Principal;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimAd(adId: bigint): Promise<void>;
    getAd(id: bigint): Promise<Ad | null>;
    getAllWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getAvailableAds(): Promise<Array<Ad>>;
    getCallerAdWatches(): Promise<Array<AdWatch>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWithdrawalHistory(): Promise<Array<WithdrawalRequest>>;
    getDashboardStats(): Promise<{
        totalAdsWatched: bigint;
        totalBalance: bigint;
        adsWatchedToday: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    requestWithdrawal(amount: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
