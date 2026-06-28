#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'android', 'ios']);
const TEXT_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.css', '.html', '.py', '.sh', '.yml', '.yaml'
]);

const STUB_PATTERNS = [
  /coming\s+soon/i,
  /placeholder/i,
  /stub/i,
  /todo:/i,
  /mock\s+only/i,
  /not\s+implemented/i,
  /throw\s+new\s+Error\(['\"]not implemented/i,
  /return\s+null\s*;?\s*$/m,
  /onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/m,
  /href=["']#["']/i
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      files.push(...await walk(fullPath));
    } else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function classifyFinding(file, text) {
  const hits = STUB_PATTERNS
    .filter((pattern) => pattern.test(text))
    .map((pattern) => pattern.toString());

  const isLikelyApp = /export\s+default\s+function|function\s+[A-Z][A-Za-z0-9_]*\s*\(|<main|<section|route|page|screen/i.test(text);
  const hasHandler = /onClick|onSubmit|addEventListener|fetch\(|router\.|navigate\(|href=|form/i.test(text);
  const hasRuntime = /api\/.+|fetch\(|WebSocket|Supabase|pyodide|JSZip|FileReader|createClient/i.test(text);

  return {
    file: path.relative(ROOT, file),
    hits,
    isLikelyApp,
    hasHandler,
    hasRuntime,
    recommendation: hits.length === 0
      ? 'keep-or-classify'
      : isLikelyApp && (hasHandler || hasRuntime)
        ? 'inspect-before-removal'
        : 'remove-or-replace-stub'
  };
}

const files = await walk(ROOT);
const findings = [];

for (const file of files) {
  const info = await stat(file);
  if (info.size > 512_000) continue;
  const text = await readFile(file, 'utf8').catch(() => '');
  if (!text) continue;
  const finding = classifyFinding(file, text);
  if (finding.hits.length || finding.isLikelyApp) findings.push(finding);
}

console.log(JSON.stringify({ root: ROOT, scanned: files.length, findings }, null, 2));
