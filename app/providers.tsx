'use client';

import { KonstaProvider } from 'konsta/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false}
    >
      <KonstaProvider theme="ios">
        {children}
      </KonstaProvider>
    </SessionProvider>
  );
}

