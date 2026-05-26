'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { formatCurrency } from '@/lib/utils';
import { Share2, Trophy, Home } from 'lucide-react';
import Link from 'next/link';

interface SuccessCardProps {
  donation: {
    id: string;
    name: string;
    amount: number;
    message: string;
    is_amount_hidden: boolean;
    rank: number;
  };
}

export default function SuccessCard({ donation }: SuccessCardProps) {
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-2xl border-4 border-emerald-100 text-center"
    >
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🎊</span>
      </div>
      
      <h2 className="text-3xl font-bold text-emerald-900 mb-2">Eid Mubarak!</h2>
      <p className="text-emerald-700 mb-6">Thank you for your generous Salami Gift, {donation.name}!</p>

      <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
        <p className="text-sm font-bold text-emerald-800 uppercase mb-1">Your Salami</p>
        <p className="text-4xl font-black text-emerald-600 mb-4">
          {donation.is_amount_hidden ? 'Secret 🤫' : formatCurrency(donation.amount)}
        </p>
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1 rounded-full border border-emerald-100 text-emerald-800 font-bold">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Rank #{donation.rank}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => window.open(`/api/card/${donation.id}`, '_blank')}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          <Share2 className="w-5 h-5" />
          Share My Salami Card
        </button>
        
        <Link
          href="/leaderboard"
          className="w-full py-4 border-2 border-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
        >
          <Trophy className="w-5 h-5" />
          View Leaderboard
        </Link>

        <Link
          href="/"
          className="w-full py-4 text-emerald-500 font-medium flex items-center justify-center gap-2 hover:underline"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
