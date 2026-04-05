'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Clock, User, Phone, Mail, CheckCircle,
  MapPin, DollarSign, Timer, ChevronRight,
  ChevronLeft, Calendar, Star, ArrowRight
} from 'lucide-react';

export default function PublicBookingPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness]           = useState(null);
  const [loading, setLoading]             = useState(true);
  const [step, setStep]                   = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate]   = useState('');
  const [selectedTime, setSelectedTime]   = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', customerEmail: '', notes: ''
  });

  useEffect(() => { fetchBusiness(); }, [params.businessId]);

  const fetchBusiness = async () => {
    try {
      const res  = await fetch(`/api/businesses/${params.businessId}`);
      const data = await res.json();
      setBusiness(res.ok ? data.business : null);
    } catch (e) {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  const generateTimes = () => {
    if (!selectedDate || !business) return [];
    const day  = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const avail = business.availability[day];
    if (!avail?.enabled) return [];
    const times = [];
    const [sh, sm] = avail.start.split(':').map(Number);
    const [eh, em] = avail.end.split(':').map(Number);
    for (let h = sh; h <= eh; h++) {
      for (let m of [0, 30]) {
        if (h === eh && m > em) break;
        if (h === sh && m < sm) continue;
        times.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
      }
    }
    return times;
  };

  useEffect(() => {
    if (selectedDate) setAvailableTimes(generateTimes());
  }, [selectedDate, business]);

  const getNextDays = (n = 14) => {
    return Array.from({ length: n }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingStatus('loading');
    try {
      const res  = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId:    business._id,
          customerName:  formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          service:       selectedService.name,
          servicePrice:  selectedService.price,
          date:          new Date(`${selectedDate}T${selectedTime}:00`),
          notes:         formData.notes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingStatus('success');
        setTimeout(() => router.push(`/booking-confirmation/${data.booking._id}`), 1500);
      } else {
        setBookingStatus('error');
        setTimeout(() => setBookingStatus(null), 4000);
      }
    } catch {
      setBookingStatus('error');
      setTimeout(() => setBookingStatus(null), 4000);
    }
  };

  const stepLabels = ['Service', 'Date & Time', 'Your Details'];

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium text-[14px]">Loading booking page...</p>
      </div>
    </div>
  );

  // ── Not found ──
  if (!business) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center max-w-sm w-full shadow-xl">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <MapPin className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="text-[20px] font-black text-slate-900 mb-2">Business not found</h2>
        <p className="text-[14px] text-slate-500 mb-6">This booking link doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-[14px] hover:opacity-90 transition"
        >
          Go to BookEase
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top nav bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="text-[18px] font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          BookEase
        </div>
        <span className="text-[11px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
          Booking open
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Business header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/20">
            <span className="text-[22px] font-black text-white">
              {business.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">{business.name}</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {business.location && (
              <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <MapPin className="h-3.5 w-3.5" /> {business.location}
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <Phone className="h-3.5 w-3.5" /> {business.phone}
              </div>
            )}
          </div>
          {business.description && (
            <p className="text-[14px] text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              {business.description}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {stepLabels.map((label, i) => {
              const s = i + 1;
              return (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all mb-1.5 ${
                    step > s
                      ? 'bg-green-600 text-white'
                      : step === s
                      ? 'bg-gradient-to-br from-green-600 to-blue-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  <span className={`text-[11px] font-semibold ${step === s ? 'text-green-600' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress line */}
          <div className="relative h-1 bg-slate-100 rounded-full mx-6 -mt-1">
            <div
              className="absolute left-0 top-0 h-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* ── STEP 1: Service ── */}
        {step === 1 && (
          <div>
            <div className="mb-5">
              <h2 className="text-[22px] font-black text-slate-900 mb-1">Choose a service</h2>
              <p className="text-[14px] text-slate-500">Select what you'd like to book</p>
            </div>
            <div className="space-y-3">
              {business.services.map((service, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedService(service); setStep(2); }}
                  className="w-full bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between hover:border-green-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-green-100 group-hover:to-blue-100 transition">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900 mb-1">{service.name}</p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-[13px] text-slate-500">
                          <DollarSign className="h-3.5 w-3.5" />
                          KES {service.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-[13px] text-slate-500">
                          <Timer className="h-3.5 w-3.5" />
                          {service.duration} mins
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition">
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white transition" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Date & Time ── */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setStep(1)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
              <div>
                <h2 className="text-[22px] font-black text-slate-900 leading-none">Pick a date & time</h2>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Booking: <span className="font-semibold text-green-600">{selectedService?.name}</span>
                </p>
              </div>
            </div>

            {/* Date grid */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select date</p>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {getNextDays(14).map((date, i) => {
                  const dateStr    = date.toISOString().split('T')[0];
                  const dayName    = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                  const dayShort   = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const isAvail    = business.availability[dayName]?.enabled;
                  const isSelected = selectedDate === dateStr;
                  const isToday    = i === 0;

                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                      disabled={!isAvail}
                      className={`flex flex-col items-center py-3 px-1 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-green-600 to-blue-600 border-transparent text-white shadow-lg shadow-green-600/25'
                          : isAvail
                          ? 'bg-white border-slate-100 hover:border-green-300 hover:shadow-md'
                          : 'bg-slate-50 border-slate-50 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isSelected ? 'text-green-100' : 'text-slate-400'}`}>
                        {dayShort}
                      </span>
                      <span className={`text-[18px] font-black leading-none ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {date.getDate()}
                      </span>
                      {isToday && (
                        <span className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-green-100' : 'text-green-600'}`}>
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Available times
                </p>
                {availableTimes.length === 0 ? (
                  <p className="text-[14px] text-slate-400 text-center py-4">
                    No available times for this day
                  </p>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setStep(3); }}
                        className={`flex flex-col items-center py-3 rounded-xl border transition-all ${
                          selectedTime === time
                            ? 'bg-gradient-to-br from-green-600 to-blue-600 border-transparent text-white shadow-lg shadow-green-600/25'
                            : 'bg-white border-slate-100 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <Clock className={`h-3.5 w-3.5 mb-1 ${selectedTime === time ? 'text-green-100' : 'text-slate-400'}`} />
                        <span className={`text-[13px] font-bold ${selectedTime === time ? 'text-white' : 'text-slate-700'}`}>
                          {time}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Details ── */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setStep(2)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>
              <div>
                <h2 className="text-[22px] font-black text-slate-900 leading-none">Your details</h2>
                <p className="text-[13px] text-slate-500 mt-0.5">Almost done — just a few details</p>
              </div>
            </div>

            {/* Booking summary pill */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-[13px]">
                <Star className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-slate-700">{selectedService?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">
                  {new Date(selectedDate).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-bold text-green-600">KES {selectedService?.price.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <label className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <User className="h-3.5 w-3.5" /> Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  placeholder="e.g., John Mwangi"
                  className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-300 outline-none border-none bg-transparent"
                />
              </div>

              {/* Phone */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <label className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Phone className="h-3.5 w-3.5" /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  placeholder="+254 712 345 678"
                  className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-300 outline-none border-none bg-transparent"
                />
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <label className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Mail className="h-3.5 w-3.5" /> Email <span className="text-slate-300 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-300 outline-none border-none bg-transparent"
                />
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Special Requests <span className="text-slate-300 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests for the business?"
                  className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-300 outline-none border-none bg-transparent resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 rounded-2xl text-[16px] flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70 shadow-xl shadow-green-600/20"
              >
                {bookingStatus === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirming your booking...
                  </>
                ) : bookingStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Booking confirmed! Redirecting...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {bookingStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-[13px] text-center font-medium">
                  This time slot may already be taken. Please go back and choose another time.
                </div>
              )}
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-[12px] text-slate-400">
            Powered by{' '}
            <span className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              BookEase
            </span>
            {' '}· Made in Kenya
          </p>
        </div>
      </div>
    </div>
  );
}