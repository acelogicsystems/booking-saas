'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, Users,
  DollarSign, Settings, LogOut, Menu, X
} from 'lucide-react';

const avatarColors = [
  'from-green-600 to-emerald-500', 'from-blue-600 to-violet-600',
  'from-cyan-500 to-blue-500',     'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-500',  'from-teal-500 to-green-600',
];
const getAvatarColor = (name = '') => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials    = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export default function DashboardLayout({ children, business, user }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar,        label: 'Bookings',  href: '/dashboard/bookings' },
    { icon: Users,           label: 'Customers', href: '/dashboard/customers' },
    { icon: Settings,        label: 'Setup',     href: '/dashboard/setup' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[220px] bg-slate-900 flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-6">
          <div className="text-[20px] font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
            BookEase
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main</p>
          {navItems.map((item) => (
            <button key={item.label} onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg mb-0.5 text-[13px] font-medium transition-all text-left border-l-[3px] ${
                isActive(item.href)
                  ? 'bg-green-500/10 text-white border-green-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
              }`}>
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-auto border-t border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(business?.name)} flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0`}>
              {getInitials(business?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-200 truncate">{business?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-[12px] text-red-400 hover:text-red-300 transition">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="text-[18px] font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          BookEase
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(business?.name)} flex items-center justify-center text-[10px] font-bold text-white`}>
              {getInitials(business?.name)}
            </div>
            <span className="text-[12px] font-medium text-slate-300 max-w-[100px] truncate">
              {business?.name}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white transition">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[52px] left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-4 py-3">
          {navItems.map((item) => (
            <button key={item.label}
              onClick={() => { router.push(item.href); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg mb-1 text-[14px] font-medium transition-all text-left ${
                isActive(item.href)
                  ? 'bg-green-500/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-800 pt-3 mt-2">
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-[13px] text-red-400 px-3 py-2">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:min-h-screen">
        {/* Spacer for mobile top bar */}
        <div className="lg:hidden h-[52px]" />
        {children}
      </div>

      {/* ── Mobile bottom nav ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => (
          <button key={item.label}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
              isActive(item.href)
                ? 'text-green-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}>
            <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-green-600' : ''}`} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}