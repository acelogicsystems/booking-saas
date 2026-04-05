'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, ArrowRight, Eye, EyeOff,
  Building2, CheckCircle, Scissors, Sparkles
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading,  setLoading]       = useState(false);
  const [error,    setError]         = useState('');
  const [showPass, setShowPass]      = useState(false);
  const [showConf, setShowConf]      = useState(false);
  const [formData, setFormData]      = useState({
    businessName: '', email: '', password: '', confirmPassword: ''
  });

  const update = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.businessName || !formData.email || !formData.password) {
      setError('Please fill in all required fields'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); return;
    }

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:        formData.email,
          password:     formData.password,
          businessName: formData.businessName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/login?success=Account created! Please sign in.');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const strength = (() => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-400',   width: 'w-1/4' };
    if (p.length < 8) return { label: 'Weak',      color: 'bg-amber-400', width: 'w-2/4' };
    if (p.length < 12) return { label: 'Good',     color: 'bg-blue-500',  width: 'w-3/4' };
    return               { label: 'Strong',        color: 'bg-green-500', width: 'w-full' };
  })();

  const businessTypes = [
    { icon: Scissors,  label: 'Barbershop'   },
    { icon: Sparkles,  label: 'Salon'        },
    { icon: Building2, label: 'Other'        },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.06] rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="text-[26px] font-black text-white mb-1">BookEase</div>
          <p className="text-green-200 text-[14px]">Made in Kenya</p>
        </div>

        <div className="relative z-10">
          <h2 className="text-[36px] font-black text-white leading-tight mb-4">
            Get your first<br />booking in under<br />10 minutes
          </h2>
          <p className="text-green-100 text-[15px] leading-relaxed mb-8">
            Set up your free booking page, share the link on WhatsApp, and start accepting appointments immediately.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { n: '1', title: 'Create your account',    sub: 'Takes less than 2 minutes'           },
              { n: '2', title: 'Add your services',       sub: 'Set prices and duration'             },
              { n: '3', title: 'Share your booking link', sub: 'On WhatsApp, Instagram & more'       },
              { n: '4', title: 'Start getting booked',    sub: '24/7 appointments without the hassle'},
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-black text-white flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">{s.title}</p>
                  <p className="text-[12px] text-green-300">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { val: '500+', label: 'Businesses' },
            { val: 'KES 500', label: 'Per month' },
            { val: '24/7',  label: 'Bookings'   },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-[18px] font-black text-white">{s.val}</p>
              <p className="text-[11px] text-green-300 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-[24px] font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              BookEase
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-[28px] font-black text-slate-900 mb-1">Start free trial</h1>
            <p className="text-[14px] text-slate-500">14 days free · No credit card needed</p>
          </div>

          {/* Free trial badge */}
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-[13px] text-green-700 font-medium">
              Free for 14 days · then only KES 500/month
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-[13px] text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Business Name */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={e => update('businessName', e.target.value)}
                  required
                  placeholder="e.g., Kevin's Barbershop"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 placeholder:text-slate-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                This appears on your public booking page
              </p>
            </div>

            {/* Business type quick-select */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Business Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {businessTypes.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      if (t.label !== 'Other' && !formData.businessName) {
                        update('businessName', '');
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 py-3 bg-white border border-slate-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-[12px] font-semibold text-slate-600 hover:text-green-700"
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => update('email', e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 placeholder:text-slate-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => update('password', e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3.5 text-[14px] text-slate-900 placeholder:text-slate-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-[11px] mt-1 font-semibold ${
                    strength.label === 'Strong' ? 'text-green-600' :
                    strength.label === 'Good'   ? 'text-blue-500'  :
                    strength.label === 'Weak'   ? 'text-amber-500' : 'text-red-500'
                  }`}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showConf ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  required
                  placeholder="Repeat your password"
                  className={`w-full bg-white border rounded-xl pl-11 pr-11 py-3.5 text-[14px] text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 transition ${
                    formData.confirmPassword && formData.confirmPassword !== formData.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                      : formData.confirmPassword && formData.confirmPassword === formData.password
                      ? 'border-green-400 focus:border-green-500 focus:ring-green-500/10'
                      : 'border-slate-200 focus:border-green-500 focus:ring-green-500/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {/* Match indicator */}
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 rounded-xl text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60 shadow-lg shadow-green-600/20 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400 mt-2">
              By signing up you agree to our{' '}
              <Link href="/terms" className="text-green-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-[13px] text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 font-bold hover:text-green-700 transition">
              Sign in
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-400 mt-6">
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