import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { Prisma, ProjectStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { client: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) {
      where.status = status as ProjectStatus;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
          milestones: { select: { id: true, status: true } },
          proposals: { select: { id: true, status: true } },
          transactions: { select: { id: true, amount: true, status: true } },
          disputes: { select: { id: true, status: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    const enrichedProjects = projects.map((p) => {
      const totalMilestones = p.milestones.length;
      const completedMilestones = p.milestones.filter((m) => m.status === 'APPROVED').length;
      const totalPaid = p.transactions
        .filter((t) => t.status === 'RELEASED')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        ...p,
        milestoneProgress: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
        totalMilestones,
        completedMilestones,
        totalPaid,
        proposalCount: p.proposals.length,
        disputeCount: p.disputes.filter((d) => d.status !== 'CLOSED').length,
      };
    });

    // Aggregated stats
    const [totalValue, activeCount, completedCount] = await Promise.all([
      prisma.project.aggregate({ _sum: { budget: true }, where }),
      prisma.project.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { ...where, status: 'COMPLETED' } }),
    ]);

    return NextResponse.json({
      projects: enrichedProjects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        total,
        active: activeCount,
        completed: completedCount,
        totalValue: Number(totalValue._sum.budget || 0),
      },
    });
  } catch (error) {
    console.error('Admin projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
