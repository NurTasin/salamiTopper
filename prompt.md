Create a full-stack web application called "SalamiTopper" using Next.js 14 (App Router) and Neon PostgreSQL. Here is the full spec:

---

## Overview
A Bengali Eid gifting app where visitors give "Salami" (Eid money) to the site owner. After a successful payment, donors appear on a public leaderboard ranked by amount. Donors can share a beautiful card after paying. The admin can manage and share individual transactions from a protected panel.

---

## Tech Stack
- Framework: Next.js 14 with App Router and TypeScript
- Database: Neon PostgreSQL using @neondatabase/serverless
- Styling: Tailwind CSS with a festive Eid theme (emerald greens, golds, white, cream)
- Payment: UddoktaPay REST API (integrates bKash, Nagad, Rocket)
- Share Cards: @vercel/satori to generate PNG share cards server-side (as /api/card/[id] route returning an image)
- Fonts: "Hind Siliguri" (Google Fonts) + "Inter"
- Animations: Framer Motion + canvas-confetti

---

## Database Schema

Table: donations
- id: UUID primary key (default gen_random_uuid())
- name: VARCHAR(100) not null  ← always shown, no anonymous option
- amount: DECIMAL(10,2) not null
- is_amount_hidden: BOOLEAN default false  ← donor can hide amount on leaderboard
- message: TEXT nullable  ← optional Eid message, max 300 chars
- payment_id: VARCHAR(255) unique
- status: VARCHAR(20) default 'pending'  ← pending | paid | failed
- created_at: TIMESTAMPTZ default now()
- paid_at: TIMESTAMPTZ nullable

---

## Pages & Routes

### 1. Home Page — /
- Festive hero with crescent 🌙, stars ✨, lanterns 🏮 SVG decorations
- Big bold "SalamiTopper 🎊" title with subtitle in both English and Bengali ("ঈদ মোবারক! সালামি দিন 💚")
- Live counter: total collected (৳ amount) + total donors
- "Give Salami 💚" CTA button scrolling to donation form
- Recent donations ticker at bottom — scrolling marquee, polls every 10s

### 2. Donation Form (on Home Page, smooth scroll section)
Fields:
- Full Name (text input, required — name is ALWAYS displayed publicly, no anonymous option)
- Amount (number, min ৳10) — with preset quick-pick buttons: ৳50 ৳100 ৳200 ৳500 ৳1000
- "Hide my amount on leaderboard" toggle (amount still recorded in DB and shown to admin)
- Eid Message (textarea, optional, max 300 chars, character counter shown) — displayed on leaderboard and share card
- Submit: "Give Salami 💚"

On submit:
1. POST /api/donate → validates, inserts pending record, calls UddoktaPay, returns { payment_url }
2. Redirect to UddoktaPay hosted payment page

### 3. Payment Success Page — /payment/success?payment_id=xxx
- Calls GET /api/verify?payment_id=xxx on load
- On confirmed: full-screen celebration with canvas-confetti burst
- Success card showing: donor name, amount (if not hidden), Eid message, rank achieved
- Two action buttons:
  a. "📤 Share My Card" — calls /api/card/[donation_id] to download a PNG share card
  b. "🏆 View Leaderboard" — navigates to /leaderboard

### 4. Payment Failed Page — /payment/failed
- Friendly Eid-themed error message, retry button back to home

### 5. Leaderboard Page — /leaderboard
- Top 3 donors in large gold/silver/bronze highlight cards at the top with crown 👑 icons
- Full ranked table below: Rank | Name | Amount (or "Hidden 🤫") | Eid Message | Date
- Pagination (10 per page)
- Search by name (debounced, 300ms)
- Auto-refresh every 15 seconds
- Each row has a "Share" button that opens /api/card/[id] as a downloadable PNG

### 6. Admin Panel — /admin
- Protected by middleware: checks for a cookie set on login
- Login page at /admin/login — single password field, checks against ADMIN_PASSWORD env var, sets an httpOnly cookie on success
- Dashboard shows:
  a. Summary cards: Total Collected, Total Donors, Pending Payments, Failed Payments
  b. Full transactions table (ALL donations including pending/failed, shows actual amounts always)
     Columns: Name | Amount | Message | Status | Date | Actions
  c. Actions per row: "🗑 Delete" (soft delete or hard), "📤 Share Card" (downloads PNG)
  d. Export to CSV button (client-side, generates from API response)
- Logout button that clears cookie

---

