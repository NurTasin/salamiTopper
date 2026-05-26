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
    const domain = 'salamitopper.bigtdevs.xyz';
    const bgUrl = `${baseUrl}/bg.png`;
    const qrUrl = `${baseUrl}/qr.png`;

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

          {/* Stronger Overlay to ensure readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(6, 78, 59, 0.45)',
            display: 'flex',
          }} />

          {/* Content Container - Darker glassmorphism for better contrast */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(15px)',
            padding: '80px 60px',
            borderRadius: '60px',
            border: '2px solid rgba(252, 211, 77, 0.2)',
            width: '100%',
            maxWidth: '960px',
            position: 'relative',
          }}>
            {/* Header */}
            <div style={{ 
              fontSize: 110, 
              fontWeight: 900, 
              marginBottom: 20, 
              color: '#FCD34D', 
              display: 'flex',
              letterSpacing: '-2px',
              textShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              {`Eid Mubarak!`}
            </div>

            <div style={{ 
              fontSize: 42, 
              fontWeight: 400, 
              marginBottom: 60, 
              color: '#ECFDF5', 
              opacity: 0.95, 
              display: 'flex',
              textTransform: 'uppercase',
              letterSpacing: '4px'
            }}>
              {`Sharing the Joy of Salami`}
            </div>

            {/* Accent Line */}
            <div style={{ height: '2px', width: '120px', backgroundColor: 'rgba(252, 211, 77, 0.5)', marginBottom: 60, display: 'flex' }} />

            {/* Donor Name */}
            <div style={{ 
              fontSize: 90, 
              fontWeight: 900, 
              marginBottom: 10, 
              display: 'flex',
              color: 'white'
            }}>
              {donation.name}
            </div>

            {/* Gift Details */}
            {showAmount ? (
              <div style={{ 
                fontSize: 48, 
                color: 'white', 
                marginBottom: 60, 
                fontWeight: 500, 
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {`Gifted `}
                <span style={{ color: '#FCD34D', fontWeight: 800 }}>{formatCurrency(donation.amount)}</span>
                {` Salami`}
              </div>
            ) : (
              <div style={{ fontSize: 48, color: '#FCD34D', marginBottom: 60, fontWeight: 600, display: 'flex' }}>
                {`Gifted a Secret Salami`}
              </div>
            )}

            {/* Eid Message */}
            {donation.message && (
              <div style={{ 
                fontSize: 38, 
                fontStyle: 'italic', 
                color: '#D1FAE5', 
                maxWidth: '100%',
                marginBottom: 80,
                lineHeight: 1.6,
                display: 'flex',
                padding: '0 40px'
              }}>
                {`"${donation.message}"`}
              </div>
            )}

            {/* Rank Badge */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#064E3B',
              padding: '24px 60px',
              borderRadius: '100px',
              border: '2px solid #FCD34D',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <span style={{ fontSize: 36, fontWeight: 800, display: 'flex', color: 'white' }}>
                {Number(rank) <= 3 ? `Rank #${rank} on SalamiTopper` : `Gifted Through SalamiTopper`}
              </span>
            </div>
          </div>

          {/* QR Code and Domain */}
          <div style={{
            position: 'absolute',
            bottom: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrUrl} 
              alt="qr" 
              width="180" 
              height="180" 
              style={{ 
                borderRadius: '20px',
                border: '4px solid #FCD34D',
                display: 'flex'
              }} 
            />
            <div style={{ 
              fontSize: 32, 
              color: 'white',
              opacity: 0.9, 
              display: 'flex',
              fontWeight: 700,
              letterSpacing: '2px'
            }}>
              {domain}
            </div>
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
