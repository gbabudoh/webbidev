import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/messaging/conversations/direct - Get direct message conversations
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

    const userId = session.user.id;

    try {
      // Get all unique users the current user has messaged with (direct messages only)
      // Direct messages have projectId = null and recipientId is not null
      const sentMessages = await prisma.message.findMany({
        where: {
          senderId: userId,
          projectId: null,
          recipientId: { not: null },
        },
        select: {
          recipientId: true,
        },
      });

      const receivedMessages = await prisma.message.findMany({
        where: {
          recipientId: userId,
          projectId: null,
        },
        select: {
          senderId: true,
        },
      });

      // Combine and get unique user IDs
      const userIds = new Set<string>();
      sentMessages.forEach((m) => {
        if (m.recipientId) {
          userIds.add(m.recipientId);
        }
      });
      receivedMessages.forEach((m) => {
        if (m.senderId) {
          userIds.add(m.senderId);
        }
      });

      // If no conversations exist, return empty array
      if (userIds.size === 0) {
        return NextResponse.json({ conversations: [] }, { status: 200 });
      }

      // Get user details and last message for each conversation
      const conversations = await Promise.all(
        Array.from(userIds).map(async (otherUserId) => {
          try {
            const otherUser = await prisma.user.findUnique({
              where: { id: otherUserId },
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            });

            if (!otherUser) return null;

            // Get last message in this conversation
            const lastMessage = await prisma.message.findFirst({
              where: {
                OR: [
                  { senderId: userId, recipientId: otherUserId, projectId: null },
                  { senderId: otherUserId, recipientId: userId, projectId: null },
                ],
              },
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            });

            // Get unread count
            const unreadCount = await prisma.message.count({
              where: {
                senderId: otherUserId,
                recipientId: userId,
                projectId: null,
                isRead: false,
              },
            });

            return {
              id: otherUser.id,
              userId: otherUser.id,
              otherParty: {
                id: otherUser.id,
                name: otherUser.name,
                email: otherUser.email,
                role: otherUser.role,
              },
              lastMessage: lastMessage
                ? {
                    id: lastMessage.id,
                    subject: lastMessage.subject,
                    content: lastMessage.content,
                    senderId: lastMessage.senderId,
                    sender: lastMessage.sender,
                    createdAt: lastMessage.createdAt,
                  }
                : null,
              unreadCount,
              updatedAt: lastMessage?.createdAt || new Date(),
            };
          } catch (err: any) {
            console.error(`Error processing conversation with user ${otherUserId}:`, err);
            return null;
          }
        })
      );

      // Filter out nulls and sort by last message time
      const validConversations = conversations
        .filter((c): c is NonNullable<typeof c> => c !== null)
        .sort((a, b) => {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return timeB - timeA;
        });

      return NextResponse.json({ conversations: validConversations }, { status: 200 });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      console.error('Error meta:', dbError.meta);
      
      // If it's a schema error, return empty array for now
      if (dbError.code === 'P2002' || dbError.message?.includes('column') || dbError.message?.includes('does not exist')) {
        console.warn('Schema might not be fully synced. Returning empty conversations.');
        return NextResponse.json({ conversations: [] }, { status: 200 });
      }
      
      throw dbError;
    }
  } catch (error: any) {
    console.error('Error fetching direct conversations:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch conversations',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