## Share Card Design — /api/card/[donationId]
- Server-side PNG generation using @vercel/satori
- Card dimensions: 1200×630px (OG image size, perfect for sharing)
- Design:
  - Festive gradient background: deep green to emerald (#064E3B → #059669)
  - Gold decorative border and crescent/star SVG accents
  - Large text: "🎊 ঈদ মোবারক!"
  - Donor name in large bold white text
  - Amount (if not hidden): "দিয়েছেন ৳[amount] সালামি"
  - Eid message (if present) in italic cream text, max 2 lines
  - Rank badge: "#[rank] on SalamiTopper"
  - Footer: "salamitopper.com" branding
- Route returns Content-Type: image/png with Cache-Control headers
- Admin card variant: always shows amount regardless of is_amount_hidden

---

## API Routes

### POST /api/donate
- Body: { name, amount, is_amount_hidden, message }
- Validate: name required, amount >= 10, message <= 300 chars
- Insert pending donation
- Call UddoktaPay checkout-v2 API with success_url, cancel_url, webhook_url
- Return: { payment_url }

### GET /api/verify
- Query: ?payment_id=xxx
- Call UddoktaPay verify-payment API
- On success: UPDATE donation SET status='paid', paid_at=now() WHERE payment_id=xxx
- Return: full donation row including rank (SELECT COUNT(*)+1 WHERE amount > this amount AND status='paid')

### POST /api/webhook
- UddoktaPay IPN endpoint
- Verify api-key header matches UDDOKTAPAY_API_KEY
- Update donation status to 'paid' or 'failed'
- Return 200

### GET /api/leaderboard
- Query: ?page=1&limit=10&search=
- Return paginated paid donations sorted by amount DESC, then paid_at ASC for tiebreak
- Mask amount as null if is_amount_hidden=true
- Include total_collected, total_donors, total_pages

### GET /api/card/[donationId]
- Fetch donation + calculate rank
- Use satori to render JSX → PNG
- Return image/png
- Accept ?admin=1 query param (verified via checking admin cookie server-side) to always show amount

### GET /api/admin/transactions (protected)
- Returns all donations regardless of status
- Sorted by created_at DESC
- Includes actual amount always

### DELETE /api/admin/transactions/[id] (protected)
- Hard deletes a donation record

### GET /api/admin/stats (protected)
- Returns: total_collected, total_donors, pending_count, failed_count

---

## Middleware — middleware.ts
- Protect all /admin/* routes (except /admin/login)
- Check for 'admin_session' httpOnly cookie
- Redirect to /admin/login if missing

---

## Environment Variables (.env.local.example)
DATABASE_URL=                  # Neon PostgreSQL connection string
UDDOKTAPAY_API_KEY=            # UddoktaPay API key
UDDOKTAPAY_BASE_URL=           # e.g. https://yourstore.uddoktapay.com/api
NEXT_PUBLIC_APP_URL=           # e.g. https://salamitopper.com
ADMIN_PASSWORD=                # Plain string password for admin login
ADMIN_COOKIE_SECRET=           # Random 32-char string to sign the session cookie

---

## UddoktaPay Integration (lib/uddoktapay.ts)
- initiatePayment({ full_name, email, amount, metadata, success_url, cancel_url, webhook_url })
  → POST {UDDOKTAPAY_BASE_URL}/checkout-v2 with Authorization: {UDDOKTAPAY_API_KEY}
- verifyPayment(payment_id: string)
  → POST {UDDOKTAPAY_BASE_URL}/verify-payment
- Reference: https://uddoktapay.com/documentation

---

## Project Structure
app/
  page.tsx                         # Home + donation form
  leaderboard/page.tsx
  payment/
    success/page.tsx
    failed/page.tsx
  admin/
    login/page.tsx
    page.tsx                       # Admin dashboard
  api/
    donate/route.ts
    verify/route.ts
    webhook/route.ts
    leaderboard/route.ts
    card/[donationId]/route.ts
    admin/
      transactions/route.ts
      transactions/[id]/route.ts
      stats/route.ts
      login/route.ts
      logout/route.ts
components/
  DonationForm.tsx
  Leaderboard.tsx
  LeaderboardRow.tsx
  SuccessCard.tsx
  Ticker.tsx
  AdminTable.tsx
  ShareCardPreview.tsx
lib/
  db.ts                            # Neon client
  uddoktapay.ts                    # Payment API wrapper
  auth.ts                          # Admin cookie helpers
  card.tsx                         # Satori card JSX template
middleware.ts
scripts/
  migrate.ts

---

## Additional Notes
- Use next/font to load Hind Siliguri for Bengali text rendering in Satori card
- The share card must embed the font as a Buffer (satori requires fonts as ArrayBuffer)
- For the admin CSV export, generate client-side using the /api/admin/transactions response
- Mobile-first responsive design throughout
- All monetary values stored as DECIMAL(10,2), displayed with ৳ prefix and Bangladeshi comma formatting
- Add a /robots.txt and basic SEO meta tags (OG image pointing to /api/card/[topDonorId])

Generate all files with complete, working, production-ready code. Include a README.md with: prerequisites, environment setup, local development steps, DB migration instructions, UddoktaPay webhook setup guide, and Vercel deployment steps.