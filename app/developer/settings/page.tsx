import { Metadata } from 'next';
import { requireDeveloper } from '@/lib/auth-server';
import DeleteAccountSection from '@/components/features/settings/DeleteAccountSection';
import { Typography } from '@/components/ui';
import { Settings, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account Settings | Webbidev',
  description: 'Manage your account settings and privacy.',
};

export default async function DeveloperSettingsPage() {
  const user = await requireDeveloper();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Settings className="w-4 h-4" />
              <Typography variant="span" size="sm" className="font-bold uppercase tracking-widest text-[10px]">
                Platform Settings
              </Typography>
            </div>
            <Typography variant="h1" className="text-4xl font-black text-slate-900 tracking-tight">
              Account Settings
            </Typography>
            <Typography className="text-slate-500 font-medium max-w-xl">
              Manage your personal information, security preferences, and account privacy to keep your experience secure.
            </Typography>
          </div>
        </div>

        <div className="space-y-8">
          {/* Future settings sections can go here (Email, Password, Notifications) */}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Shield className="w-5 h-5 text-slate-900" />
              <Typography variant="h3" className="font-black text-slate-900">
                Privacy & Data
              </Typography>
            </div>
            
            <DeleteAccountSection userEmail={user.email} />
          </div>
        </div>
      </div>
  );
}
