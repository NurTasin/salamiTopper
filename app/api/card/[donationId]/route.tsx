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
      return new Response('Salami gift not found', { status: 404 });
    }

    const [rankResult] = await sql`
      SELECT COUNT(*) + 1 as rank FROM donations 
      WHERE status = 'paid' AND amount > ${donation.amount}
    `;
    const rank = rankResult.rank;

    const showAmount = !donation.is_amount_hidden || isAdminView;

    // Use the provided background image
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const bgUrl = `${baseUrl}/bg.png`;

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
            padding: '80px',
            color: 'white',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={bgUrl} 
            alt="bg"
            width="1080" 
            height="1920" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '1080px', 
              height: '1920px', 
              display: 'flex'
            }} 
          />

          {/* Overlay to ensure readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(6, 78, 59, 0.3)',
            display: 'flex',
          }} />

          {/* Content Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '60px',
            borderRadius: '40px',
            border: '2px solid rgba(252, 211, 77, 0.3)',
            width: '100%',
            maxWidth: '900px',
          }}>
            <div style={{ fontSize: 100, fontWeight: 900, marginBottom: 40, color: '#FCD34D', display: 'flex' }}>
              {`Eid Mubarak!`}
            </div>

            <div style={{ fontSize: 48, fontWeight: 300, marginBottom: 20, color: '#ECFDF5', opacity: 0.9, display: 'flex' }}>
              {`Sharing the Joy of Salami`}
            </div>

            <div style={{ height: '4px', width: '200px', backgroundColor: '#FCD34D', marginBottom: 60, display: 'flex' }} />

            <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 20, display: 'flex' }}>
              {donation.name}
            </div>

            {showAmount && (
              <div style={{ fontSize: 40, color: '#FCD34D', marginBottom: 40, fontWeight: 600, display: 'flex' }}>
                {`gifted ${formatCurrency(donation.amount)} Salami`}
              </div>
            )}

            {donation.message && (
              <div style={{ 
                fontSize: 36, 
                fontStyle: 'italic', 
                color: '#F0FDF4', 
                maxWidth: '100%',
                marginBottom: 60,
                lineHeight: 1.5,
                display: 'flex'
              }}>
                {`"${donation.message}"`}
              </div>
            )}

            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#065F46',
              padding: '20px 50px',
              borderRadius: '100px',
              border: '2px solid #FCD34D',
              marginTop: 'auto',
            }}>
              <span style={{ fontSize: 32, fontWeight: 700, display: 'flex' }}>
                {`Rank #${rank} on SalamiTopper`}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            position: 'absolute', 
            bottom: 60, 
            fontSize: 24, 
            opacity: 0.8, 
            display: 'flex',
            fontWeight: 600,
            letterSpacing: '1px'
          }}>
            salamitopper.com
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (error) {
    console.error('Card generation error:', error);
    return new Response('Failed to generate card', { status: 500 });
  }
}
