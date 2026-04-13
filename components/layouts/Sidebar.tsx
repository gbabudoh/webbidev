'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Kanban,
  LayoutGrid,
  FolderOpen,
  FilePlus,
  MessageSquare,
  User,
  CreditCard,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Users,
  Sparkles,
  Scale,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const CLIENT_NAV: NavGroup[] = [
  {
    items: [
      { name: 'Dashboard', href: '/client/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { name: 'Task Board', href: '/dashboard/user-bucket', icon: <Kanban className="w-4 h-4" /> },
      { name: 'Kanban View', href: '/dashboard/user-bucket/board', icon: <LayoutGrid className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Projects',
    items: [
      { name: 'My Projects', href: '/client/projects', icon: <FolderOpen className="w-4 h-4" /> },
      { name: 'Post Project', href: '/client/post', icon: <FilePlus className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Messages', href: '/client/messages', icon: <MessageSquare className="w-4 h-4" /> },
      { name: 'My Profile', href: '/client/profile', icon: <User className="w-4 h-4" /> },
      { name: 'Billing', href: '/client/billing', icon: <CreditCard className="w-4 h-4" /> },
      { name: 'Verification', href: '/client/verification', icon: <ShieldCheck className="w-4 h-4" /> },
    ],
  },
];

const DEVELOPER_NAV: NavGroup[] = [
  {
    items: [
      { name: 'Dashboard', href: '/developer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { name: 'Dev Workspace', href: '/developer/dashboard/dev-bucket', icon: <Kanban className="w-4 h-4" /> },
      { name: 'Kanban View', href: '/developer/dashboard/dev-bucket/board', icon: <LayoutGrid className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Work',
    items: [
      { name: 'Job Feed', href: '/developer/jobs', icon: <Briefcase className="w-4 h-4" /> },
      { name: 'Messages', href: '/developer/messages', icon: <MessageSquare className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'My Profile', href: '/developer/profile', icon: <User className="w-4 h-4" /> },
      { name: 'Earnings', href: '/developer/earnings', icon: <DollarSign className="w-4 h-4" /> },
      { name: 'Verification', href: '/developer/verification', icon: <ShieldCheck className="w-4 h-4" /> },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
      { name: 'Projects', href: '/admin/projects', icon: <FolderOpen className="w-4 h-4" /> },
      { name: 'Messages', href: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
      { name: 'Disputes', href: '/admin/disputes', icon: <Scale className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Platform',
    items: [
      { name: 'Hero Content', href: '/admin/hero', icon: <Sparkles className="w-4 h-4" /> },
      { name: 'Verification', href: '/admin/verification', icon: <ShieldCheck className="w-4 h-4" /> },
      { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

const ROLE_PILL: Record<string, { label: string; className: string }> = {
  CLIENT: { label: 'Client', className: 'bg-indigo-50 text-indigo-600 border border-indigo-100' },
  DEVELOPER: { label: 'Developer', className: 'bg-blue-50 text-blue-600 border border-blue-100' },
  ADMIN: { label: 'Admin', className: 'bg-purple-50 text-purple-600 border border-purple-100' },
};

function isItemActive(href: string, pathname: string): boolean {
  const exactOnly = href.includes('dashboard') || href.includes('bucket');
  return exactOnly
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/');
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const groups =
    user.role === 'ADMIN'
      ? ADMIN_NAV
      : user.role === 'CLIENT'
      ? CLIENT_NAV
      : user.role === 'DEVELOPER'
      ? DEVELOPER_NAV
      : [];

  if (groups.length === 0) return null;

  const initial = (user.name || user.email).charAt(0).toUpperCase();
  const displayName = user.name || user.email.split('@')[0];
  const rolePill = ROLE_PILL[user.role] ?? { label: user.role, className: 'bg-slate-100 text-slate-600' };

  return (
    <aside
      className={cn(
        'hidden w-64 shrink-0 border-r border-slate-100 bg-white lg:flex flex-col',
        className
      )}
    >
      {/* Header — identity */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-black text-base shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm font-black text-slate-900 tracking-tight truncate max-w-[80px]">
                {displayName}
              </span>
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0', rolePill.className)}>
                {rolePill.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.label && (
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isItemActive(item.href, pathname);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150',
                      active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn('shrink-0', active ? 'text-white' : 'text-slate-400')}>
                        {item.icon}
                      </span>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-bold shrink-0',
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100 shrink-0">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Need Help?</p>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Visit our{' '}
              <Link href="/help" className="text-slate-700 font-semibold hover:underline underline-offset-2">
                help center
              </Link>{' '}
              or contact support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
