'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, DollarSign, Search, Filter,
  CheckCircle, XCircle, LayoutDashboard, Users,
  Settings, LogOut, ChevronRight, ArrowLeft, Wallet
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';

const avatarColors = [
  'from-green-600 to-emerald-500','from-blue-600 to-violet-600',
  'from-cyan-500 to-blue-500','from-rose-500 to-pink-600',
  'from-amber-500 to-orange-500','from-teal-500 to-green-600',
];
const getAvatarColor = (name = '') => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const getStatusStyle = (status) => ({
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  pending:   'bg-amber-100 text-amber-700',
}[status] || 'bg-gray-100 text-gray-600');

export default function BookingsPage() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [user, setUser]         = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [stats, setStats]       = useState({ total: 0, upcoming: 0, completed: 0, revenue: 0 });

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/login'); return; }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setBusiness(parsed.business);
    fetchBookings(token);
  }, [router]);

  const fetchBookings = async (token) => {
    try {
      const res  = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setFiltered(data.bookings || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...bookings];
    if (statusFilter !== 'all') result = result.filter(b => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.customerName?.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q) ||
        b.customerPhone?.includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const updateStatus = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings(prev =>
          prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard',  action: () => router.push('/dashboard') },
    { icon: Calendar,        label: 'Bookings',   action: () => {},                        active: true },
    { icon: Users,           label: 'Customers',  action: () => router.push('/dashboard/customers') },
    { icon: DollarSign,      label: 'Revenue',    action: () => {} },
    { icon: Settings,        label: 'Setup',      action: () => router.push('/dashboard/setup') },
  ];

  const filterTabs = [
    { key: 'all',       label: 'All',       count: bookings.length },
    { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <DashboardLayout business={business} user={user}>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-700 transition">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-[13px] font-semibold text-slate-900">All Bookings</span>
          </div>
          <span className="text-[11px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
            Live
          </span>
        </header>
  
        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
  
          {/* stats — 2 cols mobile, 4 desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-5 md:mb-7">
            {[
              { label: 'Total',     value: stats.total,     icon: Calendar,     bg: 'bg-green-100',  ic: 'text-green-600'  },
              { label: 'Upcoming',  value: stats.upcoming,  icon: Clock,        bg: 'bg-blue-100',   ic: 'text-blue-600'   },
              { label: 'Completed', value: stats.completed, icon: CheckCircle,  bg: 'bg-purple-100', ic: 'text-purple-600' },
              { label: 'Revenue',   value: `KES ${(stats.revenue || 0).toLocaleString()}`, icon: Wallet, bg: 'bg-orange-100', ic: 'text-orange-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 hover:border-green-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                <div className={`${s.bg} p-2 md:p-2.5 rounded-xl w-fit mb-3`}>
                  <s.icon className={`h-4 w-4 md:h-5 md:w-5 ${s.ic}`} />
                </div>
                <p className="text-[20px] md:text-[24px] font-black text-slate-900 leading-none mb-1">{s.value}</p>
                <p className="text-[11px] md:text-[12px] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
  
          {/* search + filter */}
          <div className="bg-white rounded-2xl border border-slate-100 mb-4 p-3 md:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 flex-1">
              <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search bookings..."
                className="bg-transparent text-[13px] text-slate-700 outline-none w-full placeholder:text-slate-400" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {filterTabs.map(tab => (
                <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    statusFilter === tab.key
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}>
                  {tab.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
  
          {/* bookings — table on desktop, cards on mobile */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-7 w-7 text-slate-300" />
                </div>
                <p className="text-[14px] font-semibold text-slate-500 mb-1">No bookings found</p>
                <p className="text-[12px] text-slate-400">
                  {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Share your booking link to get started'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Customer</span><span>Service</span><span>Date & Time</span><span>Amount</span><span>Actions</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {filtered.map((b) => (
                      <div key={b._id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-4 items-center hover:bg-slate-50/60 transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(b.customerName)} flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0`}>
                            {getInitials(b.customerName)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 truncate">{b.customerName}</p>
                            <p className="text-[11px] text-slate-400">{b.customerPhone || '—'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-700 truncate">{b.service}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusStyle(b.status)}`}>{b.status}</span>
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-slate-700">
                            {new Date(b.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(b.date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <p className="text-[14px] font-bold text-green-600">KES {(b.servicePrice || 0).toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          {b.status === 'confirmed' ? (
                            <>
                              <button onClick={() => updateStatus(b._id, 'completed')} disabled={updating === b._id}
                                className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition disabled:opacity-50">
                                <CheckCircle className="h-3 w-3" />{updating === b._id ? '...' : 'Done'}
                              </button>
                              <button onClick={() => updateStatus(b._id, 'cancelled')} disabled={updating === b._id}
                                className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50">
                                <XCircle className="h-3 w-3" />Cancel
                              </button>
                            </>
                          ) : (
                            <span className="text-[12px] text-slate-300 italic">—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-slate-50">
                  {filtered.map((b) => (
                    <div key={b._id} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(b.customerName)} flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0`}>
                          {getInitials(b.customerName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-bold text-slate-900 truncate">{b.customerName}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusStyle(b.status)}`}>{b.status}</span>
                          </div>
                          <p className="text-[12px] text-slate-400">{b.customerPhone || '—'}</p>
                        </div>
                        <p className="text-[14px] font-black text-green-600 flex-shrink-0">
                          KES {(b.servicePrice || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{b.service}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(b.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}{' '}
                          {new Date(b.date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {b.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(b._id, 'completed')} disabled={updating === b._id}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-[12px] font-semibold py-2 rounded-xl hover:bg-blue-100 transition disabled:opacity-50">
                            <CheckCircle className="h-3.5 w-3.5" />{updating === b._id ? '...' : 'Mark Done'}
                          </button>
                          <button onClick={() => updateStatus(b._id, 'cancelled')} disabled={updating === b._id}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-[12px] font-semibold py-2 rounded-xl hover:bg-red-100 transition disabled:opacity-50">
                            <XCircle className="h-3.5 w-3.5" />Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
  
          {filtered.length > 0 && (
            <p className="text-[12px] text-slate-400 mt-3 text-right">
              Showing {filtered.length} of {bookings.length} bookings
            </p>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
};