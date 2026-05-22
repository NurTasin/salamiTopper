import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function DELETE() {
  try {
    await sql`DELETE FROM donations WHERE status = 'pending'`;
    return NextResponse.json({ message: 'All pending payments cleared' });
  } catch (error) {
    console.error('Admin delete pending error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
