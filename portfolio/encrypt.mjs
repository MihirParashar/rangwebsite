#!/usr/bin/env node
/**
 * Encrypt a PDF with a password and bake the ciphertext into portfolio/index.html.
 * The PDF itself is never published — only the AES-GCM encrypted bytes are.
 *
 * Usage:
 *   node portfolio/encrypt.mjs <password> [pdfPath]
 *
 * Defaults:
 *   pdfPath = portfolio/source.pdf
 *
 * After running, commit + push portfolio/index.html. The plaintext PDF stays
 * local (portfolio/source.pdf is gitignored). To rotate the password, just
 * re-run this script with the new password.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const ITERATIONS = 200_000;

const [, , password, pdfArg] = process.argv;
if (!password) {
  console.error("Usage: node portfolio/encrypt.mjs <password> [pdfPath]");
  process.exit(1);
}
const pdfPath = resolve(here, pdfArg || "source.pdf");
const templatePath = resolve(here, "template.html");
const outPath = resolve(here, "index.html");

const pdfBytes = await readFile(pdfPath);
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
  await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, key, pdfBytes)
);

const b64 = (u8) => Buffer.from(u8).toString("base64");

const html = template
  .replace("__SALT_B64__", b64(salt))
  .replace("__IV_B64__", b64(iv))
  .replace("__ITERATIONS__", String(ITERATIONS))
  .replace("__CIPHERTEXT_B64__", b64(ciphertext));

await writeFile(outPath, html, "utf8");

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`Encrypted ${pdfPath}`);
console.log(`  PDF size:        ${mb(pdfBytes.length)} MB`);
console.log(`  Ciphertext size: ${mb(ciphertext.length)} MB`);
console.log(`Wrote ${outPath}`);
