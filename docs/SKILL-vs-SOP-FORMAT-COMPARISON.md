# .sop.md vs SKILL.md: Format Comparison

> **See also:** [FAQs.md](FAQs.md) for common questions about AI workflows and skills

## Overview

You now have **both formats** for the AI workflow engineering pattern:

1. **`.sop.md`** - Platform-agnostic SOP format
2. **`SKILL.md`** - Optimized for Claude's skill system

Both contain the same core pattern but optimized for different use cases.

---

## Key Differences

### 1. Format & Structure

**SKILL.md:**
```yaml
---
name: skill-name
description: "When Claude should use this skill..."
license: Optional
compatibility: Optional
---

# Skill content (token-optimized)
```

- **YAML frontmatter** (required)
  - `name` and `description` fields MUST be present
  - Claude reads description to decide when to trigger
  - Only metadata loads initially; body loads on-demand

**.sop.md:**
```markdown
# Workflow Name

## Overview
Description and when to use

## Parameters
...
```

- **No frontmatter** - pure markdown
- Self-contained, complete documentation
- Designed to be read directly

---

### 2. Content Philosophy

| Aspect | SKILL.md | .sop.md |
|--------|----------|---------|
| **Conciseness** | Extremely concise - "context window is public good" | More complete - can be verbose where needed |
| **Assumptions** | Assumes Claude is already smart | Assumes reader may be learning |
| **Style** | Example-driven over explanations | Includes rationale and principles |
| **Optimization** | Token efficiency (shares context with everything) | Reusability across contexts |
| **Audience** | Claude (with human oversight) | Both humans and AI systems |

---

### 3. Usage Patterns

**SKILL.md:**
- Upload to Claude.ai Skills library
- Claude auto-triggers based on description
- User-facing in Claude interface
- Optimized for on-demand loading

**.sop.md:**
- Platform-agnostic base format
- Can be converted to:
  - SKILL.md (Claude.ai)
  - MCP prompt (Claude Code)
  - Agent system prompt (Strands, etc.)
  - Human documentation
- Explicitly invoked by user/system

---

### 4. Triggering Mechanism

**SKILL.md:**
```yaml
description: "Use when: (1) User wants X, (2) User needs Y, (3) User mentions Z"
```
- Claude reads description to decide when to activate
- Must be precise about trigger conditions
- Auto-triggered based on user query

**.sop.md:**
- No auto-trigger
- User explicitly calls/references it
- More flexible invocation patterns

---

### 5. Content Optimization Examples

#### Example: Constraint Definition

**SKILL.md version (concise):**
```markdown
## Key Constraints

- MUST ask ONE question at a time
- MUST wait for user confirmation at checkpoints
- MUST NOT proceed if < 3/5 without confirmation
- SHOULD include rationale with "because" for critical constraints
```

**.sop.md version (complete):**
```markdown
### Step 3: Requirements Clarification

**Constraints:**
- You MUST ask ONLY ONE question at a time and wait for the user's response before asking the next question
- You MUST NOT list multiple questions for the user to answer at once because this overwhelms users and leads to incomplete responses
- You MUST NOT pre-populate answers to questions without user input because this assumes user preferences without confirmation
- You MUST follow this exact process for each question:
  1. Formulate a single question
  2. Append the question to {project_dir}/idea-honing.md
  3. Present the question to the user in the conversation
  4. Wait for the user's complete response
  5. Append the user's answer to {project_dir}/idea-honing.md
  6. Only then proceed to formulating the next question
...
```

**Key differences:**
- SKILL.md: Assumes Claude knows the pattern
- .sop.md: Spells out the exact process

---

#### Example: Workflow Overview

**SKILL.md version:**
```markdown
# Response Quality Analysis

Validates response actually solves problem asked. Analyzes problem quality, 
decomposes components, calculates coverage, provides improvements.

## When to Use
Before posting to forums/Slack/mailing lists
```

**.sop.md version:**
```markdown
# Response Quality Analysis

## Overview

This SOP guides you through analyzing a problem statement and validating 
your response coverage before posting. It ensures you're solving the actual 
problem asked, not the problem you're comfortable addressing. The process 
systematically validates problem quality, decomposes it into components, 
analyzes your response coverage, and provides actionable improvement suggestions.

Use this workflow when responding to questions in forums (Slack, Stack Overflow, 
internal knowledge bases), writing to mailing lists, or any situation where you 
want to ensure your answer actually addresses what was asked.
```

