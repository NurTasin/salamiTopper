import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border-4 border-red-50 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">Payment Failed</h2>
        <p className="text-emerald-700 mb-8">
          Something went wrong with your transaction. Don&apos;t worry, your money hasn&apos;t been deducted.
        </p>

        <div className="space-y-4">
          <Link
            href="/#donate"
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            Retry Salami 💚
          </Link>
          
          <Link
            href="/"
            className="w-full py-4 border-2 border-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
