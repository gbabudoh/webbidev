'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input, Card, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DeleteAccountSectionProps {
  userEmail: string;
}

export default function DeleteAccountSection({ userEmail }: DeleteAccountSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== userEmail) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch('/api/user/account/delete', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Success - sign out and redirect to home
      await signOut({ callbackUrl: '/' });
    } catch (err: unknown) {
      console.error('Delete account error:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-100 bg-red-50/30 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="space-y-1">
              <Typography variant="h3" className="text-red-900 font-black">
                Danger Zone
              </Typography>
              <Typography variant="p" size="sm" className="text-red-700/80 font-medium">
                Permanently delete your account and all associated data.
              </Typography>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-2xl bg-white border border-red-100/50 space-y-2">
              <Typography className="text-xs font-black text-red-900 uppercase tracking-widest">
                What will be lost
              </Typography>
              <ul className="space-y-1.5">
                {['Your profile and settings', 'All project history and history', 'Messages and attachments', 'Active proposals and bids'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-red-700/70 font-medium">
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-red-100/50 space-y-2">
              <Typography className="text-xs font-black text-red-900 uppercase tracking-widest">
                Before you go
              </Typography>
              <p className="text-sm text-red-700/70 font-medium leading-relaxed">
                Ensure all your active projects are completed and funds have been released from escrow. You cannot delete an account with active contracts.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl px-6 font-bold transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-red-600" />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={isDeleting}
                    className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <Typography variant="h3" className="font-black text-slate-900">
                    Are you absolutely sure?
                  </Typography>
                  <Typography className="text-slate-500 font-medium leading-relaxed">
                    This action is irreversible. All your projects, proposals, and data will be permanently wiped. There is no way to recover this information.
                  </Typography>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-red-600 text-sm font-semibold leading-tight">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Type your email to confirm: <span className="text-slate-900 select-all font-bold">{userEmail}</span>
                    </label>
                    <Input
                      placeholder={userEmail}
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      disabled={isDeleting}
                      className="rounded-2xl border-slate-200 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 order-2 sm:order-1"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={cn(
                        "flex-1 rounded-2xl font-black shadow-lg shadow-red-500/20 order-1 sm:order-2 transition-all duration-300",
                        confirmText === userEmail 
                          ? "bg-red-600 text-white hover:bg-red-700" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      )}
                      onClick={handleDelete}
                      disabled={confirmText !== userEmail || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Confirm Deletion"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
