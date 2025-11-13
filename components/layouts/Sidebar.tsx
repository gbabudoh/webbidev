'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Client navigation
  const clientNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/client/dashboard' },
    { name: 'My Projects', href: '/client/projects' },
    { name: 'Post Project', href: '/client/post' },
    { name: 'Messages', href: '/client/messages' },
    { name: 'My Profile', href: '/client/profile' },
    { name: 'Billing', href: '/client/billing' },
  ];

  // Developer navigation
  const developerNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/developer/dashboard' },
    { name: 'Job Feed', href: '/developer/jobs' },
    { name: 'Messages', href: '/developer/messages' },
    { name: 'My Profile', href: '/developer/profile' },
    { name: 'Earnings', href: '/developer/earnings' },
  ];

  // Admin navigation
  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Messages', href: '/admin/messages' },
    { name: 'Disputes', href: '/admin/disputes' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  const getNavItems = (): NavItem[] => {
    if (!user) return [];
    if (user.role === 'ADMIN') return adminNavItems;
    if (user.role === 'CLIENT') return clientNavItems;
    if (user.role === 'DEVELOPER') return developerNavItems;
    return [];
  };

  const navItems = getNavItems();

  if (!user || navItems.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        'hidden w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:block',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <Typography variant="h2" size="lg" weight="semibold">
            {user.role === 'ADMIN' ? 'Admin' : user.role === 'CLIENT' ? 'Client' : 'Developer'}
          </Typography>
          <Typography variant="p" size="sm" color="muted">
            {user.email}
          </Typography>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                )}
              >
                <span className="flex items-center gap-3">
                  {item.icon && <span className="h-5 w-5">{item.icon}</span>}
                  {item.name}
                </span>
                {item.badge && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      isActive
                        ? 'bg-background/20 text-background'
                        : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
            <Typography variant="p" size="xs" weight="medium" className="mb-1">
              Need Help?
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Contact support or check our{' '}
              <Link href="/help" className="text-foreground hover:underline">
                help center
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </aside>
  );
}

