'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({ essential: true, analytics: true, marketing: true });
    localStorage.setItem('cookieConsent', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    setPreferences({ essential: true, analytics: false, marketing: false });
    localStorage.setItem('cookieConsent', JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Cookie Preferences</h3>
                  <p className="text-xs text-white/80">We value your privacy</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {!showPreferences ? (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    <Link href="/privacy" className="text-blue-600 hover:underline ml-1 cursor-pointer">
                      Learn more
                    </Link>
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAcceptAll}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accept All
                    </button>
                    <button
                      onClick={handleRejectNonEssential}
                      className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="w-full py-2 px-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Preferences
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {/* Essential Cookies */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Essential</p>
                          <p className="text-xs text-slate-500">Required for site functionality</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                      onClick={() => togglePreference('analytics')}
                    >
                      <div className="flex items-center gap-3">
                        <Cookie className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Analytics</p>
                          <p className="text-xs text-slate-500">Help us improve our site</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.analytics ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${preferences.analytics ? 'ml-auto' : 'ml-0'}`} />
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                      onClick={() => togglePreference('marketing')}
                    >
                      <div className="flex items-center gap-3">
                        <Cookie className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Marketing</p>
                          <p className="text-xs text-slate-500">Personalized advertisements</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${preferences.marketing ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${preferences.marketing ? 'ml-auto' : 'ml-0'}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
