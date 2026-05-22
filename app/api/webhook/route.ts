import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  const apiKey = req.headers.get('RT-UDDOKTAPAY-API-KEY');

  if (apiKey !== process.env.UDDOKTAPAY_API_KEY) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, invoice_id, metadata } = body;

    if (status === 'COMPLETED') {
      await sql`
        UPDATE donations 
        SET status = 'paid', paid_at = NOW(), payment_id = ${invoice_id}
        WHERE id = ${metadata.donation_id} AND status != 'paid'
      `;
    } else {
      await sql`
        UPDATE donations 
        SET status = 'failed'
        WHERE id = ${metadata.donation_id} AND status = 'pending'
      `;
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
