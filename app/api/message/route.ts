import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const createMessageSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  content: z.string().min(1, 'Message content is required'),
  attachments: z.array(z.string().url()).optional(),
  isEvidence: z.boolean().optional().default(false),
});

// GET /api/message - Get messages for a project
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
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

    // Check permissions
    if (user.role === 'CLIENT' && project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (user.role === 'DEVELOPER' && project.selectedDeveloperId !== user.id) {
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

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/message - Create a new message
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
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

    // Check permissions
    if (user.role === 'CLIENT' && project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (user.role === 'DEVELOPER' && project.selectedDeveloperId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        projectId: validatedData.projectId,
        senderId: user.id,
        content: validatedData.content,
        attachments: validatedData.attachments || [],
        isEvidence: validatedData.isEvidence || false,
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
      },
    });

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

