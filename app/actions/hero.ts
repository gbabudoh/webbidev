"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getHeroData() {
  const content = await prisma.heroContent.findFirst();
  const assets = await prisma.floatingAsset.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' }
  });
  return { content, assets };
}

export async function updateHeroText(data: {
  badgeText?: string;
  headingPart1?: string;
  headingPart2?: string;
  description?: string;
}) {
  const content = await prisma.heroContent.findFirst();
  if (content) {
    await prisma.heroContent.update({
      where: { id: content.id },
      data
    });
  } else {
    await prisma.heroContent.create({
      data: {
        badgeText: data.badgeText || "The Next-Gen Developer Ecosystem",
        headingPart1: data.headingPart1 || "Think.",
        headingPart2: data.headingPart2 || "Build. Scale.",
        description: data.description || "Join the most advanced ecosystem for top-tier developers and ambitious clients. Transparent lifecycles, milestone payments, and expert tooling."
      }
    });
  }
  revalidatePath("/");
}

interface FloatingAssetData {
  id?: string;
  type: "IMAGE" | "ICON";
  src?: string;
  iconName?: string;
  alt?: string;
  color?: string;
  size?: number;
  posX: string;
  posY: string;
  duration?: number;
  isActive?: boolean;
}

export async function upsertFloatingAsset(data: FloatingAssetData) {
  const { id, ...rest } = data;
  if (id) {
    await prisma.floatingAsset.update({
      where: { id },
      data: rest
    });
  } else {
    await prisma.floatingAsset.create({ data });
  }
  revalidatePath("/");
}

export async function deleteFloatingAsset(id: string) {
  await prisma.floatingAsset.delete({ where: { id } });
  revalidatePath("/");
}
