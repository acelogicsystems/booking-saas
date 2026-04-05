'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const success      = searchParams.get('success');

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.06] rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="text-[26px] font-black text-white mb-1">BookEase</div>
          <p className="text-green-200 text-[14px]">Made in Kenya</p>
        </div>

        <div className="relative z-10">
          <h2 className="text-[36px] font-black text-white leading-tight mb-4">
            Your business,<br />always open for<br />bookings
          </h2>
          <p className="text-green-100 text-[15px] leading-relaxed mb-8">
            Join 500+ Kenyan businesses accepting appointments 24/7 with their own booking page.
          </p>

          {/* Social proof */}
          <div className="space-y-3">
            {[
              'Free booking page for your business',
              'Share on WhatsApp & Instagram',
              'Real-time appointment management',
              'KES 500/month after free trial',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-green-300" />
                </div>
                <span className="text-[13px] text-green-100">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <p className="text-[13px] text-green-50 leading-relaxed italic mb-3">
            "My bookings increased by 40% in the first month. Best investment for my barbershop."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-400/30 flex items-center justify-center text-[11px] font-bold text-white">
              KO
            </div>
            <div>
              <p className="text-[12px] font-bold text-white">Kevin Otieno</p>
              <p className="text-[11px] text-green-300">Premium Cuts, Nairobi CBD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-[24px] font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              BookEase
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-[28px] font-black text-slate-900 mb-1">Welcome back</h1>
            <p className="text-[14px] text-slate-500">Sign in to your dashboard</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <p className="text-[13px] text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-[13px] text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 placeholder:text-slate-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-600 font-bold hover:text-green-700 transition">
              Start free trial
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-400 mt-8">
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}