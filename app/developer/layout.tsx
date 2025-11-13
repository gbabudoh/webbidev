import { ReactNode } from 'react';
import { requireDeveloper } from '@/lib/auth-server';

export default async function DeveloperLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ensure user is a developer
  await requireDeveloper();

  return <>{children}</>;
}

