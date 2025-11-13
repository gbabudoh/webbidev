import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'transfer.created':
        await handleTransferCreated(event.data.object as Stripe.Transfer);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle payment intent succeeded
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'HELD_IN_ESCROW',
          heldAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
  }
}

// Handle payment intent failed
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
        },
      });
    }
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
  }
}

// Handle transfer created
async function handleTransferCreated(transfer: Stripe.Transfer) {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { stripeTransferId: transfer.id },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'RELEASED',
          releasedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error handling transfer.created:', error);
  }
}

// Handle account updated
async function handleAccountUpdated(account: Stripe.Account) {
  try {
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { stripeAccountId: account.id },
    });

    if (developerProfile) {
      const onboardingComplete =
        account.details_submitted === true &&
        account.charges_enabled === true &&
        account.payouts_enabled === true;

      await prisma.developerProfile.update({
        where: { id: developerProfile.id },
        data: {
          stripeOnboardingComplete: onboardingComplete,
        },
      });
    }
  } catch (error) {
    console.error('Error handling account.updated:', error);
  }
}

