---
name: synchronizing-grok-convos
description: "Global/continuous sync of your private Grok conversations from both grok.com and x.com into a clean Obsidian vault. Uses Playwright for reliable discovery across surfaces, supports bookmarklet capture, requires Defuddle, and produces 6-stream maximized Markdown with surface origin in frontmatter. Default target: ~/.grok/conversations/"
user_invocable: true
tags: [grok, sync, obsidian, defuddle, export, global]
---

# synchronizing-grok-convos

Robust global sync for Grok conversations across **grok.com** and **x.com**.

All conversations land in a single folder (`~/.grok/conversations/` by default). The `surface` is recorded in frontmatter so you can filter easily.

## CLI (recommended after build)

```bash
# One-time build of the ggs binary
bun install
bun build ./bin/ggs.ts --compile --outfile bin/ggs

# Global sync (uses default ~/.grok/conversations/)
./bin/ggs --sync --headed     # first run for login

# One specific conversation
./bin/ggs "https://x.com/i/grok?conversation=2068028429640024253"

# Custom target
./bin/ggs --sync --target ~/path/to/vault/GenAI/Grok
```

## Inside Grok TUI

```
/synchronizing-grok-convos --sync
/synchronizing-grok-convos <url-or-id>
```

## Core Features

- Dual-surface discovery (grok.com + x.com/i/grok)
- Incremental sync via `.grok-sync-index.json` in target
- Hybrid capture: Playwright or `--html` (bookmarklet)
- Defuddle required for cleaning + metadata
- 6-stream output with proper priority sections
- `surface` frontmatter key for origin tracking
- Obsidian-native (status, word_count, kebab-friendly ids, etc.)

## Bookmarklet (first-class capture)

See `assets/grok-export-bookmarklet.js` (or `scripts/`).

1. Create a bookmark with the JS.
2. On any open Grok conversation page, click it.
3. Feed the resulting JSON with `--html`.

## References

- `references/sources.md` — full research, X thread, Dev process slugs
- `references/harnesses/` — cron, launchd, TUI schedule examples
- Architecture diagrams and 6-stream spec in `references/`

## First-time login

```bash
ggs --sync --headed
```

Subsequent runs can be headless.

---

This skill was built from the egc--grok-export-defuddle research (see references for the full trail including the June 2026 feature request thread).