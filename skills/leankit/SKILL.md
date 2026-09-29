---
name: leankit
description: >
  Manage the leankit stack (ponytail, tpd, graphify, rtk) for the current
  project. Use for "leankit init", "leankit status", "leankit doctor", or when
  the user wants to turn ponytail/tpd/graphify/rtk on or off per project.
---

# leankit

Per-project switches live in `.leankit` (JSON, project root or any parent):

```json
{ "ponytail": "full", "tpd": true, "graphify": true, "rtk": true }
```

`ponytail`: `off | lite | full | ultra`. Other keys: `true | false`. No file = everything off.
A SessionStart hook reads this file. If the host skipped the hook, read it yourself and follow the enabled parts: ponytail skill for coding style, tpd skill for repo tasks, graphify skill for codebase questions, rtk for condensed command output.

## init
Write `.leankit` with the example above, unless one exists. Ask which parts to enable if the user named none. Tell the user to restart the session.

## status
Read `.leankit`. Print each part: on/off, and for graphify/rtk whether the CLI is installed (`command -v graphify`, `command -v rtk`).

## doctor
Run status, then for each enabled but missing CLI give the install command. Never install without asking.

- graphify: `uv tool install graphifyy`
- rtk: `brew install rtk`
