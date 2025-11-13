'use client';

import PublicLayout from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Typography, Button, Badge } from '@/components/ui';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Shield, Zap, Users, CheckCircle, Lock, MessageSquare, Award, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 mb-6">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <Typography variant="p" size="sm" weight="medium" className="text-purple-600 dark:text-purple-400">
                  Building the Future of Development
                </Typography>
              </div>
              <Typography variant="h1" size="4xl" weight="bold" className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About Webbidev
              </Typography>
              <Typography variant="p" size="xl" color="muted" className="max-w-3xl mx-auto mb-8">
                Guaranteed Scope. Simplified Development.
              </Typography>
              <Typography variant="p" size="lg" color="muted" className="max-w-2xl mx-auto">
                We're revolutionizing how clients and developers collaborate, bringing transparency, security, and simplicity to every project.
              </Typography>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Mission Section */}
            <section>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Typography variant="p" size="sm" weight="medium" className="text-blue-600 dark:text-blue-400">
                    Our Mission
                  </Typography>
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-4">
                  Building Trust Through Technology
                </Typography>
                <Typography variant="p" size="lg" color="muted" className="max-w-3xl mx-auto">
                  We're building a better way for clients and developers to work together, with transparency, security, and simplicity at the core.
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Transparency
                    </Typography>
                    <Typography variant="p" color="muted">
                      Clear project scopes, defined milestones, and transparent pricing. No hidden fees, no surprises.
                    </Typography>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Security
                    </Typography>
                    <Typography variant="p" color="muted">
                      Escrow payments protect both clients and developers. Funds are held securely until milestones are approved.
                    </Typography>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Simplicity
                    </Typography>
                    <Typography variant="p" color="muted">
                      A streamlined platform focused on what matters: connecting great developers with great projects.
                    </Typography>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-blue-950/20 rounded-3xl" />
              <div className="relative text-center mb-12 pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <Typography variant="p" size="sm" weight="medium" className="text-purple-600 dark:text-purple-400">
                    Simple Process
                  </Typography>
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-4">
                  How It Works
                </Typography>
                <Typography variant="p" size="lg" color="muted" className="max-w-3xl mx-auto">
                  Our platform makes it easy to find the right developer and manage your project from start to finish.
                </Typography>
              </div>

              <div className="relative space-y-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white mb-4">
                      <span className="font-bold">01</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Post Your Project
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Clients create a project with clear requirements, budget, and deadline. Break down your project into milestones with the Development Scope Bar.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Define project scope and requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Set budget and timeline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Break down into milestones</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 p-8 shadow-lg">
                    <div className="space-y-4">
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-full"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-5/6"></div>
                      <div className="h-24 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded-xl"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 p-8 shadow-lg order-2 md:order-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-4">
                      <span className="font-bold">02</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Review Proposals
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Developers submit proposals with their approach, timeline, and pricing. Review and select the best fit for your project.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Browse developer profiles and portfolios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Compare proposals and expertise</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Select the right developer</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4">
                      <span className="font-bold">03</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Work with Milestones
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Projects are broken down into milestones. Funds are held in escrow and released as each milestone is completed and approved.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Clear milestone definitions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Secure escrow payments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Approval-based releases</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 p-8 shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                        <div className="h-4 bg-gradient-to-r from-green-300 to-emerald-300 dark:from-green-700 dark:to-emerald-700 rounded w-1/2"></div>
                        <Badge variant="success" size="sm" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                        <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-1/2"></div>
                        <Badge variant="primary" size="sm">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                        <div className="h-4 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600 rounded w-1/2"></div>
                        <Badge variant="secondary" size="sm">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 mb-4">
                  <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <Typography variant="p" size="sm" weight="medium" className="text-green-600 dark:text-green-400">
                    Platform Features
                  </Typography>
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-4">
                  Why Choose Webbidev?
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Development Scope Bar
                  </Typography>
                  <Typography variant="p" color="muted">
                    Our unique milestone system ensures clear project scope and protects both parties with defined deliverables.
                  </Typography>
                </div>

                <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Low Fees
                  </Typography>
                  <Typography variant="p" color="muted">
                    Simple, transparent pricing. Just 10-13% flat commission - no hidden fees or surprise charges.
                  </Typography>
                </div>

                <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Curated Talent
                  </Typography>
                  <Typography variant="p" color="muted">
                    Verified developers with proven track records. Quality over quantity.
                  </Typography>
                </div>

                <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Secure Payments
                  </Typography>
                  <Typography variant="p" color="muted">
                    Escrow system protects your funds. Payments are only released when milestones are approved.
                  </Typography>
                </div>

                <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:border-red-300 dark:hover:border-red-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Dispute Resolution
                  </Typography>
                  <Typography variant="p" color="muted">
                    Fair and transparent dispute resolution process. We're here to help when things don't go as planned.
                  </Typography>
                </div>

                <div className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg hover:border-cyan-300 dark:hover:border-cyan-700 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Project Management
                  </Typography>
                  <Typography variant="p" color="muted">
                    Built-in messaging and milestone tracking. Everything you need in one place.
                  </Typography>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                  <Sparkles className="w-4 h-4 text-white" />
                  <Typography variant="p" size="sm" weight="medium" className="text-white">
                    Join Our Community
                  </Typography>
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-4 text-white">
                  Ready to Get Started?
                </Typography>
                <Typography variant="p" size="lg" className="mb-8 max-w-2xl mx-auto text-white/90">
                  Join Webbidev today and experience a better way to work with developers or find your next project.
                </Typography>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup?role=CLIENT">
                    <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-white/90 shadow-lg">
                      Post a Project
                    </Button>
                  </Link>
                  <Link href="/signup?role=DEVELOPER">
                    <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm">
                      Become a Developer
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

