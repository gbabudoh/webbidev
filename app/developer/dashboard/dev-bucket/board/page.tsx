'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  User,
  Layout,
  Search,
  Layers,
  Trash2,
  List
} from 'lucide-react';
import { Button, Badge, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

const INITIAL_COLUMNS = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'slate',
    gradient: 'from-slate-400 to-slate-500',
    tasks: [
      { id: 'T-1', title: 'API Integration - Auth Layer', priority: 'High', date: 'Feb 12', comments: 4, type: 'Feature' },
      { id: 'T-2', title: 'Database Schema Migration', priority: 'Medium', date: 'Feb 15', comments: 2, type: 'Backend' },
      { id: 'T-3', title: 'Unit Tests for Payments', priority: 'Low', date: 'Feb 18', comments: 0, type: 'Testing' }
    ]
  },
  {
    id: 'progress',
    title: 'In Progress',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    tasks: [
      { id: 'T-4', title: 'Frontend Component Refactor', priority: 'High', date: 'Feb 10', comments: 8, type: 'UI/UX' },
      { id: 'T-5', title: 'Mobile Responsive Audit', priority: 'Medium', date: 'Feb 11', comments: 5, type: 'Review' }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    tasks: [
      { id: 'T-6', title: 'Documentation Update', priority: 'Low', date: 'Feb 08', comments: 1, type: 'Ops' }
    ]
  },
  {
    id: 'done',
    title: 'Completed',
    color: 'emerald',
    gradient: 'from-emerald-400 to-teal-600',
    tasks: [
      { id: 'T-7', title: 'Project Initialization', priority: 'Low', date: 'Jan 30', comments: 12, type: 'Setup' }
    ]
  }
];

