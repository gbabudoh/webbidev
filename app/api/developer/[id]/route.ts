import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/developer/[id] - Get developer by ID (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check database connection first
    try {
      await prisma.$connect();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        {
          error: 'Database connection failed',
          message: dbError.message || 'Unable to connect to database',
        },
        { status: 500 }
      );
    }

    const developerId = params.id;

    const developer = await prisma.developerProfile.findUnique({
      where: { id: developerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        proposals: {
          where: {
            status: 'ACCEPTED',
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        transactions: {
          where: {
            status: 'COMPLETED',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    // Check if profile is active and not suspended
    if (!developer.isActive || developer.isSuspended) {
      return NextResponse.json(
        { error: 'Developer profile is not available' },
        { status: 404 }
      );
    }

    // Format response
    const formattedDeveloper = {
      id: developer.id,
      userId: developer.userId,
      portfolioUrl: developer.portfolioUrl,
      bioSummary: developer.bioSummary,
      location: developer.location,
      timeZone: developer.timeZone,
      skills: developer.skills,
      totalEarnings: Number(developer.totalEarnings),
      totalProjects: developer.totalProjects,
      completedProjects: developer.completedProjects,
      isVerified: developer.isVerified,
      isActive: developer.isActive,
      user: developer.user,
      recentProjects: developer.proposals.map((p) => ({
        id: p.project.id,
        title: p.project.title,
        status: p.project.status,
      })),
      recentEarnings: developer.transactions.map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        createdAt: t.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({ developer: formattedDeveloper });
  } catch (error: any) {
    console.error('Error fetching developer:', error);
    
    // Check if it's a Prisma error
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        {
          error: 'Database connection failed',
          message: 'Unable to connect to database. Please check your DATABASE_URL in .env.local',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch developer',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

