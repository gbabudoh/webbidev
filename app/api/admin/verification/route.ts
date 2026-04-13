import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { prisma } from '@/lib/db';

// GET /api/admin/verification — list all verifications (newest first)
export async function GET() {
  try {
    await requireAdmin();

    const verifications = await prisma.identityVerification.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        developer: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
            location: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({ verifications });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
