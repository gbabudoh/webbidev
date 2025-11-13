'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Typography, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  subject?: string | null;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  recipient?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  attachments?: string[];
  isEvidence?: boolean;
  createdAt: string;
}

interface DirectMessageViewProps {
  otherParty: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
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
  className,
}: DirectMessageViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const isOwnMessage = (message: Message) => {
    return message.senderId === user?.id;
  };

  const displayName = otherParty?.name || otherParty?.email || 'Unknown';

  if (!otherParty) {
    return (
      <Card className={cn('flex flex-col h-[600px]', className)}>
        <CardContent className="flex items-center justify-center h-full">
          <Typography variant="p" color="muted">
            No recipient selected
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Direct Message</CardTitle>
            <Typography variant="p" size="sm" color="muted">
              Conversation with {displayName}
            </Typography>
          </div>
          <Badge variant="secondary" size="sm">
            {otherParty.role}
          </Badge>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Typography variant="p" color="muted">
              Loading messages...
            </Typography>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Typography variant="p" color="muted" className="text-center">
              No messages yet. Start the conversation!
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const own = isOwnMessage(message);
              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    own ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn('flex flex-col max-w-[70%]', own ? 'items-end' : 'items-start')}>
                    {message.subject && !own && (
                      <Typography variant="p" size="xs" weight="semibold" className="mb-1 text-zinc-500 dark:text-zinc-400">
                        {message.subject}
                      </Typography>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2',
                        own
                          ? 'bg-foreground text-background'
                          : 'bg-zinc-100 text-foreground dark:bg-zinc-800'
                      )}
                    >
                      {!own && (
                        <Typography variant="p" size="xs" weight="semibold" className="mb-1">
                          {message.sender.name || message.sender.email}
                        </Typography>
                      )}
                      <Typography variant="p" size="sm" className="whitespace-pre-wrap">
                        {message.content}
                      </Typography>
                      {message.isEvidence && (
                        <Badge variant="warning" size="sm" className="mt-2">
                          Evidence
                        </Badge>
                      )}
                    </div>
                    <Typography variant="p" size="xs" color="muted" className="mt-1">
                      {formatRelativeTime(message.createdAt)}
                    </Typography>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      {/* Message Input */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSending}
            disabled={isSending || !newMessage.trim() || isLoading}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </Card>
  );
}

