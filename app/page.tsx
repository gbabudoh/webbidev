'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Typography, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        </div>

        <div ref={heroRef} className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          {/* Status Badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-3 shadow-2xl">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
            </span>
            <span className="text-sm font-medium text-white/90">Platform Live • Trusted Worldwide</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-8 text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="block text-white mb-4">Guaranteed Scope.</span>
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Simplified Development.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-3xl mb-12 text-xl sm:text-2xl text-white/70 leading-relaxed font-light">
            The enterprise-grade marketplace for
            <span className="text-white font-medium"> frontend</span>,
            <span className="text-white font-medium"> backend</span>, and
            <span className="text-white font-medium"> UI/UX</span> specialists.
            <br />
            <span className="text-cyan-400 font-semibold">No pay-to-play. No complexity. Just results.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/signup">
              <Button 
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white border-0 shadow-2xl shadow-blue-500/50 hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-105 px-8 py-6 text-lg font-semibold"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Building Today
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link href="/talent">
              <Button 
                size="lg"
                className="group border-2 border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 px-8 py-6 text-lg font-semibold"
              >
                <span className="flex items-center gap-2">
                  Explore Talent
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: '10-13%', label: 'Platform Fee', color: 'from-blue-500 to-cyan-500' },
              { value: '100%', label: 'Scope Guaranteed', color: 'from-emerald-500 to-green-500' },
              { value: '$0', label: 'Pay-to-Play', color: 'from-purple-500 to-pink-500' }
            ].map((stat, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-white/60 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="relative py-32 bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="primary" size="lg" className="mb-6 px-6 py-2 text-sm font-semibold">
              Why Choose Webbidev
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Enterprise-grade features designed for developers and clients who demand excellence.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Specialized Focus',
                description: 'Curated marketplace exclusively for frontend, backend, and UI/UX professionals.',
                gradient: 'from-blue-500 via-cyan-500 to-blue-600',
                size: 'md:col-span-1'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Scope Bar Protection',
                description: 'Every project milestone is guaranteed. If deliverables don\'t match the agreed scope, you get a full refund.',
                gradient: 'from-emerald-500 via-green-500 to-emerald-600',
                size: 'md:col-span-1'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Transparent Pricing',
                description: 'Flat 10-13% commission. No hidden fees, no tiers, no pay-to-play schemes.',
                gradient: 'from-purple-500 via-pink-500 to-purple-600',
                size: 'md:col-span-1'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Instant Onboarding',
                description: 'Portfolio link, 5 skills, and a bio. Start working in under 5 minutes.',
                gradient: 'from-orange-500 via-red-500 to-orange-600',
                size: 'md:col-span-1'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure Escrow',
                description: 'Funds held safely in escrow until milestone approval. Complete protection for all parties.',
                gradient: 'from-indigo-500 via-blue-500 to-indigo-600',
                size: 'md:col-span-1'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                ),
                title: 'Fair Disputes',
                description: 'Technical reviewers make objective decisions based on predefined milestone criteria.',
                gradient: 'from-violet-500 via-purple-500 to-violet-600',
                size: 'md:col-span-1'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50",
                  feature.size
                )}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Split View */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="primary" size="lg" className="mb-6 px-6 py-2 text-sm font-semibold bg-white/10 text-white border-white/20">
              How It Works
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-black mb-6 text-white">
              Simple. Transparent. Fair.
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Get started in minutes with our streamlined process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Clients */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 hover:bg-white/10 transition-all duration-500">
                <div className="mb-8">
                  <Badge variant="primary" size="lg" className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                    For Clients
                  </Badge>
                  <h3 className="text-3xl font-bold text-white mb-2">Post & Hire</h3>
                  <p className="text-white/60">Find the perfect developer for your project</p>
                </div>

                <div className="space-y-6 mb-10">
                  {[
                    { 
                      step: '01', 
                      title: 'Define Your Project', 
                      desc: 'Create 3-5 clear milestones with measurable outcomes',
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    },
                    { 
                      step: '02', 
                      title: 'Review Proposals', 
                      desc: 'Browse specialized developers with verified portfolios',
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    },
                    { 
                      step: '03', 
                      title: 'Approve & Release', 
                      desc: 'Review work and release payments per milestone',
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group/item">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-white/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-xl py-6 text-lg font-semibold group/btn">
                    Start as Client
                    <svg className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Developers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 hover:bg-white/10 transition-all duration-500">
                <div className="mb-8">
                  <Badge variant="primary" size="lg" className="mb-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                    For Developers
                  </Badge>
                  <h3 className="text-3xl font-bold text-white mb-2">Build & Earn</h3>
                  <p className="text-white/60">Work on projects that match your expertise</p>
                </div>

                <div className="space-y-6 mb-10">
                  {[
                    { 
                      step: '01', 
                      title: 'Create Profile', 
                      desc: 'Portfolio, 5 skills, and bio. Takes 5 minutes.',
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    },
                    { 
                      step: '02', 
                      title: 'Browse & Propose', 
                      desc: 'Find projects matching your skills and submit proposals',
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    },
                    { 
                      step: '03', 
                      title: 'Deliver & Get Paid', 
                      desc: 'Complete milestones and receive 87-90% of earnings',
                      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group/item">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-white/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0 shadow-xl py-6 text-lg font-semibold group/btn">
                    Start as Developer
                    <svg className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope Bar Showcase */}
      <section className="relative py-32 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="primary" size="lg" className="mb-6 px-6 py-2 text-sm font-semibold">
              The Scope Bar
            </Badge>
            <h2 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 dark:from-white dark:via-emerald-200 dark:to-white bg-clip-text text-transparent">
              Your Protection, Guaranteed
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Every project is protected by our Scope Bar system. Clear milestones, objective criteria, and full refunds if deliverables don't match.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    ),
                    title: 'Defined Milestones',
                    desc: '3-5 clear milestones with objective "Definition of Done" criteria for each.'
                  },
                  {
                    icon: (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: 'Escrow Protection',
                    desc: 'Funds held securely until milestone approval. Zero risk for both parties.'
                  },
                  {
                    icon: (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    ),
                    title: 'Fair Resolution',
                    desc: 'Technical reviewers make objective decisions based on agreed criteria.'
                  }
                ].map((item, i) => (
                  <div key={i} className="text-center group">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 text-white">
            Ready to Build Something Great?
          </h2>
          <p className="text-2xl text-white/70 mb-12 leading-relaxed">
            Join thousands of developers and clients building the future.
            <br />
            <span className="text-cyan-400">No credit card required. Start in minutes.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white border-0 shadow-2xl shadow-blue-500/50 hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-105 px-10 py-7 text-xl font-bold group"
              >
                Create Free Account
                <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/talent">
              <Button 
                size="lg"
                className="border-2 border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 px-10 py-7 text-xl font-bold group"
              >
                Browse Developers
                <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
