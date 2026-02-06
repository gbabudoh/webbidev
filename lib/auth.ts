import { prisma } from './db';
import * as bcrypt from 'bcryptjs';

// User role type (matches Prisma enum)
export type UserRole = 'CLIENT' | 'DEVELOPER' | 'ADMIN';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Password verification
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// User authentication
export async function authenticateUser(
  email: string,
  password: string
): Promise<{
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string; // UserRole from Prisma
    isSuperAdmin: boolean;
    isSuspended: boolean;
  } | null;
  error?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isSuperAdmin: true,
        isSuspended: true,
      },
    });

    if (!user) {
      return { user: null, error: 'Invalid email or password' };
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return { user: null, error: 'Account is suspended. Please contact support.' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { user: null, error: 'Invalid email or password' };
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch (error: unknown) {
    console.error('Authentication error:', error);
    
    // Check if it's a database connection error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P1001') {
      return { 
        user: null, 
        error: 'Database connection failed. Please check if the database server is running and accessible.' 
      };
    }
    
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes("Can't reach database server")) {
      return { 
        user: null, 
        error: 'Database connection failed. Please check if the database server is running and accessible.' 
      };
    }
    
    return { user: null, error: 'An error occurred during authentication' };
  }
}

// Create user
export async function createUser(
  email: string,
  password: string,
  name: string | null,
  role: UserRole
): Promise<{
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string; // UserRole from Prisma
  } | null;
  error?: string;
}> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { user: null, error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return { user };
  } catch (error) {
    console.error('User creation error:', error);
    return { user: null, error: 'An error occurred during user creation' };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isSuperAdmin: true,
      isSuspended: true,
      createdAt: true,
      developerProfile: {
        select: {
          id: true,
          portfolioUrl: true,
          bioSummary: true,
          location: true,
          skills: true,
          isVerified: true,
          isActive: true,
        },
      },
    },
  });
}

// Check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === 'ADMIN';
}

// Check if user is super admin
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isSuperAdmin: true, role: true },
  });

  return user?.role === 'ADMIN' && user?.isSuperAdmin === true;
}

// Check if user is developer
export async function isDeveloper(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === 'DEVELOPER';
}

// Check if user is client
export async function isClient(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === 'CLIENT';
}

// Update user password
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error('Password update error:', error);
    return { success: false, error: 'An error occurred during password update' };
  }
}

