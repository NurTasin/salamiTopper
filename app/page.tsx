import React from 'react';
import DonationForm from '@/components/DonationForm';
import Ticker from '@/components/Ticker';
import { Trophy, Gift, Heart, Star } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/leaderboard?limit=1`, { cache: 'no-store' });
  if (!res.ok) return { total_collected: 0, total_donors: 0 };
  return res.json();
}

export default async function Home() {
  const stats = await getStats();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-emerald-100 opacity-20 rotate-12">
        <Star size={120} fill="currentColor" />
      </div>
      <div className="absolute top-40 right-10 text-emerald-100 opacity-20 -rotate-12">
        <Star size={80} fill="currentColor" />
      </div>

      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 text-center relative z-10">
        <div className="inline-block animate-bounce mb-6">
          <span className="text-6xl">🌙</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-emerald-900 mb-4 tracking-tight">
          SalamiTopper <span className="text-yellow-500">🎊</span>
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-emerald-700 mb-8 font-hind">
          ঈদ মোবারক! সালামি দিন 💚
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="bg-white px-8 py-4 rounded-3xl shadow-xl border-2 border-emerald-50">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Total Collected</p>
            <p className="text-3xl font-black text-emerald-900">৳{stats.total_collected.toLocaleString()}</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-xl border-2 border-emerald-50">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Gifts Received</p>
            <p className="text-3xl font-black text-emerald-900">{stats.total_donors}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="#donate"
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            <Gift className="w-6 h-6" />
            Give Salami 💚
          </Link>
          <Link
            href="/leaderboard"
            className="bg-white text-emerald-700 border-2 border-emerald-100 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            Leaderboard
          </Link>
        </div>
      </header>

      {/* Donation Form Section */}
      <DonationForm />

      {/* Footer Info */}
      <footer className="py-20 px-4 text-center text-emerald-800/60 pb-32">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          <span className="font-semibold">SalamiTopper — Spreading Joy this Eid</span>
        </div>
        <p className="text-sm">Made with 💚 for the community</p>
      </footer>

      {/* Bottom Ticker */}
      <Ticker />
    </main>
  );
}
