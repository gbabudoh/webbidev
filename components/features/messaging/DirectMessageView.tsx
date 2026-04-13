'use client';

import { useState, useEffect, useRef } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Send, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  subject?: string | null;
  content: string;
  senderId: string;
  sender: { id: string; name: string | null; email: string; role: string };
  recipient?: { id: string; name: string | null; email: string; role: string } | null;
  attachments?: string[];
  isEvidence?: boolean;
  createdAt: string;
}

interface DirectMessageViewProps {
  otherParty: { id: string; name: string | null; email: string; role: string } | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export default function DirectMessageView({
  otherParty,
  messages: initialMessages,
  onSendMessage,
  isLoading = false,
}: DirectMessageViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMessages(initialMessages); }, [initialMessages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  };

  const displayName = otherParty?.name || otherParty?.email || 'Unknown';

  if (!otherParty) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-slate-400 font-medium">No recipient selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Chat header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-base shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900 dark:text-white truncate">{displayName}</p>
          <p className="text-xs text-slate-400 font-medium truncate capitalize">{otherParty.role.toLowerCase()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-400 font-medium">Loading messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1">
              <MessageSquare className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">No messages yet</p>
            <p className="text-xs text-slate-400 font-medium">Send the first message to start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const own = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={cn('flex gap-2.5', own ? 'flex-row-reverse' : 'flex-row')}
                >
                  {!own && (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-sm shrink-0 self-end mb-4">
                      {(message.sender.name || message.sender.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={cn('flex flex-col max-w-[72%]', own ? 'items-end' : 'items-start')}>
                    {message.subject && !own && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 px-1">
                        {message.subject}
                      </p>
                    )}
                    <div
                      className={cn(
                        'px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                        own
                          ? 'bg-indigo-600 text-white rounded-3xl rounded-br-lg'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl rounded-bl-lg'
                      )}
                    >
                      {message.content}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 px-1">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700 focus-within:border-indigo-300 dark:focus-within:border-indigo-700 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type your message…"
            rows={1}
            disabled={isSending || isLoading}
            className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none leading-relaxed max-h-32 overflow-y-auto disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 dark:text-slate-600 font-medium text-center mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
