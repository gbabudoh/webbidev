'use client';

import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Button, Card, CardContent, CardHeader, CardTitle, Typography, Badge } from '@/components/ui';

export default function PricingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" size="lg" className="mb-6 bg-white/10 text-white border-white/20">
            Transparent Pricing
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
            Simple. Fair. Transparent.
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            No hidden fees. No surprise charges. No pay-to-play schemes.
            <br />
            <span className="text-cyan-400 font-semibold">Just honest pricing that works for everyone.</span>
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* For Developers */}
            <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-2">For Developers</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Keep more of what you earn</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    10-13%
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Platform commission</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">You keep 87-90% of earnings</p>
                </div>

                <div className="space-y-4 pt-6">
                  {[
                    'No subscription fees',
                    'Free profile creation',
                    'Unlimited proposals',
                    'No pay-to-play visibility',
                    'Direct client communication',
                    'Secure escrow payments',
                    'Fast payment processing',
                    'No hidden charges'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-6">
                    Start as Developer
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Clients - Featured */}
            <Card className="relative overflow-hidden border-2 border-blue-500 dark:border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500"></div>
              <div className="absolute top-4 right-4">
                <Badge variant="primary" size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 text-white shadow-lg mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-2">For Clients</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Post projects for free</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Free
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">To post and browse</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Only pay when you hire</p>
                </div>

                <div className="space-y-4 pt-6">
                  {[
                    'Unlimited project postings',
                    'Browse verified developers',
                    'Scope Bar guarantee',
                    'Milestone-based payments',
                    'Secure escrow protection',
                    'Direct developer communication',
                    'Dispute resolution support',
                    'No upfront costs'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 hover:from-blue-700 hover:via-cyan-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-6">
                    Start as Client
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Custom solutions for teams</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Custom
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Tailored pricing</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Volume discounts available</p>
                </div>

                <div className="space-y-4 pt-6">
                  {[
                    'Dedicated account manager',
                    'Custom contract terms',
                    'Priority support',
                    'Team collaboration tools',
                    'Advanced analytics',
                    'Custom integrations',
                    'SLA guarantees',
                    'Flexible payment terms'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="block pt-4">
                  <Button variant="outline" className="w-full border-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 py-6">
                    Contact Sales
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-20 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              Compare with competitors
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              See why Webbidev is the better choice
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-950 rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-600 dark:text-blue-400">Webbidev</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400">Competitor A</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400">Competitor B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { feature: 'Platform Fee', webbidev: '10-13%', compA: '20%', compB: '15-20%' },
                  { feature: 'Pay-to-Play', webbidev: 'No', compA: 'Yes', compB: 'Yes' },
                  { feature: 'Scope Guarantee', webbidev: 'Yes', compA: 'No', compB: 'No' },
                  { feature: 'Escrow Protection', webbidev: 'Yes', compA: 'Yes', compB: 'Yes' },
                  { feature: 'Subscription Required', webbidev: 'No', compA: 'Yes', compB: 'Optional' },
                  { feature: 'Specialized Focus', webbidev: 'Yes', compA: 'No', compB: 'No' },
                  { feature: 'Dispute Resolution', webbidev: 'Technical Review', compA: 'Mediation', compB: 'Mediation' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                        {row.webbidev}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.compA}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.compB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Everything you need to know about pricing
            </p>
          </div>

          <div className="space-y-4">
            {[
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
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-50 dark:bg-slate-900 rounded-xl p-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">{faq.q}</span>
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Join thousands of developers and clients building amazing projects.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-xl px-8 py-6 text-lg font-semibold">
                Create Free Account
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
