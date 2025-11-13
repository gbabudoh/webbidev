import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { reason } = await request.json();

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const dispute = await prisma.dispute.update({
      where: { id },
      data: {
        status: 'CLOSED',
        reviewerDecision: reason,
        reviewerId: session.user.id,
        reviewerDecisionAt: new Date(),
        closedAt: new Date(),
      },
      include: {
        project: true,
        client: true,
        developer: true,
      },
    });

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error('Error rejecting dispute:', error);
    return NextResponse.json(
      { error: 'Failed to reject dispute' },
      { status: 500 }
    );
  }
}
