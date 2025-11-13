'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requireAuth: boolean = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, requireAuth, router]);

  return {
    user: session?.user,
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
  };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useRequireRole(role: string) {
  const { user, isLoading, isAuthenticated } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== role) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, isAuthenticated, role, router]);

  return { user, isLoading, isAuthenticated };
}

