import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { sendMessageNotification } from '@/lib/email';

// Validation schema
const createDirectMessageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be 200 characters or less'),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message content must be 5000 characters or less'),
  attachments: z.array(z.string().url()).optional(),
});

// GET /api/messaging/direct - Get direct messages for the current user
export async function GET(request: NextRequest) {
  try {
    // Check authentication manually for API routes
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const conversationWith = searchParams.get('conversationWith'); // User ID to get conversation with

    let where: any = {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id },
      ],
      projectId: null, // Only direct messages
    };

    // If conversationWith is specified, filter to that conversation
    if (conversationWith) {
      where = {
        OR: [
          { senderId: session.user.id, recipientId: conversationWith },
          { senderId: conversationWith, recipientId: session.user.id },
        ],
        projectId: null,
      };
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        recipientId: session.user.id,
        isRead: false,
        projectId: null,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching direct messages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messaging/direct - Send a direct message
export async function POST(request: NextRequest) {
  try {
    // Check authentication manually for API routes
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createDirectMessageSchema.parse(body);

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: validatedData.recipientId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
      },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    if (recipient.isSuspended) {
      return NextResponse.json(
        { error: 'Cannot send message to suspended user' },
        { status: 403 }
      );
    }

    // Prevent sending to self
    if (recipient.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      );
    }

    // Get sender info
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId: validatedData.recipientId,
        subject: validatedData.subject,
        content: validatedData.content,
        attachments: validatedData.attachments || [],
        projectId: null, // Direct message
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Send email notification (async - don't wait for it)
    sendMessageNotification(
      recipient.email,
      recipient.name,
      sender.name,
      sender.email,
      validatedData.content,
      undefined, // No project for direct messages
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/messages?conversation=${session.user.id}`
    ).catch((error) => {
      console.error('Failed to send email notification:', error);
      // Don't fail the request if email fails
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating direct message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create message' },
      { status: 500 }
    );
  }
}

