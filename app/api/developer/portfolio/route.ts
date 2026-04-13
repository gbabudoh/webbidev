import { NextRequest, NextResponse } from 'next/server';
import { requireDeveloper } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const portfolioProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be 1000 characters or less'),
  techStack: z.array(z.string().min(1).max(50)).min(1, 'Add at least one technology').max(15, 'Maximum 15 technologies'),
  liveUrl: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().int().min(0).optional().default(0),
});

// GET /api/developer/portfolio — list all portfolio projects for the current developer
export async function GET() {
  try {
    const user = await requireDeveloper();

    const profile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Developer profile not found' }, { status: 404 });
    }

    const projects = await prisma.portfolioProject.findMany({
      where: { developerId: profile.id },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ projects });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch portfolio', message }, { status: 500 });
  }
}

// POST /api/developer/portfolio — create a new portfolio project
export async function POST(request: NextRequest) {
  try {
    const user = await requireDeveloper();
    const body = await request.json();

    const result = portfolioProjectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.errors },
        { status: 400 }
      );
    }

    const profile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Developer profile not found' }, { status: 404 });
    }

    // Enforce max 12 portfolio projects
    const count = await prisma.portfolioProject.count({ where: { developerId: profile.id } });
    if (count >= 12) {
      return NextResponse.json(
        { error: 'Maximum of 12 portfolio projects allowed' },
        { status: 400 }
      );
    }

    const { liveUrl, imageUrl, ...rest } = result.data;

    const project = await prisma.portfolioProject.create({
      data: {
        ...rest,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        developerId: profile.id,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create portfolio project', message }, { status: 500 });
  }
}
