import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional().nullable(),
  company: z.string().max(200, 'Company name must be 200 characters or less').optional().nullable(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional().nullable(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional().nullable(),
});

// GET /api/client/profile - Get current client's profile
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
    
    if (session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Forbidden. Client access required.' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            clientProjects: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get client stats
    const totalProjects = user._count.clientProjects;
    const completedProjects = await prisma.project.count({
      where: {
        clientId: user.id,
        status: 'COMPLETED',
      },
    });
    const activeProjects = await prisma.project.count({
      where: {
        clientId: user.id,
        status: 'IN_PROGRESS',
      },
    });

    // Calculate total spent
    const transactions = await prisma.transaction.findMany({
      where: {
        project: {
          clientId: user.id,
        },
        status: 'RELEASED',
      },
      select: {
        amount: true,
      },
    });
    const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: null, // Will be stored in a metadata field or separate table if needed
        location: null,
        bio: null,
        totalProjects,
        completedProjects,
        activeProjects,
        totalSpent: Number(totalSpent),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client profile', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/client/profile - Update client profile
export async function POST(request: NextRequest) {
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
    
    if (session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Forbidden. Client access required.' },
        { status: 403 }
      );
    }

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

    const { name, company, location, bio } = validationResult.data;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        // Note: company, location, and bio would need to be stored in a separate table
        // or as JSON metadata. For now, we'll just update the name.
      },
      include: {
        _count: {
          select: {
            clientProjects: true,
          },
        },
      },
    });

    // Get client stats
    const totalProjects = updatedUser._count.clientProjects;
    const completedProjects = await prisma.project.count({
      where: {
        clientId: updatedUser.id,
        status: 'COMPLETED',
      },
    });
    const activeProjects = await prisma.project.count({
      where: {
        clientId: updatedUser.id,
        status: 'IN_PROGRESS',
      },
    });

    // Calculate total spent
    const transactions = await prisma.transaction.findMany({
      where: {
        project: {
          clientId: updatedUser.id,
        },
        status: 'RELEASED',
      },
      select: {
        amount: true,
      },
    });
    const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        company: company || null,
        location: location || null,
        bio: bio || null,
        totalProjects,
        completedProjects,
        activeProjects,
        totalSpent: Number(totalSpent),
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating client profile:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update client profile', message: error.message },
      { status: 500 }
    );
  }
}

