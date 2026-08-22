#!/usr/bin/env tsx
/**
 * Login manual Arnold S → exporta Playwright storage state.
 * Uso: npx tsx scripts/workana-export-session.ts [outPath]
 */
import { exportStorageStateInteractive } from "../lib/integrations/workana.js";

const out = process.argv[2];
const path = await exportStorageStateInteractive(out);
console.log(JSON.stringify({ ok: true, path }, null, 2));
