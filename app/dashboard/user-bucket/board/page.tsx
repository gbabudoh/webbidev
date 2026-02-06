'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Layout, 
  Search, 
  Filter,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Button, Card, CardContent, Badge, Typography } from '@/components/ui';
import Link from 'next/link';

export default function UserBucketBoard() {
  const projects = [
    { id: 1, title: 'AI Platform Design', status: 'In Progress', progress: 65, team: 'DevBucket_#1' },
    { id: 2, title: 'E-commerce API', status: 'Review', progress: 90, team: 'DevBucket_#2' }
  ];

  return (
    <DashboardLayout showFooter={false}>
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/user-bucket" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Bucket
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 font-bold px-3">
              Live updates active
            </Badge>
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-10 bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-400/20 border border-white/40">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <Typography variant="h1" size="4xl" weight="black" className="text-slate-900 mb-2">
              userBucket Board
            </Typography>
            <Typography variant="p" className="text-slate-600 font-medium max-w-lg">
              Monitor project milestones, progress, and team collaboration in real-time.
            </Typography>
          </div>
          <div className="relative z-10">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 h-14 rounded-2xl flex items-center gap-3 font-bold shadow-xl active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
              Configure Board
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Layout className="w-7 h-7 text-blue-500" />
                Active Milestones
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-xl border border-slate-200 dark:border-slate-800">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl border border-slate-200 dark:border-slate-800">
                  <Search className="w-4 h-4 mr-2" /> Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="border-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner">
                          <CheckCircle2 className="w-7 h-7 text-indigo-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{project.team}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1.5 font-bold">
                        {project.status}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-500">Overall Progress</span>
                        <span className="text-slate-900 dark:text-white">{project.progress}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Next Milestone: Review</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 font-black flex items-center gap-2 px-0 hover:bg-transparent">
                        View Details <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <aside className="space-y-8">
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Collaborators</h2>
              <Card className="border-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm">
                <CardContent className="p-8 space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                          DV
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">Developer {i}</p>
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-slate-400 group-hover:text-blue-600">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-2xl font-bold py-3 text-slate-600 border-slate-200 dark:border-slate-800 hover:bg-slate-50">
                    Invite Collaborator
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6" />
                <span className="font-bold uppercase tracking-widest text-xs">Team Performance</span>
              </div>
              <p className="text-4xl font-black mb-1">98%</p>
              <p className="text-sm text-blue-100 font-medium">Agreement fulfillment</p>
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter opacity-70">
                <span>Updated 2m ago</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white opacity-40" />
                  <div className="w-1 h-1 rounded-full bg-white opacity-20" />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
