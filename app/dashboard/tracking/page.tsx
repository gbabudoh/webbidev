'use client';

import { motion } from 'framer-motion';
import { 
  Trello, 
  Activity,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/components/ui';

export default function ProjectTracking() {
  const lifecycle = [
    { name: "Backlog", tasks: 8, color: "bg-[#AC9898]" },
    { name: "Development", tasks: 3, color: "bg-[#F3C36C]" },
    { name: "Ready for Review", tasks: 2, color: "bg-[#BCEACF]" },
    { name: "Completed", tasks: 12, color: "bg-[#171717]" },
  ];

  return (
    <div className="min-h-screen bg-[#ECE6E6] p-6 lg:p-12">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#171717] rounded-2xl flex items-center justify-center text-[#F3C36C]">
              <Trello className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#171717]">Lifecycle Management</h1>
              <p className="text-xs font-bold text-[#171717]/40 uppercase tracking-widest">Project: NextGen Fintech App</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="rounded-xl font-bold text-[#171717]/60">Board View</Button>
            <Button variant="ghost" className="rounded-xl font-bold text-[#171717]/60">Timeline</Button>
            <Button className="bg-[#171717] text-white rounded-xl px-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {lifecycle.map((column, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="text-lg font-black text-[#171717]">{column.name}</h3>
                  <Badge className="bg-[#171717]/5 text-[#171717]/40 font-black">{column.tasks}</Badge>
                </div>
                <MoreHorizontal className="w-5 h-5 text-[#171717]/20" />
              </div>

              <div className="space-y-4">
                {[1, 2].map((task) => (
                  <motion.div
                    key={task}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass border-none shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                      <CardContent className="p-5">
                        <div className="flex gap-2 mb-4">
                          <Badge className="bg-[#F3C36C]/20 text-[#F3C36C] text-[10px] font-black">HIGH PRIO</Badge>
                          <Badge className="bg-[#171717]/5 text-[#171717]/40 text-[10px] font-black">FRONTEND</Badge>
                        </div>
                        <h4 className="text-sm font-bold text-[#171717] mb-4">Implement Auth Flow with NextAuth.js and Prisma</h4>
                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-[#AC9898] border-2 border-white" />
                            <div className="w-6 h-6 rounded-full bg-[#BCEACF] border-2 border-white" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-[#171717]/40">
                            <Activity className="w-3 h-3" />
                            <span>12 Updates</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
