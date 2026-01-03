# Skill Creation Workflow and Agent Toolkit

**Last Updated:** January 3, 2026

## Table of Contents

1. [Overview](#overview)
2. [The skill-creator Skill](#the-skill-creator-skill)
3. [Intersection Analysis: skill-creator vs Documentation](#intersection-analysis)
4. [Plugin-Dev Agent Toolkit](#plugin-dev-agent-toolkit)
5. [Recommended Workflow](#recommended-workflow)
6. [When to Use Each Agent](#when-to-use-each-agent)
7. [Quick Reference](#quick-reference)

---

## Overview

This guide documents the practical toolkit for creating, reviewing, and validating skills and plugins in Claude Code. It intersects learnings from:

- **Agent Skills Specification** (agentskills.io)
- **Claude Code Skills Guide** (comprehensive documentation)
- **skill-creator skill** (from document-skills package)
- **plugin-dev agents** (agent-creator, skill-reviewer, plugin-validator)

**Key Insight:** The skill-creator skill provides the *process*, the documentation provides the *specification*, and the plugin-dev agents provide *automation and validation*.

---

## The skill-creator Skill

**Location:** `~/.claude/plugins/cache/anthropic-agent-skills/document-skills/[hash]/skills/skill-creator/`

### What It Provides

The skill-creator skill is a comprehensive guide for creating effective skills, with emphasis on:

1. **6-Step Creation Process** (detailed workflow)
2. **Practical Utilities**:
   - `scripts/init_skill.py` - Generate skill template
   - `scripts/package_skill.py` - Validate and package as `.skill` file
   - `scripts/quick_validate.py` - Quick validation
3. **Design Patterns**:
   - `references/workflows.md` - Sequential workflows and conditional logic
   - `references/output-patterns.md` - Template and example patterns

### Core Philosophy: "Context as Public Good"

> "The context window is a public good. Skills share the context window with everything else Claude needs: system prompt, conversation history, other Skills' metadata, and the actual user request."

This drives all skill design decisions:
- Keep SKILL.md lean (<500 lines, 1,500-2,000 words ideal)
- Move detailed content to references/ (2,000-5,000+ words each)
- Only add what Claude doesn't already know
- Challenge every paragraph: "Does this justify its token cost?"

### Degrees of Freedom Framework

Match specificity to task fragility:

| Freedom Level | Use When | Format |
|---------------|----------|--------|
| **High** | Multiple approaches valid, context-dependent decisions | Text instructions |
| **Medium** | Preferred pattern exists, some variation acceptable | Pseudocode with parameters |
| **Low** | Fragile operations, consistency critical, specific sequence | Specific scripts, few parameters |

### What NOT to Include

Explicit prohibition list:
- ❌ README.md
- ❌ INSTALLATION_GUIDE.md
- ❌ QUICK_REFERENCE.md
- ❌ CHANGELOG.md
- ❌ Any auxiliary documentation

**Rationale:** "The skill should only contain the information needed for an AI agent to do the job at hand."

---

## Intersection Analysis

### ✅ Core Alignments

Both skill-creator and documentation agree on:

1. **Three-level progressive disclosure**: Metadata → SKILL.md body → Bundled resources
2. **Directory structure**: `skill-name/SKILL.md` + optional `scripts/`, `references/`, `assets/`
3. **Writing style**: Imperative form in body, third person in description
4. **Description importance**: Must include WHAT and WHEN (trigger phrases)
5. **Keep SKILL.md lean**: ~1,500-2,000 words, <500 lines, move detail to references/

### 🎯 Unique Contributions from skill-creator

| Aspect | skill-creator Adds |
|--------|-------------------|
| **Process** | 6-step creation workflow with clear decision points |
| **Tools** | Actual scripts (init_skill.py, package_skill.py, quick_validate.py) |
| **Philosophy** | "Context as public good" framing |
| **Framework** | Degrees of freedom (high/medium/low) |
| **Prohibitions** | Explicit list of what NOT to include |
| **Patterns** | Reference files for workflows and output patterns |
| **Questioning** | How to ask users for concrete examples without overwhelming |

### 📚 Unique Contributions from Documentation

| Aspect | Documentation Adds |
|--------|-------------------|
| **Specifications** | Technical constraints (field limits, regex patterns, max chars) |
| **Ecosystem** | Plugin context (skills + commands + agents + hooks + MCP) |
| **Anti-patterns** | Common mistakes section with before/after examples |
| **Checklist** | Comprehensive validation checklist |
| **Examples** | Real working example (medical bill analysis) |
| **Naming** | Detailed naming conventions and validation rules |

### 🔧 Practical Synthesis

**For creating a skill:**
1. Follow **skill-creator's 6-step process** (more actionable)
2. Use **skill-creator's scripts** (init_skill.py, package_skill.py)
3. Apply **documentation's validation checklist** (more comprehensive)
4. Reference **documentation for technical constraints** (field limits, naming)
5. Embrace **"context as public good"** philosophy
6. Use **docs' common mistakes** as final review

**Key Takeaway:** skill-creator is *process-oriented* (how to create), documentation is *specification-oriented* (what must be true). Together they're comprehensive.

---

## Plugin-Dev Agent Toolkit

**Location:** `/Users/ljack/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev`

The plugin-dev toolkit provides 3 autonomous agents for automation:

### 1. agent-creator

**Purpose:** Creates autonomous agent `.md` files for plugins

**Triggers:**
- "create an agent"
- "generate an agent"
- "build a new agent"
- "make me an agent that..."

**What it does:**
1. Extracts core intent from user requirements
2. Designs expert persona and identity
3. Architects comprehensive system prompt
4. Optimizes for performance with decision frameworks
5. Creates identifier (lowercase, hyphens, 3-50 chars)
6. Crafts triggering examples (2-4 `<example>` blocks)
7. Generates `agents/[identifier].md` file

**Configuration:**
- **Model:** sonnet (complex), haiku (simple), or inherit
- **Color:** blue/cyan (analysis), green (creation), yellow (validation), red (security), magenta (creative)
- **Tools:** Minimal set needed, or omit for full access

**Quality Standards:**
- Identifier: lowercase, hyphens, 3-50 chars
- Description: Strong trigger phrases + 2-4 examples
- System prompt: 500-3,000 words, clear structure
- Examples show explicit and proactive triggering

**Relevance to SKILL creation:** ⚠️ **Low** - Only if your plugin needs autonomous agents alongside skills

---

### 2. skill-reviewer ✨

**Purpose:** Reviews skill quality and provides improvement recommendations

**Triggers:**
- "review my skill"
- "check skill quality"
- "improve skill description"
- Proactively after skill creation

**What it checks:**

| Category | Checks |
|----------|--------|
| **Structure** | YAML frontmatter format, required fields, body content |
| **Description** | Trigger phrases, third person, specificity, concrete scenarios |
| **Content** | Word count (1,000-3,000 ideal), imperative style, organization |
| **Progressive Disclosure** | Core in SKILL.md, detailed in references/, clear pointers |
| **Supporting Files** | references/ quality, examples/ completeness, scripts/ documentation |

**Validation Standards:**
- Description must have strong, specific trigger phrases
- SKILL.md should be lean (under 3,000 words)
- Writing style must be imperative/infinitive form
- Progressive disclosure properly implemented
- All file references work correctly
- Examples are complete and accurate

**Output Format:**
- Summary with word counts
- Description analysis with recommendations
- Content quality assessment
- Progressive disclosure evaluation
- Specific issues (critical/major/minor)
- Positive aspects
- Overall rating (Pass/Needs Improvement/Needs Major Revision)
- Priority recommendations

**Relevance to SKILL creation:** 🔥 **CRITICAL** - Use for every skill you create!

---

### 3. plugin-validator

**Purpose:** Validates entire plugin structure and all components

**Triggers:**
- "validate my plugin"
- "check plugin structure"
- "verify plugin is correct"
- Proactively after creating/modifying plugin components

**What it validates:**

| Component | Checks |
|-----------|--------|
| **Manifest** | `.claude-plugin/plugin.json` syntax, required `name` field, version format |
| **Directory Structure** | commands/, agents/, skills/, hooks/ in correct locations |
| **Commands** | YAML frontmatter, `description` field, markdown content |
| **Agents** | Frontmatter fields, name format, description examples, model/color validity |
| **Skills** | SKILL.md exists, frontmatter with name/description, referenced files exist |
| **Hooks** | Valid JSON, event names, matcher/hooks structure, script references |
| **MCP** | Server configurations, required fields by type, ${CLAUDE_PLUGIN_ROOT} usage |
| **Security** | No hardcoded credentials, HTTPS/WSS usage, no secrets in examples |

**Output Format:**
- Summary (pass/fail with stats)
- Critical issues with fixes
- Warnings with recommendations
- Component summary (counts and validity)
- Positive findings
- Overall assessment (PASS/FAIL)

**Relevance to SKILL creation:** ⚙️ **HIGH** - Essential if creating plugins (not just standalone skills)

---

## Recommended Workflow

### For Creating a SKILL within a Plugin

```
┌─────────────────────────────────────────────┐
│ Step 1: Understand the Skill                │
│ • Gather concrete examples from user        │
│ • Identify trigger phrases                  │
│ • Clarify functionality scope               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 2: Plan Reusable Contents              │
│ • Identify scripts/ needs                   │
│ • Identify references/ needs                │
│ • Identify assets/ needs                    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 3: Initialize the Skill                │
│ • Run scripts/init_skill.py                 │
│ • Creates template structure                │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 4: Edit the Skill                      │
│ • Implement scripts/, references/, assets/  │
│ • Write SKILL.md frontmatter (strong desc)  │
│ • Write SKILL.md body (imperative, lean)    │
│ • Delete unused example files               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 5: Review with skill-reviewer ✨       │
│ • Trigger: "Review my skill"                │
│ • Check description triggers                │
│ • Validate progressive disclosure           │
│ • Verify writing style                      │
│ • Get improvement recommendations           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 6: Iterate Based on Feedback          │
│ • Fix critical issues                       │
│ • Improve trigger phrases                   │
│ • Move content to references/ if needed     │
│ • Re-review if major changes                │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 7: Add to Plugin Structure             │
│ • Place in plugin/skills/skill-name/        │
│ • Update plugin documentation if needed     │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 8: Validate Plugin (plugin-validator)⚙️│
│ • Trigger: "Validate my plugin"             │
│ • Check overall structure                   │
│ • Validate all components                   │
│ • Security checks                           │
│ • Get comprehensive report                  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│ Step 9: Package the Skill                   │
│ • Run scripts/package_skill.py              │
│ • Automatically validates first             │
│ • Creates .skill file for distribution      │
└─────────────────────────────────────────────┘
```

### For Standalone Skills (Not Part of Plugin)

Follow Steps 1-6 and 9, skip Steps 7-8 (plugin-specific).

---

## When to Use Each Agent

### agent-creator

**Use when:**
- ✅ Creating an autonomous agent for a plugin
- ✅ Need background agents that run autonomously
- ✅ Example: code-review agent, test-runner agent, deployment agent

**Don't use for:**
- ❌ Creating skills (use skill-creator skill instead)
- ❌ Creating slash commands (use command templates)
- ❌ Creating hooks (use hook templates)

### skill-reviewer ✨

**Use when:**
- ✅ **Immediately after creating or modifying any skill** ⭐
- ✅ Before packaging a skill for distribution
- ✅ When you want to improve trigger effectiveness
- ✅ To validate description quality
- ✅ Checking progressive disclosure implementation
- ✅ Ensuring writing style compliance

**Trigger phrases:**
- "Review my skill"
- "Check skill quality"
- "Does my skill description look good?"
- "Improve my skill"

### plugin-validator

**Use when:**
- ✅ After creating a complete plugin
- ✅ Before publishing/distributing a plugin
- ✅ When adding new components to a plugin
- ✅ To catch structural issues early
- ✅ After modifying plugin.json
- ✅ Security audit before release

**Trigger phrases:**
- "Validate my plugin"
- "Check plugin structure"
- "Is my plugin correct?"

---

## Quick Reference

### Skill Quality Checklist (Use with skill-reviewer)

**Description:**
- [ ] Third person ("This skill should be used when...")
- [ ] Specific trigger phrases users would say
- [ ] Concrete scenarios listed
- [ ] Key domain vocabulary included
- [ ] 50-500 characters (not too short, not too long)

**Content:**
- [ ] SKILL.md body: 1,000-3,000 words (lean and focused)
- [ ] Imperative/infinitive form throughout
- [ ] No second person ("you", "your")
- [ ] Clear sections with logical flow
- [ ] Concrete guidance, not vague advice

**Progressive Disclosure:**
- [ ] Core essentials in SKILL.md
- [ ] Detailed content in references/
- [ ] Working examples in examples/
- [ ] Utility scripts in scripts/
- [ ] Clear pointers to all resources

**Files:**
- [ ] All referenced files exist
- [ ] Examples are complete and working
- [ ] Scripts are executable and documented
- [ ] No prohibited files (README.md, CHANGELOG.md, etc.)

### Plugin Structure Checklist (Use with plugin-validator)

**Manifest:**
- [ ] `.claude-plugin/plugin.json` exists
- [ ] Valid JSON syntax
- [ ] Required `name` field (kebab-case)
- [ ] Optional fields valid if present

**Components:**
- [ ] Commands in `commands/` with proper frontmatter
- [ ] Agents in `agents/` with valid configuration
- [ ] Skills in `skills/` with SKILL.md
- [ ] Hooks in `hooks/hooks.json` if present
- [ ] MCP servers configured correctly if present

**Security:**
- [ ] No hardcoded credentials
- [ ] HTTPS/WSS for external connections
- [ ] No secrets in example files
- [ ] Scripts use ${CLAUDE_PLUGIN_ROOT}

### Key Commands

```bash
# Initialize new skill
scripts/init_skill.py <skill-name> --path <output-directory>

# Validate and package skill
scripts/package_skill.py <path/to/skill-folder>

# Quick validate skill
scripts/quick_validate.py <path/to/skill-folder>
```

### Agent Invocation Examples

```
# Review a skill
"Review my skill at .claude/skills/my-skill"

# Validate plugin
"Validate my plugin structure"

# Create an agent
"Create an agent that reviews code for security issues"
```

---

## File Locations Reference

### skill-creator Skill
```
~/.claude/plugins/cache/anthropic-agent-skills/document-skills/[hash]/skills/skill-creator/
├── SKILL.md
├── scripts/
│   ├── init_skill.py
│   ├── package_skill.py
│   └── quick_validate.py
└── references/
    ├── workflows.md
    └── output-patterns.md
```

### Plugin-Dev Agents
```
/Users/ljack/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/
├── agents/
│   ├── agent-creator.md
│   ├── skill-reviewer.md
│   └── plugin-validator.md
└── skills/
    ├── agent-development/
    ├── skill-development/
    ├── command-development/
    ├── hook-development/
    ├── mcp-integration/
    ├── plugin-structure/
    └── plugin-settings/
```

### Documentation Files
```
/Users/ljack/github/ai-skills/docs/
├── claude-code-skills-guide.md          # Comprehensive guide
├── agent-skills-specification.md        # Technical spec
├── skill-creation-workflow-and-agents.md # This document
├── plugins-skills-validation.md
└── REFERENCES.md
```

---

## Summary

**The Complete Toolkit:**

1. **skill-creator skill** → Process and scripts for creation
2. **Documentation** → Specifications and best practices
3. **skill-reviewer agent** → Quality review and improvement
4. **plugin-validator agent** → Structural validation
5. **agent-creator agent** → (Optional) Create autonomous agents

**Best Practice:**
- Use skill-creator's process and scripts
- Follow documentation's specifications
- Always review with skill-reviewer before packaging
- Validate with plugin-validator before distribution
- Embrace "context as public good" philosophy

**Key Philosophy:**
> "The context window is a public good. Only add what Claude doesn't already know. Challenge every paragraph: 'Does this justify its token cost?'"

---

**Document Version:** 1.0
**Created:** January 3, 2026
**Session:** Intersection analysis and workflow design
**Related Documents:**
- [Claude Code Skills Guide](./claude-code-skills-guide.md)
- [Agent Skills Specification](./agent-skills-specification.md)
- [Plugins Skills Validation](./plugins-skills-validation.md)
