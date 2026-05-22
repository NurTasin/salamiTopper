'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Share2, Trophy, Crown } from 'lucide-react';

interface Donation {
  id: string;
  name: string;
  amount: number | null;
  message: string;
  is_amount_hidden: boolean;
  paid_at: string;
}

export default function Leaderboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?page=${page}&search=${search}`);
      const data = await res.json();
      setDonations(data.donations);
      setTotalPages(data.total_pages);
    } catch {
      console.error('Failed to fetch leaderboard');
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchLeaderboard, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchLeaderboard, search]);

  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const topThree = donations.slice(0, 3);
  const others = donations.slice(3);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-emerald-900 text-center mb-12 flex items-center justify-center gap-3">
        <Trophy className="text-yellow-500 w-10 h-10" />
        Salami Leaderboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {topThree.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl p-6 text-center border-4 ${
              i === 0 ? 'bg-yellow-50 border-yellow-400 order-1 md:order-2 md:scale-110 z-10' :
              i === 1 ? 'bg-slate-50 border-slate-300 order-2 md:order-1' :
              'bg-orange-50 border-orange-300 order-3'
            }`}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
              <Crown className={`w-8 h-8 ${
                i === 0 ? 'text-yellow-500' :
                i === 1 ? 'text-slate-400' :
                'text-orange-500'
              }`} />
            </div>
            <p className="text-sm font-bold text-emerald-800 mb-1">RANK #{i + 1}</p>
            <p className="text-xl font-bold text-emerald-950 mb-2 truncate">{d.name}</p>
            <p className="text-2xl font-black text-emerald-700">
              {d.is_amount_hidden ? '🤫' : formatCurrency(d.amount!)}
            </p>
            {d.message && <p className="text-sm text-emerald-600 italic mt-2 line-clamp-2">&quot;{d.message}&quot;</p>}
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="p-4 border-bottom border-emerald-50">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-2 rounded-xl border-2 border-emerald-50 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50 text-emerald-900 font-bold">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {others.map((d, i) => (
                <tr key={d.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-emerald-800">#{i + 4}</td>
                  <td className="px-6 py-4 font-medium text-emerald-950">{d.name}</td>
                  <td className="px-6 py-4 text-emerald-700 font-bold">
                    {d.is_amount_hidden ? 'Hidden 🤫' : formatCurrency(d.amount!)}
                  </td>
                  <td className="px-6 py-4 text-sm text-emerald-600 italic max-w-xs truncate">
                    {d.message || '-'}
                  </td>
                  <td className="px-6 py-4 text-xs text-emerald-500">
                    {formatDate(d.paid_at)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => window.open(`/api/card/${d.id}`, '_blank')}
                      className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-full transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 flex justify-center gap-2 border-t border-emerald-50">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  page === i + 1
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
