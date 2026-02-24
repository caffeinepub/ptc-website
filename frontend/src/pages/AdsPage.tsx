import React from 'react';
import { Link } from '@tanstack/react-router';
import { PlayCircle, Clock, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAvailableAds, useGetCallerAdWatches } from '../hooks/useQueries';

function formatDuration(seconds: bigint): string {
  const s = Number(seconds);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function AdsPage() {
  const { data: ads, isLoading: adsLoading } = useGetAvailableAds();
  const { data: adWatches, isLoading: watchesLoading } = useGetCallerAdWatches();

  const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));

  const watchedTodaySet = React.useMemo(() => {
    const set = new Set<string>();
    if (adWatches) {
      adWatches.forEach((w) => {
        if (Number(w.watchDate) === today) {
          set.add(w.adId.toString());
        }
      });
    }
    return set;
  }, [adWatches, today]);

  const isLoading = adsLoading || watchesLoading;

  const availableCount = ads ? ads.filter((ad) => !watchedTodaySet.has(ad.id.toString())).length : 0;
  const watchedCount = ads ? ads.filter((ad) => watchedTodaySet.has(ad.id.toString())).length : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl gold-text mb-2">AVAILABLE ADS</h1>
        <p className="text-muted-foreground">Watch ads and earn $100 each. New ads reset daily.</p>
      </div>

      {/* Stats bar */}
      {!isLoading && ads && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="navy-card rounded-xl p-4 text-center">
            <div className="font-display text-3xl text-foreground">{ads.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Ads</div>
          </div>
          <div className="navy-card rounded-xl p-4 text-center">
            <div className="font-display text-3xl text-primary">{availableCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Available Today</div>
          </div>
          <div className="navy-card rounded-xl p-4 text-center">
            <div className="font-display text-3xl text-foreground">{watchedCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Watched Today</div>
          </div>
        </div>
      )}

      {/* Ads Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-52 rounded-2xl bg-secondary" />
          ))}
        </div>
      ) : !ads || ads.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium">No ads available right now</p>
          <p className="text-sm mt-2">Check back later for new ads</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => {
            const isWatched = watchedTodaySet.has(ad.id.toString());
            return (
              <div
                key={ad.id.toString()}
                className={`navy-card rounded-2xl overflow-hidden flex flex-col transition-all ${
                  isWatched ? 'opacity-60' : 'navy-card-hover'
                }`}
              >
                {/* Card top accent */}
                <div className={`h-1.5 w-full ${isWatched ? 'bg-muted' : 'gold-gradient'}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                      Ad #{ad.id.toString()}
                    </span>
                    {isWatched ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        <DollarSign className="w-3 h-3" />
                        Available
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{ad.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{ad.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDuration(ad.duration)}
                    </span>
                    <span className="flex items-center gap-1.5 text-primary font-bold">
                      <DollarSign className="w-4 h-4" />
                      ${Number(ad.rewardAmount)} Reward
                    </span>
                  </div>

                  {/* CTA */}
                  {isWatched ? (
                    <div className="w-full py-3 rounded-xl bg-secondary text-muted-foreground text-sm font-semibold text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Claimed Today
                    </div>
                  ) : (
                    <Link
                      to="/ads/$adId"
                      params={{ adId: ad.id.toString() }}
                      className="btn-gold w-full py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Watch & Earn $100
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
