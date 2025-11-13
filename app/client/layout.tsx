import { ReactNode } from 'react';
import { requireClient } from '@/lib/auth-server';

export default async function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ensure user is a client
  await requireClient();

  return <>{children}</>;
}

