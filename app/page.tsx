import React from 'react';
import DonationForm from '@/components/DonationForm';
import Ticker from '@/components/Ticker';
import { Trophy, Gift, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const [stats] = await sql`
      SELECT SUM(amount) as total_collected, COUNT(*) as total_donors
      FROM donations WHERE status = 'paid'
    `;
    return {
      total_collected: stats.total_collected || 0,
      total_donors: parseInt(stats.total_donors) || 0,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return { total_collected: 0, total_donors: 0 };
  }
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
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Total Salami</p>
            <p className="text-3xl font-black text-emerald-900">৳{stats.total_collected.toLocaleString()}</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-xl border-2 border-emerald-50">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Generous Givers</p>
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

      {/* Our Mission Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center relative z-10">
        <div className="bg-emerald-50/50 backdrop-blur-sm rounded-[3rem] p-10 md:p-16 border-2 border-emerald-100 shadow-inner">
          <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-black text-emerald-900 mb-6 font-hind">
            আমাদের লক্ষ্য 🤝
          </h2>
          <p className="text-xl md:text-2xl text-emerald-800 font-bold leading-relaxed mb-8 font-hind">
            আপনার দেয়া প্রতিটি সালামি পৌঁছে যাবে সুবিধাবঞ্চিত মানুষের কাছে। 
            আমরা চাই উৎসবের এই আনন্দ কেবল নিজের মাঝে সীমাবদ্ধ না রেখে ছড়িয়ে দিতে তাদের মাঝে, 
            যাদের জন্য ঈদ মানেই নতুন এক সংগ্রামের দিন। 
          </p>
          <div className="h-px w-24 bg-emerald-200 mx-auto mb-8" />
          <p className="text-lg text-emerald-700 italic font-medium leading-relaxed">
            Our mission is simple: to make Eid a bit more joyous and pleasurable for those less fortunate. 
            By sharing your Salami, you are directly helping us bring food, clothes, and smiles to 
            underprivileged families across the community.
          </p>
        </div>
      </section>

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
