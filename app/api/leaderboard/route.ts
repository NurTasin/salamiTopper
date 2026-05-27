import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface DonationRow {
  id: string;
  name: string;
  amount: string | number | null;
  is_amount_hidden: boolean;
  message: string | null;
  paid_at: string | Date;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  try {
    const query = search ? `%${search}%` : '%';
    
    // Always fetch the global top 3
    const topThreeRaw = await sql`
      SELECT id, name, amount, is_amount_hidden, message, paid_at
      FROM donations
      WHERE status = 'paid'
      ORDER BY amount DESC, paid_at ASC
      LIMIT 3
    `;

    // Fetch paginated donations starting from rank 4
    const listOffset = 3 + offset;
    const donationsRaw = await sql`
      SELECT id, name, amount, is_amount_hidden, message, paid_at
      FROM donations
      WHERE status = 'paid' AND name ILIKE ${query}
      ORDER BY amount DESC, paid_at ASC
      LIMIT ${limit} OFFSET ${listOffset}
    `;

    const [total] = await sql`
      SELECT COUNT(*) as count FROM donations 
      WHERE status = 'paid' AND name ILIKE ${query}
    `;

    const [stats] = await sql`
      SELECT SUM(amount) as total_collected, COUNT(*) as total_donors
      FROM donations WHERE status = 'paid'
    `;

    const topThree = topThreeRaw as unknown as DonationRow[];
    const donations = donationsRaw as unknown as DonationRow[];

    const mask = (d: DonationRow) => ({
      ...d,
      amount: d.is_amount_hidden ? null : d.amount,
    });

    return NextResponse.json({
      top_three: topThree.map(mask),
      donations: donations.map(mask),
      total_pages: Math.ceil(Math.max(0, parseInt(total.count) - 3) / limit),
      total_collected: stats.total_collected || 0,
      total_donors: parseInt(stats.total_donors) || 0,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
