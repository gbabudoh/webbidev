import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Webbidev',
  description: 'Sign in or create an account on Webbidev',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

