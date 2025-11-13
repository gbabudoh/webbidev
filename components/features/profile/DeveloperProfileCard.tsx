'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge, Typography, Button } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';

interface DeveloperProfile {
  id: string;
  userId: string;
  portfolioUrl: string;
  bioSummary: string;
  location: string;
  timeZone?: string | null;
  skills: string[];
  totalEarnings: number;
  totalProjects: number;
  completedProjects: number;
  isVerified: boolean;
  isActive: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface DeveloperProfileCardProps {
  profile: DeveloperProfile;
  showActions?: boolean;
  onViewProfile?: () => void;
  onHire?: () => void;
  className?: string;
}

export default function DeveloperProfileCard({
  profile,
  showActions = true,
  onViewProfile,
  onHire,
  className,
}: DeveloperProfileCardProps) {
  const displayName = profile.user?.name || profile.user?.email || 'Developer';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <CardTitle className="mb-1">
                {displayName}
                {profile.isVerified && (
                  <Badge variant="success" size="sm" className="ml-2">
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <Typography variant="p" size="sm" color="muted">
                {profile.location}
                {profile.timeZone && ` • ${profile.timeZone}`}
              </Typography>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <div>
          <Typography variant="p" size="sm" className="line-clamp-3">
            {profile.bioSummary}
          </Typography>
        </div>

        {/* Skills */}
        <div>
          <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
            Skills
          </Typography>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {skill.replace(/_/g, ' ')}
              </Badge>
            ))}
            {profile.skills.length > 5 && (
              <Badge variant="secondary" size="sm">
                +{profile.skills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="text-center">
            <Typography variant="h3" size="lg" weight="bold">
              {formatCurrency(profile.totalEarnings)}
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Total Earnings
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" size="lg" weight="bold">
              {profile.totalProjects}
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Projects
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h3" size="lg" weight="bold">
              {profile.completedProjects}
            </Typography>
            <Typography variant="p" size="xs" color="muted">
              Completed
            </Typography>
          </div>
        </div>

        {/* Portfolio Link */}
        {profile.portfolioUrl && (
          <div>
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground hover:underline"
            >
              View Portfolio →
            </a>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewProfile}
              className="flex-1"
            >
              View Profile
            </Button>
            {onHire && (
              <Button
                variant="primary"
                size="sm"
                onClick={onHire}
                className="flex-1"
              >
                Hire
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

