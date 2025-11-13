import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/users - Get all users (admin only)
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
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const whereConditions: any = {};

    // Search filter
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Role filter
    if (role) {
      whereConditions.role = role;
    }

    // Status filter
    if (status === 'suspended') {
      whereConditions.isSuspended = true;
    } else if (status === 'active') {
      whereConditions.isSuspended = false;
    }

    // Build where object for queries
    const hasFilters = Object.keys(whereConditions).length > 0;
    const where = hasFilters ? whereConditions : {};

    // Get users with counts
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      hasFilters 
        ? prisma.user.count({ where: whereConditions })
        : prisma.user.count(),
    ]);

    // Format response
    const formattedUsers = users.map((user) => ({
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
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    // Check if it's an authentication error
    if (error.message?.includes('redirect') || error.message?.includes('unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch users',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

