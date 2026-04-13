import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const reviewSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('approve') }),
  z.object({ action: z.literal('reject'), rejectionReason: z.string().min(10, 'Please provide a reason (min 10 characters)') }),
]);

// PATCH /api/admin/verification/[id] — approve or reject
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.errors },
        { status: 400 },
      );
    }

    const verification = await prisma.identityVerification.findUnique({
      where: { id },
      select: { id: true, developerId: true, status: true },
    });

    if (!verification) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    if (verification.status === 'VERIFIED') {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 });
    }

    const now = new Date();

    if (result.data.action === 'approve') {
      const [updated] = await prisma.$transaction([
        prisma.identityVerification.update({
          where: { id },
          data: {
            status: 'VERIFIED',
            reviewedAt: now,
            reviewedBy: admin.id,
            rejectionReason: null,
          },
        }),
        prisma.developerProfile.update({
          where: { id: verification.developerId },
          data: { isVerified: true, verifiedAt: now, verifiedBy: admin.id },
        }),
        prisma.adminActivity.create({
          data: {
            adminId: admin.id,
            action: 'VERIFIED_DEVELOPER',
            targetType: 'IDENTITY_VERIFICATION',
            targetId: id,
            description: `Approved identity verification for developer profile ${verification.developerId}`,
          },
        }),
      ]);

      return NextResponse.json({ verification: updated });
    }

    // reject
    const [updated] = await prisma.$transaction([
      prisma.identityVerification.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedAt: now,
          reviewedBy: admin.id,
          rejectionReason: result.data.rejectionReason,
        },
      }),
      prisma.adminActivity.create({
        data: {
          adminId: admin.id,
          action: 'REJECTED_VERIFICATION',
          targetType: 'IDENTITY_VERIFICATION',
          targetId: id,
          description: result.data.rejectionReason,
        },
      }),
    ]);

    return NextResponse.json({ verification: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
