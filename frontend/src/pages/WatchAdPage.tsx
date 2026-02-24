import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Clock, DollarSign, CheckCircle, Loader2, AlertCircle, Play } from 'lucide-react';
import { useGetAd, useGetCallerAdWatches, useClaimAd } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function WatchAdPage() {
  const { adId } = useParams({ from: '/app/ads/$adId' });
  const navigate = useNavigate();

  const adIdBigInt = BigInt(adId);
  const { data: ad, isLoading: adLoading } = useGetAd(adIdBigInt);
  const { data: adWatches } = useGetCallerAdWatches();
  const claimAd = useClaimAd();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));

  const isAlreadyWatched = React.useMemo(() => {
    if (!adWatches) return false;
    return adWatches.some(
      (w) => w.adId.toString() === adId && Number(w.watchDate) === today
    );
  }, [adWatches, adId, today]);

  useEffect(() => {
    if (ad && timeLeft === null) {
      setTimeLeft(Number(ad.duration));
    }
  }, [ad, timeLeft]);

  const startTimer = useCallback(() => {
    if (timerStarted || !ad) return;
    setTimerStarted(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timerStarted, ad]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleClaim = async () => {
    try {
      await claimAd.mutateAsync(adIdBigInt);
      setClaimed(true);
      toast.success('🎉 $100 added to your balance!', {
        description: 'Reward claimed successfully.',
      });
      setTimeout(() => navigate({ to: '/ads' }), 2000);
    } catch (err: unknown) {
      const e = err as Error;
      const msg = e?.message || 'Failed to claim reward';
      if (msg.includes('already claimed')) {
        toast.error('Already claimed today', { description: 'You can claim this ad again tomorrow.' });
      } else {
        toast.error('Claim failed', { description: msg });
      }
    }
  };

  const duration = ad ? Number(ad.duration) : 1;
  const progress = timeLeft !== null ? ((duration - timeLeft) / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (adLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive opacity-60" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Ad Not Found</h2>
        <p className="text-muted-foreground mb-6">This ad doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate({ to: '/ads' })}
          className="btn-gold px-6 py-3 rounded-xl font-bold"
        >
          Back to Ads
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/ads' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Ads
      </button>

      {/* Ad info */}
      <div className="navy-card rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-bold text-2xl text-foreground mb-1">{ad.title}</h1>
            <p className="text-muted-foreground">{ad.description}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl gold-gradient">
            <DollarSign className="w-5 h-5 text-navy" />
            <span className="font-display text-2xl text-navy">${Number(ad.rewardAmount)}</span>
          </div>
        </div>
      </div>

      {/* Already watched */}
      {isAlreadyWatched && !claimed ? (
        <div className="navy-card rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Already Claimed Today!</h2>
          <p className="text-muted-foreground mb-6">You've already earned $100 from this ad today. Come back tomorrow!</p>
          <button
            onClick={() => navigate({ to: '/ads' })}
            className="btn-gold px-8 py-3 rounded-xl font-bold"
          >
            Watch More Ads
          </button>
        </div>
      ) : claimed ? (
        <div className="navy-card rounded-2xl p-8 text-center gold-glow">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h2 className="font-display text-4xl gold-text mb-2">$100 EARNED!</h2>
          <p className="text-muted-foreground">Redirecting you back to ads...</p>
        </div>
      ) : (
        <>
          {/* Video embed */}
          <div className="navy-card rounded-2xl overflow-hidden mb-6">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={ad.url.replace('watch?v=', 'embed/').replace('&list=', '?list=')}
                title={ad.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={startTimer}
              />
            </div>
          </div>

          {/* Timer & Claim */}
          <div className="navy-card rounded-2xl p-8 text-center">
            {!timerStarted ? (
              <div className="mb-6">
                <div
                  className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
                  onClick={startTimer}
                >
                  <Play className="w-8 h-8 text-navy ml-1" />
                </div>
                <p className="text-muted-foreground">The timer will start when the video loads.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the play button above if it doesn't start automatically.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="oklch(0.28 0.04 255)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="oklch(0.78 0.16 85)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-3xl text-foreground">{timeLeft}</span>
                    <span className="text-xs text-muted-foreground">seconds</span>
                  </div>
                </div>
                {timeLeft !== null && timeLeft > 0 ? (
                  <p className="text-muted-foreground">
                    Keep watching to earn your reward...
                  </p>
                ) : (
                  <p className="text-primary font-semibold">
                    🎉 Time's up! Claim your reward below.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleClaim}
              disabled={timeLeft === null || timeLeft > 0 || claimAd.isPending || claimed}
              className="btn-gold px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {claimAd.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  Claim $100 Reward
                </>
              )}
            </button>

            {timeLeft !== null && timeLeft > 0 && timerStarted && (
              <p className="text-muted-foreground text-sm mt-3 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4" />
                Wait {timeLeft}s to claim your reward
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
