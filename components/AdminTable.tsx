'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, Download, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Donation {
  id: string;
  name: string;
  amount: number;
  message: string;
  status: string;
  created_at: string;
  is_amount_hidden: boolean;
}

export default function AdminTable() {
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      setDonations(data);
    } catch {
      toast.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`/api/admin/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Record deleted');
        setDonations(donations.filter(d => d.id !== id));
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Error deleting record');
    }
  };

  const handleDeletePending = async () => {
    if (!confirm('Are you sure you want to remove ALL pending payments? This cannot be undone.')) return;

    try {
      const res = await fetch('/api/admin/transactions/pending', { method: 'DELETE' });
      if (res.ok) {
        toast.success('All pending payments cleared');
        setDonations(donations.filter(d => d.status !== 'pending'));
      } else {
        toast.error('Clear failed');
      }
    } catch {
      toast.error('Error clearing pending payments');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Amount', 'Message', 'Status', 'Date', 'Hidden'];
    const rows = donations.map(d => [
      d.name,
      d.amount,
      d.message?.replace(/,/g, ' '),
      d.status,
      formatDate(d.created_at),
      d.is_amount_hidden ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `salamitopper_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
      <div className="p-6 flex flex-wrap gap-4 justify-between items-center border-b border-emerald-50 bg-emerald-50/50">
        <h3 className="text-xl font-bold text-emerald-900">All Transactions</h3>
        <div className="flex gap-2">
          <button
            onClick={handleDeletePending}
            className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-100 transition-all font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Clear Pending
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all font-semibold"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white text-emerald-900 font-bold border-b-2 border-emerald-50">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-emerald-950">
                  {d.name} {d.is_amount_hidden && <span className="text-xs bg-slate-100 px-1 rounded">HIDDEN</span>}
                </td>
                <td className="px-6 py-4 font-bold text-emerald-700">{formatCurrency(d.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    d.status === 'paid' ? 'bg-green-100 text-green-700' :
                    d.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-600 italic max-w-xs truncate">{d.message || '-'}</td>
                <td className="px-6 py-4 text-xs text-emerald-500">{formatDate(d.created_at)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => window.open(`/api/card/${d.id}?admin=1`, '_blank')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Share Card"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Record"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
