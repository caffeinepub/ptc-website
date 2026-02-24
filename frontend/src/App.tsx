import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdsPage from './pages/AdsPage';
import WatchAdPage from './pages/WatchAdPage';
import WithdrawalPage from './pages/WithdrawalPage';

// ─── Root Route ───────────────────────────────────────────────────────────────

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Outlet />
      <ProfileSetupModal open={showProfileSetup} />
      <Toaster richColors position="top-right" />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

// ─── Landing Route ────────────────────────────────────────────────────────────

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// ─── App Layout Route ─────────────────────────────────────────────────────────

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
});

// ─── Dashboard Route ──────────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

// ─── Ads Route ────────────────────────────────────────────────────────────────

const adsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/ads',
  component: AdsPage,
});

// ─── Watch Ad Route ───────────────────────────────────────────────────────────

const watchAdRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/ads/$adId',
  component: WatchAdPage,
});

// ─── Withdrawal Route ─────────────────────────────────────────────────────────

const withdrawalRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/withdrawal',
  component: WithdrawalPage,
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    adsRoute,
    watchAdRoute,
    withdrawalRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
