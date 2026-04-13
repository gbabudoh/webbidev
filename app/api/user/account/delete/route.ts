import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Safety Check 1: Check for active projects where user is the client
    const activeClientProjects = await prisma.project.findFirst({
      where: {
        clientId: userId,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
    });

    if (activeClientProjects) {
      return NextResponse.json({
        error: 'Cannot delete account with active projects. Please close or cancel your active projects first.',
      }, { status: 400 });
    }

    // Safety Check 2: Check for active engagements where user is the developer
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { userId: userId },
    });

    if (developerProfile) {
      const activeDeveloperEngagements = await prisma.project.findFirst({
        where: {
          selectedDeveloperId: developerProfile.id,
          status: 'IN_PROGRESS',
        },
      });

      if (activeDeveloperEngagements) {
        return NextResponse.json({
          error: 'Cannot delete account with active project engagements. Please complete your ongoing work first.',
        }, { status: 400 });
      }
    }

    // Safety Check 3: Check for funds in escrow
    const escrowTransactions = await prisma.transaction.findFirst({
      where: {
        OR: [
          { developer: { userId: userId } },
          { project: { clientId: userId } }
        ],
        status: 'HELD_IN_ESCROW',
      },
    });

    if (escrowTransactions) {
      return NextResponse.json({
        error: 'Cannot delete account with funds still held in escrow. Please resolve all pending payments first.',
      }, { status: 400 });
    }

    // All checks passed - proceed with cascading deletion
    // Prisma cascading delete (defined in schema.prisma) will handle:
    // - DeveloperProfile
    // - Projects
    // - Proposals
    // - Messages
    // - Transactions
    // - IdentityVerifications
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'Account successfully deleted' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error during account deletion:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
