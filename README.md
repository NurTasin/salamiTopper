# SalamiTopper 🎊

A Bengali Eid gifting app where visitors give "Salami" (Eid money) to the site owner. Rank on the leaderboard and share beautiful festive cards!

## Features
- 🌙 **Festive UI**: Emerald green and gold theme with Bengali support.
- 💳 **Payment Integration**: Secure payments via UddoktaPay (bKash, Nagad, Rocket).
- 🏆 **Live Leaderboard**: Ranked by Salami amount with live updates.
- 📤 **Share Cards**: Dynamic PNG generation for social sharing.
- 🔐 **Admin Panel**: Protected dashboard to manage Salami gifts and export CSV.
...
1. **Redesigning the Share Card**: Switching from landscape to a 1080x1920 portrait format suitable for social media stories.
2. **New Background**: Incorporating the provided festive background image.
3. **Terminology Update**: Replacing the word "donation" with "Salami Gift" or "Salami" across the entire UI.
...
DATABASE_URL=postgres://...
UDDOKTAPAY_API_KEY=your_api_key
UDDOKTAPAY_BASE_URL=https://yourstore.uddoktapay.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PASSWORD=your_secure_password
ADMIN_COOKIE_SECRET=your_32_char_secret
```

4. **Database Migration**
   Run the migration script to create the `donations` table:
   ```bash
   npm run migrate
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## UddoktaPay Webhook Setup
In your UddoktaPay panel, set the Webhook URL to:
`https://your-domain.com/api/webhook`

## Deployment (Vercel)
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add all environment variables from `.env.local`.
4. Deploy!

## License
MIT