**Key differences:**
- SKILL.md: High-level summary (assumes context)
- .sop.md: Educational explanation (builds understanding)

---

## Which Format to Use When

### Use SKILL.md when:

✅ Deploying to Claude.ai Skills library  
✅ Want auto-triggering based on user queries  
✅ Need token efficiency (shares context window)  
✅ End users are interacting via Claude interface  
✅ Want on-demand loading (metadata first, body later)

**Example:** Upload response-quality SKILL.md to Claude.ai. When you paste a draft response and ask "is this good?", Claude auto-triggers the skill.

---

### Use .sop.md when:

✅ Building platform-agnostic workflows  
✅ Want to convert to multiple formats later  
✅ Need complete documentation for humans  
✅ Creating reusable processes across teams  
✅ Want to maintain single source of truth  
✅ Building workflow libraries or templates

**Example:** Store .sop.md in your team repo, generate SKILL.md and MCP prompts from it as needed.

---

## Conversion Strategy

**Recommended workflow:**

1. **Start with .sop.md** - Complete, self-contained version
2. **Generate SKILL.md** - Distilled, token-optimized version
3. **Generate other formats** as needed (MCP, agent prompts, docs)

**Why this order?**
- .sop.md is complete source of truth
- SKILL.md is a lossy compression (omits rationale, examples)
- Easier to compress than reconstruct

---

## Content Comparison Table

| Element | .sop.md | SKILL.md |
|---------|---------|----------|
| **Frontmatter** | None | YAML required |
| **Rationale** | Extensive ("because" explanations) | Minimal (only if critical) |
| **Examples** | Multiple detailed scenarios | Brief reference examples |
| **Anti-patterns** | Explicitly documented with reasoning | Listed concisely if space allows |
| **Constraints** | Full MUST/MUST NOT with justification | Condensed list of key constraints |
| **Checkpoints** | Full templates with all options | Simplified decision points |
| **Troubleshooting** | Comprehensive guide | Quick reference only |
| **Meta-content** | Principles, philosophy, "why" | Just the "what" and "how" |

---

## Real Example: Character Count Comparison

**Same workflow content:**

| File | Format | Size | Character Count | Ratio |
|------|--------|------|----------------|-------|
| `response-quality.sop.md` | Full SOP | 33 KB | 33,397 chars | 100% |
| `response-quality-SKILL.md` | Claude Skill | 16 KB | 15,974 chars | 48% |

**SKILL.md is ~50% smaller** while preserving core workflow structure.

**What was compressed:**
- Removed detailed rationales
- Condensed examples  
- Removed philosophical discussion
- Shortened constraint explanations
- Simplified troubleshooting

**What was preserved:**
- All 5 core phases
- Key constraints (MUST/MUST NOT)
- Checkpoint structure
- Validation tests
- Workflow progression

---

## The YAML Frontmatter Explained

### Required Fields

```yaml
---
name: skill-name
description: "Clear description of when to use this skill..."
---
```

**`name`:**
- Identifier for the skill
- Lowercase with hyphens
- Example: `response-quality-analysis`

**`description`:**
- **Most important field** - Claude uses this to decide when to trigger
- Should clearly state: "Use when: (1) condition, (2) condition, (3) condition"
- Be specific about trigger scenarios
- Include keywords user might say

### Optional Fields

```yaml
license: "Proprietary / Public domain / Apache 2.0 / etc"
compatibility: "Requires: Python 3.8+, pandoc, etc"
metadata:
  version: "1.0"
  author: "Your name"
```

**`license`:**
- Usage terms (if applicable)
- Most skills don't need this unless restricted

**`compatibility`:**
- Environment requirements
- System packages needed
- Target platform (Claude.ai, Claude Code, etc)
- Most skills don't need this

---

## Token Economics

**Why SKILL.md is token-optimized:**

Claude's context window is shared by:
- System prompt (~20K tokens)
- Conversation history (varies)
- **Other skills' metadata** (all loaded)
- **Active skill body** (loaded on-demand)
- User's actual request

**Loading strategy:**
1. All skill **metadata** (name + description) always loaded
2. Skill **body** only loaded if skill triggers
3. Multiple skills can trigger in same conversation

**Implication:**
- Description must be efficient (loaded always)
- Body should be concise (but complete when loaded)
- Assume Claude has general intelligence

