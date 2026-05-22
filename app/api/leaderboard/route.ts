import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  try {
    const query = search ? `%${search}%` : '%';
    
    const donations = await sql`
      SELECT id, name, amount, is_amount_hidden, message, paid_at
      FROM donations
      WHERE status = 'paid' AND name ILIKE ${query}
      ORDER BY amount DESC, paid_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [total] = await sql`
      SELECT COUNT(*) as count FROM donations 
      WHERE status = 'paid' AND name ILIKE ${query}
    `;

    const [stats] = await sql`
      SELECT SUM(amount) as total_collected, COUNT(*) as total_donors
      FROM donations WHERE status = 'paid'
    `;

    // Mask amount if hidden
    const maskedDonations = donations.map(d => ({
      ...d,
      amount: d.is_amount_hidden ? null : d.amount,
    }));

    return NextResponse.json({
      donations: maskedDonations,
      total_pages: Math.ceil(parseInt(total.count) / limit),
      total_collected: stats.total_collected || 0,
      total_donors: parseInt(stats.total_donors) || 0,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
