import { NextRequest, NextResponse } from 'next/server';
import { requireClient } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const submitSchema = z.object({
  country:          z.string().length(2, 'Invalid country code'),
  documentType:     z.enum(['PASSPORT', 'SOCIAL_SECURITY', 'NATIONAL_INSURANCE', 'NATIONAL_ID']),
  documentFrontUrl: z.string().url('Invalid document front URL'),
  documentBackUrl:  z.string().url('Invalid document back URL').optional().nullable(),
  selfieUrl:        z.string().url('Invalid selfie URL'),
});

// GET /api/client/verification — fetch own verification record
export async function GET() {
  try {
    const user = await requireClient();

    const verification = await prisma.clientIdentityVerification.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ verification });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/client/verification — submit or resubmit verification
export async function POST(request: NextRequest) {
  try {
    const user = await requireClient();
    const body = await request.json();

    const result = submitSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.errors },
        { status: 400 },
      );
    }

    const { country, documentType, documentFrontUrl, documentBackUrl, selfieUrl } = result.data;

    // Upsert — allow re-submission after rejection
    const verification = await prisma.clientIdentityVerification.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        status: 'PENDING',
        country,
        documentType,
        documentFrontUrl,
        documentBackUrl: documentBackUrl ?? null,
        selfieUrl,
        submittedAt: new Date(),
      },
      update: {
        status: 'PENDING',
        country,
        documentType,
        documentFrontUrl,
        documentBackUrl: documentBackUrl ?? null,
        selfieUrl,
        submittedAt: new Date(),
        rejectionReason: null,
        reviewedAt: null,
        reviewedBy: null,
      },
    });

    return NextResponse.json({ verification }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
