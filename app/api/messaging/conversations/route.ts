import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/messaging/conversations - Get all conversations for the current user
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

    // Get all projects where user is involved (as client or developer)
    // For developers, we need to check via DeveloperProfile
    let whereClause: any = { clientId: userId };
    
    if (session.user.role === 'DEVELOPER') {
      const developerProfile = await prisma.developerProfile.findUnique({
        where: { userId },
        select: { id: true },
      });
      
      if (developerProfile) {
        whereClause = {
          OR: [
            { clientId: userId },
            { selectedDeveloperId: developerProfile.id },
          ],
        };
      }
    } else if (session.user.role === 'ADMIN') {
      // Admins can see all projects
      whereClause = {};
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // For each project, get the developer if selected
    const projectsWithDeveloper = await Promise.all(
      projects.map(async (project) => {
        if (project.selectedDeveloperId) {
          const developer = await prisma.developerProfile.findUnique({
            where: { id: project.selectedDeveloperId },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          });
          return { ...project, selectedDeveloper: developer };
        }
        return { ...project, selectedDeveloper: null };
      })
    );

    // Format conversations
    const conversations = projectsWithDeveloper.map((project) => {
      // Determine the other party
      let otherParty;
      if (session.user.role === 'CLIENT') {
        otherParty = project.selectedDeveloper?.user || null;
      } else if (session.user.role === 'DEVELOPER') {
        otherParty = project.client;
      } else {
        // Admin can see both
        otherParty = project.selectedDeveloper?.user || project.client;
      }

      const lastMessage = project.messages[0] || null;
      const unreadCount = 0; // TODO: Implement unread tracking

      return {
        id: project.id,
        projectId: project.id,
        projectTitle: project.title,
        otherParty: otherParty ? {
          id: otherParty.id,
          name: otherParty.name,
          email: otherParty.email,
          role: otherParty.role,
        } : null,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          senderId: lastMessage.senderId,
          sender: lastMessage.sender,
          createdAt: lastMessage.createdAt,
        } : null,
        unreadCount,
        messageCount: project._count.messages,
        updatedAt: project.updatedAt,
      };
    });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

