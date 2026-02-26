#!/bin/bash
set -euo pipefail

###############################################################################
# genInfoNugget.yt — YouTube transcript → Markdown Info Nugget
#
# Downloads subtitles (prefers manual, falls back to auto-generated),
# deduplicates the rolling-text artifacts from auto-subs, inserts chapter
# headings, and produces two output files:
#   1. Full transcript with timestamps + chapters  (.md)
#   2. Prose-only version grouped by chapter        (.md_chapters.md)
#
# Usage:
#   genInfoNugget.yt <YouTube_URL_or_VIDEO_ID>
#   genInfoNugget.yt --fix <YouTube_URL_or_VIDEO_ID>   # reprocess existing files
###############################################################################

usage() {
    echo "Usage: $(basename "$0") [--fix] <YouTube_URL_or_VIDEO_ID>"
    echo "  --fix   Skip download, reprocess existing SRT/JSON files"
    exit 1
}

# ── Parse arguments ──────────────────────────────────────────────────────────

FIX_MODE=false
if [[ "${1:-}" == "--fix" ]]; then
    FIX_MODE=true
    shift
fi
[[ -z "${1:-}" ]] && usage
INPUT="$1"
LANG="en"

# ── Extract video ID (macOS-compatible, no grep -P) ──────────────────────────

extract_video_id() {
    local input="$1" id=""
    # ?v=ID or &v=ID
    id=$(echo "$input" | sed -n 's/.*[?&]v=\([A-Za-z0-9_-]*\).*/\1/p')
    # youtu.be/ID
    [[ -z "$id" ]] && id=$(echo "$input" | sed -n 's|.*youtu\.be/\([A-Za-z0-9_-]*\).*|\1|p')
    # /shorts/ID
    [[ -z "$id" ]] && id=$(echo "$input" | sed -n 's|.*/shorts/\([A-Za-z0-9_-]*\).*|\1|p')
    # bare video ID
    [[ -z "$id" ]] && id="$input"
    echo "$id"
}

VIDEO_ID=$(extract_video_id "$INPUT")
URL="https://www.youtube.com/watch?v=${VIDEO_ID}"
echo "Video ID: $VIDEO_ID"

# ── Temp file cleanup on exit ────────────────────────────────────────────────

TMPFILE=$(mktemp /tmp/infonug.XXXXXX)
CHFILE=$(mktemp /tmp/infonug_ch.XXXXXX)
trap 'rm -f "$TMPFILE" "$CHFILE"' EXIT

# ── Step 1: Download ─────────────────────────────────────────────────────────

AUTO_SUBS=false

if [[ "$FIX_MODE" == false ]]; then
    echo "Downloading subtitles and metadata..."

    # Try manual subs first (clean, no rolling duplicates)
    if yt-dlp --write-subs --skip-download \
          --sub-lang "$LANG" --sub-format vtt --convert-subs srt \
          --write-info-json --write-thumbnail -- "$URL" 2>/dev/null; then
        # Check if an SRT was actually created
        if ! find . -maxdepth 1 -name "*${VIDEO_ID}*.srt" -type f | grep -q .; then
            echo "No manual subs found, trying auto-generated..."
            AUTO_SUBS=true
            yt-dlp --write-auto-subs --skip-download \
                --sub-lang "$LANG" --sub-format vtt --convert-subs srt \
                --write-info-json --write-thumbnail -- "$URL"
        fi
    else
        echo "Manual sub download failed, trying auto-generated..."
        AUTO_SUBS=true
        yt-dlp --write-auto-subs --skip-download \
            --sub-lang "$LANG" --sub-format vtt --convert-subs srt \
            --write-info-json --write-thumbnail -- "$URL"
    fi
else
    # In fix mode, assume auto-subs (always safe to dedup)
    AUTO_SUBS=true
fi

# ── Find files ───────────────────────────────────────────────────────────────

SRT_FILE=$(find . -maxdepth 1 -name "*${VIDEO_ID}*.srt" -type f | head -1)
INFO_JSON=$(find . -maxdepth 1 -name "*${VIDEO_ID}*.info.json" -type f | head -1)

if [[ -z "$SRT_FILE" || ! -f "$SRT_FILE" ]]; then
    echo "ERROR: No SRT file found for video ID: $VIDEO_ID"
    exit 1
fi
echo "SRT: $SRT_FILE"

# ── Build output filename ────────────────────────────────────────────────────

BASE_NAME=$(basename "$SRT_FILE" .srt)
CLEAN_NAME=$(echo "$BASE_NAME" \
    | sed -E 's/([^[:alnum:]])\1+/\1/g' \
    | sed 's/\[/(/g; s/\]/)/g; s/{/(/g; s/}/)/g' \
    | sed -E 's/[^[:alnum:][:punct:] ()]/-/g')
DATE_SUFFIX=$(date +"%d%b%y.%H%M%S" | tr '[:lower:]' '[:upper:]')
MARKDOWN_FILE="${CLEAN_NAME}.InfoNug.${DATE_SUFFIX}.md"

