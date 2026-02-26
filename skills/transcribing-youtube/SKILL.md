---
name: transcribing-youtube
description: "Download and transcribe YouTube videos into clean, deduplicated Markdown documents with chapter headings. Wraps yt-dlp to fetch subtitles (manual or auto-generated), removes the rolling-text triplication artifacts from auto-subs, inserts chapter markers from video metadata, and produces both a timestamped transcript and a prose-only version. Use when the user wants to: (1) transcribe a YouTube video, (2) get a transcript or subtitles from YouTube, (3) create an InfoNugget from a video, (4) extract text from a YouTube URL or video ID, or (5) mentions yt-dlp, YouTube transcript, or video subtitles."
---

# Transcribing YouTube Videos

Generate clean, deduplicated Markdown transcripts from YouTube videos using yt-dlp.

## Prerequisites

Verify CLI dependencies before running:
```bash
command -v yt-dlp jq awk sed find
```

Required: `yt-dlp`, `jq`, `awk`, `sed`, `find` (standard POSIX utilities).

## Workflow

### Step 1: Get the video identifier

Accept any of these input formats:
- Full URL: `https://www.youtube.com/watch?v=q6pbQ5li5Cg`
- Short URL: `https://youtu.be/q6pbQ5li5Cg`
- Shorts URL: `https://www.youtube.com/shorts/q6pbQ5li5Cg`
- Bare video ID: `q6pbQ5li5Cg`

### Step 2: Run the script

```bash
bash {baseDir}/scripts/genInfoNugget.sh <URL_or_VIDEO_ID>
```

To reprocess an existing SRT without re-downloading:
```bash
bash {baseDir}/scripts/genInfoNugget.sh --fix <URL_or_VIDEO_ID>
```

### Step 3: Verify output

The script produces two files in the current directory:

| File | Contents |
|------|----------|
| `*.InfoNug.DDMMMYY.HHMMSS.md` | Timestamped transcript with `####` chapter headings |
| `*.InfoNug.DDMMMYY.HHMMSS.md_chapters.md` | Prose-only version grouped by chapter (no timestamps) |

After the script completes, read the first ~30 lines of the prose file (`_chapters.md`) to confirm no triplication. Each phrase should appear exactly once.

### Step 4: Present results

Report the two output filenames to the user. If the user wants a summary, read the prose file and summarize by chapter.

## How the script works

1. **Download**: Tries manual subs first (`--write-subs`), falls back to auto-generated (`--write-auto-subs`) only if needed
2. **Deduplicate**: AWK pass removes ≤100ms transition blocks and strips rolling duplicate lines carried forward from previous blocks
3. **Chapters**: Extracts chapter timestamps from `info.json` via `jq`, inserts `####` headings in a single AWK pass
4. **Prose**: Strips all timestamps and joins text into flowing paragraphs grouped by chapter

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "No SRT file found" | No subtitles in target language | Check video has captions enabled |
| Tripled text in output | Using old v1 script | Use this skill's script which includes deduplication |
| `--fix` fails with no SRT | Previous run cleaned up intermediate files | Run without `--fix` to re-download |

**Why does tripling happen?** See [references/faqs.md](references/faqs.md) for a detailed explanation of YouTube's rolling VTT format and how the dedup works.
