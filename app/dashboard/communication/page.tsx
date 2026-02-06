'use client';

import { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Paperclip, 
  Plus, 
  Search
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/components/ui';

export default function CommunicationCenter() {
  const [activeChat, setActiveChat] = useState(0);

  const chats = [
    { name: "DevBucket_#9201", lastMsg: "The API is ready for testing.", time: "10:30 AM", unread: 2 },
    { name: "Project Manager", lastMsg: "Can we review the design?", time: "昨天", unread: 0 },
    { name: "Support Team", lastMsg: "Your ticket has been resolved.", time: "Monday", unread: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#ECE6E6] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto h-[80vh] flex gap-8">
        {/* Sidebar: Chat List */}
        <div className="w-80 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-[#171717]">Chats</h1>
            <Button size="icon" className="bg-[#171717] text-white rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <Card className="glass border-none flex-1 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b border-[#171717]/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#171717]/40" />
                  <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full bg-[#171717]/5 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-full">
                {chats.map((chat, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveChat(i)}
                    className={`p-4 flex gap-4 items-center cursor-pointer transition-colors ${activeChat === i ? 'bg-white' : 'hover:bg-white/40'}`}
                  >
                    <div className="w-12 h-12 bg-[#AC9898] rounded-full" />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-[#171717] truncate">{chat.name}</h4>
                        <span className="text-[10px] text-[#171717]/40 font-bold">{chat.time}</span>
                      </div>
                      <p className="text-xs text-[#171717]/60 truncate font-medium">{chat.lastMsg}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-[#F3C36C] rounded-full flex items-center justify-center text-[10px] font-black">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <Card className="flex-1 glass border-none flex flex-col overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-[#171717]/5 flex justify-between items-center bg-white/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#AC9898] rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-[#171717]">{chats[activeChat].name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold text-[#171717]/40 uppercase">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-[#171717]/40"><MessageSquare className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-white/20">
              <div className="flex justify-center">
                <Badge className="bg-[#171717]/5 text-[#171717]/40 font-bold text-[10px]">TODAY</Badge>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#AC9898] rounded-full flex-shrink-0" />
                <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[70%]">
                  <p className="text-sm font-medium text-[#171717]/80">
                    Everything is ready for the final integration. Please check the `donBucket` for approval.
                  </p>
                  <span className="text-[10px] font-bold text-[#171717]/20 mt-2 block">10:30 AM</span>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 bg-[#F3C36C] rounded-full flex-shrink-0" />
                <div className="bg-[#171717] text-white rounded-2xl rounded-tr-none p-4 shadow-sm max-w-[70%] text-right">
                  <p className="text-sm font-medium">
                    Perfect, checking now! I&apos;ll confirm the completion if everything looks good.
                  </p>
                  <span className="text-[10px] font-bold text-white/20 mt-2 block text-right">10:32 AM</span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-[#171717]/5 bg-white/50">
              <div className="relative flex items-center gap-4">
                <Button size="icon" variant="ghost" className="text-[#171717]/40">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full bg-[#171717]/5 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F3C36C]/20"
                  />
                  <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#171717] text-white rounded-xl py-2 px-4 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
