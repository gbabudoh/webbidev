import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/users/search - Search users for direct messaging
export async function GET(request: NextRequest) {
  try {
    // Check authentication manually for API routes
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role'); // Optional role filter

    let where: any = {
      id: { not: session.user.id }, // Exclude current user
      isSuspended: false, // Only active users
    };

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role filter
    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 50, // Limit results
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search users' },
      { status: 500 }
    );
  }
}

