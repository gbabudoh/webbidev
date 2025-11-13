import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect('/unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  return await requireRole('ADMIN');
}

export async function requireClient() {
  return await requireRole('CLIENT');
}

export async function requireDeveloper() {
  return await requireRole('DEVELOPER');
}

