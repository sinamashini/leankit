#!/bin/sh
# Re-copy ponytail + graphify skills from local installs. Review the diff, bump THIRD_PARTY.md versions.
set -e
cd "$(dirname "$0")/.."
PT=$(ls -d ~/.claude/plugins/cache/ponytail/ponytail/* | sort -V | tail -1)
for s in "$PT"/skills/ponytail*; do rm -rf "skills/$(basename "$s")"; cp -R "$s" skills/; done
rm -rf skills/graphify && cp -R ~/.claude/skills/graphify skills/graphify && rm -f skills/graphify/.graphify_version
echo "synced ponytail from $PT"
