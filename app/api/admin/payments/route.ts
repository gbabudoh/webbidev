import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { Prisma, TransactionStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {};
    if (status) where.status = status as TransactionStatus;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { id: true, title: true } },
          developer: { include: { user: { select: { id: true, name: true, email: true } } } },
          milestone: { select: { id: true, title: true, order: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    // Aggregated totals
    const [escrowTotal, releasedTotal, feeTotal, refundedTotal] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'HELD_IN_ESCROW' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'RELEASED' } }),
      prisma.transaction.aggregate({ _sum: { webbidevFee: true }, where: { status: 'RELEASED' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { status: 'REFUNDED' } }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      totals: {
        escrow: Number(escrowTotal._sum.amount || 0),
        released: Number(releasedTotal._sum.amount || 0),
        fees: Number(feeTotal._sum.webbidevFee || 0),
        refunded: Number(refundedTotal._sum.amount || 0),
      },
    });
  } catch (error) {
    console.error('Admin payments error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
