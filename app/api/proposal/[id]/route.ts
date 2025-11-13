import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireClient } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const updateProposalSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
});

// GET /api/proposal/[id] - Get a specific proposal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const proposalId = params.id;

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            milestones: {
              orderBy: { order: 'asc' },
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
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'CLIENT' && proposal.project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (user.role === 'DEVELOPER' && proposal.developer.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ proposal }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposal/[id] - Accept or reject a proposal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireClient();
    const proposalId = params.id;
    const body = await request.json();
    const validatedData = updateProposalSchema.parse(body);

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        project: {
          select: {
            id: true,
            clientId: true,
            status: true,
            selectedDeveloperId: true,
            selectedProposalId: true,
          },
        },
        developer: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    // Only project client can accept/reject proposals
    if (proposal.project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Only allow accepting if project is open
    if (validatedData.status === 'ACCEPTED' && proposal.project.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Project is not accepting proposals' },
        { status: 400 }
      );
    }

    // If accepting, update project to select this developer
    if (validatedData.status === 'ACCEPTED') {
      // Reject all other proposals for this project
      await prisma.proposal.updateMany({
        where: {
          projectId: proposal.projectId,
          id: { not: proposalId },
        },
        data: {
          status: 'REJECTED',
        },
      });

      // Update project
      await prisma.project.update({
        where: { id: proposal.projectId },
        data: {
          status: 'IN_PROGRESS',
          selectedDeveloperId: proposal.developer.userId,
          selectedProposalId: proposalId,
        },
      });
    }

    // Update proposal status
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: validatedData.status,
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            milestones: {
              orderBy: { order: 'asc' },
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
    });

    return NextResponse.json({ proposal: updatedProposal }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

