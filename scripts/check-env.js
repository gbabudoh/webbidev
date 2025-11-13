#!/usr/bin/env node

/**
 * Check if all required environment variables are set
 * Usage: node scripts/check-env.js
 */

require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

const optionalVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PUBLISHABLE_KEY',
  'WEBBIDEV_COMMISSION_RATE',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

console.log('\n🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Variables:');
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    if (varName === 'DATABASE_URL') {
      const url = new URL(value);
      const masked = `${url.protocol}//${url.username}:${'*'.repeat(url.password?.length || 0)}@${url.host}${url.pathname}`;
      console.log(`  ✅ ${varName}: ${masked}`);
    } else if (varName === 'NEXTAUTH_SECRET') {
      console.log(`  ✅ ${varName}: ${'*'.repeat(20)}... (hidden)`);
    } else {
      console.log(`  ✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`  ❌ ${varName}: NOT SET`);
    hasErrors = true;
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('SECRET') || varName.includes('KEY')) {
      console.log(`  ✅ ${varName}: ${'*'.repeat(20)}... (hidden)`);
    } else {
      console.log(`  ✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`  ⚠️  ${varName}: NOT SET (optional)`);
  }
});

console.log('\n');

if (hasErrors) {
  console.log('❌ Some required environment variables are missing!');
  console.log('📝 Please check your .env.local file and add the missing variables.');
  console.log('📖 See ENV_SETUP.md for detailed instructions.\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!\n');
  process.exit(0);
}

