import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireClient } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { capturePaymentIntent, createTransferToDeveloper } from '@/lib/stripe';

// POST /api/payment/[id]/release - Release escrow funds to developer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireClient();
    const transactionId = params.id;

    // Get transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        project: {
          select: {
            id: true,
            clientId: true,
            status: true,
          },
        },
        milestone: {
          select: {
            id: true,
            status: true,
          },
        },
        developer: {
          select: {
            id: true,
            stripeAccountId: true,
            stripeOnboardingComplete: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Only project client can release funds
    if (transaction.project.clientId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check transaction status
    if (transaction.status !== 'HELD_IN_ESCROW') {
      return NextResponse.json(
        { error: 'Transaction is not in escrow' },
        { status: 400 }
      );
    }

    // Check milestone status
    if (transaction.milestone.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Milestone must be approved before releasing funds' },
        { status: 400 }
      );
    }

    // Check if developer has Stripe Connect account
    if (!transaction.developer.stripeAccountId || !transaction.developer.stripeOnboardingComplete) {
      return NextResponse.json(
        { error: 'Developer has not completed Stripe onboarding' },
        { status: 400 }
      );
    }

    // Capture payment intent (release from escrow)
    if (transaction.stripePaymentIntentId) {
      await capturePaymentIntent(transaction.stripePaymentIntentId);
    }

    // Transfer funds to developer's Stripe Connect account
    const transfer = await createTransferToDeveloper(
      transaction.developer.stripeAccountId,
      transaction.developerPayout,
      'usd',
      {
        projectId: transaction.projectId,
        milestoneId: transaction.milestoneId,
        transactionId: transaction.id,
      }
    );

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'RELEASED',
        stripeTransferId: transfer.id,
        releasedAt: new Date(),
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

    // Update developer earnings
    await prisma.developerProfile.update({
      where: { id: transaction.developerId },
      data: {
        totalEarnings: {
          increment: transaction.developerPayout,
        },
      },
    });

    return NextResponse.json(
      { transaction: updatedTransaction },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error releasing payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to release payment' },
      { status: 500 }
    );
  }
}

