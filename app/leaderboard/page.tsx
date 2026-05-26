import React from 'react';
import Leaderboard from '@/components/Leaderboard';
import { Home } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
      <Leaderboard />
    </main>
  );
}
