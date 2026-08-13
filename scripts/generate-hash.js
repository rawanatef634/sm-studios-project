#!/usr/bin/env node
/**
 * Generates a bcrypt hash (work factor 12) for the given password.
 *
 * Usage:
 *   node scripts/generate-hash.js <your-password>
 *
 * Copy the output line into your .env file or Netlify environment variables.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-hash.js <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

console.log("\nAdd this to your environment variables:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
