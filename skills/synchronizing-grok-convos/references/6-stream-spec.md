# 6-Stream Specification

Priority order (as defined by user):

1. User Prompts
2. Grok Replies
3. Grok X Sources
4. Grok Web Sources
5. Grok Thinking / Reasoning
6. Tool Calls & Hooks (Phase 1 is light)

Streams are classified internally but rendered as:

## Conversation
### User
...
### Grok
...

## Grok X Sources
...

## Grok Web Sources
...

## Grok Thinking / Reasoning
...

## Tool Calls & Hooks
...

Conversation is kept linear (alternating User/Grok turns visible in outline). The four supporting streams are their own top-level H2 sections at the very end, in this order: X Sources, Web Sources, Thinking / Reasoning, Tool Calls. Zero duplication.

When using bookmarklet, prefer pre-extracted streams if present in the JSON.

Always fall back to Defuddle-cleaned content as the authoritative body when streams are weak.
