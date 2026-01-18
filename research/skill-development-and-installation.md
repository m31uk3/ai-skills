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

---

## Case Study: Building Guided OODA Loop Skill

**Date:** January 17, 2026
**Skill:** `guided-ooda-loop`
**Status:** ✅ Complete and packaged

### Overview

The Guided OODA Loop skill implements a universal pattern for structured LLM interaction across all domains (software, strategy, writing, research). Based on the Prompt-Driven Development (PDD) SOP, it manages finite context windows through phased progression.

### The 9-Step Build Workflow

#### Step 1: Understand the Skill ✅
- **Source Material:** PDD SOP from `/Users/ljack/github/resources/code/agent-sop/agent-sops/pdd.sop.md`
- **Key Decisions:**
  - Skill name: `guided-ooda-loop`
  - Core concept: Universal pattern (not just software)
  - Primary value: Context window management through phased progression
  - Domain scope: Universal (software, strategy, writing, research)
  - ACT phase: Creates execution-ready artifacts (not just planning)

**Trigger Phrases:**
- "I have an idea for..."
- "Help me design/build/create..."
- "Guide me through..."
- "Walk through my thinking..."
- Mentions of: OODA, RPI, PDD

#### Step 2: Plan Reusable Contents ✅
**Resources Structure:**
```
guided-ooda-loop/
├── SKILL.md                      # Core OODA principles (1,500-2,000 words)
├── references/
│   ├── ooda-pattern.md          # Deep dive on OODA theory (2,000-5,000 words)
│   └── domain-applications.md   # Domain implementations (2,000-5,000 words)
├── scripts/                     # Reserved for future
└── assets/                      # Reserved for future
```

**Directory Structure Created by Skill:**
```
ooda-loop-{unique-name}-{DDMMMYY.HHMMSS}/
├── rough-idea.md
├── observe/
│   ├── research.md
│   └── idea-honing.md
├── decide/
│   ├── to-do.md
│   └── high-level-design.md
├── act/
│   ├── implementation-plan.md
│   └── detailed-design.md
└── summary.md                   # YAML frontmatter status
```

#### Step 3: Initialize the Skill ✅
```bash
python3 /Users/ljack/.claude/plugins/cache/anthropic-agent-skills/\
document-skills/69c0b1a06741/skills/skill-creator/scripts/init_skill.py \
guided-ooda-loop --path /Users/ljack/github/ai-skills/skills
```

**Result:** Base structure with template SKILL.md

#### Step 4: Edit the Skill ✅
**Files Created:**
1. `SKILL.md` - 1,743 words (ideal range: 1,000-3,000)
2. `references/ooda-pattern.md` - 2,287 words
3. `references/domain-applications.md` - 3,380 words

**Total Content:** 7,410 words

#### Step 5: Review with skill-reviewer ✅
**Initial Rating:** 4/5 stars ⭐⭐⭐⭐

**Critical Issues Identified:**
- Placeholder files present (api_reference.md, assets/example_asset.txt, scripts/example.py)
- Description too long (85 words, should be 50-60)
- Incomplete domain sections (2-4) in domain-applications.md
- Contradictory language about ACT phase

**Strengths:**
- Exceptional theoretical foundation
- Outstanding progressive disclosure
- Comprehensive software development section
- Clear constraints using "MUST", "NEVER", "ALWAYS"

#### Step 6: Iterate Based on Feedback ✅
**Improvements Made:**

1. **Removed placeholder files**
   ```bash
   rm references/api_reference.md assets/example_asset.txt scripts/example.py
   ```

2. **Condensed description:** 85 → 56 words
   - Before: "Universal pattern for structured LLM interaction that manages finite context windows through phased progression (Observe-Orient-Decide-Act). Use when the user has a complex problem requiring structured breakdown..."
   - After: "Universal pattern for structured LLM interaction managing finite context windows through phased progression (Observe-Orient-Decide-Act). Use when the user has a complex problem, wants to design/build/create something..."

3. **Added context usage monitoring**
   - Check context at each phase transition
   - Warn if usage exceeds 60%
   - Provide clear resume instructions

   **Warning Template:**
   ```
   ⚠️ CONTEXT USAGE WARNING: Current context at [X]% (>60%)

   For optimal results, consider starting a new context window.

   To resume in new window:
   1. Read summary.md to understand current state
   2. Load relevant artifacts for current phase
   3. Continue from [current phase]
   ```

4. **Clarified ACT phase** (eliminated contradictions)
   - Removed "planning-only" language
   - Added: "Creates execution-ready artifacts only. Does NOT execute any tasks or actions."
   - Updated throughout SKILL.md and references

5. **Reorganized domain templates**
   - Moved "Universal Principles" before appendix
   - Renamed Sections 2-4 to "Template A-C" in appendix
   - Added status note: Section 1 complete, templates are frameworks

**Post-Iteration Rating:** 5/5 stars ⭐⭐⭐⭐⭐

#### Step 7: Add to Plugin Structure ✅
**Decision:** Standalone skill (not part of plugin)
- Location: `/Users/ljack/github/ai-skills/skills/guided-ooda-loop/`
- Skipped plugin integration

