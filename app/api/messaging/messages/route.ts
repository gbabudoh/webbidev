import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { sendMessageNotification } from '@/lib/email';

// Validation schema
const createMessageSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message content must be 5000 characters or less'),
  attachments: z.array(z.string().url()).optional(),
  isEvidence: z.boolean().optional().default(false),
});

// GET /api/messaging/messages - Get messages for a conversation (project)
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
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get project to check permissions
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        clientId: true,
        selectedDeveloperId: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check permissions - allow client, developer, and admin
    let isAuthorized = false;
    
    if (session.user.role === 'ADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'CLIENT' && project.clientId === session.user.id) {
      isAuthorized = true;
    } else if (session.user.role === 'DEVELOPER' && project.selectedDeveloperId) {
      // Check if developer profile matches
      const developerProfile = await prisma.developerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (developerProfile && project.selectedDeveloperId === developerProfile.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: { projectId },
      include: {
        sender: {
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

    // Determine other party
    let otherParty = null;
    if (session.user.role === 'CLIENT') {
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
        otherParty = developer?.user || null;
      }
    } else if (session.user.role === 'DEVELOPER') {
      otherParty = project.client;
    } else {
      // Admin can see both - get developer if exists
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
        otherParty = developer?.user || project.client;
      } else {
        otherParty = project.client;
      }
    }

    return NextResponse.json({
      messages,
      project: {
        id: project.id,
        title: project.title,
      },
      otherParty,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messaging/messages - Create a new message
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
    const validatedData = createMessageSchema.parse(body);

    // Get project to check permissions
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      select: {
        id: true,
        clientId: true,
        selectedDeveloperId: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check permissions - allow client, developer, and admin
    let isAuthorized = false;
    
    if (session.user.role === 'ADMIN') {
      isAuthorized = true;
    } else if (session.user.role === 'CLIENT' && project.clientId === session.user.id) {
      isAuthorized = true;
    } else if (session.user.role === 'DEVELOPER' && project.selectedDeveloperId) {
      // Check if developer profile matches
      const developerProfile = await prisma.developerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (developerProfile && project.selectedDeveloperId === developerProfile.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        projectId: validatedData.projectId,
        senderId: session.user.id,
        content: validatedData.content,
        attachments: validatedData.attachments || [],
        isEvidence: validatedData.isEvidence || false,
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
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Send email notification to the other party (async - don't wait for it)
    if (project.selectedDeveloperId) {
      // Get developer user
      const developer = await prisma.developerProfile.findUnique({
        where: { id: project.selectedDeveloperId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (developer && session.user.role === 'CLIENT') {
        const sender = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true },
        });

        sendMessageNotification(
          developer.user.email,
          developer.user.name,
          sender?.name || null,
          sender?.email || '',
          validatedData.content,
          message.project?.title,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/developer/messages?project=${validatedData.projectId}`
        ).catch((error) => {
          console.error('Failed to send email notification:', error);
        });
      }
    } else if (session.user.role === 'DEVELOPER') {
      // Get client user
      const client = await prisma.user.findUnique({
        where: { id: project.clientId },
        select: { name: true, email: true },
      });

      if (client) {
        const sender = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true },
        });

        sendMessageNotification(
          client.email,
          client.name,
          sender?.name || null,
          sender?.email || '',
          validatedData.content,
          message.project?.title,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/client/messages?project=${validatedData.projectId}`
        ).catch((error) => {
          console.error('Failed to send email notification:', error);
        });
      }
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create message' },
      { status: 500 }
    );
  }
}