---

## Migration Path

### Already Have .sop.md? Create SKILL.md

**Steps:**
1. Add YAML frontmatter
2. Condense content (aim for ~50% reduction)
3. Keep structure (phases, constraints, checkpoints)
4. Remove verbose explanations
5. Simplify examples
6. Test with real scenarios

**What to compress:**
- Long rationales → Brief justifications
- Multiple examples → One reference example
- Philosophical discussion → Core principles only
- Detailed troubleshooting → Quick fixes only

**What to preserve:**
- MUST/SHOULD/MAY constraints
- Phase structure
- Checkpoint questions
- Validation tests
- Implementation guidance

---

### Already Have SKILL.md? Create .sop.md

**Steps:**
1. Remove frontmatter (save for reference)
2. Expand constraints with rationale
3. Add detailed examples
4. Add troubleshooting section
5. Add principles/philosophy section
6. Make self-contained (don't assume context)

**What to expand:**
- Brief constraints → Full explanation with "because"
- Reference example → Multiple detailed scenarios
- Core principles → Full rationale and discussion
- Quick fixes → Comprehensive troubleshooting

---

## Practical Usage Examples

### Example 1: Using SKILL.md in Claude.ai

```
User: "Can you review this response I'm about to post on Slack?"

Claude: [Automatically triggers response-quality-analysis skill]
"I'll analyze your response. Please provide:
1. The original question/problem
2. Your draft response

I'll check coverage and suggest improvements."

[Follows workflow from SKILL.md]
```

### Example 2: Using .sop.md as Documentation

```
Team member: "How should I validate responses before posting?"

You: "Follow this SOP: response-quality.sop.md
It walks through the process step by step."

[They read the complete SOP and understand the reasoning]
```

### Example 3: Converting .sop.md for Different Platforms

```bash
# Generate SKILL.md for Claude.ai
python convert-sop-to-skill.py response-quality.sop.md

# Generate MCP prompt for Claude Code
python convert-sop-to-mcp.py response-quality.sop.md

# Generate agent system prompt for Strands
python convert-sop-to-agent.py response-quality.sop.md
```

---

## Best Practices

### For SKILL.md

✅ **DO:**
- Write for Claude's intelligence level
- Use examples over explanations
- Be concise but complete
- Test trigger description thoroughly
- Keep MUST/MUST NOT constraints

❌ **DON'T:**
- Over-explain what Claude knows
- Include philosophical discussions
- Write verbose troubleshooting
- Duplicate content Claude has elsewhere

### For .sop.md

✅ **DO:**
- Make self-contained
- Include rationale ("because")
- Add detailed examples
- Document edge cases
- Explain the "why"

❌ **DON'T:**
- Assume reader knows context
- Skip troubleshooting
- Omit examples
- Leave gaps in reasoning

---

## Summary

**Think of them as:**

- **.sop.md** = Complete textbook
  - Self-contained
  - Educational
  - Platform-agnostic
  - Source of truth

- **SKILL.md** = Condensed reference card
  - Assumes intelligence
  - Token-optimized
  - Claude-specific
  - Derived format

**Relationship:**
```
.sop.md (master)
    ↓
    ├── SKILL.md (for Claude.ai)
    ├── MCP prompt (for Claude Code)
    ├── Agent prompt (for frameworks)
    └── Documentation (for humans)
```

---

## Next Steps

1. **To use in Claude.ai:** Upload the `*-SKILL.md` files to your Skills library

2. **To use as documentation:** Share the `*.sop.md` files with your team

3. **To create new workflows:** Follow `sop-pattern.sop.md`, then condense to SKILL.md

4. **To customize:** Edit .sop.md (source of truth), regenerate SKILL.md

---

## Questions to Consider

**"Which format should I maintain?"**
- Maintain .sop.md as source of truth
- Generate SKILL.md when deploying to Claude
- Update .sop.md, regenerate SKILL.md as needed

**"Can I use SKILL.md outside Claude?"**
- Yes, but .sop.md is better for that
- SKILL.md assumes Claude context
- Other systems may need full .sop.md

**"Should I convert existing workflows?"**
- If you have .sop.md → Generate SKILL.md for Claude
- If you have SKILL.md → Expand to .sop.md for documentation
- Both formats have value

---

This comparison should help you understand when and how to use each format effectively!
