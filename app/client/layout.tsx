import { ReactNode } from 'react';
import { requireClient } from '@/lib/auth-server';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default async function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ensure user is a client
  await requireClient();

  return <DashboardLayout showFooter={false}>{children}</DashboardLayout>;
}
