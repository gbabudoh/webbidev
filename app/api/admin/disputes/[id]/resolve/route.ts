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
    const { resolution, favorOf } = await request.json();

    if (!resolution || !resolution.trim()) {
      return NextResponse.json(
        { error: 'Resolution text is required' },
        { status: 400 }
      );
    }

    const dispute = await prisma.dispute.update({
      where: { id },
      data: {
        status: favorOf === 'CLIENT' ? 'RESOLVED_CLIENT_WINS' : 'RESOLVED_DEVELOPER_WINS',
        reviewerDecision: resolution,
        reviewerId: session.user.id,
        reviewerDecisionAt: new Date(),
        resolvedAt: new Date(),
        resolvedInFavorOf: favorOf || 'CLIENT',
      },
      include: {
        project: true,
        client: true,
        developer: true,
      },
    });

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return NextResponse.json(
      { error: 'Failed to resolve dispute' },
      { status: 500 }
    );
  }
}
