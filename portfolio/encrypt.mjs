#!/usr/bin/env node
/**
 * Encrypt the portfolio content (HTML) with a password and bake the ciphertext
 * into portfolio/index.html. The plaintext content is never published — only
 * the AES-GCM-encrypted bytes are.
 *
 * Usage:
 *   node portfolio/encrypt.mjs <password> [contentPath]
 *
 * Defaults:
 *   contentPath = portfolio/source.html
 *
 * After running, commit + push portfolio/index.html. The plaintext content
 * stays local (portfolio/source.* is gitignored). To rotate the password or
 * update content, just re-run this script.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const ITERATIONS = 200_000;

const [, , password, contentArg] = process.argv;
if (!password) {
  console.error("Usage: node portfolio/encrypt.mjs <password> [contentPath]");
  process.exit(1);
}
const contentPath = resolve(here, contentArg || "source.html");
const templatePath = resolve(here, "template.html");
const outPath = resolve(here, "index.html");

const contentBytes = await readFile(contentPath);
const template = await readFile(templatePath, "utf8");

const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));

const keyMat = await webcrypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  { name: "PBKDF2" },
  false,
  ["deriveKey"]
);
const key = await webcrypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  keyMat,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);
const ciphertext = new Uint8Array(
  await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, key, contentBytes)
);

const b64 = (u8) => Buffer.from(u8).toString("base64");

const html = template
  .replace("__SALT_B64__", b64(salt))
  .replace("__IV_B64__", b64(iv))
  .replace("__ITERATIONS__", String(ITERATIONS))
  .replace("__CIPHERTEXT_B64__", b64(ciphertext));

await writeFile(outPath, html, "utf8");

const kb = (n) => (n / 1024).toFixed(1);
console.log(`Encrypted ${contentPath}`);
console.log(`  Content size:    ${kb(contentBytes.length)} KB`);
console.log(`  Ciphertext size: ${kb(ciphertext.length)} KB`);
console.log(`Wrote ${outPath}`);
