import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { z } from 'zod';

// Validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required').optional().nullable(),
  role: z.enum(['CLIENT', 'DEVELOPER'], {
    errorMap: () => ({ message: 'Role must be either CLIENT or DEVELOPER' }),
  }),
});

// POST /api/auth/signup - Create a new user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, role } = validationResult.data;

    // Create user
    const { user, error } = await createUser(email, password, name || null, role);

    if (error || !user) {
      return NextResponse.json(
        {
          error: error || 'Failed to create user',
        },
        { status: 400 }
      );
    }

    // Return success (don't return password)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'An error occurred during user creation',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
