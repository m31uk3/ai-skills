# Proposal: YAML Frontmatter for VKS-Generated Documents

## Executive Summary

Add YAML frontmatter to VKS-synthesized documents to capture source provenance, metadata, and organization information. This enhances discoverability, provides clear lineage, and improves knowledge base organization.

## Current State

**Your yt-dlp workflow:**
- Script: `genInfoNugget.yt` downloads YouTube metadata via `--write-info-json`
- Generates: `.md` files with subtitles and chapter markers
- Metadata available: video ID, title, uploader, timestamps, chapters, thumbnail
- Current files lack structured metadata frontmatter

**VKS output:**
- Generates synthesized markdown documents
- Currently lacks source metadata in frontmatter
- No machine-readable provenance tracking

## Proposed YAML Frontmatter Schema

### For VKS Documents Synthesized from YouTube Content

```yaml
---
# VKS Document Metadata
vks_version: "2.1"
document_type: "curated_context"  # or "guidance", "reference", "hybrid"
synthesis_date: "2025-12-28"
target_audience: "software engineers, engineering leaders"

# Source Provenance
source_type: "youtube_transcript"
source_url: "https://www.youtube.com/watch?v=rmvDxxNubIg"
source_video_id: "rmvDxxNubIg"
source_title: "No Vibes Allowed: Solving Hard Problems in Complex Codebases"
source_channel: "AI Engineer"
source_uploader: "Dex Horthy"
source_upload_date: "2025-12-XX"
source_duration: "1186s"  # from chapters
source_thumbnail: "No Vibes Allowed： Solving Hard Problems in Complex Codebases – Dex Horthy, HumanLayer [rmvDxxNubIg].webp"

# Synthesis Details
synthesis_topic: "context engineering for AI coding agents"
synthesis_strategy:
  - "convergent: context engineering principles"
  - "convergent: RPI workflow"
  - "tension_preservation: task complexity decisions"
primary_frameworks:
  - "Answer-Explain-Educate"
  - "What-So What-Now What"
  - "Golden Path Criteria"
validation_status: "validated"
confidence_level: "high"

# Content Organization
primary_topics:
  - "context engineering"
  - "AI coding agents"
  - "workflow optimization"
key_concepts:
  - "smart zone vs dumb zone"
  - "compaction"
  - "research-plan-implement"
  - "mental alignment"
related_concepts:
  - "prompt engineering"
  - "agent workflow design"
  - "code review processes"

# Knowledge Graph Metadata
key_entities:
  - type: "tool"
    name: "Claude Code"
  - type: "concept"
    name: "context window"
  - type: "workflow"
    name: "RPI"
  - type: "person"
    name: "Dex Horthy"
    affiliation: "HumanLayer"

# Usage Metadata
use_cases:
  - "interview prep"
  - "before complex AI-assisted coding tasks"
  - "team onboarding to context engineering"
estimated_read_time: "15-20 minutes"
last_validated: "2025-12-28"

# File Relationships
source_files:
  - "No Vibes Allowed--- Solving Hard Problems in Complex Codebases -----Dex Horthy, HumanLayer (rmvDxxNubIg).en.InfoNug.28DEC25.064522.md_chapters.md"
related_documents: []
---
```

## Available yt-dlp Metadata Fields

Based on research, here are the key fields available from `--write-info-json`:

### Essential Fields (Recommend Including)

| Field | Purpose | Example |
|-------|---------|---------|
| `id` | Video identifier | `rmvDxxNubIg` |
| `title` | Video title | `No Vibes Allowed: Solving Hard Problems...` |
| `uploader` | Channel/creator name | `AI Engineer` |
| `channel` | Channel name | `AI Engineer` |
| `channel_id` | Channel identifier | For tracking all videos from same channel |
| `upload_date` | When published | `20251215` |
| `duration` | Video length in seconds | `1186` |
| `webpage_url` | Direct link | Full YouTube URL |
| `description` | Video description | Conference talk description |
| `view_count` | Views | Indicates popularity/reach |
| `like_count` | Engagement metric | Signal of quality |

### Chapter Metadata (From chapters.json)

| Field | Purpose | Example |
|-------|---------|---------|
| `chapters` | Array of chapter objects | `[{start_time, title}...]` |
| `start_time` | Chapter timestamp | `100.0` |
| `title` | Chapter name | `context engineering` |