export default function DevBucketBoard() {
  const [boardData, setBoardData] = useState(INITIAL_COLUMNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleAddTask = (columnId: string = 'backlog') => {
    const newTask = {
      id: `T-${Math.floor(Math.random() * 1000) + 10}`,
      title: 'New Engineering Task',
      priority: 'Medium',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      comments: 0,
      type: 'Task'
    };

    setBoardData(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [newTask, ...col.tasks] }
        : col
    ));
  };

  const handleRemoveTask = (taskId: string) => {
    setBoardData(prev => prev.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    })));
  };

  const filteredColumns = useMemo(() => {
    return boardData.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             task.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || task.priority === activeFilter || task.type === activeFilter;
        return matchesSearch && matchesFilter;
      })
    }));
  }, [boardData, searchQuery, activeFilter]);

  const allTasks = useMemo(() => {
    return filteredColumns.flatMap(col => col.tasks.map(t => ({ ...t, status: col.title, color: col.color })));
  }, [filteredColumns]);

  return (
    <>
      <div className="space-y-10 pb-20">
        {/* Advanced Glassmorphic Header */}
        <header className="relative p-10 lg:p-14 overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] shadow-2xl shadow-slate-400/20 border border-white/40">
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 contrast-150 brightness-110" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Sprint #14</span>
                </div>
                <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Board Active</span>
                </div>
              </div>
              <Typography variant="h1" size="4xl" weight="black" className="text-slate-900 mb-2 tracking-tight lg:text-5xl">
                devBucket <span className="text-blue-600">Board</span>
              </Typography>
              <Typography variant="p" className="text-slate-700 font-medium max-w-lg leading-relaxed">
                High-fidelity tracking for elite development cycles. Precision focus on every milestone.
              </Typography>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex -space-x-3 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shadow-xl overflow-hidden ring-4 ring-white/50">
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => handleAddTask()}
                className="bg-slate-900 text-white hover:bg-slate-800 h-16 px-8 rounded-2xl flex items-center gap-3 font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all border-none"
              >
                <Plus className="w-6 h-6" />
                Add Task
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Board Controls & Stats Row */}
        <section className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 flex flex-wrap gap-4 items-center p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-md dark:shadow-blue-900/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex items-center gap-6 px-2">
              <div className="flex items-center gap-3 group/stat cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completion</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white leading-none">84%</p>
                </div>
              </div>
              <div className="w-[1px] h-10 bg-slate-100 dark:bg-slate-800" />
              <div className="flex items-center gap-3 group/stat cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Lead Time</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white leading-none">2.4d</p>
                </div>
              </div>
              <div className="w-[1px] h-10 bg-slate-100 dark:bg-slate-800" />
              <div className="flex items-center gap-3 group/stat cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Blockers</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white leading-none">None</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-inner">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white dark:bg-slate-900 pl-11 pr-10 py-3 rounded-xl text-xs font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500/50 outline-none w-48 lg:w-64 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </button>
                )}
              </div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
              <div className="flex items-center gap-1">
                {['All', 'High', 'UI/UX'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                      activeFilter === filter 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2",
                viewMode === 'kanban' 
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/50" 
                  : "text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
              )}
            >
              <Layout className="w-4 h-4" />
              Kanban
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2",
                viewMode === 'list' 
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/50" 
                  : "text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
              )}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </section>

        {/* View Layout Container */}
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div 
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[700px]"
            >
              {filteredColumns.map((column, colIndex) => (
                <div key={column.id} className="flex flex-col gap-8">
                  {/* Column Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: colIndex * 0.1 }}
                    className="flex items-center justify-between px-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full bg-${column.color}-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]`} />
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{column.title}</h3>
                      <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] tracking-widest">
                        {column.tasks.length}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddTask(column.id)}
                      className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </motion.div>

                  {/* Tasks Container */}
                  <div className="flex flex-col gap-5 px-1">
                    <AnimatePresence>
                      {column.tasks.map((task, taskIndex) => (
                        <motion.div
                          layout
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ 
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                            delay: taskIndex * 0.05 
                          }}
                          drag
                          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                          dragElastic={0.1}
                          whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                          onMouseEnter={() => setHoveredTask(task.id)}
                          onMouseLeave={() => setHoveredTask(null)}
                          className={cn(
                            "group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border transition-all duration-500 cursor-grab active:cursor-grabbing overflow-hidden",
                            hoveredTask === task.id 
                              ? "border-blue-500/50 shadow-2xl shadow-blue-500/10 -translate-y-2" 
                              : "border-slate-100 dark:border-slate-800 shadow-sm"
                          )}
                        >
                          {/* Premium Accent Corner */}
                          <div className={cn(
                            "absolute top-0 right-0 w-16 h-16 bg-gradient-to-br transition-opacity duration-500 rounded-bl-[2rem]",
                            column.gradient,
                            hoveredTask === task.id ? "opacity-20" : "opacity-0"
                          )} />
                          
                          <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-300 group-hover:text-blue-500 transition-colors">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <Badge variant="secondary" className="bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] border-none px-3 py-1">
                                  {task.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleRemoveTask(task.id)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <Badge className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none ${
                                  task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                                  task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                  'bg-blue-500/10 text-blue-500'
                                }`}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            <Typography weight="black" className="text-lg text-slate-900 dark:text-white mb-8 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                              {task.title}
                            </Typography>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="text-[11px] font-black">{task.comments}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-[11px] font-black">{task.date}</span>
                                </div>
                              </div>
                              
                              <div className="relative">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-[2px] shadow-sm transform group-hover:rotate-6 transition-transform">
                                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-400" />
                                  </div>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Drop Zone / Add Placeholder */}
                    <motion.button
                      whileHover={{ scale: 0.98 }}
                      onClick={() => handleAddTask(column.id)}
                      className="h-32 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/20 hover:border-blue-500/30 group"
                    >
                      <Plus className="w-6 h-6 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                      <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors">Drop or Add</span>
                    </motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Task</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {allTasks.map((task) => (
                      <motion.tr 
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-8 py-6">
                           <span className="text-[11px] font-black text-slate-400">#{task.id}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                              <User className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{task.title}</p>
                              <Badge variant="secondary" className="text-[8px] font-bold text-slate-400 border-none px-2 py-0.5">{task.type}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <Badge className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none ${
                              task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                              task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-blue-500/10 text-blue-500'
                            }`}>
                              {task.priority}
                            </Badge>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full bg-${task.color}-500 shadow-lg shadow-${task.color}-500/20`} />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.status}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-slate-400">
                             <Calendar className="w-3.5 h-3.5" />
                             <span className="text-[11px] font-black">{task.date}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button 
                             onClick={() => handleRemoveTask(task.id)}
                             className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
