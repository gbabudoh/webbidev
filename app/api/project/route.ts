import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schemas
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  budget: z.number().positive('Budget must be positive'),
  deadline: z.string().datetime('Invalid deadline date'),
  skillType: z.enum(['Frontend', 'Backend', 'Fullstack', 'UI/UX']),
  milestones: z.array(
    z.object({
      title: z.string().min(1, 'Milestone title is required'),
      definitionOfDone: z.string().min(10, 'Definition of done must be at least 10 characters'),
      paymentPercentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
      order: z.number().int().positive(),
    })
  ).min(3, 'At least 3 milestones are required').max(5, 'Maximum 5 milestones allowed'),
});

// GET /api/project - Get all projects (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const skillType = searchParams.get('skillType');

    let where: any = {};

    // Clients see only their projects
    if (user.role === 'CLIENT') {
      where.clientId = user.id;
    }

    // Developers see open projects
    if (user.role === 'DEVELOPER') {
      where.status = 'OPEN';
    }

    // Admins see all projects
    if (user.role === 'ADMIN') {
      // No filter - see all
    }

    if (status) {
      where.status = status;
    }

    if (skillType) {
      where.skillType = skillType;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
        proposals: {
          include: {
            developer: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/project - Create a new project
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Only clients can create projects
    if (user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Only clients can create projects' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    // Validate milestone percentages sum to 100
    const totalPercentage = validatedData.milestones.reduce(
      (sum, m) => sum + m.paymentPercentage,
      0
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      return NextResponse.json(
        { error: 'Milestone percentages must sum to 100%' },
        { status: 400 }
      );
    }

    // Create project with milestones
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        budget: validatedData.budget,
        deadline: new Date(validatedData.deadline),
        skillType: validatedData.skillType,
        clientId: user.id,
        status: 'DRAFT',
        milestones: {
          create: validatedData.milestones.map((milestone) => ({
            title: milestone.title,
            definitionOfDone: milestone.definitionOfDone,
            paymentPercentage: milestone.paymentPercentage,
            order: milestone.order,
            status: 'PENDING',
          })),
        },
      },
      include: {
        milestones: {
          orderBy: { order: 'asc' },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