# ── Step 2: Deduplicate SRT ─────────────────────────────────────────────────
#
# YouTube auto-generated subtitles use a rolling display where each block
# repeats the previous block's text plus adds new words. Converted to SRT
# this creates:
#   Block N:   "old text"                      (real block)
#   Block N+1: "old text"                      (10ms transition – skip)
#   Block N+2: "old text\nnew text"            (real block – strip old text)
#
# This awk script:
#   1. Skips blocks shorter than 100ms (transition artifacts)
#   2. Strips lines already present in the previous block
#   3. Outputs only genuinely new text with its timestamp

echo "Deduplicating subtitles..."

awk '
function ts_to_ms(ts,    p, hms) {
    split(ts, p, ",")
    split(p[1], hms, ":")
    return (hms[1]*3600 + hms[2]*60 + hms[3])*1000 + (p[2]+0)
}

BEGIN { block=0; pcnt=0 }

/^\s*$/ {
    if (block > 0 && have_ts) {
        dur = end_ms - start_ms
        if (dur > 100) {
            # collect new-only lines
            nc = 0
            for (i = 1; i <= ccnt; i++) {
                dup = 0
                for (j = 1; j <= pcnt; j++) {
                    if (clines[i] == plines[j]) { dup = 1; break }
                }
                if (!dup && clines[i] != "") nc_arr[++nc] = clines[i]
            }
            if (nc > 0) {
                printf "\n%s --> %s\n", sts, ets
                for (i = 1; i <= nc; i++) print nc_arr[i]
            }
            # save current as previous
            pcnt = ccnt
            for (i = 1; i <= ccnt; i++) plines[i] = clines[i]
        }
    }
    block = 0; have_ts = 0; ccnt = 0
    delete clines; delete nc_arr
    next
}

/^[0-9]+$/ && !have_ts { block++; next }

/^[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3} --> / {
    split($0, arrow, " --> ")
    sts = arrow[1]; ets = arrow[2]
    gsub(/\r/, "", sts); gsub(/\r/, "", ets)
    start_ms = ts_to_ms(sts); end_ms = ts_to_ms(ets)
    have_ts = 1
    next
}

{
    gsub(/\r/, "")
    if ($0 != "") clines[++ccnt] = $0
}

END {
    if (block > 0 && have_ts) {
        dur = end_ms - start_ms
        if (dur > 100) {
            nc = 0
            for (i = 1; i <= ccnt; i++) {
                dup = 0
                for (j = 1; j <= pcnt; j++) {
                    if (clines[i] == plines[j]) { dup = 1; break }
                }
                if (!dup && clines[i] != "") nc_arr[++nc] = clines[i]
            }
            if (nc > 0) {
                printf "\n%s --> %s\n", sts, ets
                for (i = 1; i <= nc; i++) print nc_arr[i]
            }
        }
    }
}
' "$SRT_FILE" > "$TMPFILE"

# ── Step 3: Extract chapters from metadata ───────────────────────────────────

HAS_CHAPTERS=false
if [[ -n "${INFO_JSON:-}" && -f "${INFO_JSON:-}" ]]; then
    echo "Extracting chapters..."
    jq -r '(.chapters // [])[] | "\(.start_time)\t\(.title)"' "$INFO_JSON" > "$CHFILE" 2>/dev/null || true
    [[ -s "$CHFILE" ]] && HAS_CHAPTERS=true
fi

# ── Step 4: Build Markdown — single-pass chapter insertion ───────────────────

echo "Building Markdown..."

{
    echo "### Subtitles"
    echo ""

    if [[ "$HAS_CHAPTERS" == true ]]; then
        awk '
        function ts_to_secs(ts,    p, hms) {
            split(ts, p, ",")
            split(p[1], hms, ":")
            return hms[1]*3600 + hms[2]*60 + hms[3] + p[2]/1000
        }
        NR == FNR {
            idx = index($0, "\t")
            ch_n++
            ch_time[ch_n] = substr($0, 1, idx-1) + 0
            ch_title[ch_n] = substr($0, idx+1)
            next
        }
        FNR == 1 { ci = 1 }
        /^[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3} -->/ {
            st = ts_to_secs($1)
            while (ci <= ch_n && st >= ch_time[ci]) {
                printf "\n#### %s\n\n", ch_title[ci]
                ci++
            }
        }
        { print }
        ' "$CHFILE" "$TMPFILE"
    else
        cat "$TMPFILE"
    fi
} > "$MARKDOWN_FILE"

# ── Step 5: Prose version (timestamps stripped, grouped by chapter) ──────────

awk '
/^####/ { printf "\n\n%s\n\n", $0; next }
/^###/  { printf "\n%s\n\n", $0; next }
/^$/    { next }
/^[0-9]{2}:[0-9]{2}:[0-9]{2}/ { next }
{ printf "%s ", $0 }
END { print "" }
' "$MARKDOWN_FILE" > "${MARKDOWN_FILE}_chapters.md"

# ── Cleanup ──────────────────────────────────────────────────────────────────

if [[ "$FIX_MODE" == false ]]; then
    rm -f "$SRT_FILE"
    [[ -n "${INFO_JSON:-}" ]] && rm -f "$INFO_JSON"
fi

echo ""
echo "Done."
echo "  Transcript: $MARKDOWN_FILE"
echo "  Prose:      ${MARKDOWN_FILE}_chapters.md"
