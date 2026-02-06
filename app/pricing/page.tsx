'use client';

import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Button, Badge } from '@/components/ui';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Code2, 
  Briefcase, 
  Building2, 
  Check, 
  ArrowRight, 
  Sparkles,
  Shield,
  Zap,
  Users,
  ChevronDown,
  Star,
  Trophy,
  Target
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

export default function PricingPage() {
  const pricingPlans = [
    {
      name: 'For Developers',
      description: 'Keep more of what you earn',
      price: '10-13%',
      priceSubtext: 'Platform commission',
      note: 'You keep 87-90% of earnings',
      icon: Code2,
      gradient: 'from-blue-500 to-cyan-500',
      buttonGradient: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
      features: [
        'No subscription fees',
        'Free profile creation',
        'Unlimited proposals',
        'No pay-to-play visibility',
        'Direct client communication',
        'Secure escrow payments',
        'Fast payment processing',
        'No hidden charges'
      ],
      cta: 'Start as Developer',
      href: '/signup?role=DEVELOPER',
      featured: false
    },
    {
      name: 'For Clients',
      description: 'Post projects for free',
      price: 'Free',
      priceSubtext: 'To post and browse',
      note: 'Only pay when you hire',
      icon: Briefcase,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      buttonGradient: 'from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700',
      features: [
        'Unlimited project postings',
        'Browse verified developers',
        'Scope Bar guarantee',
        'Milestone-based payments',
        'Secure escrow protection',
        'Direct developer communication',
        'Dispute resolution support',
        'No upfront costs'
      ],
      cta: 'Start as Client',
      href: '/signup?role=CLIENT',
      featured: true
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for teams',
      price: 'Custom',
      priceSubtext: 'Tailored pricing',
      note: 'Volume discounts available',
      icon: Building2,
      gradient: 'from-purple-500 to-pink-500',
      buttonGradient: '',
      features: [
        'Dedicated account manager',
        'Custom contract terms',
        'Priority support',
        'Team collaboration tools',
        'Advanced analytics',
        'Custom integrations',
        'SLA guarantees',
        'Flexible payment terms'
      ],
      cta: 'Contact Sales',
      href: '/contact',
      featured: false,
      outline: true
    }
  ];

  const comparisonData = [
    { feature: 'Platform Fee', webbidev: '10-13%', compA: '20%', compB: '15-20%', highlight: true },
    { feature: 'Pay-to-Play', webbidev: 'No', compA: 'Yes', compB: 'Yes', highlight: true },
    { feature: 'Scope Guarantee', webbidev: 'Yes', compA: 'No', compB: 'No', highlight: true },
    { feature: 'Escrow Protection', webbidev: 'Yes', compA: 'Yes', compB: 'Yes', highlight: false },
    { feature: 'Subscription Required', webbidev: 'No', compA: 'Yes', compB: 'Optional', highlight: true },
    { feature: 'Specialized Focus', webbidev: 'Yes', compA: 'No', compB: 'No', highlight: false },
    { feature: 'Dispute Resolution', webbidev: 'Technical Review', compA: 'Mediation', compB: 'Mediation', highlight: false }
  ];

  const faqs = [
    {
      q: 'How is the 10-13% commission calculated?',
      a: 'The commission is calculated on the total project value. The exact rate depends on the project size and complexity, ranging from 10% for larger projects to 13% for smaller ones.'
    },
    {
      q: 'Are there any hidden fees?',
      a: 'No. The commission rate is the only fee. There are no subscription fees, listing fees, or pay-to-play charges. What you see is what you pay.'
    },
    {
      q: 'When do I pay the commission?',
      a: 'For clients, the commission is included in the project budget. For developers, the commission is deducted when payments are released from escrow.'
    },
    {
      q: 'What is the Scope Bar guarantee?',
      a: 'Every project has defined milestones with clear "Definition of Done" criteria. If a milestone doesn\'t meet the agreed scope, you get a full refund for that milestone.'
    },
    {
      q: 'Can I negotiate the commission rate?',
      a: 'For enterprise clients with high-volume projects, we offer custom pricing. Contact our sales team to discuss your specific needs.'
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.15),transparent_50%)]" />
            <motion.div 
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Transparent Pricing</span>
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                Simple. Fair.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transparent.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12">
                No hidden fees. No surprise charges. No pay-to-play schemes.
                <br />
                <span className="text-cyan-400 font-semibold">Just honest pricing that works for everyone.</span>
              </p>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { icon: Shield, label: '100% Secure' },
                  { icon: Zap, label: 'Instant Payouts' },
                  { icon: Users, label: '10K+ Users' },
                ].map((item) => (
                  <div 
                    key={item.label}
                    className="flex items-center gap-2 text-white/60"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
              <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 70C1200 65 1320 55 1380 50L1440 45V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" className="dark:fill-slate-950"/>
            </svg>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative py-20 -mt-1 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  className={cn(
                    "relative group",
                    plan.featured && "lg:-mt-8 lg:mb-8 z-10"
                  )}
                >
                  {/* Glow Effect */}
                  <div className={cn(
                    "absolute -inset-1 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500",
                    `bg-gradient-to-r ${plan.gradient}`
                  )} />
                  
                  <div className={cn(
                    "relative h-full bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300",
                    plan.featured 
                      ? "border-blue-500 shadow-2xl shadow-blue-500/20" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-xl"
                  )}>
                    {/* Top Gradient Bar */}
                    <div className={cn("h-1.5 bg-gradient-to-r", plan.gradient)} />
                    
                    {/* Featured Badge */}
                    {plan.featured && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Icon */}
                      <div className={cn(
                        "inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg mb-6 bg-gradient-to-br",
                        plan.gradient
                      )}>
                        <plan.icon className="w-7 h-7" />
                      </div>

                      {/* Header */}
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                      <p className="text-slate-600 mb-6">{plan.description}</p>

                      {/* Price */}
                      <div className="mb-8">
                        <div className={cn(
                          "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r mb-2",
                          plan.gradient
                        )}>
                          {plan.price}
                        </div>
                        <p className="text-slate-600 font-medium">{plan.priceSubtext}</p>
                        <p className="text-sm text-slate-500 mt-1">{plan.note}</p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className={cn(
                              "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-gradient-to-br",
                              plan.gradient
                            )}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link href={plan.href} className="block">
                        <Button 
                          className={cn(
                            "w-full py-6 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer",
                            plan.outline 
                              ? "border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300" 
                              : `bg-gradient-to-r ${plan.buttonGradient} text-white shadow-lg hover:shadow-xl`
                          )}
                        >
                          {plan.cta}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="relative py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                <Trophy className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Compare with Competitors
              </h2>
              <p className="text-xl text-slate-600">
                See why Webbidev is the better choice
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="px-8 py-6 text-left text-sm font-bold text-slate-900">Feature</th>
                      <th className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-bold text-blue-600">Webbidev</span>
                        </div>
                      </th>
                      <th className="px-8 py-6 text-center text-sm font-bold text-slate-400">Competitor A</th>
                      <th className="px-8 py-6 text-center text-sm font-bold text-slate-400">Competitor B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 text-sm font-medium text-slate-900">{row.feature}</td>
                        <td className="px-8 py-5 text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold",
                            row.highlight 
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" 
                              : "bg-blue-100 text-blue-700"
                          )}>
                            {row.webbidev}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center text-sm text-slate-500">{row.compA}</td>
                        <td className="px-8 py-5 text-center text-sm text-slate-500">{row.compB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Everything you need to know about pricing
              </p>
            </motion.div>

            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {faqs.map((faq, i) => (
                <motion.details 
                  key={i} 
                  variants={fadeInUp}
                  className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="text-lg font-semibold text-slate-900 pr-4">{faq.q}</span>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-open:bg-blue-500 group-open:border-blue-500 transition-all">
                      <ChevronDown className="w-5 h-5 text-slate-600 group-open:text-white group-open:rotate-180 transition-all" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                Join thousands of developers and clients building amazing projects together.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-6 rounded-xl text-lg font-semibold shadow-xl shadow-blue-500/25 transition-all hover:scale-105 cursor-pointer">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 px-10 py-6 rounded-xl text-lg font-semibold transition-all hover:scale-105 cursor-pointer">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </PublicLayout>
  );
}
