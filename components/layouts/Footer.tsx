import Link from 'next/link';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Browse Talent', href: '/talent' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Dispute Resolution', href: '/dispute-resolution' },
    ],
  };

  return (
    <footer
      className={cn(
        'border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Typography variant="h2" size="lg" weight="bold" className="mb-4">
              Webbidev
            </Typography>
            <Typography variant="p" size="sm" color="muted" className="mb-4">
              Guaranteed Scope. Simplified Development.
            </Typography>
            <Typography variant="p" size="sm" color="muted">
              A specialized marketplace for frontend, backend, and UI/UX developers and designers.
            </Typography>
          </div>

          {/* Platform Links */}
          <div>
            <Typography variant="h3" size="sm" weight="semibold" className="mb-4">
              Platform
            </Typography>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <Typography variant="h3" size="sm" weight="semibold" className="mb-4">
              Company
            </Typography>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <Typography variant="h3" size="sm" weight="semibold" className="mb-4">
              Legal
            </Typography>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Typography variant="p" size="sm" color="muted">
              © {currentYear} Webbidev. All rights reserved.
            </Typography>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

