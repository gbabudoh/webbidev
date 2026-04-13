'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layout,
  Search,
  Layers,
  Trash2,
  List,
  X,
  ClipboardList,
} from 'lucide-react';
import { Button, Badge, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useState, useMemo, useRef, useEffect } from 'react';

type Priority = 'High' | 'Medium' | 'Low';
type TaskType = 'Feature' | 'Bug' | 'UI/UX' | 'Backend' | 'Testing' | 'Ops' | 'Task';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  date: string;
  type: TaskType;
}

interface Column {
  id: string;
  title: string;
  color: string;
  gradient: string;
  tasks: Task[];
}

const INITIAL_COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', color: 'slate', gradient: 'from-slate-400 to-slate-500', tasks: [] },
  { id: 'progress', title: 'In Progress', color: 'blue', gradient: 'from-blue-500 to-indigo-600', tasks: [] },
  { id: 'review', title: 'Review', color: 'amber', gradient: 'from-amber-400 to-orange-500', tasks: [] },
  { id: 'done', title: 'Completed', color: 'emerald', gradient: 'from-emerald-400 to-teal-600', tasks: [] },
];

const PRIORITY_STYLE: Record<Priority, string> = {
  High: 'bg-red-500/10 text-red-500',
  Medium: 'bg-amber-500/10 text-amber-500',
  Low: 'bg-blue-500/10 text-blue-500',
};

const TYPE_OPTIONS: TaskType[] = ['Feature', 'Bug', 'UI/UX', 'Backend', 'Testing', 'Ops', 'Task'];

