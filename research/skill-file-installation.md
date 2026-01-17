# Claude Code Skill File Installation Research

## Overview

This document captures research on how `.skill` files work in Claude Code, the plugin/skill discovery system, and installation options.

**Date:** 2026-01-17

---

## The .skill File Format

### What It Is

- A **ZIP archive** containing a packaged skill directory
- Created by `package_skill.py` script for distribution
- Contains `SKILL.md` + supporting files (references, scripts)

### Example Contents

```
$ unzip -l writing-eval-sloptastic.skill

Archive:  writing-eval-sloptastic.skill
  Length      Date    Time    Name
---------  ---------- -----   ----
     9096  01-17-2026 00:52   writing-eval-sloptastic/SKILL.md
     9971  01-17-2026 00:41   writing-eval-sloptastic/references/sloptastic-examples.md
    15683  01-17-2026 00:48   writing-eval-sloptastic/scripts/sloptastic-analyzer.py
---------                     -------
    34750                     3 files
```

### Key Finding: No Native Install Command

**Claude Code does NOT have a `/skill install` command.** The `.skill` format is a packaging/distribution format, but installation is currently manual.

---

## How Claude Code Discovers Skills

### Discovery Locations (Priority Order)

1. **Enterprise Managed Skills** - Organization-deployed
2. **Personal Skills:** `~/.claude/skills/`
3. **Project Skills:** `.claude/skills/` (in repository root)
4. **Plugin Skills:** Bundled within plugins under `skills/` directory
5. **Nested Project Skills:** `packages/*/. claude/skills/` (monorepo support)

### Required Structure

Skills must be **directories containing a `SKILL.md` file**, not standalone files:

```
~/.claude/skills/my-skill/
└── SKILL.md              # Required - contains YAML frontmatter + instructions
└── references/           # Optional - supporting documentation
└── scripts/              # Optional - helper scripts
```

---

## The Plugin System

### Plugin Directory Structure

```
~/.claude/plugins/
├── installed_plugins.json           # Registry of installed plugins
├── cache/                           # Cached plugin data
├── marketplaces/                    # Marketplace-installed plugins
│   └── anthropic-agent-skills/      # Example: document-skills plugin
│       ├── .claude-plugin/
│       │   └── marketplace.json     # Plugin metadata
│       └── skills/
│           ├── pdf/
│           │   └── SKILL.md
│           ├── docx/
│           │   └── SKILL.md
│           └── ...
└── *.skill                          # Loose .skill files (NOT auto-discovered)
```

### installed_plugins.json Format

```json
{
  "version": 2,
  "plugins": {
    "plugin-name@marketplace-name": [
      {
        "scope": "user",
        "installPath": "/Users/xxx/.claude/plugins/marketplaces/...",
        "version": "69c0b1a06741",
        "installedAt": "2026-01-03T19:10:01.616Z",
        "lastUpdated": "2026-01-03T19:10:01.616Z",
        "gitCommitSha": "69c0b1a0674149f27b61b2635f935524b6add202"
      }
    ]
  }
}
```

### Key Insight

- `installed_plugins.json` registers **plugins**, not individual skills
- Skills inside a registered plugin's `skills/` directory are auto-discovered
- Loose `.skill` files in `~/.claude/plugins/` are **NOT** auto-discovered

---

## Installation Options for .skill Files

### Option A: Add to Existing Plugin (Recommended for Integration)

Extract into an already-registered plugin's skills directory:

```bash
unzip ~/.claude/plugins/writing-eval-sloptastic.skill \
  -d ~/.claude/plugins/marketplaces/anthropic-agent-skills/skills/
```

**Result:** Skill appears as `document-skills:writing-eval-sloptastic`

**Pros:**
- No `installed_plugins.json` modification needed
- Integrates with existing plugin namespace

**Cons:**
- Mixes custom skills with marketplace skills
- May be overwritten on plugin update

---

### Option B: Create a New Local Plugin

Create a standalone plugin wrapper for custom skills:

```bash
# Create plugin structure
mkdir -p ~/.claude/plugins/local-skills/.claude-plugin
mkdir -p ~/.claude/plugins/local-skills/skills

# Add minimal marketplace.json
cat > ~/.claude/plugins/local-skills/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "local-skills",
  "version": "1.0.0",
  "description": "Locally installed custom skills"
}
EOF

# Extract skill(s)
unzip ~/.claude/plugins/writing-eval-sloptastic.skill \
  -d ~/.claude/plugins/local-skills/skills/
```

Then add to `installed_plugins.json`:

```json
{
  "version": 2,
  "plugins": {
    "local-skills@local": [
      {
        "scope": "user",
        "installPath": "/Users/ljack/.claude/plugins/local-skills/",
        "version": "1.0.0",
        "installedAt": "2026-01-17T00:00:00.000Z",
        "lastUpdated": "2026-01-17T00:00:00.000Z"
      }
    ]
  }
}
```

**Result:** Skill appears as `local-skills:writing-eval-sloptastic`

**Pros:**
- Clean separation from marketplace plugins
- Own namespace for custom skills
- Won't be affected by marketplace updates

**Cons:**
- Requires manual `installed_plugins.json` modification
- More setup steps

---

### Option C: Use ~/.claude/skills/ (Bypasses Plugin System) ⭐ RECOMMENDED

Extract directly to personal skills directory:

```bash
mkdir -p ~/.claude/skills
unzip ~/.claude/plugins/writing-eval-sloptastic.skill -d ~/.claude/skills/
```

**Result:** Skill appears as `writing-eval-sloptastic` (no namespace prefix)

