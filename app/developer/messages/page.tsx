'use client';

import { useState, useEffect } from 'react';
import ConversationList from '@/components/features/messaging/ConversationList';
import MessageView from '@/components/features/messaging/MessageView';
import DirectMessageComposer from '@/components/features/messaging/DirectMessageComposer';
import DirectMessageView from '@/components/features/messaging/DirectMessageView';
import { Typography, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { MessageSquare, Send, Users, Inbox, Mail } from 'lucide-react';

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
    sender: {
      id: string;
      name: string | null;
      email: string;
    };
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
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
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
  lastMessage: {
    id: string;
    subject: string;
    content: string;
    createdAt: string;
  } | null;
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
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

export default function DeveloperMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>('');
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
    if (viewMode === 'project') {
      fetchConversations();
    } else {
      fetchDirectConversations();
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useEffect(() => {
    if (selectedConversationId && viewMode === 'project') {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId, viewMode]);

  useEffect(() => {
    if (selectedDirectConversation && viewMode === 'direct') {
      fetchDirectMessages(selectedDirectConversation);
    }
  }, [selectedDirectConversation, viewMode]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/messaging/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);

      // Auto-select first conversation if available
      if (data.conversations && data.conversations.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data.conversations[0].id);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (projectId: string) => {
    try {
      setMessagesLoading(true);
      setError(null);

      const response = await fetch(`/api/messaging/messages?projectId=${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setProjectTitle(data.project?.title || '');
      setOtherParty(data.otherParty || null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      setError(errorMessage);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    try {
      const response = await fetch('/api/messaging/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedConversationId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add new message to the list
      setMessages((prev) => [...prev, data.message]);
      
      // Refresh conversations to update last message
      fetchConversations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const fetchDirectConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/messaging/conversations/direct');
      if (!response.ok) {
        throw new Error('Failed to fetch direct conversations');
      }

      const data = await response.json();
      setDirectConversations(data.conversations || []);

      if (data.conversations && data.conversations.length > 0 && !selectedDirectConversation) {
        setSelectedDirectConversation(data.conversations[0].userId);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load direct conversations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchDirectMessages = async (userId: string) => {
    try {
      setMessagesLoading(true);
      setError(null);

      const response = await fetch(`/api/messaging/direct?conversationWith=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch direct messages');
      }

      const data = await response.json();
      setDirectMessages(data.messages || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load direct messages';
      setError(errorMessage);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/search');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSendDirectMessage = async (recipientId: string, subject: string, content: string) => {
    try {
      const response = await fetch('/api/messaging/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          subject,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // If we're viewing this conversation, add the message
      if (selectedDirectConversation === recipientId) {
        setDirectMessages((prev) => [...prev, data.message]);
      } else {
        // Otherwise, refresh and select the conversation
        await fetchDirectConversations();
        setSelectedDirectConversation(recipientId);
        setShowComposer(false);
      }
      
      // Refresh conversations to update last message
      fetchDirectConversations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <Typography variant="p" size="lg" color="muted">
              Loading messages...
            </Typography>
          </div>
        </div>
      </>
    );
  }

  const totalUnread = viewMode === 'project' 
    ? conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
    : directConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-blue-100 dark:border-blue-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                  Messages
                </Typography>
                <Typography variant="p" size="lg" color="muted">
                  {viewMode === 'project' 
                    ? 'Communicate with clients about your projects'
                    : 'Send direct messages to other users'}
                </Typography>
                {totalUnread > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                    <Inbox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <Typography variant="p" size="sm" weight="semibold" className="text-blue-600 dark:text-blue-400">
                      {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'project' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('project')}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Project Messages
              </Button>
              <Button
                variant={viewMode === 'direct' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('direct')}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Direct Messages
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Typography variant="p" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          </div>
        )}

        {viewMode === 'project' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <Typography variant="h3" size="lg" weight="semibold">
                      Conversations
                    </Typography>
                  </div>
                  <Typography variant="p" size="sm" color="muted" className="mt-1">
                    {conversations.length} active project{conversations.length !== 1 ? 's' : ''}
                  </Typography>
                </div>
                <div className="p-2">
                  <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversationId || undefined}
                    onSelectConversation={handleSelectConversation}
                  />
                </div>
              </div>
            </div>

            {/* Message View */}
            <div className="lg:col-span-2">
              {selectedConversationId ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <MessageView
                    projectId={selectedConversationId}
                    projectTitle={projectTitle}
                    otherParty={otherParty}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={messagesLoading}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mb-4">
                    <MessageSquare className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <Typography variant="p" color="muted" className="text-center">
                    Select a conversation to view messages
                  </Typography>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Direct Messages List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      <Typography variant="h3" size="lg" weight="semibold">
                        Direct Messages
                      </Typography>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => setShowComposer(true)}
                  >
                    <Send className="w-4 h-4" />
                    New Message
                  </Button>
                </div>
                
                <div className="p-2 max-h-[600px] overflow-y-auto">
                  {directConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto mb-3">
                        <Inbox className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
                      </div>
                      <Typography variant="p" color="muted" size="sm">
                        No conversations yet
                      </Typography>
                      <Typography variant="p" color="muted" size="xs" className="mt-1">
                        Start a new conversation
                      </Typography>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {directConversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={cn(
                            'p-4 border rounded-xl cursor-pointer transition-all duration-200',
                            selectedDirectConversation === conv.userId 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm' 
                              : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                          )}
                          onClick={() => {
                            setSelectedDirectConversation(conv.userId);
                            setShowComposer(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Typography variant="p" size="sm" weight="bold" className="text-white">
                                  {(conv.otherParty.name || conv.otherParty.email).charAt(0).toUpperCase()}
                                </Typography>
                              </div>
                              <div className="flex-1 min-w-0">
                                <Typography variant="p" weight="semibold" className="truncate">
                                  {conv.otherParty.name || conv.otherParty.email}
                                </Typography>
                                <Typography variant="p" size="sm" color="muted" className="truncate mt-0.5">
                                  {conv.lastMessage?.subject || 'No subject'}
                                </Typography>
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge variant="primary" size="sm" className="flex-shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message View or Composer */}
            <div className="lg:col-span-2">
              {showComposer ? (
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Typography variant="h2" size="xl" weight="bold">
                            New Message
                          </Typography>
                          <Typography variant="p" size="sm" color="muted">
                            Compose a direct message
                          </Typography>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowComposer(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
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
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mb-4">
                    <Mail className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <Typography variant="p" color="muted" className="mb-4 text-center">
                    Select a conversation or create a new message
                  </Typography>
                  <Button
                    variant="primary"
                    onClick={() => setShowComposer(true)}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    New Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