export default function DevBucketBoard() {
  const [boardData, setBoardData] = useState<Column[]>(INITIAL_COLUMNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Inline add-task form state
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newType, setNewType] = useState<TaskType>('Task');
  const [newDate, setNewDate] = useState('');
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (addingToColumn) {
      titleInputRef.current?.focus();
    }
  }, [addingToColumn]);

  const openForm = (columnId: string) => {
    setAddingToColumn(columnId);
    setNewTitle('');
    setNewPriority('Medium');
    setNewType('Task');
    setNewDate('');
  };

  const closeForm = () => {
    setAddingToColumn(null);
  };

  const saveTask = () => {
    if (!newTitle.trim() || !addingToColumn) return;
    const task: Task = {
      id: `T-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      type: newType,
      date: newDate
        ? new Date(newDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    setBoardData(prev =>
      prev.map(col => col.id === addingToColumn ? { ...col, tasks: [task, ...col.tasks] } : col)
    );
    closeForm();
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveTask();
    }
    if (e.key === 'Escape') closeForm();
  };

  const handleRemoveTask = (taskId: string) => {
    setBoardData(prev =>
      prev.map(col => ({ ...col, tasks: col.tasks.filter(t => t.id !== taskId) }))
    );
  };

  const filteredColumns = useMemo(() => {
    return boardData.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
      }),
    }));
  }, [boardData, searchQuery, priorityFilter]);

  const allTasks = useMemo(() => {
    return filteredColumns.flatMap(col =>
      col.tasks.map(t => ({ ...t, status: col.title, color: col.color }))
    );
  }, [filteredColumns]);

  const boardStats = useMemo(() => {
    const total = boardData.reduce((sum, col) => sum + col.tasks.length, 0);
    const done = boardData.find(col => col.id === 'done')?.tasks.length ?? 0;
    const inProgress = boardData.find(col => col.id === 'progress')?.tasks.length ?? 0;
    const completion = total > 0 ? Math.round((done / total) * 100) : null;
    return { total, done, inProgress, completion };
  }, [boardData]);

  const hasTasks = boardStats.total > 0;

  return (
    <div className="space-y-10 pb-20">

      {/* Header */}
      <header className="relative p-10 lg:p-14 overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] shadow-2xl shadow-slate-400/20 border border-white/40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Personal Task Board</span>
              </div>
              {hasTasks && (
                <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{boardStats.total} tasks</span>
                </div>
              )}
            </div>
            <Typography variant="h1" size="4xl" weight="black" className="text-slate-900 mb-2 tracking-tight lg:text-5xl">
              Task <span className="text-blue-600">Board</span>
            </Typography>
            <Typography variant="p" className="text-slate-700 font-medium max-w-lg leading-relaxed">
              A personal Kanban board to plan and track your own tasks. Add, move between columns, and remove cards as you work.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={() => openForm('backlog')}
              className="bg-slate-900 text-white hover:bg-slate-800 h-14 px-8 rounded-2xl flex items-center gap-3 font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-all border-none cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Controls & Stats Row */}
      <section className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 flex flex-wrap gap-4 items-center p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-md dark:shadow-blue-900/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center gap-6 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                  {boardStats.completion !== null ? `${boardStats.completion}%` : '—'}
                </p>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-100 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">In Progress</p>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{boardStats.inProgress}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-100 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Tasks</p>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{boardStats.total}</p>
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
                className="bg-white dark:bg-slate-900 pl-11 pr-10 py-3 rounded-xl text-xs font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500/50 outline-none w-48 lg:w-56 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
            <div className="flex items-center gap-1">
              {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriorityFilter(filter)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95',
                    priorityFilter === filter
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900'
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
              'flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2',
              viewMode === 'kanban'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/50'
                : 'text-slate-400 border-slate-600 hover:text-white hover:border-slate-500'
            )}
          >
            <Layout className="w-4 h-4" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2',
              viewMode === 'list'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/50'
                : 'text-slate-400 border-slate-600 hover:text-white hover:border-slate-500'
            )}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </section>

      {/* View */}
      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (

          <motion.div
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[600px]"
          >
            {filteredColumns.map((column, colIndex) => (
              <div key={column.id} className="flex flex-col gap-5">

                {/* Column Header */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: colIndex * 0.08 }}
                  className="flex items-center justify-between px-1"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full bg-${column.color}-500`} />
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{column.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] tracking-widest">
                      {column.tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openForm(column.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Inline Add Form */}
                <AnimatePresence>
                  {addingToColumn === column.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-blue-500/40 shadow-xl shadow-blue-500/10 p-5"
                    >
                      {/* Title */}
                      <textarea
                        ref={titleInputRef}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        placeholder="Task title..."
                        rows={2}
                        className="w-full resize-none bg-transparent text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none mb-4 leading-snug"
                      />

                      {/* Priority */}
                      <div className="mb-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority</p>
                        <div className="flex gap-1.5">
                          {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                            <button
                              key={p}
                              onClick={() => setNewPriority(p)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all',
                                newPriority === p
                                  ? PRIORITY_STYLE[p]
                                  : 'text-slate-400 hover:text-slate-600 bg-slate-50 dark:bg-slate-800'
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Type */}
                      <div className="mb-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Type</p>
                        <div className="flex flex-wrap gap-1.5">
                          {TYPE_OPTIONS.map((t) => (
                            <button
                              key={t}
                              onClick={() => setNewType(t)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all',
                                newType === t
                                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                  : 'text-slate-400 hover:text-slate-600 bg-slate-50 dark:bg-slate-800'
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div className="mb-5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Due Date <span className="normal-case tracking-normal font-medium text-slate-300">(optional)</span></p>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-blue-500/30 w-full"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={saveTask}
                          disabled={!newTitle.trim()}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
                        >
                          Add Task
                        </Button>
                        <button
                          onClick={closeForm}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-300 dark:text-slate-600 font-medium mt-2 text-center">Enter to save · Esc to cancel</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tasks */}
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {column.tasks.length === 0 && addingToColumn !== column.id ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-28 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1 text-slate-300 dark:text-slate-700"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">No tasks yet</span>
                      </motion.div>
                    ) : (
                      column.tasks.map((task, taskIndex) => (
                        <motion.div
                          layout
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ type: 'spring', damping: 25, stiffness: 200, delay: taskIndex * 0.04 }}
                          className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1 transition-all duration-300"
                        >
                          {/* Top row: type badge + priority + delete */}
                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              variant="secondary"
                              className="bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] border-none px-2.5 py-1"
                            >
                              {task.type}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-none ${PRIORITY_STYLE[task.priority]}`}>
                                {task.priority}
                              </Badge>
                              <button
                                onClick={() => handleRemoveTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-snug tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                            {task.title}
                          </p>

                          {/* Footer: date only */}
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">{task.date}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>

                  {/* Add button at bottom of non-empty columns */}
                  {column.tasks.length > 0 && addingToColumn !== column.id && (
                    <button
                      onClick={() => openForm(column.id)}
                      className="h-12 rounded-[1.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-300 dark:text-slate-700 hover:border-blue-400/40 hover:text-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group"
                    >
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Add task</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

        ) : (

          /* List View */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {allTasks.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-4 text-center px-8">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white mb-1">No tasks yet</p>
                  <p className="text-sm text-slate-400 font-medium max-w-xs">
                    {searchQuery || priorityFilter !== 'All'
                      ? 'No tasks match the current search or filter.'
                      : 'Switch to Kanban view and click + to add your first task.'}
                  </p>
                </div>
                {!searchQuery && priorityFilter === 'All' && (
                  <button
                    onClick={() => { setViewMode('kanban'); openForm('backlog'); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add First Task
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Task</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Remove</th>
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
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{task.title}</p>
                        </td>
                        <td className="px-8 py-5">
                          <Badge className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-none ${PRIORITY_STYLE[task.priority as Priority]}`}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full bg-${task.color}-500`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge variant="secondary" className="text-[9px] font-bold text-slate-400 border-none px-2.5 py-1">{task.type}</Badge>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">{task.date}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleRemoveTask(task.id)}
                            className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}