**Pros:**
- Simplest approach
- No plugin system involvement
- No JSON modification needed
- **Auto-discovered on startup** - no registration required
- **Higher priority** than plugin skills (personal skills override plugin skills)
- Changes take effect immediately on save

**Cons:**
- No namespace organization
- Skills not managed through plugin system
- No version tracking

---

## Deep Dive: ~/.claude/skills/ Directory

This is the **recommended approach** for personal/local skill installation as it completely bypasses the plugin system.

### How It Works

| Aspect | `~/.claude/skills/` | `~/.claude/plugins/` |
|--------|---------------------|----------------------|
| Format | Plain `SKILL.md` directories | Packaged `.skill` files or plugin bundles |
| Registration | **Auto-discovered** at startup | Requires `enabledPlugins` in settings.json |
| Loading | Immediate on file save | Requires plugin system registration |
| Priority | **Higher** (overrides plugin skills) | Lower priority |
| Namespace | None (skill name only) | `plugin-name:skill-name` |

### Loading Priority (Highest to Lowest)

1. **Enterprise** - Managed settings (organization-deployed)
2. **Personal** - `~/.claude/skills/` ← This directory
3. **Project** - `.claude/skills/` (repository-local)
4. **Plugin** - Bundled within registered plugins

**Key Rule:** If two skills have the same name, the higher-priority location wins. Personal skills override plugin skills of the same name.

### Required Directory Structure

```
~/.claude/skills/
└── skill-name/                  # Directory name should match skill name
    └── SKILL.md                 # Required - main skill definition
    └── references/              # Optional - supporting documentation
    │   └── examples.md
    └── scripts/                 # Optional - helper scripts
        └── helper.py
```

### SKILL.md Format

The `SKILL.md` file requires YAML frontmatter:

```yaml
---
name: writing-eval-sloptastic
description: Quantitative framework for detecting AI-generated "slop" in prose. Use when analyzing text authenticity, evaluating writing quality, or detecting AI patterns like excessive parallelism, abstraction laddering, and platitudes.
---

# Skill Instructions

Your skill content here...
```

### Advanced YAML Frontmatter Options

```yaml
---
name: skill-name                           # Required: lowercase, hyphens, max 64 chars
description: What it does and when to use  # Required: max 1024 chars, triggers discovery
allowed-tools: Read, Grep, Bash            # Optional: restrict available tools
model: claude-sonnet-4-20250514            # Optional: override model
context: fork                              # Optional: run in isolated sub-agent
user-invocable: true                       # Optional: show in /slash command menu
hooks:                                     # Optional: skill-specific hooks
  pre-invoke: ./scripts/setup.sh
---
```

### How Skills Get Discovered and Triggered

**Three-step process:**

1. **Discovery** - Claude loads only `name` and `description` of each skill at startup
2. **Activation** - When user request matches skill's description, Claude asks to use it
3. **Execution** - Full `SKILL.md` content loaded only when activated

**Important:** The `description` field is critical—Claude uses it to decide when to apply a skill. Include specific keywords and trigger terms users would naturally say.

**Good description example:**
```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

**Bad description example:**
```yaml
description: A helpful skill for documents.
```

### String Substitution Support

Skills support variable substitution:

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | Arguments passed to the skill |
| `${CLAUDE_SESSION_ID}` | Current session identifier |

### Quick Installation Script

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

### Verifying Installation

After installing, verify the skill directory exists:

```bash
ls -la ~/.claude/skills/
# Should show: skill-name/

ls ~/.claude/skills/skill-name/
# Should show: SKILL.md (and optionally references/, scripts/)
```

**Note:** You may need to restart Claude Code or start a new session for newly installed skills to be discovered

---

## Current Gaps / Future Improvements

### Missing Features

1. **No `/skill install` command** - Would be useful:
   ```
   /skill install path/to/skill.skill
   /skill install https://example.com/skill.skill
   ```

2. **No skill registry/marketplace** - Unlike plugins, skills don't have a discovery mechanism

3. **No skill versioning** - No way to track/update skill versions

4. **Ambiguous .skill file purpose** - The packaging step exists but consumption is manual

### Recommended Workflow Clarification

The intended workflow appears to be:

```
Create Skill → Validate → Package (.skill) → Wrap in Plugin → Distribute via Marketplace
```

But for personal/local use, the simpler path is:

```
Create Skill → Place in ~/.claude/skills/ or .claude/skills/
```

---

## Related Files in This Repository

- `/packages/skills/*.skill` - Packaged skill files
- `/skills/*/` - Source skill directories
- `/skills/anthropic/official-skills/skill-development/scripts/package_skill.py` - Packaging script

---

## References

### Official Documentation

- [Claude Code Skills Documentation](https://docs.anthropic.com/en/docs/claude-code/skills) - Main skills reference
- [Claude Code Skills (Alternate)](https://code.claude.com/docs/en/skills) - Skills overview
- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference) - Plugin system details
- [Claude Code Plugin Discovery](https://code.claude.com/docs/en/discover-plugins) - Finding and installing plugins
- [Claude Code Documentation Map](https://code.claude.com/docs/en/claude_code_docs_map.md) - Full docs index

### Key Concepts

- **Skills** = Instructions/prompts that extend Claude's capabilities
- **Plugins** = Bundles containing skills + metadata for distribution
- **.skill files** = ZIP archives for packaging skills (distribution format)
- **~/.claude/skills/** = Personal skills directory (auto-discovered, bypasses plugins)
- **.claude/skills/** = Project skills directory (team-shared via repository)
