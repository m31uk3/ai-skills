# Claude Code Skill Development and Installation

## Overview

This document synthesizes research on Claude Code skill development, the `.skill` packaging format, and installation methods. Includes a worked example from building the Validated Knowledge Synthesis (VKS) skill.

**Sources:**
- `skill-file-installation.md` - System research and installation options
- `validated-knowledge-synthesis-skill-build.md` - Practical build case study

---

## Core Concepts

| Term | Definition |
|------|------------|
| **Skill** | Directory containing `SKILL.md` that extends Claude's capabilities |
| **Plugin** | Bundle containing skills + metadata for marketplace distribution |
| **.skill file** | ZIP archive for packaging skills (distribution format) |
| **~/.claude/skills/** | Personal skills directory (auto-discovered, bypasses plugins) |
| **.claude/skills/** | Project skills directory (team-shared via repository) |

---

## Skill Discovery Priority

Claude Code discovers skills in this order (highest to lowest):

1. **Enterprise** - Organization-deployed managed skills
2. **Personal** - `~/.claude/skills/`
3. **Project** - `.claude/skills/` (repository root)
4. **Plugin** - Bundled within registered plugins

**Key Rule:** Higher-priority locations override lower ones. Personal skills override plugin skills with the same name.

---

## The .skill File Format

A `.skill` file is a ZIP archive created by `package_skill.py`:

```
$ unzip -l validated-knowledge-synthesis.skill

Archive:  validated-knowledge-synthesis.skill
  Length      Date    Time    Name
---------  ---------- -----   ----
     4521  01-16-2026 23:18   validated-knowledge-synthesis/SKILL.md
     3842  01-16-2026 23:18   validated-knowledge-synthesis/references/document-types.md
     4156  01-16-2026 23:18   validated-knowledge-synthesis/references/frameworks.md
     3891  01-16-2026 23:18   validated-knowledge-synthesis/references/writing-principles.md
---------                     -------
    16410                     4 files
```

**Critical:** Claude Code has no `/skill install` command. Installation is manual.

---

## Installation: Recommended Method

Extract to personal skills directory (`~/.claude/skills/`):

```bash
mkdir -p ~/.claude/skills  # -p creates directory only if it doesn't exist
unzip /path/to/skill-name.skill -d ~/.claude/skills/
```

**Why this works:**
- Auto-discovered on startup - no registration required
- Higher priority than plugin skills
- No JSON modification needed
- Simplest approach

**Verification:**
```bash
ls ~/.claude/skills/skill-name/
# Should show: SKILL.md (and optionally references/, scripts/)
```

**Note:** Restart Claude Code or start new session for discovery.

---

## Installation: Alternative Methods

### Option A: Add to Existing Plugin

Extract into a registered plugin's skills directory:

```bash
unzip skill-name.skill -d ~/.claude/plugins/marketplaces/anthropic-agent-skills/skills/
```

**Result:** Skill appears as `document-skills:skill-name`

**Tradeoff:** May be overwritten on plugin update.

### Option B: Create Local Plugin

Create standalone plugin wrapper:

```bash
mkdir -p ~/.claude/plugins/local-skills/.claude-plugin
mkdir -p ~/.claude/plugins/local-skills/skills

cat > ~/.claude/plugins/local-skills/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "local-skills",
  "version": "1.0.0",
  "description": "Locally installed custom skills"
}
EOF

unzip skill-name.skill -d ~/.claude/plugins/local-skills/skills/
```

Then add to `~/.claude/plugins/installed_plugins.json`.

**Result:** Skill appears as `local-skills:skill-name`

**Tradeoff:** More setup, requires JSON modification.

---

## What Does NOT Work

Loose `.skill` files in `~/.claude/plugins/` are **NOT** auto-discovered:

```bash
# This does NOTHING:
cp skill-name.skill ~/.claude/plugins/
```

The plugin system only discovers:
- Registered plugins in `installed_plugins.json`
- Skills within those plugins' `skills/` directories

---

## Comparison Table

| Aspect | `~/.claude/skills/` | `~/.claude/plugins/` |
|--------|---------------------|----------------------|
| Format | Plain directories | Plugin bundles |
| Registration | Auto-discovered | Requires `installed_plugins.json` |
| Priority | Higher | Lower |
| Namespace | None (skill name only) | `plugin-name:skill-name` |

---

## Case Study: Building VKS Skill

### Skill Structure

```
validated-knowledge-synthesis/
├── SKILL.md                          # Core workflow (117 lines)
└── references/
    ├── document-types.md             # Curated context, guidance, reference specs
    ├── writing-principles.md         # Reader empathy, short sentences, strong verbs
    └── frameworks.md                 # Golden Path, Answer-Explain-Educate, What-So What-Now What
```

### Build Process

1. **Initialize:** `init_skill.py validated-knowledge-synthesis --path ./skills`
2. **Edit:** Write SKILL.md with frontmatter + instructions
3. **Add references:** Create supporting files in `references/`
4. **Package:** `package_skill.py ./skills/validated-knowledge-synthesis`
5. **Install:** `unzip packages/skills/validated-knowledge-synthesis.skill -d ~/.claude/skills/`
6. **Verify:** `ls ~/.claude/skills/validated-knowledge-synthesis/`

### Key Features

- Transforms raw information into validated knowledge documents
- Three document types: curated context (default), guidance, reference
- 8-step workflow with progressive disclosure
- Frameworks: Golden Path, Answer-Explain-Educate, What-So What-Now What

### Usage Triggers

- "Synthesize this information into a knowledge document"
- "Transform these notes into actionable guidance"
- "Create knowledge document from these sources"

---

## SKILL.md Format

Required YAML frontmatter:

```yaml
---
name: skill-name                           # Required: lowercase, hyphens, max 64 chars
description: What it does and when to use  # Required: max 1024 chars, triggers discovery
---

# Skill Instructions

Your skill content here...
```

### Advanced Options

```yaml
---
name: skill-name
description: Detailed description with trigger keywords
allowed-tools: Read, Grep, Bash            # Restrict available tools
model: claude-sonnet-4-20250514            # Override model
context: fork                              # Run in isolated sub-agent
user-invocable: true                       # Show in /slash command menu
---
```

### Discovery Process

1. **Discovery** - Claude loads only `name` and `description` at startup
2. **Activation** - User request matches description → Claude asks to use skill
3. **Execution** - Full `SKILL.md` content loaded only when activated

**Critical:** The `description` field determines when Claude applies a skill. Include specific keywords and trigger phrases.

---

## Quick Installation Script

```bash
#!/bin/bash
# install-skill.sh - Install a .skill file to ~/.claude/skills/

SKILL_FILE="$1"

if [ -z "$SKILL_FILE" ]; then
    echo "Usage: ./install-skill.sh path/to/skill.skill"
    exit 1
fi

mkdir -p ~/.claude/skills
unzip -o "$SKILL_FILE" -d ~/.claude/skills/
echo "Skill installed. Restart Claude Code or start new session to use."
```

---

## References

### Official Documentation

- [Claude Code Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [Claude Code Plugin Discovery](https://code.claude.com/docs/en/discover-plugins)

### Repository Files

- `/packages/skills/*.skill` - Packaged skill files
- `/skills/*/` - Source skill directories
