'use client';

import { useState, useRef, useEffect } from 'react';
import { AlertCircle, Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface DirectMessageComposerProps {
  users: User[];
  onSendMessage: (recipientId: string, subject: string, content: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

function UserSearch({
  users,
  selectedId,
  onSelect,
  disabled,
  hasError,
}: {
  users: User[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
  hasError: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = users.find((u) => u.id === selectedId) ?? null;

  const filtered = query.trim()
    ? users.filter((u) => {
        const q = query.toLowerCase();
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      })
    : users;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClear = () => {
    onSelect('');
    setQuery('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (u: User) => {
    onSelect(u.id);
    setQuery('');
    setOpen(false);
  };

  const borderClass = hasError
    ? 'border-red-300 dark:border-red-700'
    : open
    ? 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/10'
    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600';

  return (
    <div ref={containerRef} className="relative">
      {/* Input / selected chip */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border transition-all cursor-text',
          borderClass,
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        onClick={() => {
          if (!disabled && !selected) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />

        {selected ? (
          /* Selected chip */
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-sm shrink-0">
              {(selected.name || selected.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none">
                {selected.name || selected.email}
              </p>
              <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">
                {selected.role.toLowerCase()} · {selected.email}
              </p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          /* Search input */
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setOpen(false); setQuery(''); }
            }}
            placeholder="Search by name or email…"
            disabled={disabled}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
        )}
      </div>

      {/* Dropdown */}
      {open && !selected && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400 font-medium">No users found</p>
              {query && (
                <p className="text-xs text-slate-300 dark:text-slate-600 font-medium mt-1">
                  Try a different name or email
                </p>
              )}
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto py-1.5">
              {filtered.map((u) => {
                const isSelected = u.id === selectedId;
                const display = u.name || u.email;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelect(u)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-sm shrink-0">
                      {display.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {display}
                      </p>
                      <p className="text-xs text-slate-400 font-medium truncate capitalize">
                        {u.role.toLowerCase()}
                        {u.name ? ` · ${u.email}` : ''}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DirectMessageComposer({
  users,
  onSendMessage,
  isLoading = false,
}: DirectMessageComposerProps) {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!recipientId) e.recipientId = 'Please select a recipient';
    if (!subject.trim()) e.subject = 'Subject is required';
    else if (subject.length > 200) e.subject = 'Subject must be 200 characters or less';
    if (!content.trim()) e.content = 'Message is required';
    else if (content.length > 5000) e.content = 'Message must be 5000 characters or less';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSending(true);
    try {
      await onSendMessage(recipientId, subject.trim(), content.trim());
      setRecipientId('');
      setSubject('');
      setContent('');
      setErrors({});
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none border transition-all ${
      hasError
        ? 'border-red-300 dark:border-red-700 focus:ring-2 focus:ring-red-500/20'
        : 'border-slate-200 dark:border-slate-700 focus:border-blue-300 dark:focus:border-blue-700 focus:ring-2 focus:ring-blue-500/10'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Recipient — searchable */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          To
        </label>
        <UserSearch
          users={users}
          selectedId={recipientId}
          onSelect={(id) => { setRecipientId(id); setErrors(prev => ({ ...prev, recipientId: '' })); }}
          disabled={isSending || isLoading}
          hasError={!!errors.recipientId}
        />
        {errors.recipientId && <FieldError message={errors.recipientId} />}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          Subject
        </label>
        <input
          type="text"
          placeholder="Message subject"
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setErrors(prev => ({ ...prev, subject: '' })); }}
          disabled={isSending || isLoading}
          maxLength={200}
          className={`${fieldClass(!!errors.subject)} disabled:opacity-60`}
        />
        {errors.subject && <FieldError message={errors.subject} />}
      </div>

      {/* Message */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          Message
        </label>
        <textarea
          placeholder="Type your message here…"
          value={content}
          onChange={(e) => { setContent(e.target.value); setErrors(prev => ({ ...prev, content: '' })); }}
          disabled={isSending || isLoading}
          rows={7}
          maxLength={5000}
          className={`resize-none ${fieldClass(!!errors.content)} disabled:opacity-60`}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.content ? <FieldError message={errors.content} /> : <span />}
          <span className="text-[10px] text-slate-400 font-medium">{content.length}/5000</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSending || isLoading || !recipientId || !subject.trim() || !content.trim()}
        className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isSending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-red-500">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}
