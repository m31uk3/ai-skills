# Claude Code Skills: Complete Guide

**Last Updated:** January 3, 2026

## Table of Contents

1. [Introduction](#introduction)
2. [What are Skills?](#what-are-skills)
3. [Skills in the Plugin Ecosystem](#skills-in-the-plugin-ecosystem)
4. [Installing Skills](#installing-skills)
5. [Skill Structure and Format](#skill-structure-and-format)
6. [Writing Style Requirements](#writing-style-requirements)
7. [Creating Skills Locally](#creating-skills-locally)
8. [6-Step Skill Creation Process](#6-step-skill-creation-process)
9. [Where Skills are Stored](#where-skills-are-stored)
10. [Best Practices](#best-practices)
11. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
12. [Validation Checklist](#validation-checklist)
13. [Example: Medical Bill Analysis Skill](#example-medical-bill-analysis-skill)
14. [References](#references)

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

## Skills in the Plugin Ecosystem

**Important:** Skills can exist in two contexts:

### 1. Standalone Agent Skills

Following the universal [Agent Skills specification](https://agentskills.io), these skills:
- Work across any AI agent that supports the Agent Skills format
- Are distributed as skill packages (e.g., `document-skills@anthropic-agent-skills`)
- Follow the generic specification at https://agentskills.io/specification
- Can be installed from the `anthropic-agent-skills` marketplace

### 2. Claude Code Plugin Skills

Skills that are **part of Claude Code plugins**, which also include:
- **Commands** - Slash commands (e.g., `/test`, `/review`)
- **Agents** - Autonomous subagents for specialized tasks
- **Hooks** - Event-driven automation (validate operations, run on session start, etc.)
- **MCP Servers** - Model Context Protocol integrations (external APIs, databases, services)

Plugin skills are:
- Located in the plugin's `skills/` directory
- Distributed as part of the full plugin package
- Can be installed from the `claude-plugins-official` marketplace
- Automatically discovered by Claude Code

**Example Plugin Structure:**
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/           # Slash commands
├── agents/            # Autonomous subagents
├── hooks/             # Event-driven automation
├── mcp/               # MCP server configs
└── skills/            # Skills (following same SKILL.md format)
    └── my-skill/
        ├── SKILL.md
        ├── references/
        ├── examples/
        └── scripts/
```

**Key Point:** Both standalone skills and plugin skills use the same `SKILL.md` format with YAML frontmatter and markdown body. The difference is in distribution and context.

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

Executable code (Python/Bash/JavaScript) for tasks that require deterministic reliability or are repeatedly rewritten.

**When to include:**
- When the same code is being rewritten repeatedly
- When deterministic reliability is needed
- For validation utilities and testing helpers

**Examples:**
- `scripts/rotate_pdf.py` - PDF rotation tasks
- `scripts/validate-hook-schema.sh` - Hook validation
- `scripts/parse-frontmatter.sh` - YAML parsing utility

**Benefits:**
- Token efficient (may be executed without loading into context)
- Deterministic execution
- Reusable across sessions

**Note:** Scripts may still need to be read by Claude for patching or environment-specific adjustments.

#### references/

Documentation and reference material intended to be **loaded as needed** into context to inform Claude's process and thinking.

**When to include:**
- For documentation that Claude should reference while working
- To keep SKILL.md lean while providing deep domain knowledge

**Examples:**
- `references/finance.md` - Financial schemas
- `references/api_docs.md` - API specifications
- `references/patterns.md` - Detailed implementation patterns
- `references/policies.md` - Company policies

**Use cases:**
- Database schemas
- API documentation
- Domain knowledge
- Company policies
- Detailed workflow guides
- Advanced techniques

**Benefits:**
- Keeps SKILL.md lean
- Loaded only when Claude determines it's needed
- Each reference file can be large (2,000-5,000+ words)

**Best practice:** If files are large (>10k words), include grep search patterns in SKILL.md so Claude knows what to search for.

**Avoid duplication:** Information should live in either SKILL.md or references files, not both. Prefer references files for detailed information unless it's truly core to the skill.

#### assets/

Files **not intended to be loaded into context**, but rather used within the output Claude produces.

**When to include:**
- When the skill needs files that will be used in the final output
- For templates that get copied or modified

**Examples:**
- `assets/logo.png` - Brand assets
- `assets/slides.pptx` - PowerPoint templates
- `assets/frontend-template/` - HTML/React boilerplate
- `assets/font.ttf` - Typography files

**Use cases:**
- Templates
- Images and icons
- Boilerplate code
- Fonts
- Sample documents

**Benefits:**
- Separates output resources from documentation
- Enables Claude to use files without loading them into context
- User can copy and adapt these directly

### Progressive Disclosure

Skills use a **three-level loading system** to manage context efficiently:

**Level 1: Metadata (~100 words)**
- Always in context for ALL skills
- `name` and `description` from YAML frontmatter
- Used by Claude to determine skill relevance
- Critical for skill triggering

**Level 2: SKILL.md body (<5k words, ideally 1,500-2,000 words)**
- Loaded when skill triggers
- Contains core concepts and essential procedures
- Quick reference tables and workflow guidance
- Pointers to references/examples/scripts

**Level 3: Bundled resources (as needed)**
- `references/` - Loaded when Claude needs detailed information
- `examples/` - Loaded when Claude needs to see working code
- `scripts/` - May be executed without loading into context
- `assets/` - Never loaded, used in output directly

**Key Principle:** Move detailed content from SKILL.md to references/ to keep the main skill lean. Each reference file can be 2,000-5,000+ words since they're loaded on demand.

**Target Word Counts:**
- **SKILL.md body**: 1,500-2,000 words ideal, <3,000 words max
- **Reference files**: 2,000-5,000+ words each (loaded as needed)
- **Avoid**: Single SKILL.md file with 8,000+ words

**What Goes in SKILL.md:**
- Core concepts and overview
- Essential procedures and workflows
- Quick reference tables
- Pointers to references/examples/scripts
- Most common use cases

**What Goes in references/:**
- Detailed patterns and advanced techniques
- Comprehensive API documentation
- Migration guides
- Edge cases and troubleshooting
- Extensive examples and walkthroughs

## Writing Style Requirements

Following consistent writing style is critical for effective skills that Claude can properly interpret.

### Imperative/Infinitive Form (Required)

Write the **entire skill** using verb-first instructions, not second person:

✅ **Correct (imperative form):**
```markdown
To create a hook, define the event type.
Configure the MCP server with authentication.
Validate settings before use.
Parse the frontmatter using sed.
Extract fields with grep.
```

❌ **Incorrect (second person):**
```markdown
You should create a hook by defining the event type.
You need to configure the MCP server.
You must validate settings before use.
You can parse the frontmatter...
Claude should extract fields...
```

### Third-Person in Description (Required)

The frontmatter description **must** use third person:

✅ **Correct:**
```yaml
description: This skill should be used when the user asks to "create X", "configure Y", or mentions specific scenarios...
```

❌ **Incorrect:**
```yaml
description: Use this skill when you want to create X...
description: Load this skill when user asks...
description: You can use this for...
```

### Objective, Instructional Language

Focus on **what to do**, not **who should do it**:

✅ **Correct:**
```markdown
Start by reading the configuration file.
Validate the input before processing.
Use the grep tool to search for patterns.
```

❌ **Incorrect:**
```markdown
The user should start by reading...
Claude might want to validate...
You will need to use the grep tool...
```

### Why This Matters

- **Consistency**: All skills follow the same style for predictable behavior
- **Clarity**: Imperative form is clearer and more direct
- **AI Consumption**: Claude interprets imperative instructions more effectively
- **Professional**: Maintains documentation quality standards

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

## 6-Step Skill Creation Process

Follow this process when creating skills to ensure quality and effectiveness:

### Step 1: Understanding the Skill with Concrete Examples

Clearly understand concrete examples of how the skill will be used. Ask questions like:

- "What functionality should this skill support?"
- "Can you give examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

**Example questions for an image-editor skill:**
- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "I can imagine users asking for things like 'Remove the red-eye from this image' or 'Rotate this image'. Are there other ways you imagine this skill being used?"

Conclude when there's a clear sense of the functionality the skill should support.

### Step 2: Planning the Reusable Skill Contents

Analyze each concrete example by:
1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful

**Example analyses:**

**PDF Editor Skill** (query: "Help me rotate this PDF")
- Rotating a PDF requires re-writing the same code each time
- → Need: `scripts/rotate_pdf.py`

**Frontend Webapp Builder** (query: "Build me a todo app")
- Writing a frontend webapp requires the same boilerplate HTML/React each time
- → Need: `assets/hello-world/` template with boilerplate files

**BigQuery Skill** (query: "How many users have logged in today?")
- Querying BigQuery requires re-discovering table schemas each time
- → Need: `references/schema.md` documenting table schemas

**Hooks Skill** (query: "Validate my hooks configuration")
- Developers repeatedly need to validate hooks.json and test hook scripts
- → Need: `scripts/validate-hook-schema.sh`, `scripts/test-hook.sh`, `references/patterns.md`

### Step 3: Create Skill Structure

Create the skill directory structure:

```bash
# For standalone skills
mkdir -p .claude/skills/skill-name/{references,examples,scripts}
touch .claude/skills/skill-name/SKILL.md

# For plugin skills
mkdir -p plugin-name/skills/skill-name/{references,examples,scripts}
touch plugin-name/skills/skill-name/SKILL.md
```

Only create the directories you actually need (references/, examples/, scripts/).

### Step 4: Edit the Skill

Remember: You're creating this skill for another instance of Claude to use. Focus on information that would be beneficial and non-obvious.

**Start with Reusable Contents:**
- Implement the scripts/, references/, and assets/ identified in Step 2
- This may require user input (brand assets, documentation, templates)
- Delete any example files and directories not needed

**Update SKILL.md:**

1. **Write frontmatter with strong triggers:**
   ```yaml
   ---
   name: skill-name
   description: This skill should be used when the user asks to "specific phrase 1", "specific phrase 2", "specific phrase 3". Include exact phrases users would say.
   version: 0.1.0
   ---
   ```

2. **Write body in imperative form** (1,500-2,000 words ideal):
   - What is the purpose of the skill?
   - When should the skill be used?
   - How should Claude use the skill?
   - Reference all bundled resources (scripts/, references/, examples/)

3. **Keep SKILL.md lean:**
   - Target 1,500-2,000 words for the body
   - Move detailed content to references/
   - Reference supporting files clearly

**Reference Resources in SKILL.md:**
```markdown
## Additional Resources

### Reference Files
- **`references/patterns.md`** - Common patterns
- **`references/advanced.md`** - Advanced techniques

### Examples
- **`examples/script.sh`** - Working example
```

### Step 5: Validate and Test

**Check structure:**
- [ ] SKILL.md file exists with valid YAML frontmatter
- [ ] Frontmatter has `name` and `description` fields
- [ ] Markdown body is present and substantial
- [ ] Referenced files actually exist

**Validate content:**
- [ ] Description uses third person ("This skill should be used when...")
- [ ] Description includes specific trigger phrases
- [ ] Body uses imperative/infinitive form (not second person)
- [ ] SKILL.md is lean (1,500-2,000 words ideal, <3k max)
- [ ] Detailed content moved to references/
- [ ] Examples are complete and working
- [ ] Scripts are executable and documented

**Test the skill:**
- Ask questions that should trigger the skill
- Verify skill loads correctly
- Check that content is helpful for intended tasks

**Use skill-reviewer agent (if available):**
```
Ask: "Review my skill and check if it follows best practices"
```

### Step 6: Iterate

After testing the skill, identify improvements:

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again

**Common improvements:**
- Strengthen trigger phrases in description
- Move long sections from SKILL.md to references/
- Add missing examples or scripts
- Clarify ambiguous instructions
- Add edge case handling

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

## Common Mistakes to Avoid

### Mistake 1: Weak Trigger Description

❌ **Bad:**
```yaml
description: Provides guidance for working with hooks.
```

**Why bad:** Vague, no specific trigger phrases, not third person

✅ **Good:**
```yaml
description: This skill should be used when the user asks to "create a hook", "add a PreToolUse hook", "validate tool use", or mentions hook events. Provides comprehensive hooks API guidance.
```

**Why good:** Third person, specific phrases, concrete scenarios

### Mistake 2: Too Much in SKILL.md

❌ **Bad:**
```
skill-name/
└── SKILL.md  (8,000 words - everything in one file)
```

**Why bad:** Bloats context when skill loads, detailed content always loaded

✅ **Good:**
```
skill-name/
├── SKILL.md  (1,800 words - core essentials)
└── references/
    ├── patterns.md (2,500 words)
    └── advanced.md (3,700 words)
```

**Why good:** Progressive disclosure, detailed content loaded only when needed

### Mistake 3: Second Person Writing

❌ **Bad:**
```markdown
You should start by reading the configuration file.
You need to validate the input.
You can use the grep tool to search.
```

**Why bad:** Second person, not imperative form

✅ **Good:**
```markdown
Start by reading the configuration file.
Validate the input before processing.
Use the grep tool to search for patterns.
```

**Why good:** Imperative form, direct instructions

### Mistake 4: Missing Resource References

❌ **Bad:**
```markdown
# SKILL.md

[Core content]

[No mention of references/ or examples/]
```

**Why bad:** Claude doesn't know references exist

✅ **Good:**
```markdown
# SKILL.md

[Core content]

## Additional Resources

### Reference Files
- **`references/patterns.md`** - Detailed patterns
- **`references/advanced.md`** - Advanced techniques

### Examples
- **`examples/script.sh`** - Working example
```

**Why good:** Claude knows where to find additional information

### Mistake 5: Vague or Generic Triggers

❌ **Bad:**
```yaml
description: Use when working with medical bills.
```

✅ **Good:**
```yaml
description: This skill should be used when the user mentions "medical bills", "superbills", "healthcare invoices", "insurance reimbursement statements", or asks to "validate medical billing", "check for duplicate bills", "analyze healthcare expenses".
```

## Validation Checklist

Before finalizing a skill, verify:

**Structure:**
- [ ] SKILL.md file exists with valid YAML frontmatter
- [ ] Frontmatter has `name` and `description` fields
- [ ] Directory name matches `name` field exactly
- [ ] Markdown body is present and substantial
- [ ] Referenced files actually exist

**Description Quality:**
- [ ] Uses third person ("This skill should be used when...")
- [ ] Includes specific trigger phrases users would say
- [ ] Lists concrete scenarios ("create X", "configure Y")
- [ ] Not vague or generic
- [ ] Mentions key domain vocabulary

**Content Quality:**
- [ ] SKILL.md body uses imperative/infinitive form
- [ ] No second person ("you", "your") anywhere
- [ ] Body is focused and lean (1,500-2,000 words ideal, <3k max)
- [ ] Detailed content moved to references/
- [ ] Examples are complete and working
- [ ] Scripts are executable and documented

**Progressive Disclosure:**
- [ ] Core concepts in SKILL.md
- [ ] Detailed docs in references/
- [ ] Working code in examples/
- [ ] Utilities in scripts/
- [ ] SKILL.md references these resources clearly

**Testing:**
- [ ] Skill triggers on expected user queries
- [ ] Content is helpful for intended tasks
- [ ] No duplicated information across files
- [ ] References load when needed
- [ ] Scripts execute successfully

**Best Practices:**
- [ ] Only created directories actually needed (references/, examples/, scripts/)
- [ ] Each reference file is focused and well-organized
- [ ] grep search patterns included for large reference files (>10k words)
- [ ] Examples demonstrate real-world usage
- [ ] Scripts include error handling and documentation

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

8. **Plugin-Dev Toolkit** (Claude Code specific)
   - Package: `plugin-dev@claude-plugins-official`
   - Location: `/Users/[username]/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev`
   - Includes 7 skills for plugin development:
     - skill-development (creating skills)
     - hook-development (event-driven automation)
     - agent-development (autonomous subagents)
     - command-development (slash commands)
     - mcp-integration (external service integration)
     - plugin-structure (plugin organization)
     - plugin-settings (configuration management)
   - Also includes 3 agents: agent-creator, plugin-validator, skill-reviewer
   - Workflow command: `/plugin-dev:create-plugin`

### Tools and Validation

9. **skills-ref Validation Tool**
   - GitHub: https://github.com/agentskills/agentskills/tree/main/skills-ref
   - Usage: `skills-ref validate ./my-skill`

10. **skill-reviewer Agent** (from plugin-dev)
   - Usage: "Review my skill and check if it follows best practices"
   - Validates description quality, content organization, progressive disclosure

### Session Context

This guide was created on January 3, 2026, documenting learnings from:
- Creating a medical bill analysis skill
- Installing the document-skills plugin package
- Understanding the Agent Skills specification
- Refactoring from incorrect to correct skill structure
- Discovering the plugin-dev toolkit
- Studying the skill-development skill from plugin-dev
- Understanding skills within the larger plugin ecosystem

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

**Document Version:** 2.0
**Last Updated:** January 3, 2026 (Updated with plugin-dev learnings)
**Author:** Luke Jackson
**Session Date:** January 3, 2026

## Changelog

**Version 2.0 (January 3, 2026):**
- Added "Skills in the Plugin Ecosystem" section
- Added "Writing Style Requirements" section with imperative/infinitive form guidelines
- Added comprehensive "6-Step Skill Creation Process"
- Added "Common Mistakes to Avoid" section
- Added "Validation Checklist" section
- Enhanced "Optional Directories" with detailed guidance
- Updated "Progressive Disclosure" with specific word count targets
- Added references to plugin-dev toolkit and skill-reviewer agent
- Incorporated learnings from plugin-dev's skill-development skill

**Version 1.0 (January 3, 2026):**
- Initial version documenting Agent Skills specification
- Medical bill analysis skill example
- Basic skill structure and format
- Installation and creation guides
