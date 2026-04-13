import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const section = await prisma.homepageSection.findUnique({
      where: { id },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!section) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ section });
  } catch (error) {
    console.error('Fetch section error:', error);
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Update section
    await prisma.homepageSection.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        badgeText: body.badgeText,
        description: body.description,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
        metadata: body.metadata,
      },
    });

    // Update items if provided
    if (body.items && Array.isArray(body.items)) {
      // Delete existing items and recreate
      await prisma.homepageSectionItem.deleteMany({ where: { sectionId: id } });
      if (body.items.length > 0) {
        await prisma.homepageSectionItem.createMany({
          data: body.items.map((item: {
            title: string;
            description?: string;
            iconName?: string;
            color?: string;
            value?: string;
            href?: string;
            sortOrder?: number;
            isActive?: boolean;
            metadata?: Prisma.JsonValue;
          }, index: number) => ({
            sectionId: id,
            title: item.title,
            description: item.description || null,
            iconName: item.iconName || null,
            color: item.color || null,
            value: item.value || null,
            href: item.href || null,
            sortOrder: item.sortOrder ?? index,
            isActive: item.isActive ?? true,
            metadata: item.metadata || null,
          })),
        });
      }
    }

    const updated = await prisma.homepageSection.findUnique({
      where: { id },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json({ section: updated });
  } catch (error) {
    console.error('Update section error:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.homepageSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete section error:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
