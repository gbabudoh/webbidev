'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  LayoutDashboard, 
  MessageSquare, 
  MoreHorizontal, 
  Users, 
  HelpCircle, 
  CreditCard, 
  LogIn, 
  Sparkles, 
  LogOut, 
  User,
  X,
  Folder,
  Layout
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();
  const logout = useLogout();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Close "More" menu on route change using the "adjusting state during render" pattern
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isMoreOpen) {
      setIsMoreOpen(false);
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'CLIENT') return '/dashboard/user-bucket';
    if (user.role === 'DEVELOPER') return '/developer/dashboard';
    return '/dashboard';
  };

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: getDashboardLink(), icon: LayoutDashboard },
    { name: 'Message', href: '/dashboard/messages', icon: MessageSquare },
  ];

  const getMenuItems = () => {
    const defaultItems = [
      { name: 'Browse Talent', href: '/talent', icon: Users },
      { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
      { name: 'Pricing', href: '/pricing', icon: CreditCard },
    ];

    if (user?.role === 'CLIENT') {
      return [
        { name: 'userBucket', href: '/dashboard/user-bucket', icon: Folder },
        { name: 'userBucket Board', href: '/dashboard/user-bucket/board', icon: Layout },
        ...defaultItems
      ];
    }

    if (user?.role === 'DEVELOPER') {
      return [
        { name: 'devBucket', href: '/developer/dashboard/dev-bucket', icon: Folder },
        { name: 'devBucket Board', href: '/developer/dashboard/dev-bucket/board', icon: Layout },
        ...defaultItems
      ];
    }

    return defaultItems;
  };

  const menuItems = getMenuItems();

  // Check if current path belongs to a tab
  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href.includes('dashboard') || href.includes('bucket')) return pathname === href;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  // Hide mobile nav on auth and admin pages
  if (pathname.includes('/login') || pathname.includes('/signup') || pathname.includes('/admin')) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
        {/* Safe Area spacing */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around h-16 container mx-auto">
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative",
                    active ? "text-blue-600 font-medium" : "text-slate-500 font-normal"
                  )}
                >
                  <Icon className={cn("w-6 h-6", active && "animate-in zoom-in-75 duration-300")} />
                  <span className="text-[10px] uppercase tracking-wider">{tab.name}</span>
                  {active && (
                    <motion.div 
                      layoutId="mobileTabActive"
                      className="absolute -top-[1px] w-12 h-[2px] bg-blue-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            
            <button
              onClick={() => setIsMoreOpen(true)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isMoreOpen ? "text-blue-600 font-medium" : "text-slate-500 font-normal"
              )}
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] uppercase tracking-wider">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[110] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 z-[120] rounded-t-3xl shadow-2xl pb-[calc(env(safe-area-inset-bottom)+16px)] md:hidden border-t border-slate-100 dark:border-slate-800"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>

              <div className="px-6 space-y-6">
                {/* Header within drawer */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Menu</h2>
                  <button 
                    onClick={() => setIsMoreOpen(false)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Section */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/10 border border-slate-100 dark:border-slate-800">
                  {isLoading ? (
                    <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                  ) : isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/25">
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                          <p className="text-sm text-slate-500 truncate">{user?.role} Account</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link 
                          href="/dashboard/profile"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <button 
                          onClick={() => logout()}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-semibold border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Link 
                        href="/login"
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform shadow-sm"
                      >
                        <LogIn className="w-5 h-5 text-slate-400" /> Log In
                      </Link>
                      <Link 
                        href="/signup"
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold active:scale-95 transition-transform shadow-lg shadow-blue-500/25"
                      >
                        <Sparkles className="w-5 h-5" /> Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Main Menu Links */}
                <div className="grid grid-cols-1 gap-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
