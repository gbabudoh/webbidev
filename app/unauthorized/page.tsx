import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Typography } from '@/components/ui';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="p" color="muted">
              This page requires specific permissions that your account doesn't have.
            </Typography>
            <div className="flex gap-4">
              <Button asChild variant="primary">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

