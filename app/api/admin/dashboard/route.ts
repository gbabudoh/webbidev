import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // User counts
    const [totalUsers, totalClients, totalDevelopers, totalAdmins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'DEVELOPER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    // Monthly growth
    const [usersThisMonth, usersPrevMonth] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfMonth } } }),
    ]);
    const userGrowth = usersPrevMonth > 0 ? ((usersThisMonth - usersPrevMonth) / usersPrevMonth * 100).toFixed(1) : usersThisMonth > 0 ? '100' : '0';

    // Project counts
    const [totalProjects, activeProjects, completedProjects, openProjects] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.project.count({ where: { status: 'OPEN' } }),
    ]);

    const [projectsThisMonth, projectsPrevMonth] = await Promise.all([
      prisma.project.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.project.count({ where: { createdAt: { gte: startOfPrevMonth, lt: startOfMonth } } }),
    ]);
    const projectGrowth = projectsPrevMonth > 0 ? ((projectsThisMonth - projectsPrevMonth) / projectsPrevMonth * 100).toFixed(1) : projectsThisMonth > 0 ? '100' : '0';

    // Dispute counts
    const [openDisputes, totalDisputes] = await Promise.all([
      prisma.dispute.count({ where: { status: { in: ['OPEN', 'IN_REVIEW'] } } }),
      prisma.dispute.count(),
    ]);

    // Revenue (sum of webbidevFee from released transactions)
    const revenueResult = await prisma.transaction.aggregate({
      _sum: { webbidevFee: true },
      where: { status: 'RELEASED' },
    });
    const totalRevenue = Number(revenueResult._sum.webbidevFee || 0);

    const [revenueThisMonth, revenuePrevMonth] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { webbidevFee: true },
        where: { status: 'RELEASED', releasedAt: { gte: startOfMonth } },
      }),
      prisma.transaction.aggregate({
        _sum: { webbidevFee: true },
        where: { status: 'RELEASED', releasedAt: { gte: startOfPrevMonth, lt: startOfMonth } },
      }),
    ]);
    const revThisMonth = Number(revenueThisMonth._sum.webbidevFee || 0);
    const revPrevMonth = Number(revenuePrevMonth._sum.webbidevFee || 0);
    const revenueGrowth = revPrevMonth > 0 ? ((revThisMonth - revPrevMonth) / revPrevMonth * 100).toFixed(1) : revThisMonth > 0 ? '100' : '0';

    // Pending verifications
    const pendingVerifications = await prisma.identityVerification.count({
      where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    });

    // Recent admin activities
    const recentActivities = await prisma.adminActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: { select: { name: true, email: true } },
      },
    });

    // Recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalClients,
        totalDevelopers,
        totalAdmins,
        userGrowth: `${userGrowth}%`,
        usersThisMonth,
        totalProjects,
        activeProjects,
        completedProjects,
        openProjects,
        projectGrowth: `${projectGrowth}%`,
        projectsThisMonth,
        openDisputes,
        totalDisputes,
        totalRevenue,
        revenueGrowth: `${revenueGrowth}%`,
        revenueThisMonth: revThisMonth,
        pendingVerifications,
      },
      recentActivities,
      recentUsers,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
