#!/usr/bin/env node

/**
 * Generate a secure random secret for NextAuth
 * Usage: node scripts/generate-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('\n✅ Generated NEXTAUTH_SECRET:');
console.log(secret);
console.log('\n📋 Add this to your .env.local file:');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('\n');

