import React from 'react';
import { Link } from '@tanstack/react-router';
import { Coins, PlayCircle, TrendingUp, Wallet, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardStats } from '../hooks/useQueries';
import { useGetCallerAdWatches } from '../hooks/useQueries';
import { useGetAvailableAds } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import WithdrawalHistoryTable from '../components/WithdrawalHistoryTable';

function formatDate(daysSinceEpoch: bigint): string {
  const ms = Number(daysSinceEpoch) * 24 * 60 * 60 * 1000;
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: adWatches, isLoading: watchesLoading } = useGetCallerAdWatches();
  const { data: availableAds } = useGetAvailableAds();
  const { data: userProfile } = useGetCallerUserProfile();

  const adMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (availableAds) {
      availableAds.forEach((ad) => map.set(ad.id.toString(), ad.title));
    }
    return map;
  }, [availableAds]);

  const recentWatches = React.useMemo(() => {
    if (!adWatches) return [];
    return [...adWatches]
      .sort((a, b) => Number(b.watchDate) - Number(a.watchDate))
      .slice(0, 10);
  }, [adWatches]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl gold-text mb-1">
          WELCOME BACK{userProfile ? `, ${userProfile.username.toUpperCase()}` : ''}!
        </h1>
        <p className="text-muted-foreground">Here's your earnings overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Balance */}
        <div className="navy-card rounded-2xl p-6 col-span-1 sm:col-span-2 lg:col-span-1 gold-glow animate-pulse-gold">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
              <Coins className="w-5 h-5 text-navy" />
            </div>
            <span className="text-muted-foreground font-medium">Total Balance</span>
          </div>
          {statsLoading ? (
            <Skeleton className="h-12 w-32 bg-secondary" />
          ) : (
            <div className="font-display text-5xl gold-text">
              ${Number(stats?.totalBalance ?? 0).toLocaleString()}
            </div>
          )}
          <p className="text-muted-foreground text-sm mt-2">Available for withdrawal</p>
        </div>

        {/* Ads Today */}
        <div className="navy-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium">Ads Today</span>
          </div>
          {statsLoading ? (
            <Skeleton className="h-10 w-20 bg-secondary" />
          ) : (
            <div className="font-display text-4xl text-foreground">
              {Number(stats?.adsWatchedToday ?? 0)}
            </div>
          )}
          <p className="text-muted-foreground text-sm mt-2">
            Earned today: <span className="text-primary font-bold">${Number(stats?.adsWatchedToday ?? 0) * 100}</span>
          </p>
        </div>

        {/* Total Watched */}
        <div className="navy-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium">Total Watched</span>
          </div>
          {statsLoading ? (
            <Skeleton className="h-10 w-20 bg-secondary" />
          ) : (
            <div className="font-display text-4xl text-foreground">
              {Number(stats?.totalAdsWatched ?? 0)}
            </div>
          )}
          <p className="text-muted-foreground text-sm mt-2">
            All-time earnings: <span className="text-primary font-bold">${Number(stats?.totalAdsWatched ?? 0) * 100}</span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/ads"
          className="navy-card navy-card-hover rounded-2xl p-6 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-navy" />
            </div>
            <div>
              <div className="font-bold text-foreground text-lg">Watch Ads</div>
              <div className="text-muted-foreground text-sm">Earn $100 per ad</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          to="/withdrawal"
          className="navy-card navy-card-hover rounded-2xl p-6 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-bold text-foreground text-lg">Withdraw</div>
              <div className="text-muted-foreground text-sm">Min. $500 required</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>

      {/* Transaction History */}
      <div className="navy-card rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Earnings
        </h2>
        {watchesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-secondary" />
            ))}
          </div>
        ) : recentWatches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <PlayCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No earnings yet. Start watching ads!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentWatches.map((watch, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {adMap.get(watch.adId.toString()) || `Ad #${watch.adId}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(watch.watchDate)}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-primary">+$100</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal History */}
      <div className="navy-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl text-foreground flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Withdrawal History
          </h2>
          <Link
            to="/withdrawal"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Request Withdrawal <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <WithdrawalHistoryTable />
      </div>
    </div>
  );
}
