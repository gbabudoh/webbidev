import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { createEscrowPaymentIntent, calculateCommission } from '@/lib/stripe';
import { z } from 'zod';

// Validation schema
const createPaymentSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  milestoneId: z.string().min(1, 'Milestone ID is required'),
});

// POST /api/payment - Create escrow payment for milestone
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Only clients can create payments
    if (user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Only clients can create payments' },
        { status: 403 }
      );
    }

    // Get project and milestone
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      include: {
        milestones: {
          where: { id: validatedData.milestoneId },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const milestone = project.milestones[0];
    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    // Check if milestone is ready for payment
    if (milestone.status !== 'READY_FOR_REVIEW') {
      return NextResponse.json(
        { error: 'Milestone must be ready for review before payment' },
        { status: 400 }
      );
    }

    // Check if payment already exists
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        projectId: validatedData.projectId,
        milestoneId: validatedData.milestoneId,
        status: { in: ['PENDING', 'HELD_IN_ESCROW'] },
      },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Payment already exists for this milestone' },
        { status: 400 }
      );
    }

    // Calculate payment amount
    const milestoneAmount = Number(project.budget) * (Number(milestone.paymentPercentage) / 100);
    const { commission, payout } = calculateCommission(milestoneAmount);

    // Get developer profile
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { userId: project.selectedDeveloperId! },
    });

    if (!developerProfile) {
      return NextResponse.json(
        { error: 'Developer profile not found' },
        { status: 404 }
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await createEscrowPaymentIntent(
      milestoneAmount,
      'usd',
      {
        projectId: project.id,
        milestoneId: milestone.id,
        developerId: developerProfile.id,
      }
    );

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        projectId: project.id,
        milestoneId: milestone.id,
        developerId: developerProfile.id,
        amount: milestoneAmount,
        webbidevFee: commission,
        developerPayout: payout,
        stripePaymentIntentId: paymentIntent.id,
        status: 'HELD_IN_ESCROW',
        heldAt: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        milestone: {
          select: {
            id: true,
            title: true,
          },
        },
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
    });

    return NextResponse.json(
      {
        transaction,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// GET /api/payment - Get transactions (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    let where: any = {};

    if (user.role === 'CLIENT') {
      // Clients see transactions for their projects
      where.project = {
        clientId: user.id,
      };
    }

    if (user.role === 'DEVELOPER') {
      // Developers see their own transactions
      const developerProfile = await prisma.developerProfile.findUnique({
        where: { userId: user.id },
      });

      if (!developerProfile) {
        return NextResponse.json(
          { error: 'Developer profile not found' },
          { status: 404 }
        );
      }

      where.developerId = developerProfile.id;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
          },
        },
        milestone: {
          select: {
            id: true,
            title: true,
            paymentPercentage: true,
          },
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

