'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea, Button, Typography, Select } from '@/components/ui';
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

export default function DirectMessageComposer({
  users,
  onSendMessage,
  isLoading = false,
  className,
}: DirectMessageComposerProps) {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!recipientId) {
      newErrors.recipientId = 'Please select a recipient';
    }
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (subject.length > 200) {
      newErrors.subject = 'Subject must be 200 characters or less';
    }
    if (!content.trim()) {
      newErrors.content = 'Message content is required';
    } else if (content.length > 5000) {
      newErrors.content = 'Message content must be 5000 characters or less';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSending(true);
    try {
      await onSendMessage(recipientId, subject.trim(), content.trim());
      // Reset form
      setRecipientId('');
      setSubject('');
      setContent('');
      setErrors({});
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.name || user.email} (${user.role})`,
  }));

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Send Direct Message</CardTitle>
        <Typography variant="p" size="sm" color="muted">
          Send an internal email to another user
        </Typography>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="To"
            options={[
              { value: '', label: 'Select a user...', disabled: true },
              ...userOptions,
            ]}
            value={recipientId}
            onChange={(e) => {
              setRecipientId(e.target.value);
              if (errors.recipientId) {
                setErrors((prev) => ({ ...prev, recipientId: '' }));
              }
            }}
            error={errors.recipientId}
            required
            disabled={isSending || isLoading}
          />

          <Input
            label="Subject"
            type="text"
            placeholder="Message subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) {
                setErrors((prev) => ({ ...prev, subject: '' }));
              }
            }}
            error={errors.subject}
            required
            disabled={isSending || isLoading}
            maxLength={200}
          />

          <Textarea
            label="Message"
            placeholder="Type your message here..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) {
                setErrors((prev) => ({ ...prev, content: '' }));
              }
            }}
            error={errors.content}
            required
            disabled={isSending || isLoading}
            rows={6}
            maxLength={5000}
            helperText={`${content.length}/5000 characters`}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSending}
              disabled={isSending || isLoading || !recipientId || !subject.trim() || !content.trim()}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

