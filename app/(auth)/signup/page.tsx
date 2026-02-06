'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import Select from '@/components/ui/Select';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';
import { 
  Briefcase, 
  Code2, 
  ArrowRight, 
  Shield, 
  Zap, 
  Users,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

type UserRole = 'CLIENT' | 'DEVELOPER';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' as UserRole,
    country: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
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
          country: formData.country,
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
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div 
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block group cursor-pointer">
              <motion.div 
                className="flex items-center justify-center mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <Image src="/webbidev.png" alt="Webbidev Logo" width={180} height={48} className="h-12 w-auto" priority />
              </motion.div>
            </Link>
            <p className="text-slate-600 text-sm">Guaranteed Scope. Simplified Development.</p>
          </div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex items-center justify-center gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: Shield, label: 'Secure' },
              { icon: Zap, label: 'Fast' },
              { icon: Users, label: '10K+ Users' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-slate-500 text-xs">
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Card */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur opacity-20" />
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
                <p className="text-slate-600 text-sm">Join Webbidev to start your journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <motion.div 
                    className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-start gap-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs">!</span>
                    </div>
                    {error}
                  </motion.div>
                )}

                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { role: 'CLIENT' as UserRole, icon: Briefcase, label: 'Client', desc: 'Hire developers' },
                      { role: 'DEVELOPER' as UserRole, icon: Code2, label: 'Developer', desc: 'Find projects' },
                    ].map((option) => (
                      <button
                        key={option.role}
                        type="button"
                        onClick={() => handleRoleSelect(option.role)}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all cursor-pointer text-left group",
                          formData.role === option.role
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {formData.role === option.role && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          </div>
                        )}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors",
                          formData.role === option.role
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        )}>
                          <option.icon className="w-5 h-5" />
                        </div>
                        <p className={cn(
                          "font-semibold text-sm",
                          formData.role === option.role ? "text-blue-700" : "text-slate-900"
                        )}>
                          {option.label}
                        </p>
                        <p className="text-xs text-slate-500">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Country Selection */}
                <div className="space-y-2">
                  <Select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={countries}
                    placeholder="Select your country"
                    error={!formData.country && error.includes('Country') ? 'Country is required' : ''}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password (min. 8 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Must be at least 8 characters long</p>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-2"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Create account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white text-slate-500">or</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center text-sm">
                <span className="text-slate-600">Already have an account? </span>
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-8">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline cursor-pointer">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
