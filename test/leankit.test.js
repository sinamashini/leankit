const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { build } = require('../hooks/leankit');

const root = path.join(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leankit-'));
const sub = path.join(tmp, 'a', 'b');
fs.mkdirSync(sub, { recursive: true });
const write = (o) => fs.writeFileSync(path.join(tmp, '.leankit'), typeof o === 'string' ? o : JSON.stringify(o));
const none = () => false;

assert.strictEqual(build(sub, root, none), '', 'no file = silent');
write('{bad');
assert.match(build(sub, root, none), /not valid JSON/);
write({ ponytail: 'off' });
assert.strictEqual(build(sub, root, none), '', 'off = silent');
write({ ponytail: 'ultra' });
assert.match(build(sub, root, none), /PONYTAIL MODE ACTIVE — level: ultra/);
assert.doesNotMatch(build(sub, root, none), /^---/m, 'frontmatter stripped');
write({ ponytail: 'bogus' });
assert.match(build(sub, root, none), /level: full/, 'bad level falls back to full');
write({ tpd: true });
assert.match(build(sub, root, none), /tpd skill/);
write({ graphify: true, rtk: true });
assert.match(build(sub, root, none), /uv tool install graphifyy/);
assert.match(build(sub, root, none), /brew install rtk/);
assert.doesNotMatch(build(sub, root, () => true), /install/, 'CLIs present = no hints');

for (const f of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', '.codex-plugin/plugin.json',
  '.agents/plugins/marketplace.json', 'hooks/hooks.json']) JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
for (const s of fs.readdirSync(path.join(root, 'skills'))) {
  assert.match(fs.readFileSync(path.join(root, 'skills', s, 'SKILL.md'), 'utf8'), /^---\nname: /, `${s} frontmatter`);
}
console.log('ok');
