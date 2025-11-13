'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export async function logout() {
  await signOut({ redirect: false });
  window.location.href = '/login';
}

export function useLogout() {
  const router = useRouter();

  return async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };
}

