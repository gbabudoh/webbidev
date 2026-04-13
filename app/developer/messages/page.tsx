'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConversationList from '@/components/features/messaging/ConversationList';
import MessageView from '@/components/features/messaging/MessageView';
import DirectMessageComposer from '@/components/features/messaging/DirectMessageComposer';
import DirectMessageView from '@/components/features/messaging/DirectMessageView';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  Users,
  Inbox,
  Mail,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface Conversation {
  id: string;
  projectId: string;
  projectTitle: string;
  otherParty: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    sender: { id: string; name: string | null; email: string };
    createdAt: string;
  } | null;
  unreadCount: number;
  messageCount: number;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: { id: string; name: string | null; email: string; role: string };
  attachments?: string[];
  isEvidence?: boolean;
  createdAt: string;
}

interface DirectConversation {
  id: string;
  userId: string;
  otherParty: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
  lastMessage: { id: string; subject: string; content: string; createdAt: string } | null;
  unreadCount: number;
}

interface DirectMessage {
  id: string;
  subject: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  read: boolean;
  sender: { id: string; name: string | null; email: string; role: string };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

function PanelSkeleton() {
  return (
    <div className="flex h-[700px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
      <div className="w-72 shrink-0 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-32 mb-2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-20" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default function DeveloperMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [otherParty, setOtherParty] = useState<Conversation['otherParty']>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'project' | 'direct'>('project');
  const [directConversations, setDirectConversations] = useState<DirectConversation[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [selectedDirectConversation, setSelectedDirectConversation] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    if (viewMode === 'project') fetchConversations();
    else { fetchDirectConversations(); fetchUsers(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useEffect(() => {
    if (selectedConversationId && viewMode === 'project') fetchMessages(selectedConversationId);
  }, [selectedConversationId, viewMode]);

  useEffect(() => {
    if (selectedDirectConversation && viewMode === 'direct') fetchDirectMessages(selectedDirectConversation);
  }, [selectedDirectConversation, viewMode]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/messaging/conversations');
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
      if (data.conversations?.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data.conversations[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (projectId: string) => {
    try {
      setMessagesLoading(true);
      setError(null);
      const res = await fetch(`/api/messaging/messages?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data.messages || []);
      setProjectTitle(data.project?.title || '');
      setOtherParty(data.otherParty || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    const res = await fetch('/api/messaging/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: selectedConversationId, content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
    fetchConversations();
  };

  const fetchDirectConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/messaging/conversations/direct');
      if (!res.ok) throw new Error('Failed to fetch direct conversations');
      const data = await res.json();
      setDirectConversations(data.conversations || []);
      if (data.conversations?.length > 0 && !selectedDirectConversation) {
        setSelectedDirectConversation(data.conversations[0].userId);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load direct conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectMessages = async (userId: string) => {
    try {
      setMessagesLoading(true);
      const res = await fetch(`/api/messaging/direct?conversationWith=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch direct messages');
      const data = await res.json();
      setDirectMessages(data.messages || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load direct messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/search');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSendDirectMessage = async (recipientId: string, subject: string, content: string) => {
    const res = await fetch('/api/messaging/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, subject, content }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || 'Failed to send message');
    }
    const data = await res.json();
    if (selectedDirectConversation === recipientId) {
      setDirectMessages((prev) => [...prev, data.message]);
    } else {
      await fetchDirectConversations();
      setSelectedDirectConversation(recipientId);
      setShowComposer(false);
    }
    fetchDirectConversations();
  };

  const totalUnread = viewMode === 'project'
    ? conversations.reduce((sum, c) => sum + c.unreadCount, 0)
    : directConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 lg:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-6">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Messaging</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Messages
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              {viewMode === 'project'
                ? 'Conversations with clients about active projects.'
                : 'Direct messages with other users on the platform.'}
            </p>
          </div>

          {totalUnread > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl shrink-0"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unread</p>
              <p className="text-4xl font-black text-blue-600 leading-none">{totalUnread}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {totalUnread === 1 ? 'new message' : 'new messages'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setViewMode('project')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
            viewMode === 'project'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          <Users className="w-4 h-4" />
          Project Messages
          {viewMode === 'project' && conversations.reduce((s, c) => s + c.unreadCount, 0) > 0 && (
            <Badge variant="primary" size="sm">
              {conversations.reduce((s, c) => s + c.unreadCount, 0)}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setViewMode('direct')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
            viewMode === 'direct'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          <Mail className="w-4 h-4" />
          Direct Messages
          {viewMode === 'direct' && directConversations.reduce((s, c) => s + c.unreadCount, 0) > 0 && (
            <Badge variant="primary" size="sm">
              {directConversations.reduce((s, c) => s + c.unreadCount, 0)}
            </Badge>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <PanelSkeleton />}

      {/* Project Messages Panel */}
      {!loading && viewMode === 'project' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden lg:h-[700px]"
        >
          {/* Left sidebar */}
          <div className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col max-h-64 lg:max-h-none">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">Conversations</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {conversations.length} project {conversations.length === 1 ? 'thread' : 'threads'}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId || undefined}
                onSelectConversation={setSelectedConversationId}
              />
            </div>
          </div>

          {/* Right message view */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[400px] lg:min-h-0">
            {selectedConversationId ? (
              <MessageView
                projectId={selectedConversationId}
                projectTitle={projectTitle}
                otherParty={otherParty}
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={messagesLoading}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center p-8">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">Select a conversation</p>
                <p className="text-sm text-slate-400 font-medium max-w-xs">
                  Choose a project from the list to view and send messages.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Direct Messages Panel */}
      {!loading && viewMode === 'direct' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden lg:h-[700px]"
        >
          {/* Left sidebar */}
          <div className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col max-h-64 lg:max-h-none">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">Direct Messages</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{directConversations.length} conversations</p>
                </div>
              </div>
              <button
                onClick={() => { setShowComposer(true); setSelectedDirectConversation(null); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Message
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {directConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <Inbox className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white mb-1">No conversations yet</p>
                  <p className="text-xs text-slate-400 font-medium">Send a new message to get started</p>
                </div>
              ) : (
                <div>
                  {directConversations.map((conv) => {
                    const isSelected = selectedDirectConversation === conv.userId && !showComposer;
                    const displayName = conv.otherParty.name || conv.otherParty.email;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => { setSelectedDirectConversation(conv.userId); setShowComposer(false); }}
                        className={cn(
                          'w-full text-left px-4 py-4 flex items-start gap-3 transition-all border-l-2',
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        )}
                      >
                        <div className="relative shrink-0">
                          <div className={cn(
                            'w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base',
                            isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          )}>
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                              <span className="text-[8px] text-white font-black leading-none">{conv.unreadCount > 9 ? '9+' : conv.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-black truncate mb-0.5',
                            isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                          )}>
                            {displayName}
                          </p>
                          {conv.lastMessage && (
                            <p className="text-xs text-slate-400 font-medium truncate">{conv.lastMessage.subject}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[400px] lg:min-h-0">
            {showComposer ? (
              <div className="flex flex-col h-full">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-white">New Message</p>
                    <p className="text-xs text-slate-400 font-medium">Compose a direct message</p>
                  </div>
                  <button
                    onClick={() => setShowComposer(false)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <DirectMessageComposer
                    users={users}
                    onSendMessage={async (recipientId, subject, content) => {
                      await handleSendDirectMessage(recipientId, subject, content);
                      setShowComposer(false);
                      fetchDirectConversations();
                    }}
                    isLoading={messagesLoading}
                  />
                </div>
              </div>
            ) : selectedDirectConversation ? (
              <DirectMessageView
                otherParty={directConversations.find(c => c.userId === selectedDirectConversation)?.otherParty || null}
                messages={directMessages}
                onSendMessage={async (content: string) => {
                  const lastMessage = directMessages[directMessages.length - 1];
                  const subject = lastMessage?.subject ? `Re: ${lastMessage.subject}` : 'Direct Message';
                  await handleSendDirectMessage(selectedDirectConversation, subject, content);
                }}
                isLoading={messagesLoading}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center p-8">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">No conversation selected</p>
                <p className="text-sm text-slate-400 font-medium max-w-xs">Select a conversation from the list or compose a new message.</p>
                <button
                  onClick={() => setShowComposer(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors mt-2"
                >
                  <Send className="w-4 h-4" />
                  New Message
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
