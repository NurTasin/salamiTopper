'use client';

import React, { useState, useEffect } from 'react';
import AdminTable from '@/components/AdminTable';
import { LogOut, Users, Wallet, Clock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Stats {
  total_collected: number;
  total_donors: number;
  pending_count: number;
  failed_count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch {
      console.error('Failed to fetch stats');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/admin/login');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-emerald-900 flex items-center gap-2">
          SalamiTopper <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Admin</span>
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-semibold transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Collected"
            value={`৳${stats?.total_collected?.toLocaleString() || 0}`}
            icon={<Wallet className="text-emerald-600" />}
            color="bg-emerald-100"
          />
          <StatCard
            label="Salami Gifts"
            value={stats?.total_donors || 0}
            icon={<Users className="text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            label="Pending Payments"
            value={stats?.pending_count || 0}
            icon={<Clock className="text-yellow-600" />}
            color="bg-yellow-100"
          />
          <StatCard
            label="Failed Payments"
            value={stats?.failed_count || 0}
            icon={<AlertTriangle className="text-red-600" />}
            color="bg-red-100"
          />
        </div>

        {/* Transactions Table */}
        <AdminTable />
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
