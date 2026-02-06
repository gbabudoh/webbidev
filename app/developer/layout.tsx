import { ReactNode } from 'react';
import { requireDeveloper } from '@/lib/auth-server';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default async function DeveloperLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ensure user is a developer
  await requireDeveloper();

  return <DashboardLayout showFooter={false}>{children}</DashboardLayout>;
}
