# Obsidian Output Specification

## Frontmatter (current baseline)

```yaml
---
title: "..."
id: "2068028429640024253"
source: "https://x.com/i/grok?conversation=..."
surface: "x.com"          # or "grok.com"
captured: "2026-..."
word_count: 1234
status: "to-be-reviewed"
type: "grok-conversation"
tags: [grok, chat]
---
```

## Body Structure (linear conversational format)

# Title

Source: ...
Surface: x.com

## Conversation

### User

[user prompt / message 1]

### Grok

[grok response 1]

### User

[user prompt / message 2]

### Grok

[grok response 2]

...

(Alternating User/Grok turns. The conversation stays readable as a transcript and the outline view shows the natural back-and-forth.)

## Grok X Sources

...

## Grok Web Sources

...

## Grok Thinking / Reasoning

...

## Tool Calls & Hooks

...

(The four supporting streams appear as their own top-level ## sections at the very end of the document. X Sources and Web Sources come before Thinking / Reasoning. Zero duplication of conversation content.)

## Naming

- Primary: `{id}.md` (stable)
- Optional future: kebab-slug + date for human readability

## Journal / Linking

Future enhancement: auto-add [[journals/YYYY-MM-DD]] capture links when desired.
