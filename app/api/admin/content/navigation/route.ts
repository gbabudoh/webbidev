import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const items = await prisma.navigationItem.findMany({
      orderBy: [{ location: 'asc' }, { group: 'asc' }, { sortOrder: 'asc' }],
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Fetch navigation items error:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { label, href, location, group, sortOrder, isActive, isExternal } = body;

    if (!label || !href || !location) {
      return NextResponse.json({ error: 'Label, href, and location are required' }, { status: 400 });
    }

    const item = await prisma.navigationItem.create({
      data: { label, href, location, group, sortOrder: sortOrder ?? 0, isActive: isActive ?? true, isExternal: isExternal ?? false },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Create navigation item error:', error);
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, label, href, location, group, sortOrder, isActive, isExternal } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const item = await prisma.navigationItem.update({
      where: { id },
      data: { label, href, location, group, sortOrder, isActive, isExternal },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Update navigation item error:', error);
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.navigationItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete navigation item error:', error);
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 });
  }
}
