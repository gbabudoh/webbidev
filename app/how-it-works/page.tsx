'use client';

import PublicLayout from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Typography, Button, Badge } from '@/components/ui';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  DollarSign, 
  Shield, 
  Target, 
  Briefcase, 
  Code, 
  Sparkles,
  ArrowRight,
  Lock,
  TrendingUp
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 mb-6">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                <Typography variant="p" size="sm" weight="medium" className="text-green-600 dark:text-green-400">
                  Simple & Secure Process
                </Typography>
              </div>
              <Typography variant="h1" size="4xl" weight="bold" className="mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                How It Works
              </Typography>
              <Typography variant="p" size="xl" color="muted" className="max-w-3xl mx-auto">
                A simple, secure way to connect with developers and get your projects done right
              </Typography>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* For Clients Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10 rounded-3xl" />
              <div className="relative text-center mb-12 pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                  <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Typography variant="p" size="sm" weight="medium" className="text-blue-600 dark:text-blue-400">
                    For Clients
                  </Typography>
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-4">
                  Post, Review, and Collaborate
                </Typography>
                <Typography variant="p" size="lg" color="muted" className="max-w-3xl mx-auto">
                  Post your project, review proposals, and work with developers through our milestone-based system
                </Typography>
              </div>

              <div className="relative space-y-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white mb-4">
                      <FileText className="w-4 h-4" />
                      <span className="font-bold">Step 1</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Post Your Project
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Create a detailed project description with your requirements, budget, and deadline. Use our Development Scope Bar to break down your project into clear, measurable milestones.
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
                        <span>Break down into 3-5 milestones with clear deliverables</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 p-8 shadow-lg">
                    <div className="space-y-4">
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-full"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded w-5/6"></div>
                      <div className="h-24 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded w-1/2"></div>
                        <div className="h-3 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded w-2/3"></div>
                      </div>
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
                      <Users className="w-4 h-4" />
                      <span className="font-bold">Step 2</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Review Proposals
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Developers submit proposals with their approach, timeline, and pricing. Review their profiles, portfolios, and past work to find the best fit for your project.
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
                        <span>Select the right developer for your project</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-bold">Step 3</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Work with Milestones
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Projects are broken down into milestones with clear deliverables. Funds are held in escrow and released as each milestone is completed and approved.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Clear milestone definitions and deliverables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Secure escrow payments protect your funds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Approve milestones to release payments</span>
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

            {/* For Developers Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent dark:via-orange-950/10 rounded-3xl" />
              <div className="relative text-center mb-12 pt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 mb-4">
                  <Code className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <Typography variant="p" size="sm" weight="medium" className="text-orange-600 dark:text-orange-400">
                    For Developers
                  </Typography>
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-4">
                  Browse, Propose, and Earn
                </Typography>
                <Typography variant="p" size="lg" color="muted" className="max-w-3xl mx-auto">
                  Browse projects, submit proposals, and get paid securely through our milestone-based system
                </Typography>
              </div>

              <div className="relative space-y-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white mb-4">
                      <Users className="w-4 h-4" />
                      <span className="font-bold">Step 1</span>
                    </div>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Complete Your Profile
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Create a comprehensive profile showcasing your skills, portfolio, and experience. Select 5 key skills that best represent your expertise.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Add your portfolio URL and bio</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Select 5 key skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Complete Stripe Connect setup for payments</span>
                      </li>
                    </ul>
                  </div>
                  <Card className="bg-zinc-100 dark:bg-zinc-900">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-full bg-foreground mx-auto"></div>
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-2/3 mx-auto"></div>
                        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2 mx-auto"></div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-20"></div>
                          <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-20"></div>
                          <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-20"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <Card className="bg-zinc-100 dark:bg-zinc-900 order-2 md:order-1">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-zinc-950 rounded">
                          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full mb-2"></div>
                          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-5/6"></div>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-950 rounded">
                          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full mb-2"></div>
                          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-5/6"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="order-1 md:order-2">
                    <Badge variant="primary" size="lg" className="mb-4">
                      Step 2
                    </Badge>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Browse & Submit Proposals
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Browse open projects that match your skills. Submit detailed proposals explaining your approach, timeline, and pricing.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Filter projects by skill type and budget</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Review project requirements and milestones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Submit compelling proposals</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge variant="primary" size="lg" className="mb-4">
                      Step 3
                    </Badge>
                    <Typography variant="h3" size="xl" weight="bold" className="mb-3">
                      Complete Milestones & Get Paid
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-4">
                      Work through milestones, submit deliverables, and get paid securely. Funds are held in escrow and released when milestones are approved.
                    </Typography>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Complete milestones according to scope</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Submit deliverables for client approval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground mt-1">✓</span>
                        <span>Receive payments directly to your account</span>
                      </li>
                    </ul>
                  </div>
                  <Card className="bg-zinc-100 dark:bg-zinc-900">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 rounded">
                          <div>
                            <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2 mb-1"></div>
                            <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-green-300 dark:bg-green-700 rounded w-16 mb-1"></div>
                            <Badge variant="success" size="sm">Paid</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 rounded">
                          <div>
                            <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2 mb-1"></div>
                            <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-1/3"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-yellow-300 dark:bg-yellow-700 rounded w-16 mb-1"></div>
                            <Badge variant="primary" size="sm">Pending</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Development Scope Bar Section */}
            <section>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                      <Target className="w-4 h-4 text-white" />
                      <Typography variant="p" size="sm" weight="medium" className="text-white">
                        Core Feature
                      </Typography>
                    </div>
                    <Typography variant="h2" size="2xl" weight="bold" className="mb-3 text-white">
                      The Development Scope Bar
                    </Typography>
                    <Typography variant="p" size="lg" className="text-white/80 max-w-3xl mx-auto">
                      Our unique milestone system ensures clarity and protects both parties
                    </Typography>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                    <div className="space-y-8">
                      <div>
                        <Typography variant="h3" size="lg" weight="bold" className="mb-3 text-white">
                          What is the Development Scope Bar?
                        </Typography>
                        <Typography variant="p" className="mb-4 text-white/90">
                          The Development Scope Bar is our mandatory milestone breakdown system that requires every project to be divided into 3-5 clear, measurable milestones. Each milestone has:
                        </Typography>
                        <ul className="space-y-3 text-white/90">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                            <span>A clear title and description</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                            <span>Objective, measurable criteria for completion (Definition of Done)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                            <span>A percentage of the total budget allocated</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <Typography variant="h3" size="lg" weight="bold" className="mb-4 text-white">
                          How It Protects You
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Shield className="w-5 h-5 text-white" />
                              <Typography variant="h4" size="sm" weight="semibold" className="text-white">
                                For Clients
                              </Typography>
                            </div>
                            <ul className="space-y-2 text-white/90 text-sm">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Clear expectations for each milestone</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Funds held in escrow until approval</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Ability to review work before payment</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Dispute resolution process available</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Lock className="w-5 h-5 text-white" />
                              <Typography variant="h4" size="sm" weight="semibold" className="text-white">
                                For Developers
                              </Typography>
                            </div>
                            <ul className="space-y-2 text-white/90 text-sm">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Clear project scope and requirements</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Guaranteed payment upon milestone approval</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Protection from scope creep</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>Fair dispute resolution process</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-12 text-center shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                  <Sparkles className="w-4 h-4 text-white" />
                  <Typography variant="p" size="sm" weight="medium" className="text-white">
                    Start Your Journey
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
                    <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-white/90 shadow-lg gap-2">
                      Post a Project
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/signup?role=DEVELOPER">
                    <Button variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm gap-2">
                      Become a Developer
                      <ArrowRight className="w-4 h-4" />
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

