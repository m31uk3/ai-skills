# FAQs

## Why do YouTube auto-generated subtitles triple every phrase?

YouTube's auto-generated captions use a karaoke-style rolling display in their native VTT format. Words appear on screen incrementally as the speaker says them, then scroll off. When yt-dlp converts this VTT to SRT, the rolling display gets flattened into discrete blocks — and that's where the tripling comes from.

### The VTT source format

YouTube's auto-generated VTT uses `<c>` tags for word-level timing inside a single cue:

```
00:00:00.240 --> 00:00:03.830 align:start position:0%
A<00:00:00.690> fictional<00:00:01.050> recession<00:00:01.530> just<00:00:01.770> crashed<00:00:02.080> the
stock<00:00:02.370> market.<00:00:02.730> And<00:00:03.030> the<00:00:03.180> real<00:00:03.330> story<00:00:03.510> is<00:00:03.600> what
```

This tells the player: "at 0.690s highlight 'fictional', at 1.050s highlight 'recession'..." — words paint onto screen one at a time. The viewer sees text build up gradually.

### What yt-dlp's VTT-to-SRT conversion does

SRT has no word-level timing — it only supports block-level timestamps. So yt-dlp decomposes each rolling cue into multiple SRT blocks. For each word-timing boundary, it creates a separate block showing what's currently visible on screen at that moment:

```
1
00:00:00,240 --> 00:00:02,070
A fictional recession just crashed the

2
00:00:02,070 --> 00:00:02,080          <-- 10ms transition
A fictional recession just crashed the

3
00:00:02,080 --> 00:00:03,830
A fictional recession just crashed the
stock market. And the real story is what

4
00:00:03,830 --> 00:00:03,840          <-- 10ms transition
stock market. And the real story is what

5
00:00:03,840 --> 00:00:05,590
stock market. And the real story is what
nobody's going to write about tomorrow.
```

### The three appearances

Every phrase ends up in exactly three consecutive blocks:

| Block | Duration | Content | Why it exists |
|-------|----------|---------|---------------|
| Block N | Real (~2s) | `"A fictional recession just crashed the"` | The phrase is being displayed on screen |
| Block N+1 | 10ms | `"A fictional recession just crashed the"` | Transition artifact — the instant between one display state and the next |
| Block N+2 | Real (~2s) | `"A fictional recession just crashed the\nstock market..."` | The phrase is still on screen as the top line, with new text added below |

The phrase appears as:
1. **Primary content** in its own block
2. **Transition duplicate** in a 10ms block (screen state hasn't changed yet)
3. **Carried-forward prefix** in the next real block (old line still visible while new line appears below)

### Why this doesn't happen with manual subs

Manually-created subtitles don't use word-level timing. They're authored as discrete blocks with clean boundaries — no rolling display, no decomposition, no tripling.

### What the dedup fix does

The awk script in `genInfoNugget.sh` applies two filters:

1. **Drop blocks ≤100ms** — eliminates all transition artifacts (the 10ms blocks)
2. **Strip carried-forward lines** — for each remaining block, compare its text lines against the previous block's lines and only keep lines that are genuinely new

After dedup, each phrase appears exactly once.
