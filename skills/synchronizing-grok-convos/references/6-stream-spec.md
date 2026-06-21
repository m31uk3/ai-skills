# 6-Stream Specification

Priority order (as defined by user):

1. User Prompts
2. Grok Replies
3. Grok X Sources
4. Grok Web Sources
5. Grok Thinking / Reasoning
6. Tool Calls & Hooks (Phase 1 is light)

Each section gets its own `## Heading` in the output.

When using bookmarklet, prefer pre-extracted streams if present in the JSON.

Always fall back to Defuddle-cleaned content as the authoritative body when streams are weak.
