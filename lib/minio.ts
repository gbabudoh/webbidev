import * as Minio from 'minio';

const ENDPOINT = process.env.MINIO_ENDPOINT || '149.102.155.247';
const PORT = parseInt(process.env.MINIO_PORT || '9000', 10);
const USE_SSL = process.env.MINIO_USE_SSL === 'true';

export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'webbidev';

export const minioClient = new Minio.Client({
  endPoint: ENDPOINT,
  port: PORT,
  useSSL: USE_SSL,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

/** Public URL for any stored object */
export function getPublicUrl(objectName: string): string {
  const protocol = USE_SSL ? 'https' : 'http';
  return `${protocol}://${ENDPOINT}:${PORT}/${MINIO_BUCKET}/${objectName}`;
}

/** Create the bucket (if missing) and apply a public-read policy */
export async function ensureBucket(): Promise<void> {
  const exists = await minioClient.bucketExists(MINIO_BUCKET);
  if (!exists) {
    await minioClient.makeBucket(MINIO_BUCKET, 'us-east-1');
  }

  const publicReadPolicy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
      },
    ],
  });

  await minioClient.setBucketPolicy(MINIO_BUCKET, publicReadPolicy);
}

/** Delete a stored object by its full object name */
export async function deleteObject(objectName: string): Promise<void> {
  await minioClient.removeObject(MINIO_BUCKET, objectName);
}
