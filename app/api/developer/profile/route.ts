import { NextRequest, NextResponse } from 'next/server';
import { requireDeveloper } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Skill } from '@/types';

// Validation schema
const updateProfileSchema = z.object({
  portfolioUrl: z.string().url('Invalid portfolio URL'),
  bioSummary: z.string().min(10, 'Bio summary must be at least 10 characters').max(400, 'Bio summary must be 400 characters or less'),
  location: z.string().min(1, 'Location is required'),
  timeZone: z.string().optional().nullable(),
  skills: z.array(z.enum([
    'REACT', 'VUE_JS', 'ANGULAR', 'JAVASCRIPT', 'TYPESCRIPT', 'TAILWIND_CSS', 'SASS', 'ACCESSIBILITY_A11Y', 'NEXT_JS', 'HTML_CSS',
    'NODE_JS', 'PYTHON_DJANGO', 'PYTHON_FLASK', 'PHP_LARAVEL', 'RUBY_ON_RAILS', 'GO', 'POSTGRESQL', 'MYSQL', 'MONGODB', 'AWS', 'AZURE', 'RESTFUL_APIS', 'GRAPHQL',
    'FIGMA', 'SKETCH', 'ADOBE_XD', 'PROTOTYPING', 'USER_RESEARCH', 'WIREFRAMING', 'DESIGN_SYSTEMS'
  ] as const)).length(5, 'Exactly 5 skills are required'),
});

// GET /api/developer/profile - Get current developer's profile
export async function GET(request: NextRequest) {
  try {
    const user = await requireDeveloper();

    const profile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Developer profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        portfolioUrl: profile.portfolioUrl,
        bioSummary: profile.bioSummary,
        location: profile.location,
        timeZone: profile.timeZone,
        skills: profile.skills,
        totalEarnings: Number(profile.totalEarnings),
        totalProjects: profile.totalProjects,
        completedProjects: profile.completedProjects,
        isVerified: profile.isVerified,
        isActive: profile.isActive,
        user: profile.user,
      },
    });
  } catch (error: any) {
    console.error('Error fetching developer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developer profile', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/developer/profile - Create or update developer profile
export async function POST(request: NextRequest) {
  try {
    const user = await requireDeveloper();
    const body = await request.json();

    // Validate request body
    const validationResult = updateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { portfolioUrl, bioSummary, location, timeZone, skills } = validationResult.data;

    // Check if profile exists
    const existingProfile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.developerProfile.update({
        where: { userId: user.id },
        data: {
          portfolioUrl,
          bioSummary,
          location,
          timeZone: timeZone || null,
          skills: skills as Skill[],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } else {
      // Create new profile
      profile = await prisma.developerProfile.create({
        data: {
          userId: user.id,
          portfolioUrl,
          bioSummary,
          location,
          timeZone: timeZone || null,
          skills: skills as Skill[],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        portfolioUrl: profile.portfolioUrl,
        bioSummary: profile.bioSummary,
        location: profile.location,
        timeZone: profile.timeZone,
        skills: profile.skills,
        totalEarnings: Number(profile.totalEarnings),
        totalProjects: profile.totalProjects,
        completedProjects: profile.completedProjects,
        isVerified: profile.isVerified,
        isActive: profile.isActive,
        user: profile.user,
      },
    });
  } catch (error: any) {
    console.error('Error creating/updating developer profile:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create/update developer profile', message: error.message },
      { status: 500 }
    );
  }
}