### Optional Fields (Consider Based on Use Case)

| Field | Purpose | Example |
|-------|---------|---------|
| `playlist` | If from playlist | Playlist name |
| `playlist_index` | Position in playlist | `5` |
| `categories` | YouTube categories | `["Education"]` |
| `tags` | Video tags | `["AI", "coding", "agents"]` |
| `thumbnail` | Thumbnail URL | Local .webp file path |
| `resolution` | Video quality | `1920x1080` |
| `fps` | Frames per second | `30` |

## Recommended Frontmatter Templates

### Template 1: Minimal (Quick Setup)

```yaml
---
vks_version: "2.1"
document_type: "curated_context"
synthesis_date: "{{ date }}"
source_url: "{{ webpage_url }}"
source_video_id: "{{ id }}"
source_title: "{{ title }}"
source_channel: "{{ uploader }}"
synthesis_topic: "{{ user_provided }}"
target_audience: "{{ user_provided }}"
---
```

### Template 2: Standard (Recommended)

```yaml
---
# VKS Metadata
vks_version: "2.1"
document_type: "{{ document_type }}"
synthesis_date: "{{ date }}"
target_audience: "{{ user_provided }}"

# Source
source_type: "youtube_transcript"
source_url: "{{ webpage_url }}"
source_video_id: "{{ id }}"
source_title: "{{ title }}"
source_channel: "{{ channel }}"
source_uploader: "{{ uploader }}"
source_upload_date: "{{ upload_date }}"
source_duration: "{{ duration }}s"

# Content
synthesis_topic: "{{ user_provided }}"
primary_topics: {{ user_provided_list }}
key_concepts: {{ extracted_from_synthesis }}

# Usage
use_cases: {{ user_provided_list }}
estimated_read_time: "{{ calculated }}"
---
```

### Template 3: Comprehensive (Full Metadata)

Use the full schema shown in "Proposed YAML Frontmatter Schema" section above.

## Implementation Approach

### Option A: Modify genInfoNugget.yt

Add a step after yt-dlp download to extract key fields from `.info.json` and prepend minimal YAML frontmatter to the generated markdown file.

```bash
# After Step 1 in genInfoNugget.yt
if [ -f "$INFO_JSON" ]; then
    # Extract key metadata
    VIDEO_ID=$(jq -r '.id' < "$INFO_JSON")
    TITLE=$(jq -r '.title' < "$INFO_JSON")
    UPLOADER=$(jq -r '.uploader' < "$INFO_JSON")
    CHANNEL=$(jq -r '.channel' < "$INFO_JSON")
    UPLOAD_DATE=$(jq -r '.upload_date' < "$INFO_JSON")
    DURATION=$(jq -r '.duration' < "$INFO_JSON")
    WEBPAGE_URL=$(jq -r '.webpage_url' < "$INFO_JSON")

    # Create frontmatter
    cat > "${MARKDOWN_FILE}.tmp" <<EOF
---
source_type: "youtube_transcript"
source_url: "$WEBPAGE_URL"
source_video_id: "$VIDEO_ID"
source_title: "$TITLE"
source_channel: "$CHANNEL"
source_uploader: "$UPLOADER"
source_upload_date: "$UPLOAD_DATE"
source_duration: "${DURATION}s"
---

EOF

    # Prepend to markdown file
    cat "$MARKDOWN_FILE" >> "${MARKDOWN_FILE}.tmp"
    mv "${MARKDOWN_FILE}.tmp" "$MARKDOWN_FILE"
fi
```

### Option B: Add to VKS Workflow

Modify the `/vks` slash command to:
1. Detect if source material is a YouTube transcript (check for video ID pattern in filename)
2. Extract metadata from the source filename or adjacent `.info.json` if available
3. Prompt user for VKS-specific metadata (synthesis_topic, target_audience, document_type)
4. Combine source metadata + VKS metadata into frontmatter
5. Prepend to synthesized document

### Option C: Hybrid Approach (Recommended)

**Phase 1: genInfoNugget.yt adds source metadata**
- Minimal frontmatter with source provenance only
- Keeps the script focused on extraction

