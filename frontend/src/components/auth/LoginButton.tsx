import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  variant?: 'default' | 'hero' | 'nav';
}

export default function LoginButton({ variant = 'default' }: LoginButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (variant === 'hero') {
    return (
      <button
        onClick={handleAuth}
        disabled={isLoggingIn}
        className="btn-gold px-10 py-4 rounded-full text-lg font-bold flex items-center gap-3 mx-auto disabled:opacity-50"
      >
        {isLoggingIn ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogIn className="w-5 h-5" />
        )}
        {isLoggingIn ? 'Connecting...' : 'Start Earning Now'}
      </button>
    );
  }

  if (variant === 'nav') {
    return (
      <button
        onClick={handleAuth}
        disabled={isLoggingIn}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          isAuthenticated
            ? 'border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            : 'btn-gold'
        } disabled:opacity-50`}
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isAuthenticated ? (
          <LogOut className="w-4 h-4" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
      </button>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoggingIn}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
        isAuthenticated
          ? 'border border-border text-muted-foreground hover:text-foreground'
          : 'btn-gold'
      } disabled:opacity-50`}
    >
      {isLoggingIn ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isAuthenticated ? (
        <LogOut className="w-4 h-4" />
      ) : (
        <LogIn className="w-4 h-4" />
      )}
      {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}
