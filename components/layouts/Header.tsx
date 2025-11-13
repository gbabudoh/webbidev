'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/lib/auth-client';
import { Button, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', public: true },
    { name: 'Browse Talent', href: '/talent', public: true },
    { name: 'How It Works', href: '/how-it-works', public: true },
    { name: 'Pricing', href: '/pricing', public: true },
  ];

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'CLIENT') return '/client/dashboard';
    if (user.role === 'DEVELOPER') return '/developer/dashboard';
    return '/dashboard';
  };

  const getDashboardName = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'ADMIN') return 'Admin Dashboard';
    if (user.role === 'CLIENT') return 'Client Dashboard';
    if (user.role === 'DEVELOPER') return 'Developer Dashboard';
    return 'Dashboard';
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60',
        className
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center gap-x-2">
            <Typography variant="h1" size="xl" weight="bold" className="text-foreground">
              Webbidev
            </Typography>
          </Link>
          <div className="hidden lg:flex lg:gap-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-semibold leading-6 transition-colors hover:text-foreground',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-zinc-600 dark:text-zinc-400'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block">{user?.name || user?.email}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="p-2">
                      <Link
                        href={getDashboardLink()}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {getDashboardName()}
                      </Link>
                      {user?.role === 'DEVELOPER' && (
                        <Link
                          href="/developer/profile"
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      )}
                      {user?.role === 'CLIENT' && (
                        <Link
                          href="/client/post"
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Post Project
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-medium',
                  pathname === item.href
                    ? 'bg-zinc-100 text-foreground dark:bg-zinc-800'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

