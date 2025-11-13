'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Typography, Badge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

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

interface ProjectChatProps {
  projectId: string;
  messages: Message[];
  onSendMessage?: (content: string, attachments?: string[]) => Promise<void>;
  onLoadMore?: () => Promise<void>;
  className?: string;
}

export default function ProjectChat({
  projectId,
  messages: initialMessages,
  onSendMessage,
  onLoadMore,
  className,
}: ProjectChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    if (!newMessage.trim() || !onSendMessage) return;

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

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle>Project Chat</CardTitle>
        <Typography variant="p" size="sm" color="muted">
          Communicate with your team about this project
        </Typography>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Typography variant="p" color="muted" className="text-center">
                No messages yet. Start the conversation!
              </Typography>
            </div>
          ) : (
            messages.map((message) => {
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Message Input */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || !onSendMessage}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSending}
            disabled={isSending || !newMessage.trim() || !onSendMessage}
          >
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
}

