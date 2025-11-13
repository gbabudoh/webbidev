'use client';

import { useState } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Button, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

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
      // In a real application, you would send this to your API
      // For now, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // TODO: Implement actual contact form submission
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Hero Section */}
        <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <Typography variant="h1" size="4xl" weight="bold" className="mb-4">
                Contact Us
              </Typography>
              <Typography variant="p" size="xl" color="muted" className="max-w-3xl mx-auto">
                Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    We're here to help. Reach out to us through any of these channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
                      Email
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      <a
                        href="mailto:support@webbidev.com"
                        className="text-foreground hover:underline"
                      >
                        support@webbidev.com
                      </a>
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
                      Response Time
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      We typically respond within 24-48 hours during business days.
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
                      Office Hours
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      Monday - Friday: 9:00 AM - 6:00 PM (EST)
                    </Typography>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-1">
                      Account Issues
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      Having trouble logging in or accessing your account? We can help.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-1">
                      Payment Questions
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      Questions about payments, refunds, or billing? We're here to assist.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-1">
                      Technical Support
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      Need help with the platform or have a technical issue? Let us know.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <Typography variant="p" className="text-green-600 dark:text-green-400">
                        ✓ Thank you for your message! We'll get back to you soon.
                      </Typography>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <Typography variant="p" className="text-red-600 dark:text-red-400">
                        ✗ Something went wrong. Please try again or email us directly.
                      </Typography>
                    </div>
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
                      rows={8}
                      helperText="Please provide as much detail as possible so we can help you better."
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

