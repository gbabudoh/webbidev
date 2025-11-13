import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PublicLayout({
  children,
  className,
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn('flex-1', className)}>{children}</main>
      <Footer />
    </div>
  );
}

