import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { minioClient, MINIO_BUCKET, getPublicUrl, ensureBucket } from '@/lib/minio';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_DOC_SIZE   = 10 * 1024 * 1024; // 10 MB

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file   = formData.get('file')   as File   | null;
    const folder = (formData.get('folder') as string | null) ?? 'misc';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isDoc   = ALLOWED_DOC_TYPES.includes(file.type);

    if (!isImage && !isDoc) {
      return NextResponse.json(
        { error: 'File type not allowed. Accepted: JPEG, PNG, WebP, GIF, PDF, DOC, DOCX' },
        { status: 400 },
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / 1024 / 1024} MB` },
        { status: 400 },
      );
    }

    await ensureBucket();

    const ext        = EXT_MAP[file.type] ?? 'bin';
    const objectName = `${folder}/${randomUUID()}.${ext}`;
    const buffer     = Buffer.from(await file.arrayBuffer());
    const stream     = Readable.from(buffer);

    await minioClient.putObject(MINIO_BUCKET, objectName, stream, buffer.length, {
      'Content-Type': file.type,
    });

    return NextResponse.json({ url: getPublicUrl(objectName), objectName });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/upload — remove a stored object by objectName
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();

    const { objectName } = await request.json() as { objectName?: string };
    if (!objectName) {
      return NextResponse.json({ error: 'objectName is required' }, { status: 400 });
    }

    await minioClient.removeObject(MINIO_BUCKET, objectName);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
