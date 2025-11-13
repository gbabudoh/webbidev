import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';

export async function GET() {
  try {
    const dbConnected = await checkDatabaseConnection();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

