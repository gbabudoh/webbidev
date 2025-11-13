import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Unsuspend the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: false,
        suspendedAt: null,
        suspendedBy: null,
        suspensionReason: null,
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id!,
        action: 'UNSUSPENDED_USER',
        targetType: 'USER',
        targetId: id,
        description: `Unsuspended user ${targetUser.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User unsuspended successfully',
    });
  } catch (error: any) {
    console.error('Error unsuspending user:', error);
    return NextResponse.json(
      { error: 'Failed to unsuspend user' },
      { status: 500 }
    );
  }
}
