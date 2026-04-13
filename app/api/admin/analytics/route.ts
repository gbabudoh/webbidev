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

    // Developers by country
    const developersByCountry = await prisma.developerProfile.groupBy({
      by: ['location'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Clients by country
    const clientsByCountry = await prisma.user.groupBy({
      by: ['country'],
      where: { role: 'CLIENT', country: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Developer performance (top developers by completed projects)
    const developerPerformance = await prisma.developerProfile.findMany({
      where: { completedProjects: { gt: 0 } },
      select: {
        id: true,
        location: true,
        totalEarnings: true,
        totalProjects: true,
        completedProjects: true,
        user: { select: { name: true, email: true, country: true } },
      },
      orderBy: { completedProjects: 'desc' },
      take: 20,
    });

    // Registration trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const allUsers = await prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { role: true, createdAt: true },
    });

    const monthlyRegistrations: Record<string, { developers: number; clients: number; total: number }> = {};
    allUsers.forEach((u) => {
      const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRegistrations[key]) monthlyRegistrations[key] = { developers: 0, clients: 0, total: 0 };
      monthlyRegistrations[key].total++;
      if (u.role === 'DEVELOPER') monthlyRegistrations[key].developers++;
      if (u.role === 'CLIENT') monthlyRegistrations[key].clients++;
    });

    // Revenue by month (last 12 months)
    const releasedTransactions = await prisma.transaction.findMany({
      where: { status: 'RELEASED', releasedAt: { gte: twelveMonthsAgo } },
      select: { amount: true, webbidevFee: true, developerPayout: true, releasedAt: true },
    });

    const monthlyRevenue: Record<string, { total: number; fees: number; payouts: number }> = {};
    releasedTransactions.forEach((t) => {
      if (!t.releasedAt) return;
      const key = `${t.releasedAt.getFullYear()}-${String(t.releasedAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyRevenue[key]) monthlyRevenue[key] = { total: 0, fees: 0, payouts: 0 };
      monthlyRevenue[key].total += Number(t.amount);
      monthlyRevenue[key].fees += Number(t.webbidevFee);
      monthlyRevenue[key].payouts += Number(t.developerPayout);
    });

    // Jobs by location (projects completed, grouped by developer location)
    const completedProjectsByLocation = await prisma.project.findMany({
      where: { status: 'COMPLETED', selectedDeveloperId: { not: null } },
      select: {
        budget: true,
        proposals: {
          where: { status: 'ACCEPTED' },
          select: { developer: { select: { location: true } } },
          take: 1,
        },
      },
    });

    const jobsByLocation: Record<string, { count: number; value: number }> = {};
    completedProjectsByLocation.forEach((p) => {
      const loc = p.proposals[0]?.developer?.location || 'Unknown';
      if (!jobsByLocation[loc]) jobsByLocation[loc] = { count: 0, value: 0 };
      jobsByLocation[loc].count++;
      jobsByLocation[loc].value += Number(p.budget);
    });

    // Summary stats
    const [totalDevelopers, totalClients, verifiedDevelopers] = await Promise.all([
      prisma.user.count({ where: { role: 'DEVELOPER' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.developerProfile.count({ where: { isVerified: true } }),
    ]);

    return NextResponse.json({
      developersByCountry: developersByCountry.map((d) => ({ location: d.location, count: d._count.id })),
      clientsByCountry: clientsByCountry.map((c) => ({ country: c.country, count: c._count.id })),
      developerPerformance: developerPerformance.map((d) => ({
        name: d.user.name || d.user.email,
        location: d.location,
        country: d.user.country,
        totalProjects: d.totalProjects,
        completedProjects: d.completedProjects,
        completionRate: d.totalProjects > 0 ? Math.round((d.completedProjects / d.totalProjects) * 100) : 0,
        totalEarnings: Number(d.totalEarnings),
      })),
      monthlyRegistrations: Object.entries(monthlyRegistrations)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, ...data })),
      monthlyRevenue: Object.entries(monthlyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, ...data })),
      jobsByLocation: Object.entries(jobsByLocation)
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([location, data]) => ({ location, ...data })),
      summary: { totalDevelopers, totalClients, verifiedDevelopers },
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
