# Architecture — synchronizing-grok-convos

See `sequence-from-ids-expanded.md` from the egc research for the best visual.

## High Level Flow for --sync

1. Load local index from target dir (`.grok-sync-index.json`)
2. Launch Playwright persistent context (logged-in)
3. Visit grok.com and x.com/i/grok
4. Scroll history sidebars → extract conversation metadata
5. For each unknown or changed convo:
   - Capture full HTML (Playwright or --html bookmarklet JSON)
   - Run `npx defuddle parse`
   - Run 6-stream maximizer
   - Write Obsidian .md with `surface` in frontmatter
6. Update index
7. Close context

## Single convo path

Same processing pipeline, no discovery step.

## Why this shape?

- No list API → must drive the UI for discovery.
- Two surfaces → explicit dual-domain loop.
- Need continuous sync → Playwright is the reliable automation layer.
- Want high signal + Obsidian native → Defuddle + custom maximizer.
- User control + fidelity → bookmarklet escape hatch.

All decisions are documented in the X thread and grounding.md from the research project.
