'use client';

import { useState, useEffect } from 'react';
import VerificationForm from '@/components/features/verification/VerificationForm';
import VerificationStatus from '@/components/features/verification/VerificationStatus';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface Verification {
  id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  country: string;
  documentType: string;
  submittedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
}

function VerificationSkeleton() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12 animate-pulse">
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 shadow-sm h-52" />
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-96" />
    </div>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, duration: 0.4 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
};

export default function ClientVerificationPage() {
  const [verification, setVerification] = useState<Verification | null | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchVerification(); }, []);

  const fetchVerification = async () => {
    try {
      const res  = await fetch('/api/client/verification');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setVerification(data.verification ?? null);
      setShowForm(!data.verification || data.verification.status === 'REJECTED');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verification status');
      setVerification(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchVerification();
  };

  if (verification === undefined) return <VerificationSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="space-y-8 max-w-3xl mx-auto pb-12">

      {/* Header */}
      <motion.div variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] border border-white/60 p-8 md:p-12 shadow-sm">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] bg-indigo-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-white border border-white/80 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-14 h-14 text-slate-600" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Identity Verification</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Verify Your Identity
            </h1>
            <p className="text-base text-slate-700 leading-relaxed max-w-xl">
              Verify your identity to build trust with developers, unlock a verified badge on your
              profile, and access a higher tier of talent on the platform.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div variants={itemVariants}
          className="p-4 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-red-600 font-medium text-sm">{error}</p>
        </motion.div>
      )}

      {/* Status card (if submitted) */}
      {verification && !showForm && (
        <motion.div variants={itemVariants}>
          <VerificationStatus
            verification={verification}
            onResubmit={verification.status === 'REJECTED' ? () => setShowForm(true) : undefined}
          />
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div variants={itemVariants}
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-8 md:p-12">
          <div className="mb-8 pb-6 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {verification?.status === 'REJECTED' ? 'Resubmit Verification' : 'Start Verification'}
            </p>
            <p className="text-sm text-slate-500">
              Complete all steps to submit your identity documents for review.
            </p>
          </div>
          <VerificationForm
            onSuccess={handleSuccess}
            apiEndpoint="/api/client/verification"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
