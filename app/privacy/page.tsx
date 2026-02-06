'use client';

import { motion } from 'framer-motion';
import PublicLayout from '@/components/layouts/PublicLayout';
import { 
  Shield, 
  Eye, 
  Database, 
  Share2, 
  Lock,
  Cookie,
  Bell,
  Clock,
  Mail,
  Globe
} from 'lucide-react';

const sections = [
  {
    id: 'collection',
    title: '1. Information We Collect',
    icon: Database,
    color: 'blue',
    content: `We collect information you provide directly to us, including:

• Account information (name, email, password)
• Profile information (bio, skills, portfolio)
• Payment information (processed securely by third-party providers)
• Communications between users on our platform
• Project details and deliverables

We also automatically collect certain information when you use our services, including your IP address, browser type, operating system, and usage data.`
  },
  {
    id: 'usage',
    title: '2. How We Use Your Information',
    icon: Eye,
    color: 'purple',
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related information
• Send technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions
• Personalize and improve your experience on our platform`
  },
  {
    id: 'sharing',
    title: '3. Information Sharing',
    icon: Share2,
    color: 'cyan',
    content: `We may share your information in the following circumstances:

• With other users as part of the platform's functionality (e.g., profile information)
• With service providers who perform services on our behalf
• In response to legal requests or to protect our rights
• In connection with a merger, acquisition, or sale of assets
• With your consent or at your direction

We do not sell your personal information to third parties.`
  },
  {
    id: 'security',
    title: '4. Data Security',
    icon: Lock,
    color: 'green',
    content: `We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, including:

• Encryption of data in transit and at rest
• Regular security assessments and audits
• Access controls and authentication requirements
• Secure payment processing through trusted providers

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`
  },
  {
    id: 'cookies',
    title: '5. Cookies and Tracking',
    icon: Cookie,
    color: 'orange',
    content: `We use cookies and similar tracking technologies to:

• Remember your preferences and settings
• Understand how you interact with our services
• Provide personalized content and advertisements
• Analyze traffic and usage patterns

You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our services.`
  },
  {
    id: 'rights',
    title: '6. Your Rights and Choices',
    icon: Shield,
    color: 'pink',
    content: `Depending on your location, you may have certain rights regarding your personal information:

• Access: Request a copy of your personal data
• Correction: Request correction of inaccurate data
• Deletion: Request deletion of your personal data
• Portability: Request transfer of your data
• Opt-out: Unsubscribe from marketing communications

To exercise these rights, please contact us at privacy@webbidev.com.`
  },
  {
    id: 'international',
    title: '7. International Transfers',
    icon: Globe,
    color: 'indigo',
    content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.

By using our services, you consent to the transfer of your information to countries outside of your residence, which may have different data protection rules.`
  },
  {
    id: 'updates',
    title: '8. Changes to This Policy',
    icon: Bell,
    color: 'amber',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by:

• Posting the new Privacy Policy on this page
• Updating the "Last updated" date at the top
• Sending you an email notification for significant changes

We encourage you to review this Privacy Policy periodically for any changes.`
  }
];

export default function PrivacyPage() {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500 bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    purple: 'from-purple-500 to-pink-500 bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    cyan: 'from-cyan-500 to-blue-500 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600',
    green: 'from-green-500 to-emerald-500 bg-green-100 dark:bg-green-900/30 text-green-600',
    orange: 'from-orange-500 to-red-500 bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    pink: 'from-pink-500 to-rose-500 bg-pink-100 dark:bg-pink-900/30 text-pink-600',
    indigo: 'from-indigo-500 to-purple-500 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600',
    amber: 'from-amber-500 to-orange-500 bg-amber-100 dark:bg-amber-900/30 text-amber-600'
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-blue-50 dark:from-purple-950/30 dark:via-slate-950 dark:to-blue-950/30" />
          <motion.div 
            className="absolute top-10 left-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
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
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Your Privacy Matters</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: February 5, 2026</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Table of Contents */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-4 mb-12">
          <motion.div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Content Sections */}
        <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const colors = colorClasses[section.color].split(' ');
              
              return (
                <motion.section
                  key={section.id}
                  id={section.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`h-1 bg-gradient-to-r ${colors[0]} ${colors[1]}`} />
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${colors[2]} ${colors[3]} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors[4]}`} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-1.5">
                        {section.title}
                      </h2>
                    </div>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>

          {/* Contact Section */}
          <motion.div 
            className="mt-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Privacy Questions?</h3>
            <p className="text-white/80 mb-6">
              If you have any questions about our Privacy Policy, please contact our privacy team.
            </p>
            <a
              href="mailto:privacy@webbidev.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              privacy@webbidev.com
            </a>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
