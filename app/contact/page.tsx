'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Input, Textarea, Button } from '@/components/ui';
import { 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle,
  Sparkles,
  HelpCircle,
  CreditCard,
  Settings,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@webbidev.com', href: 'mailto:support@webbidev.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, label: 'Address', value: 'San Francisco, CA', href: null }
  ];

  const commonQuestions = [
    { icon: HelpCircle, title: 'Account Issues', description: 'Having trouble logging in or accessing your account?' },
    { icon: CreditCard, title: 'Payment Questions', description: 'Questions about payments, refunds, or billing?' },
    { icon: Settings, title: 'Technical Support', description: 'Need help with the platform or have a technical issue?' }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-cyan-50 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-cyan-950/30" />
          <motion.div 
            className="absolute top-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
          
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  We&apos;re Here to Help
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Contact Us
              </motion.h1>
              
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Sidebar */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Get in Touch Card */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Get in Touch</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">We&apos;re here to help</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    return (
                      <div key={info.label} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{info.label}</p>
                          {info.href ? (
                            <a href={info.href} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-semibold text-slate-900 dark:text-white">{info.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Response Time</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Typically within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Common Questions Card */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">Common Questions</h3>
                
                <div className="space-y-4">
                  {commonQuestions.map((question) => {
                    const Icon = question.icon;
                    return (
                      <div key={question.title} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{question.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{question.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send us a Message</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Fill out the form and we&apos;ll get back to you</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8">
                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-700 dark:text-green-400 font-medium">
                        Thank you for your message! We&apos;ll get back to you soon.
                      </p>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
                    >
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        Something went wrong. Please try again or email us directly.
                      </p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={errors.name}
                        required
                        disabled={isSubmitting}
                      />

                      <Input
                        label="Email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        error={errors.email}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <Input
                      label="Subject"
                      type="text"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      error={errors.subject}
                      required
                      disabled={isSubmitting}
                    />

                    <Textarea
                      label="Message"
                      placeholder="Tell us more about your question or concern..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      error={errors.message}
                      required
                      disabled={isSubmitting}
                      rows={6}
                      helperText="Please provide as much detail as possible so we can help you better."
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
