'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Select, Typography } from '@/components/ui';

type UserRole = 'CLIENT' | 'DEVELOPER';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' as UserRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || null,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      // Redirect to login page with success message
      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
            Webbidev
          </Typography>
          <Typography variant="p" color="muted">
            Guaranteed Scope. Simplified Development.
          </Typography>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Join Webbidev to connect with top developers or find your next project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <Select
                label="I am a"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={isLoading}
                options={[
                  { value: 'CLIENT', label: 'Client (Looking for developers)' },
                  { value: 'DEVELOPER', label: 'Developer (Looking for projects)' },
                ]}
              />

              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="name"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a password (min. 8 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="new-password"
                helperText="Must be at least 8 characters long"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Typography variant="span" color="muted">
                Already have an account?{' '}
              </Typography>
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

