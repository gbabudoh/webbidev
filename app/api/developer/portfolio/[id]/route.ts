import { NextRequest, NextResponse } from 'next/server';
import { requireDeveloper } from '@/lib/auth-server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  techStack: z.array(z.string().min(1).max(50)).min(1).max(15).optional(),
  liveUrl: z.string().url().optional().nullable().or(z.literal('')),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

async function getOwnedProject(projectId: string, userId: string) {
  const profile = await prisma.developerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) return null;

  const project = await prisma.portfolioProject.findUnique({
    where: { id: projectId },
  });
  if (!project || project.developerId !== profile.id) return null;

  return project;
}

// PUT /api/developer/portfolio/[id] — update a portfolio project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireDeveloper();
    const existing = await getOwnedProject(params.id, user.id);
    if (!existing) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 });
    }

    const body = await request.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.errors },
        { status: 400 }
      );
    }

    const { liveUrl, imageUrl, ...rest } = result.data;

    const project = await prisma.portfolioProject.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(liveUrl !== undefined ? { liveUrl: liveUrl || null } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
      },
    });

    return NextResponse.json({ project });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update portfolio project', message }, { status: 500 });
  }
}

// DELETE /api/developer/portfolio/[id] — delete a portfolio project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireDeveloper();
    const existing = await getOwnedProject(params.id, user.id);
    if (!existing) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 });
    }

    await prisma.portfolioProject.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete portfolio project', message }, { status: 500 });
  }
}
