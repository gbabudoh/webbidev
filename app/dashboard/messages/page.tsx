'use client';

import { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Paperclip, 
  Plus, 
  Search,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    { id: 1, name: "DevBucket_#9201", lastMsg: "The API is ready for testing.", time: "10:30 AM", unread: 2, online: true },
    { id: 2, name: "Project Manager", lastMsg: "Can we review the design?", time: "Yesterday", unread: 0, online: false },
    { id: 3, name: "Support Team", lastMsg: "Your ticket has been resolved.", time: "Monday", unread: 0, online: true },
    { id: 4, name: "Frontend Architect", lastMsg: "Check the new mobile layout.", time: "2h ago", unread: 5, online: true },
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = chats.find(c => c.id === activeChat);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Chat List Pane */}
        <aside className={cn(
          "w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out z-10",
          activeChat !== null ? "hidden md:flex" : "flex"
        )}>
          {/* List Header */}
          <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
              <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Plus className="w-5 h-5 text-blue-600" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {filteredChats.map((chat) => (
              <button 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  "w-full p-4 flex gap-4 items-center transition-all border-l-4",
                  activeChat === chat.id 
                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-600" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 shadow-sm">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{chat.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate line-clamp-1">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none min-w-[20px] h-5 flex items-center justify-center p-0 text-[10px] font-bold">
                    {chat.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Detail Pane */}
        <main className={cn(
          "flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out",
          activeChat === null ? "hidden md:flex" : "flex"
        )}>
          {selectedChat ? (
            <>
              {/* Detail Header */}
              <div className="h-16 md:h-20 px-4 md:px-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden -ml-2 rounded-full w-9 h-9 p-0"
                    onClick={() => setActiveChat(null)}
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center font-bold text-blue-600">
                      {selectedChat.name.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">{selectedChat.name}</h3>
                    <div className="flex items-center gap-1.5 leading-none">
                      <div className={cn("w-1.5 h-1.5 rounded-full", selectedChat.online ? "bg-emerald-500" : "bg-slate-300")} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {selectedChat.online ? 'Active Now' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 text-slate-400 hover:text-slate-600">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-8 bg-slate-50/50 dark:bg-slate-950/20 custom-scrollbar">
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-white dark:bg-slate-900 text-slate-400 font-bold border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-widest px-3 py-1">
                    Today
                  </Badge>
                </div>
                
                {/* Received Message */}
                <div className="flex gap-3 max-w-[85%] md:max-w-[70%] animate-in slide-in-from-left-2 duration-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
                    {selectedChat.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-3 md:p-4 shadow-sm border border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                        Everything is ready for the final integration. Please check the `donBucket` for approval.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 px-1">10:30 AM</span>
                  </div>
                </div>

                {/* Sent Message */}
                <div className="flex gap-3 flex-row-reverse ml-auto max-w-[85%] md:max-w-[70%] animate-in slide-in-from-right-2 duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                    ME
                  </div>
                  <div className="space-y-1 items-end flex flex-col">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3 md:p-4 shadow-lg shadow-blue-600/10">
                      <p className="text-sm font-medium leading-relaxed">
                        Perfect, checking now! I&apos;ll confirm completion if it looks good.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 px-1">10:32 AM</span>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 pl-4">
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-blue-600 rounded-full h-10 w-10 shrink-0 mb-1 p-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <textarea 
                    rows={1}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none py-3 text-sm font-medium focus:ring-0 focus:outline-none resize-none max-h-32 text-slate-900 dark:text-white"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-4 md:px-6 flex items-center gap-2 mb-1 shadow-lg shadow-blue-600/20 transition-all active:scale-95 shrink-0">
                    <Send className="w-4 h-4 md:mr-1" />
                    <span className="hidden md:inline">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-950/20">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-3xl flex items-center justify-center mb-6 animate-bounce duration-[3000ms]">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select a conversation</h2>
              <p className="text-sm text-slate-500 max-w-xs">
                Choose a message from the left to start chatting with your team or clients.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
