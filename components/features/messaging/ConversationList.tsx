'use client';

import { useState } from 'react';
import { Card, CardContent, Typography, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
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

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  className?: string;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  className,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Typography variant="h3" size="lg" weight="bold" className="mb-2">
              No conversations yet
            </Typography>
            <Typography variant="p" color="muted">
              Start a project to begin messaging
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {conversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;
            const displayName = conversation.otherParty?.name || conversation.otherParty?.email || 'Unknown';
            const lastMessagePreview = conversation.lastMessage
              ? conversation.lastMessage.content.length > 50
                ? conversation.lastMessage.content.substring(0, 50) + '...'
                : conversation.lastMessage.content
              : 'No messages yet';

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors',
                  isSelected && 'bg-zinc-100 dark:bg-zinc-900 border-l-4 border-foreground'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="p" size="sm" weight="semibold" className="truncate">
                        {displayName}
                      </Typography>
                      {conversation.otherParty && (
                        <Badge variant="secondary" size="xs">
                          {conversation.otherParty.role}
                        </Badge>
                      )}
                    </div>
                    <Typography variant="p" size="xs" color="muted" className="mb-1 truncate">
                      {conversation.projectTitle}
                    </Typography>
                    {conversation.lastMessage && (
                      <Typography variant="p" size="xs" color="muted" className="truncate">
                        {lastMessagePreview}
                      </Typography>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {conversation.lastMessage && (
                      <Typography variant="p" size="xs" color="muted">
                        {formatRelativeTime(conversation.lastMessage.createdAt)}
                      </Typography>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="primary" size="sm">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

