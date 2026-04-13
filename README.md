# Webbidev - The Next-Gen Developer Ecosystem

Webbidev is a high-precision, specialized marketplace connecting elite frontend, backend, and UI/UX developers with clients seeking guaranteed scope and simplified development workflows.

## 🚀 Overview

Webbidev streamlines the freelance lifecycle through architectural rigor, ensuring that every project is defined by clear milestones, secure escrowed payments, and verified identities.

### Core Features
- **Identity Verification (GDPR Compliant)**: Mandatory KYC for developers with administrative review.
- **Milestone-Based Escrow**: Secure fund handling via Stripe Connect with manual release upon milestone approval.
- **Integrated Dashboards**: Tailored experiences for Admins, Clients, and Developers.
- **Real-time Analytics**: Comprehensive platform monitoring for administrators.
- **Built-in Governance**: Full dispute resolution and project monitoring system.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion (for premium animations)
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe Connect (Escrow & Split Payments)
- **Icons**: Lucide React

## 📂 Project Structure

```text
webbidev/
├── app/                      # Next.js App Router root
│   ├── (auth)/               # Authentication routes (login, signup)
│   ├── admin/                # Platform Administration modules
│   │   ├── analytics/        # Platform-wide metrics
│   │   ├── disputes/         # Conflict resolution management
│   │   ├── verification/     # ID approval queue
│   │   └── dashboard/        # Admin control center
│   ├── api/                  # Backend API Handlers
│   │   ├── admin/            # Administrative protected routes
│   │   ├── stripe/           # Payment & Connect webhooks
│   │   └── user/             # Account management (deletion, profile)
│   ├── client/               # Client-facing portal and project posting
│   ├── developer/            # Developer-facing portal and earnings
│   └── layout.tsx            # Global root layout
├── components/               # React Component Library
│   ├── features/             # Feature-specific logic (Messaging, Scope-bar, Settings)
│   ├── layouts/              # Structural components (Sidebar, DashboardLayout)
│   └── ui/                   # Shared UI primitives (Badge, Button, Typography)
├── lib/                      # Core Utilities & Shared Logic
│   ├── auth-server.ts        # Server-side auth helpers
│   ├── prisma.ts             # Database client
│   └── stripe.ts             # Payment & Escrow implementation
├── prisma/                   # Database Schema & Migrations
└── types/                    # Common TypeScript definitions
```

## ⚙️ Development Setup

### 1. Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe Account (for Connect integration)

### 2. Environment Configuration
Create a `.env` file in the root based on the following:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/webbidev"

# NEXTAUTH
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
WEBBIDEV_COMMISSION_RATE="0.13"
```

### 3. Installation & Database
```bash
npm install
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## ⚖️ GDPR Compliance
Webbidev implements automated "Right to Erasure" features. Users can permanently delete their accounts from their respective settings pages, provided no active escrows or projects are in progress.
