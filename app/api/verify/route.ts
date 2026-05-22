import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPayment } from '@/lib/uddoktapay';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const payment_id = searchParams.get('payment_id');

  if (!payment_id) {
    return NextResponse.json({ message: 'Missing payment_id' }, { status: 400 });
  }

  try {
    const verification = await verifyPayment(payment_id);

    if (verification.status === 'COMPLETED') {
      const donation_id = verification.metadata.donation_id;

      // Update donation status
      const [donation] = await sql`
        UPDATE donations 
        SET status = 'paid', paid_at = NOW(), payment_id = ${payment_id}
        WHERE id = ${donation_id} AND status != 'paid'
        RETURNING *
      `;

      if (!donation) {
        // Might already be updated by webhook
        const [existing] = await sql`SELECT * FROM donations WHERE payment_id = ${payment_id}`;
        if (!existing) return NextResponse.json({ message: 'Donation not found' }, { status: 404 });
        
        const [rank] = await sql`
          SELECT COUNT(*) + 1 as rank FROM donations 
          WHERE status = 'paid' AND amount > ${existing.amount}
        `;
        return NextResponse.json({ ...existing, rank: parseInt(rank.rank) });
      }

      const [rank] = await sql`
        SELECT COUNT(*) + 1 as rank FROM donations 
        WHERE status = 'paid' AND amount > ${donation.amount}
      `;

      return NextResponse.json({ ...donation, rank: parseInt(rank.rank) });
    } else {
      return NextResponse.json({ message: 'Payment not completed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
