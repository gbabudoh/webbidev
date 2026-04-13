import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { Prisma, DisputeStatus } from '@prisma/client';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true, budget: true, status: true } },
        milestone: { select: { id: true, title: true, order: true } },
        client: { select: { id: true, name: true, email: true } },
        developer: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } },
      },
    });

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error('Admin dispute detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch dispute' }, { status: 500 });
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
    const { adminNotes, status } = body;

    const updateData: Prisma.DisputeUpdateInput = {
      ...(adminNotes !== undefined && { adminNotes: adminNotes as string | null }),
      ...(status && { status: status as DisputeStatus }),
    };

    const dispute = await prisma.dispute.update({
      where: { id },
      data: updateData,
    });

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: status ? 'UPDATE_DISPUTE_STATUS' : 'UPDATE_DISPUTE_NOTES',
        targetType: 'DISPUTE',
        targetId: id,
        description: status ? `Updated dispute status to ${status}` : 'Updated dispute admin notes',
      },
    });

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error('Admin dispute update error:', error);
    return NextResponse.json({ error: 'Failed to update dispute' }, { status: 500 });
  }
}
