import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const transactions = await sql`
      SELECT * FROM donations
      ORDER BY created_at DESC
    `;

    return NextResponse.json(transactions, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Admin transactions error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