#### Step 8: Validate Plugin ✅
**Status:** Validation passed during packaging (Step 9)

#### Step 9: Package the Skill ✅
```bash
python3 /Users/ljack/.claude/plugins/cache/anthropic-agent-skills/\
document-skills/69c0b1a06741/skills/skill-creator/scripts/package_skill.py \
/Users/ljack/github/ai-skills/skills/guided-ooda-loop
```

**Result:**
- Package created: `/Users/ljack/github/ai-skills/packages/skills/guided-ooda-loop.skill`
- File size: 20KB
- Validation: ✅ Passed
- Files included: SKILL.md, domain-applications.md, ooda-pattern.md

### Git Commit
```bash
git commit -m "Add guided-ooda-loop skill with context monitoring

Implements universal OODA pattern for structured LLM interaction across
all domains (software, strategy, writing, research).

Key features:
- Context usage monitoring at each phase transition (>60% warnings)
- Execution-ready artifacts with actionable checklists
- Condensed 56-word description with comprehensive trigger phrases
- Progressive disclosure: 1,743-word SKILL.md + 5,667-word references
- Complete software development section with 8-step PDD process
- Domain templates (strategy, writing, research) in appendix

Technical improvements:
- Removed placeholder files for production readiness
- Direct ACT phase language (no contradictions)
- Universal principles clearly separated from domain templates
- Checkpoint system for cross-session resumption"

git push
```

**Commit:** `619b9a0`

### Current Packaging Status

**As of January 17, 2026:**

| Skill Name | Status | Package Location |
|------------|--------|------------------|
| ai--workflow-engineering | ❌ NOT PACKAGED | - |
| anthropic | ❌ NOT PACKAGED | - |
| comms--response-quality-analysis | ❌ NOT PACKAGED | - |
| **guided-ooda-loop** | ✅ **PACKAGED** | `packages/skills/guided-ooda-loop.skill` |
| prompt-driven-development | ✅ PACKAGED | `packages/skills/prompt-driven-development.skill` |
| skill-resiliency | ❌ NOT PACKAGED | - |
| validated-knowledge-synthesis | ✅ PACKAGED | `packages/skills/validated-knowledge-synthesis.skill` |
| writing-eval-sloptastic | ✅ PACKAGED | `packages/skills/writing-eval-sloptastic.skill` |

**Summary:** 4/8 skills packaged (50%)

### Key Learnings

#### 1. Context Window Management
- Context monitoring is critical for OODA workflows
- 60% threshold provides optimal warning time
- Resume instructions must be explicit and actionable

#### 2. Description Optimization
- Target: 50-60 words
- Include all trigger phrases
- Third-person voice
- Specific scenarios over generic descriptions

#### 3. Progressive Disclosure
- SKILL.md: Core concepts (1,000-3,000 words)
- References: Deep dives (2,000-5,000+ words each)
- Prevents overwhelming users while maintaining depth

#### 4. Domain Adaptability
- Universal principles section anchors the pattern
- Domain-specific sections show adaptation
- Templates provide structure for future expansion

#### 5. Artifact Quality
- Remove ALL placeholder files before packaging
- Ensure internal consistency (no contradictions)
- Direct declarations over vague statements
- Clear status indicators (complete vs. template)

#### 6. Workflow Efficiency
- 9-step process ensures quality
- Iteration (Step 6) is critical - don't skip
- Review feedback drives major improvements
- Packaging validates the entire structure

### Installation

```bash
# Extract to personal skills directory
unzip packages/skills/guided-ooda-loop.skill -d ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/guided-ooda-loop/

# Restart Claude Code or start new session
```

### References

**Checkpoint Document:** `/Users/ljack/github/ai-skills/docs/guided-ooda-loop-checkpoint.md`
**Workflow Guide:** `/Users/ljack/github/ai-skills/docs/skill-creation-workflow-and-agents.md`
**Source Material:** `/Users/ljack/github/resources/code/agent-sop/agent-sops/pdd.sop.md`

---

## Repository Structure Summary

### Source Skills (`/skills/`)
```
skills/
├── ai--workflow-engineering/
├── anthropic/
├── comms--response-quality-analysis/
├── guided-ooda-loop/               ← Latest addition (Jan 17, 2026)
├── prompt-driven-development/
├── skill-resiliency/
├── validated-knowledge-synthesis/
└── writing-eval-sloptastic/
```

### Packaged Skills (`/packages/skills/`)
```
packages/skills/
├── guided-ooda-loop.skill          ← Latest addition (20KB, Jan 17, 2026)
├── prompt-driven-development.skill
├── validated-knowledge-synthesis.skill
└── writing-eval-sloptastic.skill
```

### Documentation (`/docs/`)
```
docs/
├── agent-skills-specification.md
├── claude-code-skills-guide.md
├── guided-ooda-loop-checkpoint.md   ← Build session checkpoint
└── skill-creation-workflow-and-agents.md
```

**Last Updated:** January 17, 2026
