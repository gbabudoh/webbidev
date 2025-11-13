import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Redirect based on user role
  if (!user) {
    redirect('/login');
  }

  if (user.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  if (user.role === 'CLIENT') {
    redirect('/client/dashboard');
  }

  if (user.role === 'DEVELOPER') {
    redirect('/developer/dashboard');
  }

  // Fallback to login if role is unknown
  redirect('/login');
}

