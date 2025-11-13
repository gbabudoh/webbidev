# Database Setup Guide

This guide will help you set up your PostgreSQL database for Webbidev.

## Quick Setup

1. **Set up your database connection string in `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/webbidev?schema=public"
   ```

2. **Push the database schema:**
   ```bash
   npm run db:push
   ```

3. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

4. **Verify the connection:**
   Visit: http://localhost:3000/api/health

## Common Issues and Solutions

### Error: "Can't reach database server"

**Problem:** The database server is not running or the connection string is incorrect.

**Solutions:**
1. **Check if PostgreSQL is running:**
   - Windows: Check Services (services.msc) for PostgreSQL
   - Mac: `brew services list` or `pg_isready`
   - Linux: `sudo systemctl status postgresql`

2. **Verify your DATABASE_URL:**
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`
   - Check username, password, host, port, and database name

3. **Test the connection:**
   ```bash
   # Using psql
   psql -h localhost -U postgres -d webbidev
   ```

### Error: "Database schema not found"

**Problem:** The database exists but the schema hasn't been created.

**Solution:**
```bash
npm run db:push
```

This will create all the tables in your database.

### Error: "relation does not exist"

**Problem:** The database schema is out of sync with your Prisma schema.

**Solutions:**
1. **Push the schema:**
   ```bash
   npm run db:push
   ```

2. **Or create a migration:**
   ```bash
   npm run db:migrate
   ```

### Error: "Authentication failed"

**Problem:** Wrong username or password in DATABASE_URL.

**Solutions:**
1. **Check your PostgreSQL credentials:**
   - Default username: `postgres`
   - Check if you set a password during installation

2. **Reset PostgreSQL password (if needed):**
   - Windows: Use pgAdmin or reset via command line
   - Mac/Linux: Check pg_hba.conf or reset via command line

### Error: "database does not exist"

**Problem:** The database hasn't been created yet.

**Solution:**
1. **Create the database:**
   ```sql
   CREATE DATABASE webbidev;
   ```

2. **Or use psql:**
   ```bash
   createdb webbidev
   ```

## Setting Up PostgreSQL

### Option 1: Local PostgreSQL

#### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. Update `.env.local` with your password

#### Mac
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Option 2: Cloud PostgreSQL (Recommended)

#### Supabase (Free tier available)
1. Sign up at: https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `.env.local` with the connection string

#### Neon (Free tier available)
1. Sign up at: https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `.env.local` with the connection string

#### Railway
1. Sign up at: https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update `.env.local` with the connection string

## Database Schema Setup

After setting up your database connection:

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Push the schema to your database:**
   ```bash
   npm run db:push
   ```

   This will create all the tables:
   - User
   - DeveloperProfile
   - Project
   - Milestone
   - Proposal
   - Transaction
   - Message
   - Dispute
   - PlatformSettings
   - AdminActivity

3. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

   This will create:
   - Platform settings
   - Initial admin user (if not exists)

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

2. **Check environment variables:**
   ```bash
   npm run env:check
   ```

3. **Open Prisma Studio (optional):**
   ```bash
   npm run db:studio
   ```
   
   This opens a visual database browser at http://localhost:5555

## Troubleshooting

### Still getting errors?

1. **Check server logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for specific error messages

2. **Verify DATABASE_URL:**
   ```bash
   # In PowerShell (Windows)
   Get-Content .env.local | Select-String "DATABASE_URL"
   
   # In Bash (Mac/Linux)
   grep DATABASE_URL .env.local
   ```

3. **Test database connection:**
   ```bash
   # Using Node.js
   node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('Connected!')).catch(e => console.error('Error:', e.message));"
   ```

4. **Check Prisma Client:**
   ```bash
   npm run db:generate
   ```

## Next Steps

Once your database is set up:

1. ✅ Database connected
2. ✅ Schema pushed
3. ✅ Prisma Client generated
4. 🚀 Ready to develop!

If you're still having issues, check the server console for specific error messages and refer to the Prisma documentation: https://www.prisma.io/docs

