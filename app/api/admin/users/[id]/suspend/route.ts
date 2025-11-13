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
    const { reason } = await request.json();

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: 'Suspension reason is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent suspending super admins
    if (targetUser.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Cannot suspend super admin' },
        { status: 403 }
      );
    }

    // Suspend the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: true,
        suspendedAt: new Date(),
        suspendedBy: session.user.id,
        suspensionReason: reason.trim(),
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id!,
        action: 'SUSPENDED_USER',
        targetType: 'USER',
        targetId: id,
        description: `Suspended user ${targetUser.email}`,
        metadata: { reason: reason.trim() },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User suspended successfully',
    });
  } catch (error: any) {
    console.error('Error suspending user:', error);
    return NextResponse.json(
      { error: 'Failed to suspend user' },
      { status: 500 }
    );
  }
}
