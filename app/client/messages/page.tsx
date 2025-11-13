'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ConversationList from '@/components/features/messaging/ConversationList';
import MessageView from '@/components/features/messaging/MessageView';
import DirectMessageComposer from '@/components/features/messaging/DirectMessageComposer';
import DirectMessageView from '@/components/features/messaging/DirectMessageView';
import { Typography, Button, Badge, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

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

export default function ClientMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [otherParty, setOtherParty] = useState<Conversation['otherParty']>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'project' | 'direct'>('project');
  const [directConversations, setDirectConversations] = useState<any[]>([]);
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [selectedDirectConversation, setSelectedDirectConversation] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    if (viewMode === 'project') {
      fetchConversations();
    } else {
      fetchDirectConversations();
      fetchUsers();
    }
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

      if (data.conversations && data.conversations.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data.conversations[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
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
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
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
      setMessages((prev) => [...prev, data.message]);
      fetchConversations();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
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
    } catch (err: any) {
      setError(err.message || 'Failed to load direct conversations');
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
    } catch (err: any) {
      setError(err.message || 'Failed to load direct messages');
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
      setDirectMessages((prev) => [...prev, data.message]);
      fetchDirectConversations();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography variant="p" size="lg" color="muted">Loading messages...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              Messages
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              {viewMode === 'project' 
                ? 'Communicate with developers about your projects'
                : 'Send direct messages to other users'}
            </Typography>
          </div>
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            <Button
              variant={viewMode === 'project' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('project')}
              className={cn(
                "transition-all duration-200",
                viewMode === 'project' && "shadow-lg"
              )}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Project Messages
            </Button>
            <Button
              variant={viewMode === 'direct' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('direct')}
              className={cn(
                "transition-all duration-200",
                viewMode === 'direct' && "shadow-lg"
              )}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Direct Messages
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="p" className="text-red-600 dark:text-red-400">
                  {error}
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages Content */}
        {viewMode === 'project' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation List */}
            <div className="lg:col-span-1">
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId || undefined}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Message View */}
            <div className="lg:col-span-2">
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
                <Card className="h-[600px]">
                  <CardContent className="h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                      No conversation selected
                    </Typography>
                    <Typography variant="p" color="muted">
                      Select a conversation to view messages
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Direct Messages List */}
            <div className="lg:col-span-1 space-y-4">
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowComposer(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Message
              </Button>
              
              {directConversations.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500/10 to-slate-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <Typography variant="p" color="muted" size="sm">
                      No conversations yet
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {directConversations.map((conv) => (
                    <Card
                      key={conv.id}
                      className={cn(
                        'cursor-pointer hover:shadow-lg transition-all duration-200',
                        selectedDirectConversation === conv.userId && 'border-blue-500 shadow-lg'
                      )}
                      onClick={() => {
                        setSelectedDirectConversation(conv.userId);
                        setShowComposer(false);
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {(conv.otherParty.name || conv.otherParty.email)[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Typography variant="p" weight="semibold" className="truncate">
                              {conv.otherParty.name || conv.otherParty.email}
                            </Typography>
                            <Typography variant="p" size="sm" color="muted" className="truncate">
                              {conv.lastMessage?.subject || 'No subject'}
                            </Typography>
                          </div>
                          {conv.unreadCount > 0 && (
                            <Badge variant="primary" size="sm" className="flex-shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Message View or Composer */}
            <div className="lg:col-span-2">
              {showComposer ? (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <Typography variant="h2" size="xl" weight="bold">
                          New Message
                        </Typography>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowComposer(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <DirectMessageComposer
                      users={users}
                      onSendMessage={async (recipientId, subject, content) => {
                        await handleSendDirectMessage(recipientId, subject, content);
                        setShowComposer(false);
                        fetchDirectConversations();
                      }}
                      isLoading={messagesLoading}
                    />
                  </CardContent>
                </Card>
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
                <Card className="h-[600px]">
                  <CardContent className="h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                      No conversation selected
                    </Typography>
                    <Typography variant="p" color="muted" className="mb-6">
                      Select a conversation or create a new message
                    </Typography>
                    <Button
                      variant="primary"
                      onClick={() => setShowComposer(true)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Message
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
