import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { prisma } from '@/lib/db';

// GET /api/project/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
          include: {
            transactions: true,
            disputes: true,
          },
        },
        proposals: {
          include: {
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
        },
        messages: {
          orderBy: { createdAt: 'asc' },
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
        },
        transactions: true,
        disputes: true,
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

    if (user.role === 'DEVELOPER' && project.status !== 'OPEN' && project.selectedDeveloperId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/project/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;
    const body = await request.json();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only client owner or admin can update
    if (user.role !== 'ADMIN' && project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Only allow status updates for certain roles
    const allowedUpdates: any = {};
    
    if (user.role === 'CLIENT') {
      if (body.status === 'OPEN' && project.status === 'DRAFT') {
        allowedUpdates.status = 'OPEN';
      }
      if (body.status === 'CANCELLED' && project.status !== 'COMPLETED') {
        allowedUpdates.status = 'CANCELLED';
      }
    }

    if (user.role === 'ADMIN') {
      allowedUpdates.status = body.status;
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: allowedUpdates,
      include: {
        milestones: {
          orderBy: { order: 'asc' },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/project/[id] - Delete a project (only if no proposals)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            proposals: true,
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

    // Only client owner or admin can delete
    if (user.role !== 'ADMIN' && project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Can't delete if there are proposals
    if (project._count.proposals > 0) {
      return NextResponse.json(
        { error: 'Cannot delete project with existing proposals' },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}

