import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            clientProjects: true,
          },
        },
        developerProfile: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
      isSuspended: user.isSuspended,
      suspendedAt: user.suspendedAt,
      suspendedBy: user.suspendedBy,
      suspensionReason: user.suspensionReason,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      projectCount: user._count.clientProjects,
      hasDeveloperProfile: !!user.developerProfile,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
