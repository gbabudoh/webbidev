'use client';

import { motion } from 'framer-motion';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Badge, Button } from '@/components/ui';
import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  Lock, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Target, 
  Sparkles,
  ArrowRight,
  Globe,
  Heart,
  Star
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const missionCards = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Clear project scopes, defined milestones, and transparent pricing. No hidden fees, no surprises.',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-400/10 to-cyan-400/10'
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Escrow payments protect both clients and developers. Funds are held securely until milestones are approved.',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-400/10 to-pink-400/10'
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description: 'A streamlined platform focused on what matters: connecting great developers with great projects.',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-400/10 to-emerald-400/10'
    }
  ];

  const features = [
    { icon: Target, title: 'Development Scope Bar', description: 'Our unique milestone system ensures clear project scope and protects both parties.', color: 'blue' },
    { icon: TrendingUp, title: 'Low Fees', description: 'Simple, transparent pricing. Just 10-13% flat commission - no hidden fees.', color: 'purple' },
    { icon: Award, title: 'Curated Talent', description: 'Verified developers with proven track records. Quality over quantity.', color: 'green' },
    { icon: Lock, title: 'Secure Payments', description: 'Escrow system protects your funds. Payments released when milestones approved.', color: 'orange' },
    { icon: Shield, title: 'Dispute Resolution', description: 'Fair and transparent dispute resolution process when things don\'t go as planned.', color: 'red' },
    { icon: MessageSquare, title: 'Project Management', description: 'Built-in messaging and milestone tracking. Everything you need in one place.', color: 'cyan' }
  ];

  const stats = [
    { value: '10K+', label: 'Developers', icon: Users },
    { value: '50K+', label: 'Projects', icon: Target },
    { value: '$25M+', label: 'Paid Out', icon: TrendingUp },
    { value: '98%', label: 'Satisfaction', icon: Star }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30" />
          <motion.div 
            className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
          
          <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-lg mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Building the Future of Development
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                About Webbidev
              </motion.h1>
              
              <motion.p 
                className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Guaranteed Scope. Simplified Development.
              </motion.p>
              
              <motion.p 
                className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                We&apos;re revolutionizing how clients and developers collaborate, bringing transparency, security, and simplicity to every project.
              </motion.p>

              {/* Stats Row */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-slate-700/50">
                      <Icon className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {/* Mission Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="text-center mb-16" variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Our Mission</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Building Trust Through Technology
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  We&apos;re building a better way for clients and developers to work together, with transparency, security, and simplicity at the core.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {missionCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.div 
                      key={card.title}
                      variants={fadeInUp}
                      className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.bgGradient} rounded-full blur-3xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`} />
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                          {card.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {card.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* How It Works Section */}
            <motion.section 
              className="relative"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-blue-950/20 rounded-3xl" />
              
              <motion.div className="relative text-center mb-16 pt-8" variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Simple Process</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Our platform makes it easy to find the right developer and manage your project from start to finish.
                </p>
              </motion.div>

              <div className="relative space-y-12 pb-8">
                {/* Step 1 */}
                <motion.div 
                  variants={fadeInUp}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white mb-6 shadow-lg">
                      <span className="font-bold text-lg">01</span>
                      <span className="font-medium">Post Your Project</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Define Your Vision
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Create a project with clear requirements, budget, and deadline. Break down your project into milestones with the Development Scope Bar.
                    </p>
                    <ul className="space-y-3">
                      {['Define project scope and requirements', 'Set budget and timeline', 'Break down into milestones'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 p-8 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl" />
                    <div className="relative space-y-4">
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-full w-3/4" />
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-full w-full" />
                      <div className="h-4 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-full w-5/6" />
                      <div className="h-28 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded-2xl flex items-center justify-center">
                        <Globe className="w-12 h-12 text-blue-500/50" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  variants={fadeInUp}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="relative rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 p-8 shadow-xl order-2 lg:order-1">
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600" />
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded w-2/3 mb-2" />
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                          </div>
                          <Star className="w-5 h-5 text-amber-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-6 shadow-lg">
                      <span className="font-bold text-lg">02</span>
                      <span className="font-medium">Review Proposals</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Find Your Match
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Developers submit proposals with their approach, timeline, and pricing. Review and select the best fit for your project.
                    </p>
                    <ul className="space-y-3">
                      {['Browse developer profiles and portfolios', 'Compare proposals and expertise', 'Select the right developer'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  variants={fadeInUp}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-6 shadow-lg">
                      <span className="font-bold text-lg">03</span>
                      <span className="font-medium">Work with Milestones</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Deliver with Confidence
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Projects are broken down into milestones. Funds are held in escrow and released as each milestone is completed and approved.
                    </p>
                    <ul className="space-y-3">
                      {['Clear milestone definitions', 'Secure escrow payments', 'Approval-based releases'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 p-8 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-slate-900 dark:text-white">Milestone 1</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border-2 border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-100 animate-pulse" />
                          <span className="font-medium text-slate-900 dark:text-white">Milestone 2</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                          <span className="font-medium text-slate-600 dark:text-slate-400">Milestone 3</span>
                        </div>
                        <Badge className="bg-slate-100 text-slate-600 border-slate-200">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="text-center mb-16" variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 mb-4">
                  <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Platform Features</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Why Choose Webbidev?
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const colorClasses: Record<string, string> = {
                    blue: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700',
                    purple: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700',
                    green: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400 hover:border-green-300 dark:hover:border-green-700',
                    orange: 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 dark:text-orange-400 hover:border-orange-300 dark:hover:border-orange-700',
                    red: 'from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 hover:border-red-300 dark:hover:border-red-700',
                    cyan: 'from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-600 dark:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-700'
                  };
                  
                  return (
                    <motion.div 
                      key={feature.title}
                      variants={fadeInUp}
                      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[feature.color].split(' ').slice(0, 4).join(' ')} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${colorClasses[feature.color].split(' ').slice(4, 8).join(' ')}`} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 lg:p-16 text-center shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
              
              <div className="relative">
                <motion.div 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Join Our Community</span>
                </motion.div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Get Started?
                </h2>
                
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Join Webbidev today and experience a better way to work with developers or find your next project.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup?role=CLIENT">
                    <Button className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2">
                      Post a Project
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/signup?role=DEVELOPER">
                    <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm transition-all cursor-pointer">
                      Become a Developer
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
