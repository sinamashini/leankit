#!/usr/bin/env node
// SessionStart: read nearest .leankit, inject context for enabled parts only.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const LEVELS = ['lite', 'full', 'ultra'];

function findConfig(dir) {
  for (let d = dir; ; d = path.dirname(d)) {
    const f = path.join(d, '.leankit');
    if (fs.existsSync(f)) return f;
    if (path.dirname(d) === d) return null;
  }
}

function has(bin) {
  try { execFileSync(process.platform === 'win32' ? 'where' : 'which', [bin], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

function build(cwd, root = path.join(__dirname, '..'), hasBin = has) {
  const file = findConfig(cwd);
  if (!file) return '';
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return `leankit: ${file} is not valid JSON, ignored.`; }

  const out = [];
  if (cfg.ponytail && cfg.ponytail !== 'off') {
    const level = LEVELS.includes(cfg.ponytail) ? cfg.ponytail : 'full';
    const body = fs.readFileSync(path.join(root, 'skills/ponytail/SKILL.md'), 'utf8').replace(/^---[\s\S]*?---\s*/, '');
    out.push(`PONYTAIL MODE ACTIVE — level: ${level}\n\n${body}`);
  }
  if (cfg.tpd) out.push('leankit: use the tpd skill (Task -> Plan -> Do) for repository tasks.');
  if (cfg.graphify) {
    out.push(hasBin('graphify')
      ? 'leankit: graphify enabled. If graphify-out/ exists, query the graph before grep/find.'
      : 'leankit: graphify enabled but CLI missing. Tell user: uv tool install graphifyy');
  }
  if (cfg.rtk && !hasBin('rtk')) out.push('leankit: rtk enabled but CLI missing. Tell user: brew install rtk');
  return out.join('\n\n');
}

module.exports = { build };

if (require.main === module) {
  try {
    const context = build(process.cwd());
    if (context) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
      }));
    }
  } catch { /* never block session start */ }
}
