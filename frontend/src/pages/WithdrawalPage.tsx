import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Wallet, DollarSign, AlertCircle, Loader2, CheckCircle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCallerUserProfile, useRequestWithdrawal } from '../hooks/useQueries';
import WithdrawalHistoryTable from '../components/WithdrawalHistoryTable';
import { toast } from 'sonner';

const MIN_WITHDRAWAL = 500;

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const requestWithdrawal = useRequestWithdrawal();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const balance = userProfile ? Number(userProfile.balance) : 0;

  const validateAmount = (val: string): string => {
    const num = parseFloat(val);
    if (!val || isNaN(num)) return 'Please enter a valid amount';
    if (num < MIN_WITHDRAWAL) return `Minimum withdrawal is $${MIN_WITHDRAWAL}`;
    if (num > balance) return `Insufficient balance. Your balance is $${balance.toLocaleString()}`;
    if (!Number.isInteger(num)) return 'Amount must be a whole number';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    try {
      await requestWithdrawal.mutateAsync(BigInt(parseInt(amount)));
      setSuccess(true);
      setAmount('');
      toast.success('Withdrawal request submitted!', {
        description: 'Your request is pending review.',
      });
    } catch (err: unknown) {
      const e = err as Error;
      const msg = e?.message || 'Failed to submit withdrawal request';
      if (msg.includes('Insufficient')) {
        setError('Insufficient balance for this withdrawal');
      } else if (msg.includes('Minimum')) {
        setError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
      } else {
        setError(msg);
      }
    }
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    setError('');
    setSuccess(false);
  };

  const setMaxAmount = () => {
    setAmount(balance.toString());
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => navigate({ to: '/dashboard' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <h1 className="font-display text-4xl md:text-5xl gold-text mb-2">WITHDRAW FUNDS</h1>
      <p className="text-muted-foreground mb-8">Request a payout of your earned balance.</p>

      {/* Balance card */}
      <div className="navy-card rounded-2xl p-6 mb-6 gold-glow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Wallet className="w-5 h-5 text-navy" />
          </div>
          <span className="text-muted-foreground font-medium">Available Balance</span>
        </div>
        {profileLoading ? (
          <div className="h-12 w-32 bg-secondary rounded animate-pulse" />
        ) : (
          <div className="font-display text-5xl gold-text">${balance.toLocaleString()}</div>
        )}
        {balance < MIN_WITHDRAWAL && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              You need ${(MIN_WITHDRAWAL - balance).toLocaleString()} more to reach the minimum withdrawal of ${MIN_WITHDRAWAL}.{' '}
              <Link to="/ads" className="text-primary hover:underline">Watch more ads</Link>
            </span>
          </div>
        )}
      </div>

      {/* Withdrawal form */}
      <div className="navy-card rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Request Withdrawal
        </h2>

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-400/10 border border-green-400/30 text-green-400 mb-4">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Withdrawal request submitted!</p>
              <p className="text-sm opacity-80">Your request is pending review. You'll be notified once processed.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground font-medium">
              Withdrawal Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
              <Input
                id="amount"
                type="number"
                min={MIN_WITHDRAWAL}
                max={balance}
                step={1}
                placeholder={`Min. $${MIN_WITHDRAWAL}`}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                disabled={requestWithdrawal.isPending || balance < MIN_WITHDRAWAL}
              />
              {balance >= MIN_WITHDRAWAL && (
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline font-semibold"
                >
                  MAX
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Info */}
          <div className="bg-secondary/50 rounded-xl p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Minimum withdrawal</span>
              <span className="font-semibold text-foreground">${MIN_WITHDRAWAL}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing time</span>
              <span className="font-semibold text-foreground">1-3 business days</span>
            </div>
            <div className="flex justify-between">
              <span>Status after request</span>
              <span className="font-semibold text-primary">Pending review</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={requestWithdrawal.isPending || balance < MIN_WITHDRAWAL || !amount}
            className="btn-gold w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2"
          >
            {requestWithdrawal.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Submit Withdrawal Request
              </>
            )}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="navy-card rounded-2xl p-6">
        <h2 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Withdrawal History
        </h2>
        <WithdrawalHistoryTable />
      </div>
    </div>
  );
}
