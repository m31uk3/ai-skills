# Sources & Research Trail — synchronizing-grok-convos

## Primary Feature Request & Validation

- **X Post (Bare Skeleton):** https://x.com/m31uk3/status/2068729674566701409
  - Posted the full 6-part Knuth-framed problem statement.
  - Direct @grok confirmation: no list API, surfaces not unified, no dedicated bulk export providing clean structured 6 streams from x.com.

- Full thread capture: `x-thread-feature-request-2068729674566701409.md` (from egc project)

- Feature Request Template: `feature-request-conversation-list-api.md`

## Core Research & Architecture (egc--grok-export-defuddle-26May26)

- `grounding.md` — especially the June 2026 X thread section and earlier research scan confirming no list API.
- `sequence-from-ids-expanded.md` — authoritative diagram of hybrid Playwright + bookmarklet flow for --sync.
- `IMPLEMENTATION-PLAN.md` (this project) — the plan you are reading.
- `grok-export.ts` — original Bun + Playwright prototype (source of `bin/ggs.ts`).
- `grok-export-bookmarklet.js` + `bookmarklet.md`

## Why Playwright for Continuous Sync

Validated conclusion (multiple rounds + direct Grok reply):
- No public API to list conversations.
- Sidebar on grok.com and x.com/i/grok is the single source of truth.
- Requires authenticated scroll-to-load.
- Therefore Playwright persistent context is optimal for automated global discovery.

Bookmarklet elevated to first-class for high-fidelity capture.

## Downstream Pipeline

- Defuddle (kepano) — required for cleaning, standardization, and metadata.
- Custom 6-stream maximizer — prompts + replies first, then sources, thinking, tools.
- Obsidian patterns — status:"to-be-reviewed", word_count, surface, kebab naming, journal links (inspired by user's clipper settings + l2.md).

## Other References

- enhanced-grok-export by iikoshteruu (userscript patterns for live extraction)
- Prior x-grok-archiver prototype
- User's Obsidian web clipper settings JSON

---

All "slug" research artifacts from the egc effort are referenced here so the published skill carries its full provenance.