import Stripe from 'stripe';

// Initialize Stripe client
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Stripe Connect configuration
export const STRIPE_CONFIG = {
  // Commission rate (10-13% as per ideation document)
  commissionRate: parseFloat(process.env.WEBBIDEV_COMMISSION_RATE || '0.13'),
  
  // Stripe Connect settings
  connect: {
    // Application fee percentage (will be calculated from commissionRate)
    applicationFeePercent: parseFloat(process.env.WEBBIDEV_COMMISSION_RATE || '0.13') * 100,
  },
  
  // Webhook settings
  webhook: {
    secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
} as const;

// Helper function to calculate commission
export function calculateCommission(amount: number): {
  total: number;
  commission: number;
  payout: number;
} {
  const commission = amount * STRIPE_CONFIG.commissionRate;
  const payout = amount - commission;
  
  return {
    total: amount,
    commission: Math.round(commission * 100) / 100, // Round to 2 decimal places
    payout: Math.round(payout * 100) / 100,
  };
}

// Helper function to create Stripe Connect account link
export async function createConnectAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<Stripe.AccountLink> {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });
}

// Helper function to create Stripe Connect login link
export async function createConnectLoginLink(
  accountId: string
): Promise<Stripe.LoginLink> {
  return await stripe.accounts.createLoginLink(accountId);
}

// Helper function to create payment intent for escrow
export async function createEscrowPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  // Convert amount to cents
  const amountInCents = Math.round(amount * 100);
  
  return await stripe.paymentIntents.create({
    amount: amountInCents,
    currency,
    metadata: {
      ...metadata,
      type: 'escrow',
    },
    capture_method: 'manual', // Hold funds until milestone approval
  });
}

// Helper function to capture payment intent (release funds)
export async function capturePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.capture(paymentIntentId);
}

// Helper function to create transfer to connected account (developer payout)
export async function createTransferToDeveloper(
  connectedAccountId: string,
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.Transfer> {
  // Convert amount to cents
  const amountInCents = Math.round(amount * 100);
  
  return await stripe.transfers.create({
    amount: amountInCents,
    currency,
    destination: connectedAccountId,
    metadata: {
      ...metadata,
      type: 'developer_payout',
    },
  });
}

// Helper function to create refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  metadata?: Record<string, string>
): Promise<Stripe.Refund> {
  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
    metadata: {
      ...metadata,
      type: 'milestone_refund',
    },
  };
  
  if (amount) {
    // Convert amount to cents
    refundParams.amount = Math.round(amount * 100);
  }
  
  return await stripe.refunds.create(refundParams);
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string = STRIPE_CONFIG.webhook.secret || ''
): Stripe.Event {
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }
  
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// Helper function to get connected account details
export async function getConnectedAccount(
  accountId: string
): Promise<Stripe.Account> {
  return await stripe.accounts.retrieve(accountId);
}

// Helper function to check if connected account is ready for payouts
export async function isAccountReadyForPayouts(
  accountId: string
): Promise<boolean> {
  try {
    const account = await getConnectedAccount(accountId);
    
    // Check if account has completed onboarding
    return (
      account.details_submitted === true &&
      account.charges_enabled === true &&
      account.payouts_enabled === true
    );
  } catch (error) {
    console.error('Error checking account status:', error);
    return false;
  }
}

// Helper function to create or update connected account
export async function createOrUpdateConnectedAccount(
  email: string,
  country: string = 'US',
  type: 'express' | 'standard' = 'express'
): Promise<Stripe.Account> {
  return await stripe.accounts.create({
    type,
    country,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

