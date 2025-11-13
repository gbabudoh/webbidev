# Email Setup Guide

The messaging system now supports email notifications when users receive messages. This guide explains how to configure email sending.

## Current Implementation

Currently, the email service is set up to log emails in development mode. To enable actual email sending in production, you need to integrate with an email service provider.

## Email Service Options

### Option 1: Resend (Recommended)
Resend is a modern email API for developers.

1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key
3. Install the Resend package:
   ```bash
   npm install resend
   ```
4. Update `lib/email.ts`:
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export async function sendEmail(options: EmailOptions) {
     try {
       await resend.emails.send({
         from: process.env.EMAIL_FROM || 'noreply@webbidev.com',
         to: options.to,
         subject: options.subject,
         html: options.html,
         text: options.text,
       });
       return { success: true };
     } catch (error: any) {
       return { success: false, error: error.message };
     }
   }
   ```
5. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=noreply@webbidev.com
   ```

### Option 2: SendGrid
SendGrid is a popular email service.

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Install the SendGrid package:
   ```bash
   npm install @sendgrid/mail
   ```
4. Update `lib/email.ts` accordingly

### Option 3: Nodemailer
Nodemailer works with various email providers (Gmail, Outlook, SMTP, etc.).

1. Install Nodemailer:
   ```bash
   npm install nodemailer
   ```
2. Update `lib/email.ts` to use Nodemailer

### Option 4: AWS SES
Amazon SES is a cost-effective email service.

1. Set up AWS SES
2. Install AWS SDK:
   ```bash
   npm install @aws-sdk/client-ses
   ```
3. Update `lib/email.ts` to use AWS SES

## Environment Variables

Add these to your `.env.local`:

```env
# Email Configuration
EMAIL_FROM=noreply@webbidev.com
RESEND_API_KEY=your_resend_api_key_here
# OR
SENDGRID_API_KEY=your_sendgrid_api_key_here
# OR
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

## Features

- **Email Notifications**: Users receive email notifications when they receive messages
- **Direct Messages**: Users can send direct messages to each other (not just project-based)
- **Project Messages**: Project-based messaging still works as before
- **Read Status**: Messages can be marked as read/unread
- **Safety**: All messages are logged in the database for audit purposes

## Testing

In development mode, emails are logged to the console instead of being sent. Check your console output to see what emails would be sent.

## Production

Make sure to:
1. Configure a real email service provider
2. Set up proper email domain verification
3. Test email delivery
4. Monitor email sending limits and quotas
5. Set up email bounce handling if needed

