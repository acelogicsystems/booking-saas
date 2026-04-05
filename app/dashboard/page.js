'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Calendar, Users, DollarSign, TrendingUp, Clock,
  CheckCircle, Copy, Share2, Settings, BarChart3,
  ArrowRight, Wallet, Award, Activity, LogOut,
  LayoutDashboard, UserPlus, ChevronRight
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/login'); return; }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setBusiness(parsedUser.business);
    fetchBookings(token, parsedUser.business?.id);
  }, [router]);

  const fetchBookings = async (token, businessId) => {
    if (!businessId) { setLoading(false); return; }
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        if (data.stats) setStats({
          total: data.stats.total || 0,
          upcoming: data.stats.upcoming || 0,
          completed: data.stats.completed || 0,
          revenue: data.stats.revenue || 0,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const copyLink = () => {
    const link = business?.bookingLink
      ? `${window.location.origin}/book/${business.bookingLink}` : '';
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const link = business?.bookingLink
      ? `${window.location.origin}/book/${business.bookingLink}` : '';
    if (link) {
      window.open(`https://wa.me/?text=${encodeURIComponent(
        `Book your appointment with ${business.name}: ${link}`
      )}`, '_blank');
    }
  };

  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100) : 0;
  const upcomingBookings = bookings.filter(
    b => new Date(b.date) > new Date() && b.status === 'confirmed'
  );
  const recentBookings = bookings.slice(0, 6);

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const getStatusStyle = (status) => ({
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  }[status] || 'bg-gray-100 text-gray-600');

  const avatarColors = [
    'from-green-600 to-emerald-500',
    'from-blue-600 to-violet-600',
    'from-cyan-500 to-blue-500',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-500',
    'from-teal-500 to-green-600',
  ];
  const getAvatarColor = (name = '') => {
    const i = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[i];
  };

  const statCards = [
    {
      label: 'Total Bookings', value: stats.total,
      format: v => v.toString(),
      icon: Calendar, iconBg: 'bg-green-100', iconColor: 'text-green-600',
      trend: `+${stats.total} all time`, trendColor: 'bg-green-50 text-green-700',
    },
    {
      label: 'Active Services', value: business?.services?.length || 0,
      format: v => v.toString(),
      icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
      trend: 'Available now', trendColor: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Total Revenue', value: stats.revenue,
      format: v => `KES ${v.toLocaleString()}`,
      icon: Wallet, iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
      trend: 'Lifetime earnings', trendColor: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Completion Rate', value: completionRate,
      format: v => `${v}%`,
      icon: Award, iconBg: 'bg-orange-100', iconColor: 'text-orange-600',
      trend: `${stats.completed} completed`, trendColor: 'bg-orange-50 text-orange-700',
    },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Bookings', active: false },
    { icon: Users, label: 'Customers', action: () => router.push('/dashboard/customers'), active: false },
    { icon: DollarSign, label: 'Revenue', active: false },
    { icon: Settings, label: 'Setup', active: false, action: () => router.push('/dashboard/setup') },
    
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout business={business} user={user}>
      <div className="flex-1 flex flex-col min-w-0">
        {/* header */}
        <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-[16px] md:text-[18px] font-black text-slate-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              {business?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-[11px] md:text-[12px] text-slate-400 mt-0.5 hidden sm:block">
              {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className="text-[11px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
            <span className="hidden sm:inline">Live & accepting bookings</span>
            <span className="sm:hidden">Live</span>
          </span>
        </header>
  
        {/* main — add bottom padding for mobile nav */}
        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
          {/* welcome banner */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-5 md:p-7 mb-5 md:mb-7 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 md:w-56 h-40 md:h-56 bg-white/[0.06] rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <p className="text-[18px] md:text-[22px] font-black mb-1">
                {stats.upcoming > 0
                  ? `You have ${stats.upcoming} upcoming ${stats.upcoming === 1 ? 'booking' : 'bookings'}`
                  : 'No upcoming bookings yet'}
              </p>
              <p className="text-green-100 text-[13px] md:text-[14px]">
                {stats.upcoming > 0 ? 'Your calendar is filling up — great work!' : 'Share your booking link to start getting appointments'}
              </p>
              {upcomingBookings[0] && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-medium">
                  <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  Next: {upcomingBookings[0].customerName} · {upcomingBookings[0].service} ·{' '}
                  {new Date(upcomingBookings[0].date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}{' '}
                  {new Date(upcomingBookings[0].date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
  
          {/* stat cards — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-5 md:mb-7">
            {statCards.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 hover:border-green-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`${s.iconBg} p-2 md:p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                    <s.icon className={`h-4 w-4 md:h-5 md:w-5 ${s.iconColor}`} />
                  </div>
                  <span className={`text-[10px] md:text-[11px] font-semibold px-1.5 md:px-2 py-1 rounded-full ${s.trendColor} hidden sm:block`}>
                    {s.trend}
                  </span>
                </div>
                <p className="text-[20px] md:text-[26px] font-black text-slate-900 leading-none mb-1">
                  {s.format(s.value)}
                </p>
                <p className="text-[11px] md:text-[13px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
  
          {/* booking link card */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 md:p-5 mb-5 md:mb-7">
            <p className="text-[11px] font-bold text-green-700 uppercase tracking-widest mb-3">Your Booking Link</p>
            <div className="bg-white border border-green-200 rounded-xl px-3 py-2.5 font-mono text-[11px] md:text-[12px] text-green-700 truncate mb-3">
              {business?.bookingLink
                ? `${typeof window !== 'undefined' ? window.location.origin : ''}/book/${business.bookingLink}`
                : 'Set up your business first'}
            </div>
            <div className="flex gap-2">
              <button onClick={copyLink} disabled={!business?.bookingLink}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-[12px] md:text-[13px] font-semibold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-40">
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={shareWhatsApp} disabled={!business?.bookingLink}
                className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 text-[12px] md:text-[13px] font-semibold py-2.5 rounded-xl border border-green-200 hover:bg-green-200 transition disabled:opacity-40">
                <Share2 className="h-3.5 w-3.5" />
                WhatsApp
              </button>
            </div>
          </div>
  
          {/* bottom grid — stacked on mobile, 2 cols on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 md:gap-6">
  
            {/* bookings list */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-[14px] md:text-[15px] font-bold text-slate-900">Upcoming Bookings</span>
                  {upcomingBookings.length > 0 && (
                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {upcomingBookings.length}
                    </span>
                  )}
                </div>
                {bookings.length > 0 && (
                  <button onClick={() => router.push('/dashboard/bookings')}
                    className="text-[12px] text-green-600 font-semibold flex items-center gap-1 hover:text-green-700">
                    View all <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-50">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-[13px] font-semibold text-slate-600 mb-1">No bookings yet</p>
                    <p className="text-[12px] text-slate-400 mb-4">Share your link to get started</p>
                    <button onClick={copyLink}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition">
                      <UserPlus className="h-3.5 w-3.5" /> Share Link
                    </button>
                  </div>
                ) : (
                  recentBookings.map((b) => (
                    <div key={b._id} className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 hover:bg-slate-50/80 transition">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(b.customerName)} flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0`}>
                        {getInitials(b.customerName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-semibold text-slate-900 truncate">{b.customerName}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${getStatusStyle(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {b.service} · {new Date(b.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })} {new Date(b.date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-[13px] font-bold text-green-600 flex-shrink-0">
                        KES {(b.servicePrice || 0).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
  
            {/* quick actions */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 md:px-5 py-4 border-b border-slate-50">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-[14px] md:text-[15px] font-bold text-slate-900">Quick Actions</span>
              </div>
              <div className="p-4 space-y-2.5">
                <button onClick={() => router.push('/dashboard/setup')}
                  className="flex items-center justify-between w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3 md:py-3.5 rounded-xl text-[13px] font-semibold hover:opacity-90 transition">
                  <span className="flex items-center gap-2"><Settings className="h-4 w-4" /> Configure Services</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={shareWhatsApp}
                  className="flex items-center justify-between w-full border-2 border-slate-100 px-4 py-3 md:py-3.5 rounded-xl text-[13px] font-semibold text-slate-700 hover:border-green-400 hover:bg-green-50 hover:text-green-700 transition">
                  <span className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Share on WhatsApp</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={copyLink}
                  className="flex items-center justify-between w-full border-2 border-slate-100 px-4 py-3 md:py-3.5 rounded-xl text-[13px] font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition">
                  <span className="flex items-center gap-2"><Copy className="h-4 w-4" /> Copy Booking Link</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mx-4 mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[12px] font-bold text-amber-800 mb-1">Pro Tip</p>
                <p className="text-[12px] text-amber-700 leading-relaxed">
                  Share on WhatsApp Status and Instagram bio — businesses doing this see 3× more appointments.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
};