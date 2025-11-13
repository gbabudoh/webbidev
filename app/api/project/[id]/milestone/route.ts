import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const updateMilestoneSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'APPROVED', 'DISPUTED', 'REJECTED']).optional(),
});

// GET /api/project/[id]/milestone - Get all milestones for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        clientId: true,
        selectedDeveloperId: true,
        status: true,
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

    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      include: {
        transactions: true,
        disputes: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            developer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ milestones }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

// PUT /api/project/[id]/milestone - Update milestone status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;
    const body = await request.json();
    const { milestoneId, ...updateData } = body;

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'milestoneId is required' },
        { status: 400 }
      );
    }

    const validatedData = updateMilestoneSchema.parse(updateData);

    // Get milestone and project
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          select: {
            id: true,
            clientId: true,
            selectedDeveloperId: true,
            status: true,
            budget: true,
          },
        },
      },
    });

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    if (milestone.projectId !== projectId) {
      return NextResponse.json(
        { error: 'Milestone does not belong to this project' },
        { status: 400 }
      );
    }

    // Check permissions based on action
    const status = validatedData.status;

    if (status === 'READY_FOR_REVIEW') {
      // Only developer can mark as ready for review
      if (user.role !== 'DEVELOPER' || milestone.project.selectedDeveloperId !== user.id) {
        return NextResponse.json(
          { error: 'Only the assigned developer can mark milestone as ready for review' },
          { status: 403 }
        );
      }
    }

    if (status === 'APPROVED' || status === 'DISPUTED') {
      // Only client can approve or dispute
      if (user.role !== 'CLIENT' || milestone.project.clientId !== user.id) {
        return NextResponse.json(
          { error: 'Only the project client can approve or dispute milestones' },
          { status: 403 }
        );
      }
    }

    // Update milestone
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: status || milestone.status,
        completedAt: status === 'READY_FOR_REVIEW' ? new Date() : milestone.completedAt,
        approvedAt: status === 'APPROVED' ? new Date() : milestone.approvedAt,
        disputedAt: status === 'DISPUTED' ? new Date() : milestone.disputedAt,
      },
      include: {
        transactions: true,
        disputes: true,
      },
    });

    return NextResponse.json({ milestone: updatedMilestone }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating milestone:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update milestone' },
      { status: 500 }
    );
  }
}

