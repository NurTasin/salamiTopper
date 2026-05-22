'use client';

import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Donation {
  id: string;
  name: string;
  amount: number | null;
  is_amount_hidden: boolean;
  created_at: string;
}

export default function Ticker() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/leaderboard?limit=5');
        const data = await res.json();
        setDonations(data.donations);
      } catch {
        console.error('Failed to fetch ticker data');
      }
    };

    fetchRecent();
    const interval = setInterval(fetchRecent, 15000);
    return () => clearInterval(interval);
  }, []);

  if (donations.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-emerald-900/90 backdrop-blur-md text-white py-2 overflow-hidden z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...donations, ...donations].map((d, i) => (
          <div key={`${d.id}-${i}`} className="flex items-center gap-2 mx-8">
            <span className="font-bold text-emerald-400">✨ {d.name}</span>
            <span>gave</span>
            <span className="font-bold text-yellow-400">
              {d.is_amount_hidden ? 'Salami 🤫' : formatCurrency(d.amount!)}
            </span>
            <span className="text-emerald-300">🎊</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
