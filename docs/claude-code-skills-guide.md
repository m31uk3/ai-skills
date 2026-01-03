# Claude Code Skills: Complete Guide

**Last Updated:** January 3, 2026

## Table of Contents

1. [Introduction](#introduction)
2. [What are Skills?](#what-are-skills)
3. [Installing Skills](#installing-skills)
4. [Skill Structure and Format](#skill-structure-and-format)
5. [Creating Skills Locally](#creating-skills-locally)
6. [Where Skills are Stored](#where-skills-are-stored)
7. [Best Practices](#best-practices)
8. [Example: Medical Bill Analysis Skill](#example-medical-bill-analysis-skill)
9. [References](#references)

---

## Introduction

This guide documents everything learned about creating, installing, and using skills in Claude Code. Skills are modular packages that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

## What are Skills?

Skills are self-contained packages that transform Claude from a general-purpose agent into a specialized agent equipped with domain-specific knowledge. They provide:

1. **Specialized workflows** - Multi-step procedures for specific domains
2. **Tool integrations** - Instructions for working with specific file formats or APIs
3. **Domain expertise** - Company-specific knowledge, schemas, business logic
4. **Bundled resources** - Scripts, references, and assets for complex tasks

### Skills vs Slash Commands

- **Skills**: Proactive and context-aware. Claude automatically identifies when to use a skill based on the task.
- **Slash Commands**: User-initiated. Require explicit invocation with `/command-name`.

## Installing Skills

### Using the Plugin Marketplace

Skills can be installed from the Anthropic marketplace using the `/plugin` command:

```bash
# Add a marketplace
/plugin marketplace add anthropics/skills

# Install a skill package
/plugin install document-skills@anthropic-agent-skills
```

### What Happens During Installation

When you install a skill package:

1. Claude Code downloads the skill to a global cache directory
2. All skills in the package become available
3. You must **restart Claude Code** to load new plugins
4. Skills are stored in: `~/.claude/plugins/cache/[marketplace]/[package]/[version]/skills/`

### Example: Installing document-skills

The `document-skills` package includes 16 skills:

- skill-creator
- algorithmic-art
- brand-guidelines
- canvas-design
- doc-coauthoring
- docx
- frontend-design
- internal-comms
- mcp-builder
- pdf
- pptx
- slack-gif-creator
- theme-factory
- web-artifacts-builder
- webapp-testing
- xlsx

Installation location:
```
/Users/[username]/.claude/plugins/cache/anthropic-agent-skills/document-skills/[hash]/skills/
```

## Skill Structure and Format

### Directory Structure

A skill MUST be a directory containing a `SKILL.md` file:

```
skill-name/
├── SKILL.md          # Required: Main skill definition
├── scripts/          # Optional: Executable code
├── references/       # Optional: Additional documentation
└── assets/           # Optional: Templates, images, data files
```

### SKILL.md Format

Every `SKILL.md` file must have two parts:

1. **YAML frontmatter** (required)
2. **Markdown body** (required)

#### Example SKILL.md

```yaml
---
name: skill-name
description: A description of what this skill does and when to use it.
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
---

# Skill Title

Instructions and documentation go here...
```

### YAML Frontmatter Requirements

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars, lowercase letters/numbers/hyphens only, must match directory name |
| `description` | Yes | Max 1024 chars, describes what the skill does AND when to use it |
| `license` | No | License name or reference to bundled license file |
| `compatibility` | No | Max 500 chars, environment requirements |
| `metadata` | No | Arbitrary key-value mapping for additional metadata |
| `allowed-tools` | No | Space-delimited list of pre-approved tools (experimental) |

#### Name Field Rules

- Must be 1-64 characters
- Only lowercase alphanumeric and hyphens (`a-z`, `0-9`, `-`)
- Must not start or end with `-`
- Must not contain consecutive hyphens (`--`)
- **Must match the parent directory name**

✓ Valid: `medical-bill-analysis`
✗ Invalid: `Medical-Bill-Analysis` (uppercase)
✗ Invalid: `-medical` (starts with hyphen)
✗ Invalid: `medical--bill` (consecutive hyphens)

#### Description Field Best Practices

Include both WHAT and WHEN:

✓ Good:
```yaml
description: Analyze medical superbills and invoices for validation, duplicate detection, and comprehensive reporting. Use when the user mentions medical bills, superbills, healthcare invoices, insurance reimbursement statements, or asks to validate or summarize medical billing documents.
```

✗ Poor:
```yaml
description: Helps with medical bills.
```

### Optional Directories

#### scripts/

Contains executable code that agents can run:
- Python scripts
- Bash scripts
- JavaScript files

Best practices:
- Make scripts self-contained or document dependencies
- Include helpful error messages
- Handle edge cases gracefully

#### references/

Additional documentation loaded on demand:
- `REFERENCE.md` - Detailed technical reference
- `FORMS.md` - Form templates or structured data formats
- Domain-specific files (`finance.md`, `legal.md`, etc.)

Keep files focused and small (agents load these on demand).

#### assets/

Static resources:
- Templates (document templates, configuration templates)
- Images (diagrams, examples)
- Data files (lookup tables, schemas)

### Progressive Disclosure

Skills are structured for efficient context usage:

1. **Metadata** (~100 tokens): `name` and `description` loaded at startup for all skills
2. **Instructions** (<5000 tokens recommended): Full `SKILL.md` body loaded when skill activates
3. **Resources** (as needed): Files in `scripts/`, `references/`, `assets/` loaded only when required

**Recommendation:** Keep your main `SKILL.md` under 500 lines. Move detailed reference material to separate files.

## Creating Skills Locally

### Method 1: Manual Creation

1. Create the skill directory structure:
```bash
mkdir -p .claude/skills/my-skill
cd .claude/skills/my-skill
```

2. Create `SKILL.md` with proper frontmatter:
```yaml
---
name: my-skill
description: What it does and when to use it.
metadata:
  author: your-name
  version: "1.0"
---

# My Skill

Instructions go here...
```

3. Add optional directories as needed:
```bash
mkdir -p scripts references assets
```

### Method 2: Using skill-creator Skill

If you have the `document-skills` package installed, use the `skill-creator` skill:

The skill-creator includes:
- `scripts/init_skill.py` - Initialize a new skill
- `scripts/package_skill.py` - Package a skill for distribution
- `scripts/quick_validate.py` - Validate skill format

### Validation

Use the `skills-ref` reference library to validate:

```bash
skills-ref validate ./my-skill
```

This checks:
- YAML frontmatter is valid
- All naming conventions are followed
- Required fields are present

## Where Skills are Stored

### Local Project Skills

Skills specific to a project:
```
/path/to/project/.claude/skills/skill-name/SKILL.md
```

### Global Skills (from plugins)

Skills installed via plugin marketplace:
```
~/.claude/plugins/cache/[marketplace-name]/[package-name]/[hash]/skills/
```

Example:
```
/Users/ljack/.claude/plugins/cache/anthropic-agent-skills/document-skills/69c0b1a06741/skills/
├── skill-creator/
├── pdf/
├── docx/
└── ... (13 more skills)
```

### Loading Priority

1. Claude Code loads metadata for ALL skills at startup
2. Local project skills (`.claude/skills/`)
3. Global plugin skills (`~/.claude/plugins/cache/`)
4. Skills activate when Claude determines they're relevant based on `description` field

## Best Practices

### Writing Effective Descriptions

The `description` field is critical for skill activation. Include:

1. **What the skill does** - Core functionality
2. **When to use it** - Trigger phrases and keywords
3. **Specific terms** - Domain vocabulary that indicates relevance

Example:
```yaml
description: Analyze medical superbills and invoices for validation, duplicate detection, and comprehensive reporting. Use when the user mentions medical bills, superbills, healthcare invoices, insurance reimbursement statements, or asks to validate or summarize medical billing documents.
```

### Keep Skills Concise

- Default assumption: Claude is already very smart
- Only add context Claude doesn't have
- Challenge each piece of information
- Prefer concise examples over verbose explanations
- Aim for <500 lines in main SKILL.md

### Set Appropriate Degrees of Freedom

Match specificity to task fragility:

- **High freedom** (text instructions): Multiple valid approaches
- **Medium freedom** (pseudocode with parameters): Preferred patterns with flexibility
- **Low freedom** (specific scripts): Operations are fragile, consistency critical

### Use Progressive Disclosure

Don't put everything in SKILL.md:
- Keep main instructions focused
- Move detailed references to `references/`
- Bundle complex logic in `scripts/`
- Store templates in `assets/`

## Example: Medical Bill Analysis Skill

### Initial Mistake

Originally created as a single file:
```
.claude/skills/medical-bill-analysis.md  ❌ Wrong!
```

### Correct Structure

```
.claude/skills/medical-bill-analysis/
└── SKILL.md                              ✓ Correct!
```

### Complete SKILL.md

```yaml
---
name: medical-bill-analysis
description: Analyze medical superbills and invoices for validation, duplicate detection, and comprehensive reporting. Use when the user mentions medical bills, superbills, healthcare invoices, insurance reimbursement statements, or asks to validate or summarize medical billing documents.
metadata:
  author: ljack
  version: "1.0"
---

# Medical Bill Analysis

This skill analyzes medical superbills/invoices to validate dates, detect duplicates, and generate comprehensive summary reports.

## When to Use

Use this skill when the user:
- Has medical bills or superbills to analyze
- Wants to check for duplicate billing
- Needs validation of dates and services
- Wants a summary of healthcare expenses
- Mentions insurance reimbursement statements

## Process

### 1. Identify Files

Ask the user for:
- The directory containing PDF bills, or
- Specific PDF file paths to analyze

List all PDF files found for confirmation.

### 2. Read All Bills in Parallel

Use the Read tool to read each PDF file in parallel for efficiency.

Extract from each bill:
- Statement number
- Issue date
- Provider name, NPI, license number
- Practice Tax ID
- Patient/client information (name, DOB)
- Responsible party information
- Diagnosis codes (ICD-10)
- Service dates
- CPT codes and descriptions
- Place of Service (POS)
- Fees and payment amounts
- Total amounts

### 3. Validate Data

Perform these validations:

**Date Validation:**
- Verify all service dates are chronological and valid
- Check that issue dates align with or follow service dates
- Note the date range covered

**Scope of Work:**
- Ensure diagnosis codes are consistent across bills
- Verify service types (CPT codes) are appropriate
- Check Place of Service codes are consistent

**Provider Information:**
- Confirm all provider details are consistent across bills
- Verify NPI, license numbers, and Tax IDs match

**Financial Accuracy:**
- Verify line item totals match stated totals
- Check all amounts are marked as paid/unpaid

### 4. Duplicate Detection

Compare all bills by:
- Statement numbers (exact match = duplicate)
- Issue dates
- Service dates
- Total amounts
- Line item details

Flag exact duplicates even if filenames differ.

### 5. Generate Summary Report

Create a markdown file with these sections:

#### Duplicate Detection Section
If duplicates found, list them prominently at the top with:
- Which files are duplicates
- What makes them identical (statement #, dates, amounts)

#### Complete Bill Summary Table
All bills with columns:
- File name
- Statement #
- Issue date
- Service dates
- CPT codes
- Services description
- Total amount
- Status (UNIQUE/DUPLICATE)

#### Detailed Service Breakdown
For unique bills only, list each service:
- Service date
- CPT code
- Description
- Fee
- Statement # reference

#### Validation Results
Report on each validation area with checkmarks:
- ✓ PASS or ✗ FAIL for date validation
- ✓ PASS or ✗ FAIL for scope of work
- ✓ CONSISTENT or ✗ INCONSISTENT for provider info
- ✓ PASS or ✗ FAIL for financial accuracy

#### Financial Summary
- Breakdown by statement number
- Total for unique bills (excluding duplicates)

#### Recommendations
Actionable items such as:
- Which duplicate files to remove
- Any billing discrepancies to investigate
- Date or service inconsistencies to review

#### Patient/Provider Information
- Client name
- DOB
- Responsible party
- Provider name and credentials
- Tax ID
- Analysis date (current date)

### 6. Save Report

Default settings:
- **Location:** `/Users/ljack/Library/Mobile Documents/iCloud~md~obsidian/Documents/m31uk3/Life/`
- **Naming:** `Medical - [Provider Short Name] - Super Bill Analysis - [DDMMMYY].md`

Ask user to confirm location or provide alternative.

## Best Practices

- Always read PDFs in parallel for efficiency
- Be thorough in duplicate detection - check multiple fields, not just filenames
- Provide clear, actionable recommendations
- Use tables for easy scanning of information
- Include validation checkmarks (✓/✗) for visual clarity
- Calculate totals carefully, excluding duplicates
- Use consistent date formatting throughout
```

### Key Learnings

1. **Directory Structure Matters**: Must be a directory with `SKILL.md`, not a single file
2. **YAML Frontmatter is Required**: Must include `name` and `description` at minimum
3. **Name Must Match Directory**: The `name` field must exactly match the parent directory name
4. **Description Triggers Activation**: Make it detailed with specific keywords
5. **Lowercase and Hyphens Only**: Naming convention is strict

## References

### Official Documentation

1. **Agent Skills Specification**
   - Web: https://agentskills.io/specification
   - Local copy: [specification.md](./specification.md)

2. **Agent Skills Website**
   - https://agentskills.io/

3. **Agent Skills GitHub Repository**
   - https://github.com/agentskills/agentskills
   - Reference library: https://github.com/agentskills/agentskills/tree/main/skills-ref

### Claude Code Documentation

4. **Claude Code Official Site**
   - https://claude.com/claude-code

5. **Claude Code GitHub**
   - https://github.com/anthropics/claude-code

### Related Files in This Repository

6. **Local Documentation**
   - [REFERENCES.md](./REFERENCES.md) - Additional references
   - [slash-commands-vs-skills.md](./slash-commands-vs-skills.md) - Comparison guide
   - [sops-vs-skills-comparison.md](./sops-vs-skills-comparison.md) - SOPs vs Skills

### Example Skills

7. **Anthropic Agent Skills Marketplace**
   - Package: `document-skills@anthropic-agent-skills`
   - Includes: skill-creator, pdf, docx, pptx, xlsx, and 11 more skills

### Tools and Validation

8. **skills-ref Validation Tool**
   - GitHub: https://github.com/agentskills/agentskills/tree/main/skills-ref
   - Usage: `skills-ref validate ./my-skill`

### Session Context

This guide was created on January 3, 2026, documenting learnings from:
- Creating a medical bill analysis skill
- Installing the document-skills plugin package
- Understanding the Agent Skills specification
- Refactoring from incorrect to correct skill structure

### File Locations

**Project Skill:**
```
/Users/ljack/github/lemel-bills/.claude/skills/medical-bill-analysis/SKILL.md
```

**Global Skills Cache:**
```
/Users/ljack/.claude/plugins/cache/anthropic-agent-skills/document-skills/69c0b1a06741/skills/
```

**This Documentation:**
```
/Users/ljack/github/ai-skills/docs/claude-code-skills-guide.md
```

---

**Document Version:** 1.0
**Last Updated:** January 3, 2026
**Author:** Luke Jackson
**Session Date:** January 3, 2026
