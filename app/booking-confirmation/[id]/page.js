'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle, Calendar, Clock, User,
  Phone, Share2, Home, MapPin, Star,
  ArrowRight, DollarSign
} from 'lucide-react';

export default function BookingConfirmationPage() {
  const params  = useParams();
  const router  = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shared,  setShared]  = useState(false);

  useEffect(() => { fetchBooking(); }, [params.id]);

  const fetchBooking = async () => {
    try {
      const res  = await fetch(`/api/bookings/${params.id}`);
      const data = await res.json();
      if (res.ok) setBooking(data.booking);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shareWhatsApp = () => {
    const date = new Date(booking.date);
    const text = [
      `✅ Booking Confirmed!`,
      ``,
      `Service: ${booking.service}`,
      `Date: ${date.toLocaleDateString('en-KE', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
      `Time: ${date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}`,
      `Amount: KES ${booking.servicePrice?.toLocaleString()}`,
      ``,
      `See you soon! 🙌`,
    ].join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium text-[14px]">Loading your confirmation...</p>
      </div>
    </div>
  );

  // ── Not found ──
  if (!booking) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center max-w-sm w-full shadow-xl">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Calendar className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="text-[20px] font-black text-slate-900 mb-2">Booking not found</h2>
        <p className="text-[14px] text-slate-500 mb-6">
          We couldn't find this booking. It may have been cancelled.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-[14px] hover:opacity-90 transition"
        >
          Go to BookEase
        </button>
      </div>
    </div>
  );

  const bookingDate = new Date(booking.date);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top nav */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="text-[18px] font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          BookEase
        </div>
        <span className="text-[11px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
          Confirmed
        </span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Success hero */}
        <div className="text-center mb-8">
          {/* Animated checkmark */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-green-600/30">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            {/* Pulse rings */}
            <div className="absolute w-24 h-24 rounded-full border-4 border-green-400/30 animate-ping" />
          </div>
          <h1 className="text-[30px] font-black text-slate-900 mb-2">
            You're all booked!
          </h1>
          <p className="text-[15px] text-slate-500">
            Your appointment has been confirmed. See you soon!
          </p>
        </div>

        {/* Main booking card */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xl mb-4">

          {/* Card header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-green-200 uppercase tracking-widest mb-1">
                  Booking Reference
                </p>
                <p className="text-[13px] font-mono text-white/80">
                  #{booking._id?.toString().slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="bg-white/20 rounded-xl px-3 py-1.5">
                <p className="text-[12px] font-bold text-white uppercase tracking-wide">
                  {booking.status}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">

            {/* Service block */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-black text-slate-900">{booking.service}</p>
                <p className="text-[13px] text-slate-500">
                  {booking.businessName || 'Your appointment'}
                </p>
              </div>
              <p className="text-[18px] font-black text-green-600">
                KES {booking.servicePrice?.toLocaleString()}
              </p>
            </div>

            {/* Date & time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-9 h-9 bg-white rounded-lg border border-slate-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Date</p>
                  <p className="text-[13px] font-bold text-slate-900">
                    {bookingDate.toLocaleDateString('en-KE', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-9 h-9 bg-white rounded-lg border border-slate-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Time</p>
                  <p className="text-[13px] font-bold text-slate-900">
                    {bookingDate.toLocaleTimeString('en-KE', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div className="border-t border-slate-50 pt-4 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Your Details
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                  {booking.customerName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-900">{booking.customerName}</p>
                  <p className="text-[12px] text-slate-400">{booking.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide mb-1">Note</p>
                <p className="text-[13px] text-amber-800">{booking.notes}</p>
              </div>
            )}

            {/* Reminder box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-green-700 leading-relaxed">
                Please arrive <strong>5 minutes early</strong> for your appointment. If you need to cancel or reschedule, contact the business directly.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={shareWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-[15px] transition shadow-lg shadow-green-600/20"
          >
            <Share2 className="h-5 w-5" />
            {shared ? 'Opening WhatsApp...' : 'Share on WhatsApp'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl text-[15px] hover:bg-slate-50 transition"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </button>
        </div>

        {/* Book again hint */}
        {booking.businessId && (
          <div className="mt-5 text-center">
            <p className="text-[13px] text-slate-400 mb-2">Want to book again?</p>
            <button
              onClick={() => router.push(`/book/${booking.businessId}`)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-green-600 hover:text-green-700 transition"
            >
              Book another appointment
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-[12px] text-slate-400">
            Powered by{' '}
            <span className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              BookEase
            </span>
            {' '}· Made in Kenya 🇰🇪
          </p>
        </div>
      </div>
    </div>
  );
}