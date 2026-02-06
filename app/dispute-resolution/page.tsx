'use client';

import { motion } from 'framer-motion';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { 
  Scale, 
  MessageSquare, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Shield,
  ArrowRight,
  Mail,
  HelpCircle
} from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Direct Communication',
    description: 'Start by communicating directly with the other party. Many disputes can be resolved through open dialogue.',
    icon: MessageSquare,
    color: 'blue',
    tips: [
      'Clearly explain your concerns',
      'Listen to the other party\'s perspective',
      'Look for a mutually agreeable solution',
      'Document all communications'
    ]
  },
  {
    number: 2,
    title: 'Request Mediation',
    description: 'If direct communication doesn\'t resolve the issue, request mediation through our platform.',
    icon: Users,
    color: 'purple',
    tips: [
      'Submit a dispute request through your dashboard',
      'Provide all relevant documentation',
      'Explain the issue clearly and objectively',
      'Response within 24-48 hours'
    ]
  },
  {
    number: 3,
    title: 'Review Process',
    description: 'Our dispute resolution team will review all evidence and communications from both parties.',
    icon: FileText,
    color: 'cyan',
    tips: [
      'Both parties can submit evidence',
      'Review of project scope and milestones',
      'Assessment of delivered work',
      'Fair and impartial evaluation'
    ]
  },
  {
    number: 4,
    title: 'Resolution',
    description: 'Based on our review, we will make a fair determination regarding the dispute and any escrow funds.',
    icon: Scale,
    color: 'green',
    tips: [
      'Decision typically within 5-7 business days',
      'Escrow funds released based on outcome',
      'Written explanation of decision',
      'All decisions are final'
    ]
  }
];

const commonDisputes = [
  {
    title: 'Scope Creep',
    description: 'When work requested exceeds the original project scope without additional compensation.',
    resolution: 'We review the original project requirements and determine if additional work was outside scope.'
  },
  {
    title: 'Quality Issues',
    description: 'When delivered work does not meet the agreed-upon standards or requirements.',
    resolution: 'We compare deliverables against the project specifications and industry standards.'
  },
  {
    title: 'Delayed Delivery',
    description: 'When milestones or project completion are significantly delayed without valid reasons.',
    resolution: 'We review timelines, communications, and any documented delays or blockers.'
  },
  {
    title: 'Payment Disputes',
    description: 'Disagreements about milestone payments or final project payments.',
    resolution: 'We review milestone completion, deliverables, and approval documentation.'
  }
];

export default function DisputeResolutionPage() {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500 bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800',
    purple: 'from-purple-500 to-pink-500 bg-purple-100 dark:bg-purple-900/30 text-purple-600 border-purple-200 dark:border-purple-800',
    cyan: 'from-cyan-500 to-blue-500 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 border-cyan-200 dark:border-cyan-800',
    green: 'from-green-500 to-emerald-500 bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-800'
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-green-950/30" />
          <motion.div 
            className="absolute top-10 right-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-lg mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Fair & Transparent</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                Dispute Resolution
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
                We&apos;re committed to fair and transparent dispute resolution. Our process protects both clients and developers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg cursor-pointer flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="border-2 border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Steps */}
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Resolution Process
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We follow a structured process to ensure fair outcomes for all parties involved.
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = colorClasses[step.color].split(' ');
              
              return (
                <motion.div
                  key={step.number}
                  className="relative"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className={`h-1.5 bg-gradient-to-r ${colors[0]} ${colors[1]}`} />
                    <div className="p-6 lg:p-8">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Step Number & Icon */}
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[0]} ${colors[1]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="lg:hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-bold ${colors[4]}`}>Step {step.number}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="hidden lg:flex items-center gap-2 mb-2">
                            <span className={`text-sm font-bold ${colors[4]}`}>Step {step.number}</span>
                          </div>
                          <h3 className="hidden lg:block text-xl font-bold text-slate-900 dark:text-white mb-3">
                            {step.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {step.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {step.tips.map((tip) => (
                              <div key={tip} className="flex items-center gap-2 text-sm">
                                <CheckCircle className={`w-4 h-4 flex-shrink-0 ${colors[4]}`} />
                                <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex justify-center py-2">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Common Disputes */}
        <div className="bg-slate-50 dark:bg-slate-900/50 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Common Dispute Types
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Understanding common disputes can help you avoid them in your projects.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonDisputes.map((dispute, index) => (
                <motion.div
                  key={dispute.title}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <h3 className="font-bold text-slate-900 dark:text-white">{dispute.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {dispute.description}
                  </p>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      <span className="font-semibold">How we resolve: </span>
                      {dispute.resolution}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 lg:p-12 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <Shield className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Prevention is Better Than Resolution
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Follow these best practices to minimize the risk of disputes in your projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FileText, title: 'Clear Scope', description: 'Define project requirements and deliverables in detail before starting.' },
                { icon: MessageSquare, title: 'Regular Communication', description: 'Maintain open communication throughout the project.' },
                { icon: Clock, title: 'Milestone Tracking', description: 'Use milestones to break down work and track progress.' }
              ].map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <Icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="font-bold text-white mb-2">{tip.title}</h3>
                    <p className="text-sm text-white/80">{tip.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Contact CTA */}
        <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Need Help With a Dispute?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
              Our support team is here to help you resolve any issues. Contact us and we&apos;ll guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:disputes@webbidev.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                disputes@webbidev.com
              </a>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2">
                  Contact Form
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
