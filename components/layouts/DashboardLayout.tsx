'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

export default function DashboardLayout({
  children,
  className,
  showFooter = true,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={cn(
            'flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900',
            className
          )}
        >
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-32 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

