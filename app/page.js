import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navigation */}
      <nav className="bg-white/97 backdrop-blur-xl border-b border-black/[0.06] sticky top-0 z-50">
        <div className="container mx-auto px-10 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-[22px] font-black bg-gradient-to-br from-green-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              BookEase
            </div>
            <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
              Made in Kenya
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-900 font-medium">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-br from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-full px-5 shadow-lg shadow-green-200/60 font-semibold">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3998420/pexels-photo-3998420.jpeg"
            alt="Kenyan barber serving customer"
            className="w-full h-full object-cover brightness-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/55 to-black/35" />
        </div>

        <div className="relative z-10 container mx-auto px-10 py-24 max-w-3xl">
          {/* Live pill */}
          <div className="inline-flex items-center gap-2 bg-green-600/[0.18] border border-green-400/35 rounded-full px-4 py-1.5 mb-7">
            <span className="relative flex h-[7px] w-[7px]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-green-500" />
            </span>
            <span className="text-[13px] text-green-100 font-medium">Trusted by 500+ businesses across Kenya</span>
          </div>

          <h1 className="text-[clamp(40px,6vw,72px)] font-black text-white leading-[1.08] tracking-[-1.5px] mb-5">
            Let customers book your services{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent block">
              online in minutes
            </span>
          </h1>

          <p className="text-[18px] text-white/78 mb-9 max-w-[520px] leading-relaxed">
            Stop the back-and-forth texting. Get your free booking page and start accepting appointments 24/7 — built for how Kenya works.
          </p>

          <div className="flex gap-4 flex-wrap mb-6">
            <Link href="/signup">
              <Button className="bg-gradient-to-br from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-full text-[16px] px-8 py-6 shadow-2xl shadow-green-600/45 font-bold transition hover:scale-[1.02]">
                Start Free Trial →
              </Button>
            </Link>
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/15 rounded-full text-[16px] px-8 py-6 backdrop-blur-sm">
              Watch Demo
            </Button>
          </div>

          <p className="text-white/50 text-[13px]">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>

        {/* Floating confirmation card */}
        <div className="absolute right-10 bottom-12 z-20 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 min-w-[220px] hidden lg:flex">
          <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-[18px] flex-shrink-0">📅</div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">Booking confirmed!</p>
            <p className="text-[12px] text-gray-500">Haircut · Tomorrow 3:00 PM</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-green-50/60 border-b border-gray-100 px-10 py-4 flex flex-wrap gap-8 items-center">
        {["500+ active businesses", "Nairobi · Mombasa · Kisumu", "WhatsApp-ready booking links", "M-Pesa payments coming soon"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
            <span className="text-green-500 text-base">✦</span> {item}
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="py-[88px] px-10 bg-white">
        <p className="text-center text-[12px] font-bold tracking-[2px] uppercase text-green-600 mb-3">Why BookEase</p>
        <h2 className="text-center text-[clamp(30px,4vw,46px)] font-black text-slate-900 tracking-tight mb-4">
          Why Kenyan businesses <span className="text-green-600">love BookEase</span>
        </h2>
        <p className="text-center text-[17px] text-slate-500 max-w-[560px] mx-auto mb-14 leading-relaxed">
          Simple, fast, and built for the Kenyan market. Here's how we help your business grow.
        </p>

        <div className="grid md:grid-cols-3 gap-7 max-w-[980px] mx-auto">
          {[
            { icon: "📱", title: "Your Own Booking Link", body: "Share on WhatsApp, Instagram, or your website. Customers book in seconds.", code: "bookease.co.ke/your-business" },
            { icon: "⏰", title: "24/7 Booking", body: "Customers can book anytime — even when you're busy serving other clients or sleeping." },
            { icon: "💰", title: "Affordable Pricing", body: null, price: true },
          ].map((f) => (
            <Card key={f.title} className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all overflow-hidden group">
              <CardContent className="p-9 text-center">
                <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-[30px] mx-auto mb-6 shadow-lg shadow-green-600/25">
                  {f.icon}
                </div>
                <h3 className="text-[20px] font-bold text-slate-900 mb-2.5">{f.title}</h3>
                {f.price ? (
                  <p className="text-slate-500 text-[15px] leading-relaxed">
                    <span className="text-[26px] font-black text-green-600">KES 500</span>/month<br />
                    Small investment. Big returns for your business.
                  </p>
                ) : (
                  <p className="text-slate-500 text-[15px] leading-relaxed">{f.body}</p>
                )}
                {f.code && (
                  <code className="mt-3 inline-block bg-green-50 border border-green-200 text-green-700 text-[13px] px-3 py-1.5 rounded-lg font-mono">
                    {f.code}
                  </code>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-[88px] px-10 bg-gradient-to-b from-slate-50 to-white">
        <p className="text-center text-[12px] font-bold tracking-[2px] uppercase text-green-600 mb-3">How it works</p>
        <h2 className="text-center text-[clamp(30px,4vw,46px)] font-black text-slate-900 tracking-tight mb-4">
          Get started in <span className="text-green-600">3 simple steps</span>
        </h2>
        <p className="text-center text-[17px] text-slate-500 max-w-[540px] mx-auto mb-16 leading-relaxed">
          No technical skills needed. Set up your booking system in minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-[900px] mx-auto relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(16.5%+28px)] right-[calc(16.5%+28px)] h-[2px] bg-gradient-to-r from-green-300 to-blue-300 z-0" />
          {[
            { n: "1", title: "Sign Up Free", body: "Create your account in 2 minutes with just your email address." },
            { n: "2", title: "Set Your Services", body: "Add your services, prices, and available working hours." },
            { n: "3", title: "Share & Earn", body: "Share your booking link and watch appointments roll in around the clock." },
          ].map((s) => (
            <div key={s.n} className="text-center relative z-10">
              <div className="w-[104px] h-[104px] rounded-[26px] bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-[44px] font-black text-white mx-auto mb-6 shadow-xl shadow-green-600/30">
                {s.n}
              </div>
              <h3 className="text-[19px] font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Kenya */}
      <section className="py-[88px] px-10 bg-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-[1100px] mx-auto">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg"
              alt="Kenyan business owner"
              className="w-full h-[520px] object-cover rounded-3xl shadow-2xl"
            />
            {/* Stats overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 flex gap-6 shadow-xl">
              {[["500+", "Active businesses"], ["40%", "More bookings avg."], ["24/7", "Always open"]].map(([num, lbl]) => (
                <div key={lbl} className="flex-1 text-center">
                  <div className="text-[22px] font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{num}</div>
                  <div className="text-[11px] text-gray-500 font-medium mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-black text-slate-900 tracking-tight leading-[1.18] mb-5">
              Built by Kenyans,{' '}
              <span className="text-green-600">for Kenyans</span>
            </h2>
            <p className="text-[16px] text-gray-500 leading-[1.8] mb-7">
              We understand the Kenyan market. From WhatsApp integration to M-Pesa payments (coming soon), BookEase is designed to work the way Kenyan businesses operate.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {["WhatsApp sharing", "Local support", "Mobile-first design", "KES pricing", "M-Pesa coming soon"].map((tag) => (
                <div key={tag} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-[14px] text-green-700 font-medium">
                  <span className="font-bold text-green-600">✓</span> {tag}
                </div>
              ))}
            </div>
            <Link href="/signup">
              <Button className="bg-gradient-to-br from-green-600 to-blue-600 rounded-full px-7 py-5 text-[15px] font-bold shadow-lg shadow-green-600/30">
                Get Started Free →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[88px] px-10 bg-slate-50">
        <p className="text-center text-[12px] font-bold tracking-[2px] uppercase text-green-600 mb-3">Social proof</p>
        <h2 className="text-center text-[clamp(30px,4vw,46px)] font-black text-slate-900 tracking-tight mb-4">
          Loved by <span className="text-green-600">Kenyan entrepreneurs</span>
        </h2>
        <p className="text-center text-[17px] text-slate-500 max-w-[520px] mx-auto mb-14 leading-relaxed">
          Hear what business owners across the country are saying
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          {[
            { q: "Since using BookEase, I don't miss any appointments. My customers love booking online! Best investment for my barbershop.", name: "Kevin Otieno", biz: "Premium Cuts, Nairobi CBD", init: "KO", grad: "from-green-600 to-emerald-500" },
            { q: "My bookings increased by 40% in the first month! Simple and easy to use. My clients love the convenience.", name: "Sarah Wanjiku", biz: "Glow Beauty Salon, Mombasa", init: "SW", grad: "from-violet-600 to-blue-600" },
          ].map((t) => (
            <Card key={t.name} className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex gap-0.5 mb-4 text-amber-400 text-[16px]">{"⭐".repeat(5)}</div>
                <p className="text-gray-600 text-[16px] leading-[1.75] italic mb-6">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-[15px] font-bold text-white`}>
                    {t.init}
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-gray-900">{t.name}</p>
                    <p className="text-[12px] text-gray-500">{t.biz}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden py-24 px-10 text-center bg-gradient-to-br from-green-600 to-blue-700">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-white/[0.05] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-white/[0.05] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-[clamp(30px,4vw,52px)] font-black text-white tracking-tight mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-[18px] text-white/80 mb-9 max-w-xl mx-auto">
            Join hundreds of Kenyan businesses already growing with BookEase
          </p>
          <Link href="/signup">
            <Button className="bg-white text-green-600 hover:bg-gray-50 rounded-full text-[17px] px-10 py-6 shadow-2xl font-bold transition hover:scale-[1.02]">
              Start Your Free Trial →
            </Button>
          </Link>
          <p className="text-white/60 text-[13px] mt-5">Free for 14 days · Cancel anytime · No commitment</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c0f12] py-16 px-10">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="text-[22px] font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-3">BookEase</div>
            <p className="text-gray-500 text-[14px] leading-relaxed">Making booking simple for Kenyan businesses. Built with love in Nairobi.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-[14px] mb-4">Contact</h4>
            <a href="tel:+254711317540" className="text-green-400 font-semibold text-[15px]">+254 711 317 540</a>
            <p className="text-gray-600 text-[13px] mt-2">Mon–Fri, 9am – 6pm</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-[14px] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-[14px] text-gray-500">
              {["About Us", "Contact Support", "Privacy Policy"].map((l) => (
                <li key={l}><Link href="#" className="hover:text-green-400 transition">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-7 text-center text-[13px] text-gray-600">
          © 2024 BookEase. Made with ❤️ in Kenya ·{' '}
          <a href="tel:+254711317540" className="text-green-400">+254 711 317 540</a>
        </div>
      </footer>
    </div>
  );
}