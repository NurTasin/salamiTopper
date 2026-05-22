import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

// We must use the Node.js runtime for @napi-rs/canvas
export const runtime = 'nodejs';

let fontLoaded = false;

async function loadFont() {
  if (fontLoaded) return;
  const fontData = await fetch(
    new URL('https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Bold.ttf')
  ).then((res) => res.arrayBuffer());
  
  GlobalFonts.register(Buffer.from(fontData), 'Hind Siliguri');
  fontLoaded = true;
}

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
      return new Response('Donation not found', { status: 404 });
    }

    const [rankResult] = await sql`
      SELECT COUNT(*) + 1 as rank FROM donations 
      WHERE status = 'paid' AND amount > ${donation.amount}
    `;
    const rank = rankResult.rank;

    const showAmount = !donation.is_amount_hidden || isAdminView;

    await loadFont();

    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#064E3B');
    gradient.addColorStop(1, '#059669');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Border
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 40;
    ctx.strokeRect(0, 0, 1200, 630);

    // Accents
    ctx.font = '60px "Hind Siliguri"';
    ctx.fillStyle = 'white';
    ctx.fillText('🌙', 1080, 100);
    ctx.fillText('🏮', 60, 570);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title
    ctx.font = '900 80px "Hind Siliguri"';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText('🎊 ঈদ মোবারক!', 600, 150);

    // Name
    ctx.font = '700 60px "Hind Siliguri"';
    ctx.fillStyle = 'white';
    ctx.fillText(donation.name, 600, 260);

    // Amount
    if (showAmount) {
      ctx.font = '400 40px "Hind Siliguri"';
      ctx.fillStyle = '#ECFDF5';
      ctx.fillText(`দিয়েছেন ${formatCurrency(donation.amount)} সালামি`, 600, 340);
    }

    // Message
    if (donation.message) {
      ctx.font = 'italic 32px "Hind Siliguri"';
      ctx.fillStyle = '#F0FDF4';
      
      // Basic word wrap
      const words = donation.message.split(' ');
      let line = '';
      let y = 420;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(`"${testLine}"`);
        if (metrics.width > 960 && i > 0) {
          ctx.fillText(`"${line.trim()}"`, 600, y);
          line = words[i] + ' ';
          y += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(`"${line.trim()}"`, 600, y);
    }

    // Rank Badge Background
    ctx.fillStyle = '#065F46';
    ctx.beginPath();
    ctx.roundRect(450, 520, 300, 60, 30);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.stroke();

    // Rank Text
    ctx.font = '700 24px "Hind Siliguri"';
    ctx.fillStyle = 'white';
    ctx.fillText(`#${rank} on SalamiTopper`, 600, 550);

    // Footer
    ctx.font = '20px "Hind Siliguri"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'right';
    ctx.fillText('salamitopper.com', 1140, 580);

    const buffer = await canvas.encode('png');

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Card generation error:', error);
    return new Response('Failed to generate card', { status: 500 });
  }
}
