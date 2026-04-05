'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, DollarSign, Search, Users,
  LayoutDashboard, Settings, LogOut,
  ChevronRight, ArrowLeft, Phone, Mail,
  TrendingUp, UserCheck
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';

const avatarColors = [
  'from-green-600 to-emerald-500','from-blue-600 to-violet-600',
  'from-cyan-500 to-blue-500','from-rose-500 to-pink-600',
  'from-amber-500 to-orange-500','from-teal-500 to-green-600',
];
const getAvatarColor = (name = '') => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export default function CustomersPage() {
  const router = useRouter();
  const [business, setBusiness]   = useState(null);
  const [user, setUser]           = useState(null);
  const [bookings, setBookings]   = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/login'); return; }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setBusiness(parsed.business);
    fetchData(token);
  }, [router]);

  const fetchData = async (token) => {
    try {
      const res  = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        const built = buildCustomers(data.bookings || []);
        setCustomers(built);
        setFiltered(built);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate bookings into unique customers
  const buildCustomers = (bookings) => {
    const map = {};
    bookings.forEach(b => {
      const key = b.customerPhone || b.customerName;
      if (!map[key]) {
        map[key] = {
          name:        b.customerName,
          phone:       b.customerPhone || '—',
          email:       b.customerEmail || '—',
          bookings:    [],
          totalSpent:  0,
          lastBooking: b.date,
        };
      }
      map[key].bookings.push(b);
      map[key].totalSpent += b.servicePrice || 0;
      if (new Date(b.date) > new Date(map[key].lastBooking)) {
        map[key].lastBooking = b.date;
      }
    });
    return Object.values(map).sort(
      (a, b) => new Date(b.lastBooking) - new Date(a.lastBooking)
    );
  };

  useEffect(() => {
    if (!search.trim()) { setFiltered(customers); return; }
    const q = search.toLowerCase();
    setFiltered(customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    ));
  }, [search, customers]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', action: () => router.push('/dashboard') },
    { icon: Calendar,        label: 'Bookings',  action: () => router.push('/dashboard/bookings') },
    { icon: Users,           label: 'Customers', action: () => {},                                  active: true },
    { icon: DollarSign,      label: 'Revenue',   action: () => {} },
    { icon: Settings,        label: 'Setup',     action: () => router.push('/dashboard/setup') },
  ];

  const totalRevenue   = customers.reduce((s, c) => s + c.totalSpent, 0);
  const repeatCustomers = customers.filter(c => c.bookings.length > 1).length;

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
            <span className="text-[13px] font-semibold text-slate-900">Customers</span>
          </div>
          <span className="text-[11px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
            Live
          </span>
        </header>
  
        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8">
  
          {/* stats — 3 cols, responsive text */}
          <div className="grid grid-cols-3 gap-3 md:gap-5 mb-5 md:mb-7">
            {[
              { label: 'Total Customers',  value: customers.length,   icon: Users,      bg: 'bg-green-100',  ic: 'text-green-600'  },
              { label: 'Repeat Customers', value: repeatCustomers,    icon: UserCheck,  bg: 'bg-blue-100',   ic: 'text-blue-600'   },
              { label: 'Total Revenue',    value: `KES ${totalRevenue.toLocaleString()}`, icon: TrendingUp, bg: 'bg-purple-100', ic: 'text-purple-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 md:p-5 border border-slate-100 hover:border-green-200 transition-all">
                <div className={`${s.bg} p-2 rounded-xl w-fit mb-2 md:mb-3`}>
                  <s.icon className={`h-4 w-4 ${s.ic}`} />
                </div>
                <p className="text-[18px] md:text-[26px] font-black text-slate-900 leading-none mb-1">{s.value}</p>
                <p className="text-[10px] md:text-[12px] text-slate-400 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
  
          {/* search */}
          <div className="bg-white rounded-2xl border border-slate-100 mb-4 p-3 md:p-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="bg-transparent text-[13px] text-slate-700 outline-none w-full placeholder:text-slate-400" />
            </div>
          </div>
  
          {/* customer grid — 1 col mobile, 2 tablet, 3 desktop */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-[14px] font-semibold text-slate-500 mb-1">No customers yet</p>
              <p className="text-[12px] text-slate-400">
                {search ? 'No customers match your search' : 'Customers appear here once bookings are made'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 md:p-5 hover:border-green-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(c.name)} flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0`}>
                      {getInitials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] md:text-[15px] font-bold text-slate-900 truncate">{c.name}</p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c.bookings.length > 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {c.bookings.length > 1 ? `${c.bookings.length}× repeat` : 'New customer'}
                      </span>
                    </div>
                    <p className="text-[14px] font-black text-green-600 flex-shrink-0">
                      KES {c.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {c.phone !== '—' && (
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />{c.phone}
                      </div>
                    )}
                    {c.email !== '—' && (
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Last visit: {new Date(c.lastBooking).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="border-t border-slate-50 pt-3 mb-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">History</p>
                    {c.bookings.slice(0, 2).map((b, j) => (
                      <div key={j} className="flex items-center justify-between text-[12px] mb-1">
                        <span className="text-slate-600 truncate">{b.service}</span>
                        <span className="text-slate-400 flex-shrink-0 ml-2">
                          {new Date(b.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                    {c.bookings.length > 2 && (
                      <p className="text-[11px] text-slate-400 italic">+{c.bookings.length - 2} more</p>
                    )}
                  </div>
                  {c.phone !== '—' && (
                    <button
                      onClick={() => window.open(`https://wa.me/${c.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${c.name.split(' ')[0]}! Ready to book your next appointment? ${window.location.origin}/book/${business?.bookingLink}`)}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold py-2.5 rounded-xl hover:bg-green-100 transition">
                      Send WhatsApp Follow-up
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
  
          {filtered.length > 0 && (
            <p className="text-[12px] text-slate-400 mt-4 text-right">
              {filtered.length} customer{filtered.length !== 1 ? 's' : ''} · {bookings.length} total bookings
            </p>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
};