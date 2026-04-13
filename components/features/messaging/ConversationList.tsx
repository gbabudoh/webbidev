'use client';

import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

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
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <MessageSquare className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-sm font-black text-slate-900 dark:text-white mb-1">No conversations yet</p>
        <p className="text-xs text-slate-400 font-medium max-w-[180px]">
          Conversations with clients appear here once a project starts.
        </p>
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const displayName =
          conversation.otherParty?.name || conversation.otherParty?.email || 'Unknown';
        const initial = displayName.charAt(0).toUpperCase();
        const hasUnread = conversation.unreadCount > 0;

        const preview = conversation.lastMessage?.content
          ? conversation.lastMessage.content.length > 55
            ? conversation.lastMessage.content.slice(0, 55) + '…'
            : conversation.lastMessage.content
          : null;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              'w-full text-left px-4 py-4 flex items-start gap-3 transition-all border-l-2',
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
            )}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base',
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                )}
              >
                {initial}
              </div>
              {hasUnread && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-black leading-none">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p
                  className={cn(
                    'text-sm truncate',
                    hasUnread ? 'font-black' : 'font-bold',
                    isSelected
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-slate-900 dark:text-white'
                  )}
                >
                  {displayName}
                </p>
                {conversation.lastMessage && (
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                    {formatRelativeTime(conversation.lastMessage.createdAt)}
                  </span>
                )}
              </div>

              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mb-0.5">
                {conversation.projectTitle}
              </p>

              {preview && (
                <p
                  className={cn(
                    'text-xs truncate',
                    hasUnread
                      ? 'font-semibold text-slate-700 dark:text-slate-300'
                      : 'font-medium text-slate-400'
                  )}
                >
                  {preview}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
