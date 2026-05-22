import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { initiatePayment } from '@/lib/uddoktapay';

export async function POST(req: Request) {
  try {
    const { name, amount, is_amount_hidden, message } = await req.json();

    if (!name || !amount || amount < 10) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Insert pending donation
    const [donation] = await sql`
      INSERT INTO donations (name, amount, is_amount_hidden, message, status)
      VALUES (${name}, ${amount}, ${is_amount_hidden}, ${message}, 'pending')
      RETURNING id
    `;

    const paymentResponse = await initiatePayment({
      full_name: name,
      email: 'customer@salamitopper.com', // Placeholder as UddoktaPay might require it
      amount: Number(amount),
      metadata: { donation_id: donation.id },
      redirect_url: `${appUrl}/payment/success`,
      cancel_url: `${appUrl}/payment/failed`,
      webhook_url: `${appUrl}/api/webhook`,
      return_type: 'GET',
    });

    if (paymentResponse.status) {
      // Update with payment_id if returned (UddoktaPay might return a reference)
      // For checkout-v2, we usually get a payment_url and we might need to poll or wait for webhook
      // We'll store the donation ID in metadata for the webhook to find it
      return NextResponse.json({ payment_url: paymentResponse.payment_url });
    } else {
      return NextResponse.json({ message: paymentResponse.message || 'Payment initiation failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
