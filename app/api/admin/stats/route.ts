import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [stats] = await sql`
      SELECT 
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_collected,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as total_donors,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
      FROM donations
    `;

    return NextResponse.json({
      total_collected: stats.total_collected || 0,
      total_donors: parseInt(stats.total_donors) || 0,
      pending_count: parseInt(stats.pending_count) || 0,
      failed_count: parseInt(stats.failed_count) || 0,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
