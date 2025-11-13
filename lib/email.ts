/**
 * Email service for sending internal notifications
 * 
 * This service handles sending email notifications to users when they receive messages.
 * For production, configure an email service provider (Resend, SendGrid, Nodemailer, etc.)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email notification
 * 
 * In production, integrate with an email service provider:
 * - Resend (recommended): https://resend.com
 * - SendGrid: https://sendgrid.com
 * - Nodemailer: https://nodemailer.com
 * - AWS SES: https://aws.amazon.com/ses
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Implement actual email sending
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM || 'noreply@webbidev.com',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.text,
    // });

    // For now, log the email (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        html: options.html.substring(0, 100) + '...',
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a message notification email
 */
export async function sendMessageNotification(
  recipientEmail: string,
  recipientName: string | null,
  senderName: string | null,
  senderEmail: string,
  messageContent: string,
  projectTitle?: string,
  messageUrl: string
): Promise<{ success: boolean; error?: string }> {
  const displayName = recipientName || recipientEmail;
  const senderDisplayName = senderName || senderEmail;
  const subject = projectTitle
    ? `New message from ${senderDisplayName} - ${projectTitle}`
    : `New message from ${senderDisplayName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #000, #333); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Webbidev</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Guaranteed Scope. Simplified Development.</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #111; margin-top: 0;">New Message</h2>
          
          <p>Hi ${displayName},</p>
          
          <p>You have received a new message from <strong>${senderDisplayName}</strong>${projectTitle ? ` regarding the project "${projectTitle}"` : ''}.</p>
          
          <div style="background: white; border-left: 4px solid #000; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap;">${messageContent}</p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${messageUrl}" style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Message
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This is an automated notification from Webbidev. All communication is logged for your safety and security.
          </p>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © ${new Date().getFullYear()} Webbidev. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
New Message from ${senderDisplayName}

Hi ${displayName},

You have received a new message from ${senderDisplayName}${projectTitle ? ` regarding the project "${projectTitle}"` : ''}.

Message:
${messageContent}

View the message: ${messageUrl}

---
This is an automated notification from Webbidev.
  `.trim();

  return await sendEmail({
    to: recipientEmail,
    subject,
    html,
    text,
  });
}

