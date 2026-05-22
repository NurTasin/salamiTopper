import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM donations WHERE id = ${params.id}`;
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
