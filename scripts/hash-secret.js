#!/usr/bin/env node
// Usage: node scripts/hash-secret.js            (prompts, input hidden)
//        node scripts/hash-secret.js --random   (prints a 48-byte SESSION_SECRET)
const crypto = require("crypto");
const { hashSecret } = require("../admin-security");

if (process.argv.includes("--random")) {
  console.log(crypto.randomBytes(48).toString("base64url"));
  process.exit(0);
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => { if (s.includes("\n") || s.includes("Secret")) process.stdout.write(s); };
rl.question("Secret to hash (input hidden): ", (v) => {
  rl.close();
  process.stdout.write("\n");
  if (!v || v.length < 4) { console.error("Too short."); process.exit(1); }
  console.log(hashSecret(v));
});
