import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireDeveloper } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { createConnectAccountLink, createOrUpdateConnectedAccount, getConnectedAccount } from '@/lib/stripe';

// GET /api/stripe/connect - Get Stripe Connect account status
export async function GET(request: NextRequest) {
  try {
    const user = await requireDeveloper();

    // Get developer profile
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        stripeAccountId: true,
        stripeOnboardingComplete: true,
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
        {
          connected: false,
          accountId: null,
          onboardingComplete: false,
        },
        { status: 200 }
      );
    }

    // Get account details from Stripe
    try {
      const account = await getConnectedAccount(developerProfile.stripeAccountId);

      return NextResponse.json(
        {
          connected: true,
          accountId: developerProfile.stripeAccountId,
          onboardingComplete:
            account.details_submitted === true &&
            account.charges_enabled === true &&
            account.payouts_enabled === true,
          accountDetails: {
            email: account.email,
            country: account.country,
            type: account.type,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Error fetching Stripe account:', error);
      return NextResponse.json(
        {
          connected: true,
          accountId: developerProfile.stripeAccountId,
          onboardingComplete: developerProfile.stripeOnboardingComplete,
          error: 'Failed to fetch account details',
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching Stripe Connect status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Stripe Connect status' },
      { status: 500 }
    );
  }
}

// POST /api/stripe/connect - Create Stripe Connect account
export async function POST(request: NextRequest) {
  try {
    const user = await requireDeveloper();
    const body = await request.json();
    const { country = 'US', returnUrl, refreshUrl } = body;

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

    let accountId = developerProfile.stripeAccountId;

    // Create or get existing account
    if (!accountId) {
      const account = await createOrUpdateConnectedAccount(
        user.email!,
        country,
        'express'
      );
      accountId = account.id;

      // Update developer profile
      await prisma.developerProfile.update({
        where: { id: developerProfile.id },
        data: {
          stripeAccountId: accountId,
        },
      });
    }

    // Create account link for onboarding
    if (returnUrl && refreshUrl) {
      const accountLink = await createConnectAccountLink(
        accountId,
        refreshUrl,
        returnUrl
      );

      return NextResponse.json(
        {
          accountId,
          onboardingUrl: accountLink.url,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        accountId,
        message: 'Account created. Use returnUrl and refreshUrl to get onboarding link.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating Stripe Connect account:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Stripe Connect account' },
      { status: 500 }
    );
  }
}

