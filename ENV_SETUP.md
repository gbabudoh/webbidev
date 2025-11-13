# Environment Variables Setup Guide

This guide will help you set up your `.env.local` file for the Webbidev application.

## Quick Start

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Restart your development server

## Required Environment Variables

### Database Configuration

#### `DATABASE_URL`
PostgreSQL connection string.

**Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

**Examples:**
- Local PostgreSQL:
  ```
  DATABASE_URL="postgresql://postgres:password@localhost:5432/webbidev?schema=public"
  ```
- PostgreSQL with SSL:
  ```
  DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&sslmode=require"
  ```
- Cloud providers (Supabase, Neon, etc.):
  ```
  DATABASE_URL="postgresql://user:password@host.region.provider.com:5432/dbname?schema=public"
  ```

**How to get it:**
- If using local PostgreSQL: Use your local database credentials
- If using a cloud provider: Check your database dashboard for the connection string

### NextAuth Configuration

#### `NEXTAUTH_SECRET`
Secret key for encrypting JWT tokens. **Required for authentication to work.**

**Generate a secret:**
```bash
# Using OpenSSL (Windows/Mac/Linux)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Example:**
```
NEXTAUTH_SECRET="your-generated-secret-key-here"
```

#### `NEXTAUTH_URL`
Base URL of your application.

**Development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```
NEXTAUTH_URL="https://yourdomain.com"
```

### Stripe Configuration

#### `STRIPE_SECRET_KEY`
Your Stripe secret key for server-side operations.

**Get it from:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Secret key" (starts with `sk_test_` for test mode or `sk_live_` for production)

**Example:**
```
STRIPE_SECRET_KEY="sk_test_51AbCdEf..."
```

#### `STRIPE_WEBHOOK_SECRET`
Secret for verifying Stripe webhook signatures.

**Get it from:**
1. Go to https://dashboard.stripe.com/webhooks
2. Create a webhook endpoint pointing to: `https://yourdomain.com/api/webhook/stripe`
3. Copy the "Signing secret" (starts with `whsec_`)

**Example:**
```
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### `STRIPE_PUBLISHABLE_KEY`
Your Stripe publishable key for client-side usage.

**Get it from:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your "Publishable key" (starts with `pk_test_` for test mode or `pk_live_` for production)

**Example:**
```
STRIPE_PUBLISHABLE_KEY="pk_test_51AbCdEf..."
```

### Platform Configuration

#### `WEBBIDEV_COMMISSION_RATE`
Commission rate for the platform (optional, defaults to 0.13 = 13%).

**Example:**
```
WEBBIDEV_COMMISSION_RATE="0.13"
```

### Admin User (Optional)

#### `ADMIN_EMAIL`
Email for the initial admin user (used during seeding).

**Example:**
```
ADMIN_EMAIL="admin@webbidev.com"
```

#### `ADMIN_PASSWORD`
Password for the initial admin user (used during seeding).

**⚠️ IMPORTANT:** Change this in production!

**Example:**
```
ADMIN_PASSWORD="admin123"
```

## Setting Up PostgreSQL

### Option 1: Local PostgreSQL

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create a database:**
   ```sql
   CREATE DATABASE webbidev;
   ```

3. **Update your `.env.local`:**
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/webbidev?schema=public"
   ```

### Option 2: Cloud PostgreSQL (Recommended for Production)

Popular providers:
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app
- **Render**: https://render.com

1. Sign up for a provider
2. Create a PostgreSQL database
3. Copy the connection string
4. Paste it into your `.env.local` as `DATABASE_URL`

## After Setting Up

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Push the schema to your database:**
   ```bash
   npm run db:push
   ```

3. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Verifying Your Setup

1. **Check database connection:**
   Visit: http://localhost:3000/api/health
   
   You should see:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "environment": "development"
   }
   ```

2. **Check if environment variables are loaded:**
   - Check the server console for any warnings about missing variables
   - NextAuth should work without errors

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Check if PostgreSQL is running
- Verify your `DATABASE_URL` is correct
- Check if the database exists

**Error: "Authentication failed"**
- Verify your PostgreSQL username and password
- Check if the user has permissions to access the database

### NextAuth Issues

**Error: "NEXTAUTH_SECRET is not set"**
- Make sure `.env.local` exists
- Verify `NEXTAUTH_SECRET` is set
- Restart your dev server after adding it

**Error: "CLIENT_FETCH_ERROR"**
- Check if `NEXTAUTH_URL` is set correctly
- Verify `NEXTAUTH_SECRET` is set
- Make sure Prisma Client is generated (`npm run db:generate`)

### Stripe Issues

**Error: "STRIPE_SECRET_KEY is not set"**
- Make sure `STRIPE_SECRET_KEY` is in your `.env.local`
- Verify you're using the correct key (test vs live)

## Security Notes

1. **Never commit `.env.local` to version control**
   - It's already in `.gitignore`
   - Only commit `.env.example`

2. **Use different keys for development and production**
   - Use test keys in development
   - Use live keys only in production

3. **Rotate secrets regularly**
   - Change `NEXTAUTH_SECRET` periodically
   - Update Stripe keys if compromised

4. **Use strong passwords**
   - Especially for admin accounts
   - Use password managers

## Next Steps

After setting up your environment variables:

1. ✅ Database connected
2. ✅ Prisma Client generated
3. ✅ Database schema pushed
4. ✅ NextAuth configured
5. ✅ Stripe configured (optional for now)
6. 🚀 Ready to develop!

