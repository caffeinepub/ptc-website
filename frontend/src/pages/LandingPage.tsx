import React from 'react';
import { Link } from '@tanstack/react-router';
import { DollarSign, Clock, Shield, TrendingUp, Play, ChevronRight, Coins, Star } from 'lucide-react';
import LoginButton from '../components/auth/LoginButton';

const steps = [
  {
    icon: '/assets/generated/earn-icon.dim_128x128.png',
    fallbackIcon: DollarSign,
    title: 'Sign Up Free',
    desc: 'Create your account in seconds using secure Internet Identity. No personal data required.',
    step: '01',
  },
  {
    icon: '/assets/generated/earn-icon.dim_128x128.png',
    fallbackIcon: Play,
    title: 'Watch Ads',
    desc: 'Browse available ads and watch them for the required duration. Simple and easy.',
    step: '02',
  },
  {
    icon: '/assets/generated/trophy-icon.dim_128x128.png',
    fallbackIcon: DollarSign,
    title: 'Earn $100',
    desc: 'Claim your $100 reward instantly after each ad. Watch multiple ads daily!',
    step: '03',
  },
  {
    icon: '/assets/generated/trophy-icon.dim_128x128.png',
    fallbackIcon: TrendingUp,
    title: 'Withdraw',
    desc: 'Request a payout once you reach $500. Fast and secure withdrawals.',
    step: '04',
  },
];

const features = [
  { icon: DollarSign, title: '$100 Per Ad', desc: 'Earn a flat $100 for every ad you watch. No tricks, no hidden fees.' },
  { icon: Clock, title: 'Quick & Easy', desc: 'Ads are short — from 30 to 90 seconds. Earn hundreds in minutes.' },
  { icon: Shield, title: 'Secure Platform', desc: 'Built on the Internet Computer blockchain. Your earnings are safe.' },
  { icon: TrendingUp, title: 'Daily Earnings', desc: 'New ads available every day. Keep watching, keep earning.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-navy/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Coins className="w-5 h-5 text-navy" />
            </div>
            <span className="font-display text-2xl gold-text tracking-wider">AdEarn</span>
          </div>
          <LoginButton variant="nav" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-background to-navy-light opacity-90" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)' }}
        />
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-current" />
            Earn Real Money Watching Ads
          </div>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 leading-none">
            <span className="gold-text">EARN $100</span>
            <br />
            <span className="text-foreground">PER AD WATCH</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of users earning real money by watching short ads. 
            Sign up free, watch ads, and withdraw your earnings — it's that simple.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LoginButton variant="hero" />
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              How it works <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: 'Per Ad', value: '$100' },
              { label: 'Min. Withdrawal', value: '$500' },
              { label: 'Daily Ads', value: '5+' },
            ].map(({ label, value }) => (
              <div key={label} className="navy-card rounded-xl p-4">
                <div className="font-display text-3xl gold-text">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-navy-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-5xl md:text-6xl gold-text mb-4">HOW IT WORKS</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Start earning in 4 simple steps. No experience needed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ title, desc, step, icon, fallbackIcon: FallbackIcon }) => (
              <div key={step} className="navy-card navy-card-hover rounded-2xl p-6 text-center relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-xs">
                  {step}
                </div>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <img
                    src={icon}
                    alt={title}
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-14 h-14 rounded-full gold-gradient flex items-center justify-center"><svg class="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>`;
                      }
                    }}
                  />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-5xl md:text-6xl gold-text mb-4">WHY CHOOSE US</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              The most rewarding PTC platform on the Internet Computer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="navy-card navy-card-hover rounded-2xl p-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-light/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-7xl mb-6">
            <span className="gold-text">READY TO EARN?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Join now and start earning $100 per ad. Your first reward is just one click away.
          </p>
          <LoginButton variant="hero" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded gold-gradient flex items-center justify-center">
              <Coins className="w-3.5 h-3.5 text-navy" />
            </div>
            <span className="font-display text-lg gold-text">AdEarn</span>
          </div>
          <p>
            © {new Date().getFullYear()} AdEarn. Built with{' '}
            <span className="text-destructive">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'adEarn-ptc')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
