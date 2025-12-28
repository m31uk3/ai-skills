# Frequently Asked Questions

## Why This Pattern Emerges

This isn't coincidence—it's fundamental to managing LLM uncertainty.

Multiple teams independently discovered these patterns within a 12-month window (2024-2025), suggesting they represent fundamental solutions to common challenges, not arbitrary design choices.

### 1. LLMs are probabilistic, not deterministic

- Need **constraints** to bound the solution space
- Need **validation gates** to prevent drift
- Need **human checkpoints** at critical decision points

### 2. Complex tasks require decomposition

- LLMs struggle with large, ambiguous problems
- **Explicit steps** with **clear outputs** work
- **Iterative refinement** handles emergence better than one-shot

### 3. Context is limited and expensive

- Can't hold everything in context at once
- Need **intentional compaction**
- Need **checkpoint artifacts** to resume work

### 4. Human-AI collaboration requires structure

- Humans need **decision points**, not auto-pilot
- AI needs **explicit permission** to proceed
- Both need **shared understanding** of state

---

## What's the Difference Between SKILL.md and Everything Else?

**AI Workflows Disambiguation**

The AI ecosystem has converged on similar patterns with different names and formats. Here's how they relate:

### The Universal Pattern

All of these implement the same core idea: **structured specifications that guide AI behavior with human checkpoints**.

### Format Comparison

| Format | System | Purpose | Key Feature |
|--------|--------|---------|-------------|
| **SKILL.md** | Claude.ai Skills | Auto-triggered workflows for Claude | YAML frontmatter with `description` for triggering |
| **POWER.md** | Kiro Powers | MCP tools + framework expertise | Keyword-based activation, bundles tools with guidance |
| **.sop.md** | Platform-agnostic | Complete workflow documentation | Self-contained, human-readable, no frontmatter |
| **Agent SOPs** | Strands Agents | Natural language workflows | MUST/SHOULD/MAY constraints, explicit phases |
| **Spec files** | SDD tools (Kiro, spec-kit, Tessl) | Source-of-truth specifications | Living documents that generate code |
| **AGENTS.md** | Project-level (cross-platform) | AI agent guidance for codebases | Standard Markdown, file discovery, 60k+ projects |

### Key Similarities

All formats share these characteristics:

1. **Structured phases** - Break work into explicit steps
2. **Constraints** - Use MUST/SHOULD/MAY or similar language
3. **Human checkpoints** - Require explicit approval at decision points
4. **Context triggering** - Activate based on user intent or keywords
5. **Validation** - Built-in quality checks and tests

### When to Use Each

**Use SKILL.md when:**
- Deploying to Claude.ai
- Want auto-triggering based on conversation context
- Need token efficiency (shares Claude's context window)

**Use POWER.md when:**
- Using Kiro or compatible systems
- Bundling MCP tools with framework expertise
- Want keyword-based dynamic loading

**Use .sop.md when:**
- Need platform-agnostic documentation
- Want complete, self-contained workflows
- Building reusable processes across teams
- Creating source of truth for multiple formats

**Use Agent SOPs when:**
- Working with Strands Agents or similar frameworks
- Need explicit natural language instructions
- Want portable agent definitions

**Use spec files (SDD) when:**
- Building software with AI code generation
- Want specification as source of truth
- Using tools like Kiro, spec-kit, or Tessl

**Use AGENTS.md when:**
- Providing project-level guidance to AI coding agents
- Want cross-platform compatibility (works with Claude Code, Copilot, Cursor, etc.)
- Need to document build/test workflows and code conventions
- Want agent-specific context separate from human README

### The Convergence

These formats emerged independently but converged because they solve the same fundamental challenge: **managing LLM uncertainty through structure**.

**Examples in the wild:**

- **[Strands Agent SOPs](https://github.com/strands-agents/agent-sop)** - Natural language workflows with PDD
- **[Kiro Powers](https://kiro.dev/blog/introducing-powers/)** - POWER.md files with MCP integration
- **[GitHub spec-kit](https://github.com/github/spec-kit)** - Constitution-based specifications
- **[HumanLayer](https://www.humanlayer.dev/)** - Context engineering with claude.md
- **[Claude Skills](https://claude.ai)** - SKILL.md with YAML frontmatter
- **[AGENTS.md](https://agents.md/)** - Open standard for AI agent project guidance (60k+ projects)

### Interoperability

These formats can be converted between each other:

```
Project Level:
AGENTS.md → Project-wide agent guidance

Task/Workflow Level:
.sop.md (source of truth)
    ↓
    ├── SKILL.md (for Claude.ai)
    ├── POWER.md (for Kiro)
    ├── Agent SOP (for Strands)
    ├── Spec file (for SDD tools)
    └── Documentation (for humans)
```

**See also:**
- [SKILL-vs-SOP-FORMAT-COMPARISON.md](docs/SKILL-vs-SOP-FORMAT-COMPARISON.md) for detailed format differences
- [REFERENCES.md](docs/REFERENCES.md) for full citations and links to all systems
- [slash-commands-vs-skills.md](docs/slash-commands-vs-skills.md) for Claude Code-specific differences

---

## What's the Difference Between Slash Commands and Skills in Claude Code?

**Quick Answer:** Skills are for Claude to invoke automatically. Slash commands are for you to invoke manually. But both can be called by either party today.

### The Confusion

Skills and slash commands work almost identically in Claude Code right now:

- Both can be invoked by typing `/name`
- Both can be invoked by Claude automatically
- Both load instructions into conversation context

This creates real confusion. Many developers ask "why have both?"

### The Intent

Anthropic designed them with different purposes:

| Aspect | Skills | Slash Commands |
|--------|--------|----------------|
| **Who decides** | Claude (automatic) | You (manual) |
| **Best for** | On-demand knowledge | Standardized workflows |
| **Think of it as** | Library books Claude grabs | Buttons you press |
| **Examples** | API docs, style guides | PR templates, test runners |

### The Reality

**Current state:** They overlap significantly. You can invoke skills manually. Claude can invoke slash commands.

**Official position** (Anthropic): "We think this difference is significant enough to keep the two concepts separate... We are definitely looking to eliminate this [overlap]... The way they load instructions may diverge over time."

### Decision Guide

Ask yourself: **Who should decide when this runs?**

- **Claude should decide** → Create a skill (e.g., load database schema docs when discussing databases)
- **I should decide** → Create a slash command (e.g., generate PR description when I'm ready)

Don't optimize for today's mechanics. Optimize for the intended use case.

**Full analysis:** See [slash-commands-vs-skills.md](docs/slash-commands-vs-skills.md) for decision matrix, context management patterns, and official Anthropic statements.
