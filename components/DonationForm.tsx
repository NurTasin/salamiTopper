'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const PRESETS = [50, 100, 200, 500, 1000];

export default function DonationForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || amount < 10) {
      toast.error('Please enter a valid name and amount (min ৳10)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount, message, is_amount_hidden: isHidden }),
      });

      const data = await res.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="py-16 px-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-emerald-100"
      >
        <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Give Salami 💚</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Amount (৳)</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={cn(
                    "py-2 rounded-lg border-2 font-semibold transition-all",
                    amount === p
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-emerald-100 text-emerald-700 hover:border-emerald-500"
                  )}
                >
                  ৳{p}
                </button>
              ))}
            </div>
            <input
              type="number"
              required
              min="10"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || '')}
              placeholder="Custom Amount"
              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hideAmount"
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
              className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="hideAmount" className="text-sm text-emerald-800">
              Hide my amount on leaderboard
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">
              Eid Message (Optional)
            </label>
            <textarea
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a festive message..."
              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 outline-none transition-all h-24"
            />
            <p className="text-right text-xs text-emerald-600 mt-1">
              {message.length}/300
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl rounded-2xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Give Salami 💚'}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
