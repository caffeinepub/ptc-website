import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Sparkles } from 'lucide-react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import type { UserProfile } from '../../backend';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Valid email is required');
      return;
    }

    const profile: UserProfile = {
      username: username.trim(),
      email: email.trim(),
      registrationDate: BigInt(Date.now()) * BigInt(1_000_000),
      balance: BigInt(0),
    };

    try {
      await saveProfile.mutateAsync(profile);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e?.message || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="navy-card border-border max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-navy" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Welcome to <span className="gold-text">AdEarn</span>!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Set up your profile to start earning $100 per ad watched.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              disabled={saveProfile.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              disabled={saveProfile.isPending}
            />
          </div>

          {error && (
            <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
          )}

          <button
            type="submit"
            disabled={saveProfile.isPending}
            className="btn-gold w-full py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 mt-2"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create My Account
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
