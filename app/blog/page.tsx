'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Button, Badge } from '@/components/ui';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Calendar,
  Tag,
  Search,
  Mail,
  ChevronRight
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

// Sample blog data
const featuredPost = {
  id: 1,
  title: 'The Future of Freelancing: How AI is Transforming the Developer Marketplace',
  excerpt: 'Explore how artificial intelligence is reshaping the way developers find work and clients discover talent. From smart matching algorithms to automated project scoping.',
  category: 'Industry Trends',
  author: 'Sarah Chen',
  authorRole: 'Head of Product',
  date: 'Feb 5, 2026',
  readTime: '8 min read',
  image: '/blog/featured.jpg'
};

const blogPosts = [
  {
    id: 2,
    title: 'How to Write a Winning Project Proposal',
    excerpt: 'Learn the secrets to crafting project proposals that get you hired. Tips from top-rated developers on the platform.',
    category: 'Developer Tips',
    author: 'Marcus Johnson',
    date: 'Feb 3, 2026',
    readTime: '5 min read',
    color: 'blue'
  },
  {
    id: 3,
    title: 'Understanding Milestone-Based Payments',
    excerpt: 'A complete guide to our escrow system and how milestone payments protect both clients and developers.',
    category: 'Platform Guide',
    author: 'Emily Rodriguez',
    date: 'Feb 1, 2026',
    readTime: '4 min read',
    color: 'purple'
  },
  {
    id: 4,
    title: 'Top 10 Skills in Demand for 2026',
    excerpt: 'Discover which programming languages and frameworks are most requested by clients this year.',
    category: 'Industry Trends',
    author: 'David Kim',
    date: 'Jan 28, 2026',
    readTime: '6 min read',
    color: 'green'
  },
  {
    id: 5,
    title: 'Building Your Developer Portfolio',
    excerpt: 'Tips for showcasing your work and attracting high-quality clients to your profile.',
    category: 'Developer Tips',
    author: 'Lisa Wang',
    date: 'Jan 25, 2026',
    readTime: '7 min read',
    color: 'orange'
  },
  {
    id: 6,
    title: 'Client Success Story: From Idea to Launch',
    excerpt: 'How one startup used Webbidev to build their MVP in just 6 weeks with a dream team of developers.',
    category: 'Success Stories',
    author: 'James Miller',
    date: 'Jan 22, 2026',
    readTime: '5 min read',
    color: 'cyan'
  },
  {
    id: 7,
    title: 'Remote Collaboration Best Practices',
    excerpt: 'Essential tips for effective communication and project management when working with distributed teams.',
    category: 'Platform Guide',
    author: 'Anna Schmidt',
    date: 'Jan 19, 2026',
    readTime: '6 min read',
    color: 'pink'
  }
];

const categories = [
  { name: 'All Posts', count: 24 },
  { name: 'Developer Tips', count: 8 },
  { name: 'Platform Guide', count: 6 },
  { name: 'Industry Trends', count: 5 },
  { name: 'Success Stories', count: 3 },
  { name: 'Company News', count: 2 }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [email, setEmail] = useState('');

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    cyan: 'from-cyan-500 to-blue-500',
    pink: 'from-pink-500 to-rose-500'
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30" />
          <motion.div 
            className="absolute top-10 right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
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
                <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Insights & Resources
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Webbidev Blog
              </motion.h1>
              
              <motion.p 
                className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Tips, tricks, and insights for developers and clients navigating the freelance marketplace.
              </motion.p>

              {/* Search Bar */}
              <motion.div 
                className="max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.aside 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Categories */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 sticky top-24">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-500" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        selectedCategory === category.name
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedCategory === category.name
                          ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Trending
                </h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="flex items-start gap-3 group cursor-pointer">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center text-xs font-bold text-orange-600">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* Blog Posts */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              <motion.article 
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 lg:p-10 mb-10 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Background Effects */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.3),transparent_50%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.2),transparent_50%)]" />
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                    <Badge className="bg-white/10 text-white/80 border-white/20">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-white/70 mb-6 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-6 py-2.5 font-semibold backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 group-hover:bg-purple-500 group-hover:border-purple-500">
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.article>

              {/* Post Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {blogPosts.map((post) => (
                  <motion.article 
                    key={post.id}
                    variants={fadeInUp}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  >
                    {/* Color Bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${colorClasses[post.color]}`} />
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colorClasses[post.color]}`} />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{post.author}</span>
                        </div>
                        <span className="text-xs text-slate-400">{post.date}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {/* Load More */}
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button variant="outline" className="border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3 rounded-xl font-semibold cursor-pointer">
                  Load More Articles
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Newsletter Section */}
          <motion.section 
            className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-10 lg:p-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                <Mail className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Stay Updated</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Subscribe to Our Newsletter
              </h2>
              
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Get the latest articles, tips, and insights delivered directly to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none"
                />
                <Button className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 rounded-xl font-semibold shadow-lg cursor-pointer flex items-center justify-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-white/60 mt-4">
                No spam, unsubscribe anytime.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </PublicLayout>
  );
}
