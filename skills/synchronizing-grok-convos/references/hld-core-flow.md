# High-Level Design: Core CLI Flow (ggs)

**Date:** 2026-06-21  
**Status:** Draft for implementation  
**Scope:** Core independent CLI path using Playwright capture → Defuddle cleaning → Maximizer for 6-stream output. Bookmarklet is secondary/debug only.

## Overview

The `ggs` CLI provides reliable global/incremental sync of private Grok conversations from both `grok.com` and `x.com` into an Obsidian vault folder (`~/.grok/conversations/` by default).

**Core Philosophy:**
- The CLI must run **fully independently** of any bookmarklet.
- Primary path: Authenticated browser automation (Playwright) for discovery and capture.
- Always use Defuddle for cleaning/standardization.
- A dedicated Maximizer layer produces the final 6-stream, Obsidian-native Markdown.
- Bookmarklet JSON (if provided via `--html`) is treated as an **optional input** for the capture step only. Its pre-extracted streams are hints at best.

This design follows the "narrow bridge + deep module" principle: simple CLI interface, rich hidden implementation in the maximizer.

## Design Principles

1. **Independence**: Core flow does not require or depend on the bookmarklet being run by the user.
2. **Defuddle Required**: Raw HTML is always cleaned via Defuddle before stream splitting.
3. **Strong Maximizer on Clean Content**: The 6-stream splitting and Obsidian polishing happens primarily on the Defuddled output (with raw HTML as structural hints).
4. **Deduplication First**: Heavy emphasis on removing repeated text that appears in chat UIs.
5. **Surface Awareness**: Every note records `surface: "grok.com" | "x.com"`.
6. **Incremental by Default**: Uses a local index in the target directory.

## Component Breakdown

The system is broken into these clear components (aligned with the sequence diagrams):

1. **Orchestration (CLI + main)**
   - Parses args (`--sync`, `--html`, `--target`, ID/URL).
   - Decides between discovery mode and single-item mode.
   - Coordinates the other components.
   - Handles target directory and index.

2. **Discovery**
   - Uses Playwright persistent context.
   - Visits `https://grok.com` and `https://x.com/i/grok`.
   - Scrolls the history sidebar/list.
   - Extracts conversation metadata (`id`, `url`, title hints).
   - Compares against local index to find new/grown convos.

3. **Capture**
   - Primary: Playwright navigates to the conversation URL and extracts `full_chat_html` (via `page.content()`).
   - Optional (debug/fallback): Accepts `--html` pointing to a file or bookmarklet JSON. Uses `full_chat_html` from the JSON if present.
   - Always saves the raw HTML as `<id>.raw.html` for debugging and re-processing.

4. **Defuddle Layer** (the cleaner)
   - Runs `npx defuddle parse <raw.html> --markdown --json`.
   - Produces:
     - Clean, standardized Markdown (`content` / `contentMarkdown`).
     - Reliable `wordCount`.
     - Other metadata (title hints, etc.).
   - This is the required step before any stream splitting. Raw noisy HTML is never fed directly into classification.

5. **Maximizer** (the deep module — where the 6-stream magic happens)
   - Input: Defuddled clean Markdown + raw HTML (for hints) + optional stream hints (from bookmarklet) + metadata (id, url, surface, title).
   - Responsibilities:
     - Deduplication across the entire conversation.
     - Classification / splitting into the 6 targets (see below).
     - Building Obsidian-native output (frontmatter + headed sections).
     - Applying curation rules (kebab naming if desired, status, journal links in future, etc.).
   - Output: Structured `SixStreams` + final Markdown content.

6. **Persistence**
   - `.grok-sync-index.json` lives inside the `--target` folder.
   - Tracks per-ID: last capture time, message count hints, output path.
   - Enables true incremental behavior.

## Data Flow (Core Path)

```
User: ggs --sync --target ~/vault/...     OR     ggs <url-or-id> --target ...
          |
          v
Orchestration
          |
          +--> if --sync or no ID: Discovery (Playwright sidebar)
          |
          v
For each needed conversation
          |
          v
Capture (Playwright page.content() OR --html full_chat_html)
          |
          v
Save <id>.raw.html
          |
          v
Defuddle Layer (npx defuddle parse --markdown --json)
          |   → cleanMarkdown + wordCount + meta
          v
Maximizer (Defuddled content + raw HTML + hints)
          |   → 6 streams (deduped + classified)
          |   → Obsidian frontmatter + sections
          v
Write .md to target
Update .grok-sync-index.json
```

This directly implements the flow shown in the expanded sequence diagram.

## Mapping to Existing Sequence Diagrams

See the diagrams in the research project:

- `egc--grok-export-defuddle-26May26/impl/sequence-from-ids-expanded.md` (primary reference)
  - Shows `--sync` discovery via sidebar on both domains.
  - Two capture paths converging at Defuddle + Maximizer.
  - Local index update.
  - Bookmarklet shown as one possible capture, but core is now Playwright.

- `egc--grok-export-defuddle-26May26/impl/sequence-diagram.md` and `sequence-from-ids.md`
  - High-level view of the hybrid idea (now simplified to core Playwright + optional --html).

The HLD above removes the "equal" status of bookmarklet and makes the Playwright → Defuddle → Maximizer path the definitive one.

## The 6 Streams (Targets)

Defined in priority order:

1. **user_prompts** — Exact text the user typed.
2. **grok_replies** — Grok’s final visible answers.
3. **x_sources** — Citations / content from X posts.
4. **web_sources** — Citations / content from web search.
5. **thinking** — Grok’s internal reasoning, “Thoughts”, collapsed blocks.
6. **tool_calls** — Tool / function / hook metadata (lighter in Phase 1).

**Extraction Strategy in the Maximizer** (to be implemented):
- Work primarily on the **clean Defuddled Markdown**.
- Use the raw HTML as a secondary source for structural cues (e.g., `<details>` for thinking blocks, source lists, tool markers).
- Apply:
  - Content-based classification (keywords, patterns, length, voice).
  - Alternation logic (user message → Grok response blocks).
  - Aggressive deduplication (normalized text hashing or prefix matching).
  - Special handling for known Grok UI artifacts (repeated prompts in history, “See new posts”, etc.).
- Bookmarklet streams (if present) are used only as *hints* (e.g., to seed classification or fill gaps).

## Role of the Bookmarklet

- **Status**: Secondary / debugging tool only.
- The CLI can still accept a bookmarklet-produced `.json` via `--html` and will extract `full_chat_html` for the Defuddle step.
- Pre-extracted `streams` from the JSON are treated as optional hints inside the Maximizer, never as the authoritative source.
- This allows the CLI to be used completely standalone (just `ggs --sync`).

## Implementation Notes (Current State & Gaps)

- Capture and Defuddle are already present in `bin/ggs.ts`.
- The current “maximizer” is a simple section builder that consumes either `extractStreamsFromPage` (DOM) or raw bookmarklet streams.
- Next work: Move the real splitting logic into a dedicated `maximizeStreams(defuddledMarkdown, rawHtml, optionalHints)` function that operates on clean text + structural hints.

## References

- Sequence diagrams: `egc--grok-export-defuddle-26May26/impl/sequence-from-ids-expanded.md` (and siblings)
- Previous architecture notes in this `references/` folder
- Defuddle research and Obsidian clipper patterns (from egc grounding)

---

This HLD gives a clear mental model so we can reason precisely about where to improve stream extraction.