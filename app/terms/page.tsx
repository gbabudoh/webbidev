'use client';

import { motion } from 'framer-motion';
import PublicLayout from '@/components/layouts/PublicLayout';
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  Scale, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    icon: CheckCircle,
    color: 'green',
    content: `By accessing or using Webbidev's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.

These terms apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.`
  },
  {
    id: 'services',
    title: '2. Description of Services',
    icon: FileText,
    color: 'blue',
    content: `Webbidev is a platform that connects clients with software developers for freelance projects. Our services include:

• Project posting and management
• Developer profiles and portfolios
• Secure escrow payment processing
• Milestone-based project tracking
• Communication tools between clients and developers

We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.`
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    icon: Users,
    color: 'purple',
    content: `To use certain features of our platform, you must register for an account. When you register, you agree to:

• Provide accurate and complete information
• Maintain the security of your password
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use

We reserve the right to suspend or terminate accounts that violate these terms or for any other reason at our sole discretion.`
  },
  {
    id: 'payments',
    title: '4. Payments and Fees',
    icon: CreditCard,
    color: 'cyan',
    content: `Our platform uses an escrow system to protect both clients and developers:

• Clients fund milestones before work begins
• Funds are held securely in escrow
• Developers receive payment upon milestone approval
• Platform fees are deducted from developer earnings (10-13%)

All payments are processed through secure third-party payment providers. We are not responsible for any fees charged by these providers or your financial institution.`
  },
  {
    id: 'conduct',
    title: '5. User Conduct',
    icon: Shield,
    color: 'orange',
    content: `You agree not to:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Submit false or misleading information
• Harass, abuse, or harm other users
• Attempt to circumvent the platform's payment system
• Use the platform for any illegal or unauthorized purpose
• Interfere with the proper working of the service

Violation of these rules may result in immediate account termination.`
  },
  {
    id: 'disputes',
    title: '6. Dispute Resolution',
    icon: Scale,
    color: 'pink',
    content: `In the event of a dispute between clients and developers:

• Both parties should first attempt to resolve the issue directly
• If resolution is not possible, either party may request mediation
• Our support team will review the case and make a fair determination
• Decisions regarding escrow fund release are final

We encourage open communication and good faith efforts to resolve all disputes amicably.`
  },
  {
    id: 'liability',
    title: '7. Limitation of Liability',
    icon: AlertTriangle,
    color: 'red',
    content: `To the fullest extent permitted by law:

• Webbidev is not liable for any indirect, incidental, or consequential damages
• We do not guarantee the quality of work performed by developers
• We are not responsible for disputes between users
• Our total liability shall not exceed the fees paid to us in the past 12 months

The platform is provided "as is" without warranties of any kind.`
  }
];

export default function TermsPage() {
  const colorClasses: Record<string, string> = {
    green: 'from-green-500 to-emerald-500 bg-green-100 dark:bg-green-900/30 text-green-600',
    blue: 'from-blue-500 to-cyan-500 bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    purple: 'from-purple-500 to-pink-500 bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    cyan: 'from-cyan-500 to-blue-500 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600',
    orange: 'from-orange-500 to-red-500 bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    pink: 'from-pink-500 to-rose-500 bg-pink-100 dark:bg-pink-900/30 text-pink-600',
    red: 'from-red-500 to-orange-500 bg-red-100 dark:bg-red-900/30 text-red-600'
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-purple-950/30" />
          <motion.div 
            className="absolute top-10 right-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
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
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Legal</span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                Terms of Service
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                Please read these terms carefully before using our platform. By using Webbidev, you agree to these terms.
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
            className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Questions About Our Terms?</h3>
            <p className="text-white/80 mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <a
              href="mailto:legal@webbidev.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              legal@webbidev.com
            </a>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