**Phase 2: VKS adds synthesis metadata**
- Detects existing source frontmatter
- Merges with VKS-specific fields
- Creates comprehensive frontmatter

## Benefits

### Discoverability
- Search by channel, uploader, topic, or concept
- Filter by document type (curated_context vs reference)
- Query by synthesis date or validation status

### Provenance Tracking
- Clear lineage from source to synthesis
- Ability to re-synthesize if source is updated
- Credit original creators (Dex Horthy, conference, etc.)

### Knowledge Base Integration
- Obsidian can use frontmatter for queries
- Notion, Roam, and other PKM tools support YAML
- Build graphs of related concepts and sources

### Maintenance
- Track when documents need re-validation
- Identify documents from same source/channel
- Update confidence levels over time

### Automation
- Scripts can parse frontmatter to organize files
- Build indexes of all synthesized content
- Generate reports on knowledge coverage

## Comparison to Claude Code SKILL.md Format

| Claude Code Skills | VKS Documents |
|-------------------|---------------|
| `name` | `synthesis_topic` |
| `description` | Embedded in content, not frontmatter |
| `tools` | N/A (not applicable to static docs) |
| `model` | Could track model used for synthesis |
| `color` | Could use for categorization |

**Key Difference:** Claude Code skills are executable agents with tool access. VKS documents are static knowledge artifacts. Frontmatter should reflect this distinction.

**Potential Alignment:** Could add `model: "sonnet-4.5"` to track which model performed the synthesis.

## Recommendations

1. **Start with Standard Template**: Captures essential metadata without overwhelming complexity

2. **Automate in Two Phases**:
   - Phase 1: Add source metadata to genInfoNugget.yt output
   - Phase 2: Enhance VKS slash command to merge synthesis metadata

3. **Make Frontmatter Optional**: Don't break existing workflows, add flag like `--with-metadata`

4. **Version the Schema**: Start with `vks_version: "2.1"` to allow future evolution

5. **Keep Source Files**: Don't delete `.info.json` immediately, could be useful for re-synthesis

## Next Steps

1. **Validate Proposal**: Confirm this metadata structure meets your needs

2. **Implement genInfoNugget.yt Enhancement**: Add source metadata extraction

3. **Test with Example**: Process the Dex Horthy video with new frontmatter

4. **Update VKS Slash Command**: Merge source + synthesis metadata

5. **Document Usage**: Add to REFERENCES.md or create METADATA-GUIDE.md

## Example Output

When you run `/vks` on a YouTube transcript with the new workflow, the output would look like:

```markdown
---
vks_version: "2.1"
document_type: "curated_context"
synthesis_date: "2025-12-28"
target_audience: "software engineers, engineering leaders"
source_type: "youtube_transcript"
source_url: "https://www.youtube.com/watch?v=rmvDxxNubIg"
source_video_id: "rmvDxxNubIg"
source_title: "No Vibes Allowed: Solving Hard Problems in Complex Codebases"
source_channel: "AI Engineer"
source_uploader: "Dex Horthy"
source_upload_date: "20251215"
source_duration: "1186s"
synthesis_topic: "context engineering for AI coding agents"
primary_topics:
  - "context engineering"
  - "AI coding agents"
  - "workflow optimization"
validation_status: "validated"
confidence_level: "high"
---

# Context Engineering for AI Coding Agents

## Purpose & Reader Context

You need AI coding assistants to solve complex problems...
```

---

## References

**yt-dlp Documentation:**
- [yt-dlp GitHub Repository](https://github.com/yt-dlp/yt-dlp)
- [yt-dlp Manual Pages](https://man.archlinux.org/man/yt-dlp.1)
- [Output Template Documentation](https://github.com/yt-dlp/yt-dlp/blob/master/README.md)

**Metadata Schema Research:**
- [yt-dlp info.json fields discussion](https://github.com/yt-dlp/yt-dlp/issues/8926)
- [OSTechNix yt-dlp Tutorial](https://ostechnix.com/yt-dlp-tutorial/)

**Claude Code Skills Format:**
- Example skills in `~/.claude` directory showing YAML frontmatter structure

**VKS Framework:**
- Validated Knowledge Synthesis v2.1 specification
- Curated Context document type with Golden Path criteria
