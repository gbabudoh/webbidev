'use client';

import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Link from 'next/link';
import { 
  FileText, 
  MessageSquare, 
  Layout, 
  ChevronRight,
  Plus,
  ArrowLeft,
  Clock,
  DollarSign,
  CheckCircle,
  Sparkles,
  HelpCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function UserBucket() {
  const invoices = [
    {
      id: 'INV-001',
      title: 'Fullstack Development - Milestone 1',
      from: 'DevBucket_#9201',
      dueIn: '2 days',
      amount: '$1,200.00'
    }
  ];

  const projects = [
    {
      id: 1,
      name: 'AI Integrations Suite',
      status: 'ACTIVE',
      progress: 65,
      nextMilestone: 'Review'
    },
    {
      id: 2,
      name: 'E-commerce Platform',
      status: 'ACTIVE',
      progress: 45,
      nextMilestone: 'Design Approval'
    }
  ];

  const supportTeam = [
    { id: 1, name: 'Sarah Johnson', role: 'Project Manager' },
    { id: 2, name: 'Mike Chen', role: 'Technical Lead' }
  ];

  return (
    <DashboardLayout showFooter={false}>
      <div className="space-y-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/client/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-8 transition-colors cursor-pointer group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
          </motion.div>
          
          {/* Header */}
          <motion.header 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 mb-10 shadow-2xl shadow-slate-400/20 border border-white/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.15),transparent_50%)]" />
            </div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Client Hub</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">userBucket</h1>
                <p className="text-slate-600">Manage your projects and collaborate with developers.</p>
              </div>
              <Link href="/client/post">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:scale-105 cursor-pointer flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Project
                </Button>
              </Link>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content: Projects & Invoices */}
            <motion.div 
              className="lg:col-span-3 space-y-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Pending Invoices */}
              <motion.section variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Pending Invoices</h2>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">{invoices.length}</Badge>
                </div>
                
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Left Accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500" />
                      
                      <div className="p-6 pl-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                            INV
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1">{invoice.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>From: {invoice.from}</span>
                              <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <Clock className="w-4 h-4" />
                                Due in {invoice.dueIn}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">{invoice.amount}</p>
                          </div>
                          <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl px-6 py-2.5 font-semibold shadow-lg cursor-pointer flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Accept & Pay
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Project Progress */}
              <motion.section variants={fadeInUp}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Layout className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Your Projects</h2>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{projects.length}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h4>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold">
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full" 
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Progress</span>
                          <span className="font-bold text-slate-900">{project.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-500">
                          Next: <span className="text-slate-700">{project.nextMilestone}</span>
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Stats Row */}
              <motion.section variants={fadeInUp}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: DollarSign, label: 'Total Invested', value: '$12,400', gradient: 'from-emerald-500 to-green-500', bg: 'from-emerald-50 to-green-50' },
                    { icon: TrendingUp, label: 'Active Projects', value: '2', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' },
                    { icon: CheckCircle, label: 'Completed', value: '5', gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50' }
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border border-white/50`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            </motion.div>

            {/* Right Panel: Support & Chat */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Support Card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Direct Support</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Need help with a project or payment?</p>
                    <Button variant="outline" className="w-full border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl py-3 font-semibold cursor-pointer transition-all">
                      Open Support Ticket
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Your Team</h4>
                    <div className="space-y-3">
                      {supportTeam.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Team Activity</span>
                </div>
                <p className="text-3xl font-bold mb-1">12</p>
                <p className="text-sm text-white/80">Messages this week</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
