import { PrismaClient, UserRole } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

// Load .env.local for seeding
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create initial platform settings
  const settings = await prisma.platformSettings.upsert({
    where: { id: 'platform-settings' },
    update: {},
    create: {
      id: 'platform-settings',
      commissionRate: 0.13, // 13% default
      platformName: 'Webbidev',
      platformTagline: 'Guaranteed Scope. Simplified Development.',
      registrationEnabled: true,
      developerRegistrationEnabled: true,
      clientRegistrationEnabled: true,
      maintenanceMode: false,
    },
  });

  console.log('✅ Platform settings created');

  // Create initial admin user (if not exists)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@webbidev.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production!
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: UserRole.ADMIN,
        isSuperAdmin: true,
      },
    });

    console.log(`✅ Admin user created:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword} (change this in production!)`);
    console.log(`   Role: ADMIN`);
    console.log(`   isSuperAdmin: true`);
  } else {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

