# BookEase 📅

A SaaS booking system built for Kenyan small businesses — salons, barbershops, and service businesses. Businesses get their own booking page to share on WhatsApp and Instagram.

**Live Demo:** https://your-app.vercel.app

---

## What it does

- Business owners sign up and get a unique booking link
- Customers use the link to book appointments 24/7
- Business owners manage bookings from a dashboard
- WhatsApp sharing built in throughout

## Tech Stack

- **Frontend & Backend** — Next.js 16 (App Router)
- **Database** — MongoDB Atlas + Mongoose
- **Auth** — JWT + bcryptjs
- **Styling** — Tailwind CSS + shadcn/ui
- **Deployment** — Vercel

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page |
| Signup | `/signup` | Create business account |
| Login | `/login` | Sign in |
| Dashboard | `/dashboard` | Business overview |
| Bookings | `/dashboard/bookings` | Manage all bookings |
| Customers | `/dashboard/customers` | Customer profiles |
| Setup | `/dashboard/setup` | Configure services & hours |
| Public Booking | `/book/[businessId]` | Customer-facing booking page |
| Confirmation | `/booking-confirmation/[id]` | Post-booking confirmation |

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/booking-saas.git
cd booking-saas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`
:MONGODB_URI=mongodb+svr://....
JWT-SECRET=your_secret-key
### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |

## Deployment

Deployed on Vercel. Add the environment variables above in your Vercel project settings before deploying.

## Pricing

KES 500/month per business after 14-day free trial.

---

Built with ❤️ in Kenya 🇰🇪
