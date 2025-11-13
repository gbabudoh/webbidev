import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      default:
        'bg-zinc-100 text-zinc-800 focus:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-100',
      primary:
        'bg-foreground text-background focus:ring-foreground',
      secondary:
        'bg-zinc-200 text-zinc-900 focus:ring-zinc-500 dark:bg-zinc-700 dark:text-zinc-100',
      success:
        'bg-green-100 text-green-800 focus:ring-green-500 dark:bg-green-900 dark:text-green-100',
      warning:
        'bg-yellow-100 text-yellow-800 focus:ring-yellow-500 dark:bg-yellow-900 dark:text-yellow-100',
      danger:
        'bg-red-100 text-red-800 focus:ring-red-500 dark:bg-red-900 dark:text-red-100',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

