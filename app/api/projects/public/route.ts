import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/projects/public — Public endpoint: returns OPEN projects with safe fields only
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skillType = searchParams.get('skillType');

    const where: Record<string, unknown> = { status: 'OPEN' };
    if (skillType) where.skillType = skillType;

    const projects = await prisma.project.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        deadline: true,
        skillType: true,
        createdAt: true,
        client: {
          select: {
            name: true,
          },
        },
        milestones: {
          select: { id: true },
        },
        _count: {
          select: { proposals: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
