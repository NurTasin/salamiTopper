import { ImageResponse } from 'next/og';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';

export const runtime = 'edge';

export async function GET(
  req: Request,
  { params }: { params: { donationId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdminView = searchParams.get('admin') === '1';

    // Verify admin session if admin view is requested
    if (isAdminView) {
      const session = await getSession();
      if (!session) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    const [donation] = await sql`
      SELECT * FROM donations WHERE id = ${params.donationId} AND status = 'paid'
    `;

    if (!donation) {
      return new Response('Donation not found', { status: 404 });
    }

    const [rankResult] = await sql`
      SELECT COUNT(*) + 1 as rank FROM donations 
      WHERE status = 'paid' AND amount > ${donation.amount}
    `;
    const rank = rankResult.rank;

    const showAmount = !donation.is_amount_hidden || isAdminView;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#064E3B',
            backgroundImage: 'linear-gradient(to bottom right, #064E3B, #059669)',
            padding: '40px',
            border: '20px solid #FCD34D',
            color: 'white',
          }}
        >
          {/* Festive Accents */}
          <div style={{ position: 'absolute', top: 40, right: 40, fontSize: 60, display: 'flex' }}>🌙</div>
          <div style={{ position: 'absolute', bottom: 40, left: 40, fontSize: 60, display: 'flex' }}>🏮</div>
          
          <div style={{ fontSize: 80, fontWeight: 900, marginBottom: 20, color: '#FCD34D', display: 'flex' }}>
            {`Eid Mubarak!`}
          </div>
          
          <div style={{ fontSize: 60, fontWeight: 700, marginBottom: 10, display: 'flex' }}>
            {donation.name}
          </div>
          
          {showAmount && (
            <div style={{ fontSize: 40, color: '#ECFDF5', marginBottom: 20, display: 'flex' }}>
              {`donated ${formatCurrency(donation.amount)} Salami`}
            </div>
          )}

          {donation.message && (
            <div style={{ 
              fontSize: 32, 
              fontStyle: 'italic', 
              color: '#F0FDF4', 
              textAlign: 'center',
              maxWidth: '80%',
              marginBottom: 40,
              lineHeight: 1.4,
              display: 'flex'
            }}>
              {`"${donation.message}"`}
            </div>
          )}

          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#065F46',
            padding: '10px 30px',
            borderRadius: '50px',
            border: '2px solid #FCD34D'
          }}>
            <span style={{ fontSize: 24, fontWeight: 700, display: 'flex' }}>
              {`#${rank} on SalamiTopper`}
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: 20, opacity: 0.8, display: 'flex' }}>
          salamitopper.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} catch {
  return new Response('Failed to generate card', { status: 500 });
}
}
