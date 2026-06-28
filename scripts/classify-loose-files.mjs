#!/usr/bin/env node
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const KNOWN_ROOT = new Set(['README.md', 'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'Dockerfile', 'docker-compose.yml', '.gitignore']);

function classify(file) {
  const ext = path.extname(file).toLowerCase();
  const lower = file.toLowerCase();

  if (KNOWN_ROOT.has(file)) return 'root-config';
  if (/docker|compose|gradle|capacitor|apk|android|start\.sh|start\.ps1/.test(lower)) return 'build-tooling';
  if (/app|screen|page|route|view|window|shell/.test(lower) && ['.tsx', '.jsx', '.ts', '.js', '.html'].includes(ext)) return 'possible-app';
  if (/aion|autoling|ingest|parser|orchestrator|runtime|engine/.test(lower)) return 'runtime';
  if (/resonance|field|physics|analyzer/.test(lower)) return 'runtime-resonance';
  if (['.md', '.txt', '.pdf'].includes(ext)) return 'docs';
  if (['.zip', '.tar', '.gz'].includes(ext)) return 'archive-source';
  if (['.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico'].includes(ext)) return 'asset';
  return 'needs-human-review';
}

const entries = await readdir(ROOT, { withFileTypes: true });
const loose = [];

for (const entry of entries) {
  if (!entry.isFile()) continue;
  const full = path.join(ROOT, entry.name);
  const info = await stat(full);
  loose.push({
    file: entry.name,
    size: info.size,
    classification: classify(entry.name)
  });
}

console.log(JSON.stringify({ root: ROOT, looseFiles: loose }, null, 2));
