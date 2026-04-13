'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Typography, Button } from '@/components/ui';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid admin credentials. Please try again.');
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setError('A secure connection could not be established. Please retry.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Premium Background Effects (Lighter and Brighter) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(black,transparent_85%)] opacity-[0.03]" />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-8">
            <Image src="/webbidev.png" alt="Webbidev" width={180} height={40} className="opacity-90 transition-opacity hover:opacity-100" priority />
          </Link>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Admin Control Center</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 transition-all hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.12)]">
          <div className="mb-8">
            <Typography variant="h1" className="text-2xl font-black text-slate-900 mb-2">Secure Login</Typography>
            <Typography variant="p" size="sm" className="text-slate-500">Authorized personnel only. Sessions are monitored.</Typography>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="text-[10px] font-bold text-white">!</span>
                </div>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Admin Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@webbidev.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Key</label>
                <Link href="#" className="text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-wider transition-colors">System Reset</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In to Management
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              Return to Public Portal
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} Webbidev Node. v2.1.0-Admin
          </p>
        </div>
      </div>
    </div>
  );
}
