'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true' && !success) {
      // Use setTimeout to avoid cascading render warning
      const timer = setTimeout(() => {
        setSuccess('Account created successfully! Please sign in.');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block group cursor-pointer">
              <div className="flex items-center justify-center mb-3">
                <Image src="/webbidev.png" alt="Webbidev Logo" width={180} height={48} className="h-12 w-auto" priority />
              </div>
            </Link>
            <p className="text-slate-600 dark:text-blue-200/80 text-sm">Guaranteed Scope. Simplified Development.</p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-slate-600 dark:text-white/60">Sign in to continue to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Success Message */}
            {success && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-white/90">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-white/90">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white/80 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-white/60 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-white/40">
            <Link href="/" className="hover:text-slate-700 dark:hover:text-white/70 transition-colors cursor-pointer">Home</Link>
            <Link href="/talent" className="hover:text-slate-700 dark:hover:text-white/70 transition-colors cursor-pointer">Browse Talent</Link>
            <Link href="/about" className="hover:text-slate-700 dark:hover:text-white/70 transition-colors cursor-pointer">About</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
