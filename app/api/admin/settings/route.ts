import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const updateSettingsSchema = z.object({
  commissionRate: z.number().min(0.10).max(0.13).optional(),
  platformName: z.string().min(1).max(200).optional(),
  platformTagline: z.string().max(200).optional().nullable(),
  registrationEnabled: z.boolean().optional(),
  developerRegistrationEnabled: z.boolean().optional(),
  clientRegistrationEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// GET /api/admin/settings - Get platform settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication manually for API routes
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'platform-settings' },
    });

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.platformSettings.create({
        data: {
          id: 'platform-settings',
          commissionRate: 0.13,
          platformName: 'Webbidev',
          platformTagline: 'Guaranteed Scope. Simplified Development.',
          registrationEnabled: true,
          developerRegistrationEnabled: true,
          clientRegistrationEnabled: true,
          maintenanceMode: false,
        },
      });

      return NextResponse.json({
        settings: {
          ...defaultSettings,
          commissionRate: Number(defaultSettings.commissionRate),
        },
      });
    }

    return NextResponse.json({
      settings: {
        ...settings,
        commissionRate: Number(settings.commissionRate),
      },
    });
  } catch (error: any) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update platform settings
export async function PUT(request: NextRequest) {
  try {
    // Check authentication manually for API routes
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = updateSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update settings
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'platform-settings' },
      update: {
        ...updateData,
        updatedBy: session.user.id,
      },
      create: {
        id: 'platform-settings',
        commissionRate: updateData.commissionRate || 0.13,
        platformName: updateData.platformName || 'Webbidev',
        platformTagline: updateData.platformTagline || 'Guaranteed Scope. Simplified Development.',
        registrationEnabled: updateData.registrationEnabled ?? true,
        developerRegistrationEnabled: updateData.developerRegistrationEnabled ?? true,
        clientRegistrationEnabled: updateData.clientRegistrationEnabled ?? true,
        maintenanceMode: updateData.maintenanceMode ?? false,
        maintenanceMessage: updateData.maintenanceMessage || null,
        notes: updateData.notes || null,
        updatedBy: session.user.id,
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'UPDATED_SETTINGS',
        targetType: 'SETTINGS',
        targetId: settings.id,
        description: 'Updated platform settings',
        metadata: {
          changes: updateData,
        },
      },
    });

    return NextResponse.json({
      settings: {
        ...settings,
        commissionRate: Number(settings.commissionRate),
      },
    });
  } catch (error: any) {
    console.error('Error updating platform settings:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

