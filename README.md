# leankit

Lean code, lean tokens. One plugin for Claude Code and Codex bundling:

- **ponytail**: lazy-senior-dev coding style (YAGNI, stdlib first)
- **tpd**: Task -> Plan -> Do protocol for repo work
- **graphify**: codebase knowledge graph
- **rtk**: condensed command output

## Install

Claude Code:
```
/plugin marketplace add sinamashini/leankit
/plugin install leankit@leankit
```
Codex:
```
codex plugin marketplace add sinamashini/leankit
```
Then install `leankit` from the plugin browser and trust its hook once.

## Enable per project

Put `.leankit` in the project root:
```json
{ "ponytail": "full", "tpd": true, "graphify": true, "rtk": true }
```
`ponytail`: `off | lite | full | ultra`. No file = nothing active. Or run `/leankit init`.

## CLIs (not bundled)

leankit detects them and prints the install command; it never installs anything.
```
uv tool install graphifyy
brew install rtk
```

## Dev
```
npm test
scripts/sync-upstream.sh   # refresh bundled ponytail/graphify
```

## License
MIT. Bundled third-party parts: see THIRD_PARTY.md.
