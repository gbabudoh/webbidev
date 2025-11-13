import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// GET /api/developer - Get developers (public endpoint)
export async function GET(request: NextRequest) {
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
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const skills = searchParams.get('skills')?.split(',').filter(Boolean);
    const location = searchParams.get('location');
    const minEarnings = searchParams.get('minEarnings');
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
      isSuspended: false,
    };

    // Search filter
    if (search) {
      where.OR = [
        { bioSummary: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Skills filter
    if (skills && skills.length > 0) {
      where.skills = {
        hasSome: skills,
      };
    }

    // Location filter
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    // Min earnings filter
    if (minEarnings) {
      where.totalEarnings = {
        gte: parseFloat(minEarnings),
      };
    }

    // Verified filter
    if (verified === 'true') {
      where.isVerified = true;
    }

    // Get developers with pagination
    const [developers, total] = await Promise.all([
      prisma.developerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { isVerified: 'desc' },
          { totalEarnings: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.developerProfile.count({ where }),
    ]);

    // Format response
    const formattedDevelopers = developers.map((dev) => ({
      id: dev.id,
      userId: dev.userId,
      portfolioUrl: dev.portfolioUrl,
      bioSummary: dev.bioSummary,
      location: dev.location,
      timeZone: dev.timeZone,
      skills: dev.skills,
      totalEarnings: Number(dev.totalEarnings),
      totalProjects: dev.totalProjects,
      completedProjects: dev.completedProjects,
      isVerified: dev.isVerified,
      isActive: dev.isActive,
      user: dev.user,
    }));

    return NextResponse.json({
      developers: formattedDevelopers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching developers:', error);
    
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

    // Check if it's a schema error
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        {
          error: 'Database schema not found',
          message: 'Please run: npm run db:push to create the database schema',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch developers',
        message: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

