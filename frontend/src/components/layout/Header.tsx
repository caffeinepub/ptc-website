import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, PlayCircle, Wallet, Menu, X, Coins } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ads', label: 'Watch Ads', icon: PlayCircle },
  { to: '/withdrawal', label: 'Withdraw', icon: Wallet },
];

export default function Header() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = !!identity;
  const hasProfile = !!userProfile;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-navy/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
            <Coins className="w-5 h-5 text-navy" />
          </div>
          <span className="font-display text-2xl gold-text tracking-wider">AdEarn</span>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated && hasProfile && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && hasProfile && userProfile && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                ${Number(userProfile.balance).toLocaleString()}
              </span>
            </div>
          )}
          <LoginButton variant="nav" />

          {/* Mobile menu toggle */}
          {isAuthenticated && hasProfile && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && isAuthenticated && hasProfile && (
        <div className="md:hidden border-t border-border bg-navy">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
