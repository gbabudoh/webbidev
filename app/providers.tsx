'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}

