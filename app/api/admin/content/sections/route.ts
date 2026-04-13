import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Fetch sections error:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { sectionKey, title, subtitle, badgeText, description, isActive, sortOrder, metadata } = body;

    if (!sectionKey) {
      return NextResponse.json({ error: 'Section key is required' }, { status: 400 });
    }

    const section = await prisma.homepageSection.upsert({
      where: { sectionKey },
      update: { title, subtitle, badgeText, description, isActive, sortOrder, metadata },
      create: { sectionKey, title, subtitle, badgeText, description, isActive: isActive ?? true, sortOrder: sortOrder ?? 0, metadata },
    });

    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATE_HOMEPAGE_SECTION',
        targetType: 'HOMEPAGE_SECTION',
        targetId: section.id,
        description: `Updated homepage section: ${sectionKey}`,
      },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Save section error:', error);
    return NextResponse.json({ error: 'Failed to save section' }, { status: 500 });
  }
}
