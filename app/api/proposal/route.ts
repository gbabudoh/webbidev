import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireDeveloper } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const createProposalSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  rate: z.number().positive().optional(),
  estimatedTime: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// GET /api/proposal - Get proposals (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    let where: any = {};

    if (user.role === 'DEVELOPER') {
      // Developers see their own proposals
      const developerProfile = await prisma.developerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!developerProfile) {
        return NextResponse.json(
          { error: 'Developer profile not found' },
          { status: 404 }
        );
      }

      where.developerId = developerProfile.id;
    }

    if (user.role === 'CLIENT') {
      // Clients see proposals for their projects
      where.project = {
        clientId: user.id,
      };
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        developer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ proposals }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposal - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const user = await requireDeveloper();
    const body = await request.json();
    const validatedData = createProposalSchema.parse(body);

    // Get developer profile
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!developerProfile) {
      return NextResponse.json(
        { error: 'Developer profile not found. Please complete your profile first.' },
        { status: 404 }
      );
    }

    // Check if project exists and is open
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      select: {
        id: true,
        status: true,
        clientId: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Project is not accepting proposals' },
        { status: 400 }
      );
    }

    // Check if developer already submitted a proposal
    const existingProposal = await prisma.proposal.findUnique({
      where: {
        projectId_developerId: {
          projectId: validatedData.projectId,
          developerId: developerProfile.id,
        },
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: 'You have already submitted a proposal for this project' },
        { status: 400 }
      );
    }

    // Create proposal
    const proposal = await prisma.proposal.create({
      data: {
        projectId: validatedData.projectId,
        developerId: developerProfile.id,
        rate: validatedData.rate,
        estimatedTime: validatedData.estimatedTime,
        message: validatedData.message,
        status: 'PENDING',
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
          },
        },
        developer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create proposal' },
      { status: 500 }
    );
  }
}

