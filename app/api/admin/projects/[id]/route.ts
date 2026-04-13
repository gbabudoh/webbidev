import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true, country: true, createdAt: true } },
        milestones: { orderBy: { order: 'asc' }, include: { transactions: true, disputes: true } },
        proposals: {
          include: { developer: { include: { user: { select: { id: true, name: true, email: true } } } } },
          orderBy: { createdAt: 'desc' },
        },
        transactions: { orderBy: { createdAt: 'desc' } },
        disputes: {
          include: {
            client: { select: { id: true, name: true, email: true } },
            developer: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Admin project detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, reason } = body;

    const validStatuses = ['DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_PROJECT_STATUS',
        targetType: 'PROJECT',
        targetId: id,
        description: `Changed project status to ${status}${reason ? `: ${reason}` : ''}`,
        metadata: { previousStatus: body.previousStatus, newStatus: status, reason },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Admin project update error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
