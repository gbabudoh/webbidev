import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireDeveloper } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { createConnectLoginLink } from '@/lib/stripe';

// GET /api/stripe/connect/login - Get Stripe Connect login link
export async function GET(request: NextRequest) {
  try {
    const user = await requireDeveloper();

    // Get developer profile
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        stripeAccountId: true,
      },
    });

    if (!developerProfile) {
      return NextResponse.json(
        { error: 'Developer profile not found' },
        { status: 404 }
      );
    }

    if (!developerProfile.stripeAccountId) {
      return NextResponse.json(
        { error: 'Stripe Connect account not found. Please complete onboarding first.' },
        { status: 400 }
      );
    }

    // Create login link
    const loginLink = await createConnectLoginLink(developerProfile.stripeAccountId);

    return NextResponse.json(
      {
        loginUrl: loginLink.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating Stripe Connect login link:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create login link' },
      { status: 500 }
    );
  }
}

