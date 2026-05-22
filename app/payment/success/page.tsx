'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SuccessCard from '@/components/SuccessCard';
import { Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const payment_id = searchParams.get('payment_id');
  const [donation, setDonation] = useState<{ id: string, rank: number, name: string, amount: number, is_amount_hidden: boolean, message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (payment_id) {
      fetch(`/api/verify?payment_id=${payment_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setDonation(data);
          } else {
            setError(data.message || 'Verification failed');
          }
        })
        .catch(() => setError('Failed to verify payment'));
    }
  }, [payment_id]);

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! {error}</h1>
        <a href="/" className="text-emerald-600 font-bold underline">Back to Home</a>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-emerald-800 font-bold">Verifying your Salami...</p>
      </div>
    );
  }

  return <SuccessCard donation={donation} />;
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
