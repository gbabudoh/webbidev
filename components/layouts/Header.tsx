'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Browse Talent', href: '/talent' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'CLIENT') return '/dashboard/user-bucket';
    if (user.role === 'DEVELOPER') return '/developer/dashboard';
    return '/dashboard';
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl',
        className
      )}
    >
      {/* Mobile Header */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-x-2 group cursor-pointer flex-shrink-0">
          <Image 
            src="/webbidev.png" 
            alt="Webbidev Logo" 
            width={150} 
            height={40} 
            className="h-8 md:h-9 w-auto transition-transform duration-300 group-hover:scale-105" 
            priority 
          />
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-1 flex-1 mx-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
          
          {/* Dashboard Link - Desktop only */}
          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className={cn(
                'relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                pathname.includes('/dashboard') || pathname.includes('/admin')
                  ? 'text-slate-900 bg-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              Dashboard
              {(pathname.includes('/dashboard') || pathname.includes('/admin')) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-x-2">
          {isLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/25">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block max-w-[120px] truncate text-sm font-medium text-slate-700">{user?.name || user?.email}</span>
              <button
                onClick={() => {
                  logout();
                }}
                className="text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 group cursor-pointer">
                  Get Started
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
