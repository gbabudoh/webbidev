'use client';

import PublicLayout from '@/components/layouts/PublicLayout';
import { Button, Badge } from '@/components/ui';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
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
  Clock,
  Star
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
            <motion.div 
              className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, 30, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1],
                x: [0, -30, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-lg shadow-emerald-200/20 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">
                  Simple & Secure Process
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="text-slate-900">How </span>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Webbidev
                </span>
                <span className="text-slate-900"> Works</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12">
                A seamless journey from project idea to successful delivery, powered by our secure milestone-based system.
              </p>

              {/* Quick Stats */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { icon: Shield, label: 'Secure Escrow', value: '100%' },
                  { icon: Clock, label: 'Avg. Response', value: '<24h' },
                  { icon: Star, label: 'Success Rate', value: '98%' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {/* For Clients Section */}
            <section>
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">For Clients</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Post, Review & Collaborate
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Three simple steps to get your project completed by expert developers
                </p>
              </motion.div>

              {/* Client Steps */}
              <div className="relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 -translate-x-1/2" />

                <div className="space-y-12 lg:space-y-0">
                  {/* Step 1 */}
                  <motion.div 
                    className="relative lg:grid lg:grid-cols-2 lg:gap-16 items-center"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="lg:text-right lg:pr-16">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-4 shadow-lg shadow-blue-500/25">
                        <FileText className="w-4 h-4" />
                        <span className="font-bold">Step 1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Post Your Project</h3>
                      <p className="text-slate-600 mb-6">
                        Create a detailed project description with requirements, budget, and timeline. Use our Development Scope Bar to break down your project into clear milestones.
                      </p>
                      <ul className="space-y-3">
                        {['Define scope & requirements', 'Set budget & timeline', 'Create 3-5 milestones'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 justify-start lg:justify-end">
                            <span className="text-slate-700 font-medium">{item}</span>
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8 lg:mt-0 lg:pl-16 relative">
                      {/* Step Number Circle */}
                      <div className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 z-10">
                        1
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
                          <div className="space-y-4">
                            <div className="h-4 bg-gradient-to-r from-blue-200 to-cyan-200 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 rounded w-full" />
                            <div className="h-3 bg-slate-100 rounded w-5/6" />
                            <div className="h-24 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="flex gap-2">
                              <div className="h-8 w-20 bg-blue-100 rounded-lg" />
                              <div className="h-8 w-24 bg-cyan-100 rounded-lg" />
                              <div className="h-8 w-16 bg-teal-100 rounded-lg" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div 
                    className="relative lg:grid lg:grid-cols-2 lg:gap-16 items-center"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="order-2 lg:order-1 mt-8 lg:mt-0 lg:pr-16 relative">
                      {/* Step Number Circle */}
                      <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30 z-10">
                        2
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
                          <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                                <div className="flex-1">
                                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <div className="h-3 bg-slate-100 rounded w-12" />
                                  </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1 lg:order-2 lg:pl-16">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4 shadow-lg shadow-purple-500/25">
                        <Users className="w-4 h-4" />
                        <span className="font-bold">Step 2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Review Proposals</h3>
                      <p className="text-slate-600 mb-6">
                        Developers submit proposals with their approach and pricing. Review profiles, portfolios, and past work to find the perfect fit.
                      </p>
                      <ul className="space-y-3">
                        {['Browse developer profiles', 'Compare proposals', 'Select best fit'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-700 font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div 
                    className="relative lg:grid lg:grid-cols-2 lg:gap-16 items-center"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="lg:text-right lg:pr-16">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-4 shadow-lg shadow-emerald-500/25">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-bold">Step 3</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Work with Milestones</h3>
                      <p className="text-slate-600 mb-6">
                        Funds are held in secure escrow and released as each milestone is completed and approved. Full control, zero risk.
                      </p>
                      <ul className="space-y-3">
                        {['Clear milestone definitions', 'Secure escrow payments', 'Approve to release'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 justify-start lg:justify-end">
                            <span className="text-slate-700 font-medium">{item}</span>
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8 lg:mt-0 lg:pl-16 relative">
                      {/* Step Number Circle */}
                      <div className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/30 z-10">
                        3
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
                          <div className="space-y-3">
                            {[
                              { label: 'Design Phase', status: 'Complete', color: 'emerald' },
                              { label: 'Development', status: 'In Progress', color: 'blue' },
                              { label: 'Testing', status: 'Pending', color: 'slate' },
                            ].map((milestone, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-3 h-3 rounded-full",
                                    milestone.color === 'emerald' && "bg-emerald-500",
                                    milestone.color === 'blue' && "bg-blue-500 animate-pulse",
                                    milestone.color === 'slate' && "bg-slate-300"
                                  )} />
                                  <span className="font-medium text-slate-700">{milestone.label}</span>
                                </div>
                                <Badge 
                                  variant={milestone.color === 'emerald' ? 'success' : milestone.color === 'blue' ? 'primary' : 'secondary'}
                                  size="sm"
                                >
                                  {milestone.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* For Developers Section */}
            <section>
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-6">
                  <Code className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600">For Developers</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Browse, Propose & Earn
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Find great projects and get paid securely through our milestone system
                </p>
              </motion.div>

              {/* Developer Steps - Horizontal Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  {
                    step: 1,
                    icon: Users,
                    title: 'Complete Your Profile',
                    description: 'Showcase your skills, portfolio, and experience. Select your top 5 skills and set up Stripe for payments.',
                    color: 'from-orange-500 to-red-500',
                    items: ['Add portfolio & bio', 'Select 5 key skills', 'Setup Stripe Connect']
                  },
                  {
                    step: 2,
                    icon: Target,
                    title: 'Browse & Propose',
                    description: 'Filter projects by skill and budget. Submit detailed proposals with your approach and timeline.',
                    color: 'from-amber-500 to-orange-500',
                    items: ['Filter by skills', 'Review requirements', 'Submit proposals']
                  },
                  {
                    step: 3,
                    icon: DollarSign,
                    title: 'Complete & Get Paid',
                    description: 'Work through milestones, submit deliverables, and receive secure payments upon approval.',
                    color: 'from-emerald-500 to-teal-500',
                    items: ['Complete milestones', 'Submit deliverables', 'Get paid securely']
                  }
                ].map((step) => (
                  <motion.div
                    key={step.step}
                    variants={fadeInUp}
                    className="relative group"
                  >
                    <div className={cn("absolute -inset-1 bg-gradient-to-r rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity", step.color)} />
                    <div className="relative h-full p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                      <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-white mb-6 shadow-lg bg-gradient-to-r", step.color)}>
                        <step.icon className="w-4 h-4" />
                        <span className="font-bold">Step {step.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 mb-6">{step.description}</p>
                      <ul className="space-y-2">
                        {step.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Development Scope Bar Feature */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 md:p-16 shadow-2xl">
                {/* Animated Background Elements */}
                <motion.div 
                  className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                  transition={{ duration: 15, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
                  transition={{ duration: 12, repeat: Infinity }}
                />
                
                <div className="relative">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                      <Target className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Core Feature</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      The Development Scope Bar
                    </h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                      Our unique milestone system ensures clarity and protects both clients and developers
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* What it is */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        What is it?
                      </h3>
                      <p className="text-white/90 mb-6">
                        Every project is divided into 3-5 clear, measurable milestones. Each milestone includes:
                      </p>
                      <ul className="space-y-4">
                        {[
                          'Clear title and description',
                          'Measurable completion criteria',
                          'Allocated budget percentage'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Protection Cards */}
                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white">For Clients</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-white/80">
                          {['Clear expectations', 'Funds held in escrow', 'Review before payment', 'Dispute resolution'].map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white">For Developers</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-white/80">
                          {['Clear project scope', 'Guaranteed payment', 'Protection from scope creep', 'Fair resolution'].map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-10 md:p-16 text-center shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Background Elements */}
              <motion.div 
                className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Start Your Journey</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Join Webbidev today and experience a better way to work with developers or find your next project.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup?role=CLIENT">
                    <Button className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 cursor-pointer">
                      Post a Project
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/signup?role=DEVELOPER">
                    <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
                      Become a Developer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
