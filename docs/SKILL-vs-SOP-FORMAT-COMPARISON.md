# .sop.md vs SKILL.md: Format Comparison

> **See also:** [FAQs.md](../FAQs.md) for common questions about AI workflows and skills

## Overview

You now have **both formats** for the AI workflow engineering pattern:

1. **`.sop.md`** - Platform-agnostic SOP format
2. **`SKILL.md`** - Optimized for Claude's skill system

Both contain the same core pattern but optimized for different use cases.

---

## Complete Format Specifications

### SKILL.md Format (Anthropic/Claude Code)

**Official definition:** "Skills are model-invoked capabilities that Claude autonomously uses based on task context. Skills provide contextual guidance that Claude incorporates into its responses."

**File extension:** `.md` (inside `skills/skill-name/` directory)

**Required structure:**
```markdown
---
name: skill-name
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2"...
version: 1.0.0
---

# Skill body in imperative/infinitive form
```

**Progressive disclosure architecture (3 levels):**

1. **Level 1: Metadata** (always in context)
   - Skill name + description (~100 words)
   - Loaded for ALL available skills
   - Claude uses this to decide whether to invoke

2. **Level 2: SKILL.md body** (loaded when triggered)
   - Core instructions and guidance
   - Recommended: 1,500-2,000 words
   - Maximum: <5,000 words
   - Loaded when Claude or user invokes skill

3. **Level 3: Bundled resources** (loaded as needed)
   - `references/` - Detailed docs, patterns, API refs (2,000-5,000+ words each)
   - `examples/` - Working code examples
   - `scripts/` - Utility scripts (can execute without loading to context)
   - Claude loads these only when needed

**Writing style:** Imperative/infinitive form (not second person)
- ✅ "To create a workflow, define the parameters."
- ❌ "You should create a workflow by defining parameters."

**Frontmatter fields:**
- `name` (required): Skill identifier
- `description` (required): Third-person with trigger phrases - "This skill should be used when..."
- `version` (optional): Semantic version

**Directory structure:**
```
skills/skill-name/
├── SKILL.md (required)
├── references/     (optional - detailed docs)
│   └── patterns.md
├── examples/       (optional - working code)
│   └── example.sh
└── scripts/        (optional - utilities)
    └── validate.sh
```

---

### .sop.md Format (Strands Agent SOPs)

**Official definition:** "Markdown files providing structured guidance for agents executing repeatable workflows."

**File extension:** `.sop.md` with descriptive kebab-case naming

**No frontmatter** - Pure markdown with standardized sections

**Required sections:**
1. **Title and Overview** - Clear heading with purpose and use cases
2. **Parameters** - Listed with required/optional status, snake_case naming
3. **Steps** - Numbered sections with natural language descriptions
4. **Examples** (Recommended) - Input/output demonstrations
5. **Troubleshooting** (Optional) - Common issues with resolutions

**RFC 2119 Keywords System:**
- **MUST/REQUIRED** - Absolute requirements
- **MUST NOT/SHALL NOT** - Absolute prohibitions
- **SHOULD/RECOMMENDED** - Strong recommendations (exceptions allowed)
- **SHOULD NOT** - Discouraged but potentially valid
- **MAY/OPTIONAL** - Truly optional elements

**Critical rule:** "When using negative constraints (MUST NOT, SHOULD NOT, SHALL NOT), you MUST provide context explaining why the restriction exists."

**Parameter format:**
```markdown
## Parameters

- **parameter_name** (required): Description
- **optional_param** (optional, default: "value"): Description
```

**Parameter naming:**
- Lowercase letters only
- Snake_case for word separation
- Descriptive and clear terminology

**Writing style:** Natural language with explicit constraints
- Focus on clarity and specificity
- Include rationale with "because" for prohibitions
- Spell out exact processes

**Design principles:**
1. Natural Language First
2. Standardized Structure
3. Parameterized inputs
4. Constraint-Based clarity
5. Interactive capability

**No progressive disclosure** - All content in single file

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
| **Writing voice** | Imperative/infinitive ("To do X, perform Y") | Natural language with explicit constraints |
| **Constraints** | Implicit in instructions | Explicit RFC 2119 keywords (MUST, SHOULD, MAY) |
| **Optimization** | Token efficiency (shares context with everything) | Reusability across contexts |
| **Audience** | Claude (with human oversight) | Both humans and AI systems |
| **Parameters** | Not formalized (handled in description/body) | Explicit Parameters section with required/optional |
| **Progressive disclosure** | 3-level system (metadata → body → resources) | Single file with all content |

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

## Constraint Systems Comparison

### SKILL.md: Implicit Constraints

Skills embed constraints in imperative instructions without formal keywords:

```markdown
## Validation Process

Start by reading the configuration file.
Validate the input before processing.
Use the grep tool to search for patterns.
Create only the directories you actually need.
```

**Characteristics:**
- Natural flow of instructions
- Assumes Claude understands imperatives as requirements
- Concise, action-oriented
- No formal distinction between MUST vs SHOULD

### .sop.md: Explicit RFC 2119 Keywords

SOPs use standardized constraint keywords with specific meanings:

```markdown
## Step 3: Validation

**Constraints:**
- You MUST validate the input before processing
- You MUST NOT proceed if validation score < 3/5 because this indicates incomplete requirements
- You SHOULD use the grep tool to search for patterns when files are large
- You MAY skip validation if the input source is trusted
```

**Characteristics:**
- Formal constraint levels (absolute vs recommended vs optional)
- **Negative constraints MUST include "because" rationale**
- Clear distinction between requirements and recommendations
- More verbose but eliminates ambiguity

### The "Negative Constraints Rule"

**From Strands specification:** "When using negative constraints (MUST NOT, SHOULD NOT, SHALL NOT), you MUST provide context explaining why the restriction exists."

**Rationale types include:**
- Technical limitations
- Security risks
- Data integrity concerns
- User experience issues
- Compatibility problems
- Performance impacts
- Workflow disruption

**Example from .sop.md:**
```markdown
- You MUST NOT ask multiple questions at once because this overwhelms users and leads to incomplete responses
- You MUST NOT skip the validation step because proceeding with invalid input corrupts downstream processes
```

**SKILL.md equivalent (implicit):**
```markdown
Ask ONE question at a time.
Validate input before proceeding to next step.
```

### When Each Approach Fits

**Use SKILL.md implicit constraints when:**
- Working with Claude (understands imperative form)
- Context window is limited
- Workflow is straightforward
- Target audience is AI agent

**Use .sop.md explicit keywords when:**
- Building platform-agnostic SOPs
- Multiple AI systems will use it
- Human readers need clarity
- Formal compliance required
- Complex workflows with many edge cases

---

## Progressive Disclosure Deep Dive

### SKILL.md's 3-Level Architecture

**Why progressive disclosure matters:**
- Context window is shared resource
- Not all skills needed for every conversation
- Detailed content should load only when relevant

**Level 1: Always loaded (metadata only)**
```yaml
name: database-schema
description: This skill should be used when the user discusses database structure, table relationships, queries, or schema design.
```
- ~100 words per skill
- ALL skills' metadata always in context
- Claude uses descriptions to decide invocation

**Level 2: Loaded when skill triggers (SKILL.md body)**
```markdown
# Database Schema Guidance

## Core Concepts
[1,500-2,000 word overview of schema design]

## Common Patterns
[Brief patterns reference]

See `references/detailed-patterns.md` for comprehensive guide.
```
- Recommended: 1,500-2,000 words
- Maximum: <5,000 words
- Loaded when Claude or user invokes skill

**Level 3: Loaded as needed (bundled resources)**
```
skills/database-schema/
├── SKILL.md (1,800 words)
├── references/
│   ├── detailed-patterns.md (4,500 words)
│   ├── normalization.md (3,200 words)
│   └── indexing.md (2,800 words)
├── examples/
│   ├── e-commerce-schema.sql
│   └── multi-tenant-schema.sql
└── scripts/
    └── validate-schema.sh
```
- References: 2,000-5,000+ words each (unlimited total)
- Examples: Complete, runnable code
- Scripts: Can execute without loading to context
- Claude loads only when it determines need

**Token efficiency example:**
- Without progressive disclosure: 15,000 words loaded when skill triggers
- With progressive disclosure: 1,800 words + selective reference loading
- Savings: ~13,000 tokens (87%) when references not needed

### .sop.md's Single-File Approach

**All content in one file:**
```markdown
# Database Schema Design SOP

## Overview
[Complete explanation]

## Parameters
[All parameters defined]

## Steps
### Step 1: Requirements Analysis
[Detailed process with constraints]

### Step 2: Schema Design
[Detailed process with constraints]

[... all steps ...]

## Examples
[Multiple detailed scenarios]

## Troubleshooting
[Comprehensive guide]
```

**Characteristics:**
- Self-contained (no external dependencies)
- Easier to share and version control
- No selective loading (all or nothing)
- Better for human readers (complete context)

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
| **File structure** | Single .sop.md file | Directory with SKILL.md + resources |
| **Frontmatter** | None (uses .sop.md extension) | YAML required (name, description, version) |
| **Writing style** | Natural language with "You MUST/SHOULD" | Imperative/infinitive form |
| **Constraint keywords** | Explicit RFC 2119 (MUST, SHOULD, MAY) | Implicit in imperative instructions |
| **Negative constraints** | MUST include "because" rationale | Brief justification if space allows |
| **Parameters** | Formal Parameters section (snake_case) | Informal (described in body or examples) |
| **Progressive disclosure** | None (all content in one file) | 3-level system (metadata → body → resources) |
| **Content size** | Unlimited single file | SKILL.md: 1,500-2,000 words + unlimited refs |
| **Rationale** | Extensive ("because" explanations) | Minimal (only if critical) |
| **Examples** | Multiple detailed scenarios | Brief reference examples (or in examples/) |
| **Anti-patterns** | Explicitly documented with reasoning | Listed concisely if space allows |
| **Checkpoints** | Full templates with all options | Simplified decision points |
| **Troubleshooting** | Comprehensive guide | Quick reference only (or in references/) |
| **Meta-content** | Principles, philosophy, "why" | Just the "what" and "how" |
| **Bundled resources** | N/A (all in one file) | references/, examples/, scripts/ directories |
| **Triggering** | Not specified by format | Third-person description with trigger phrases |

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

## Sources and References

This comprehensive comparison synthesizes official specifications from both format creators:

### SKILL.md Format (Anthropic/Claude Code)

**Official Documentation:**
- **skill-development/SKILL.md** - Complete skill development guide from Anthropic's official plugin-dev toolkit
  - Progressive disclosure architecture (3-level system)
  - Writing style requirements (imperative/infinitive form)
  - Bundled resources structure (references/, examples/, scripts/)
  - Content size recommendations (1,500-2,000 words for SKILL.md body)
  - Source: `~/.claude/plugins/.../plugin-dev/skills/skill-development/SKILL.md`

- **example-skill/SKILL.md** - Official Anthropic skill template
  - Official definition of skills
  - Frontmatter requirements
  - Structure examples
  - Source: `~/.claude/plugins/.../example-plugin/skills/example-skill/SKILL.md`

- **command-development/SKILL.md** - Slash command development guide
  - Command vs skill distinctions
  - YAML frontmatter fields
  - Source: `~/.claude/plugins/.../plugin-dev/skills/command-development/SKILL.md`

- **agent-development/SKILL.md** - Agent development guide
  - Autonomous agent architecture
  - System prompt design
  - Source: `~/.claude/plugins/.../plugin-dev/skills/agent-development/SKILL.md`

### .sop.md Format (Strands Agent SOPs)

**Official Specifications:**
- **agent-sop-format.md** - Format specification and rules
  - Core structure requirements
  - RFC 2119 keywords system
  - Negative constraints rule
  - Best practices
  - Source: https://github.com/strands-agents/agent-sop/blob/main/rules/agent-sop-format.md

- **agent-sops-specification.md** - Complete technical specification
  - Parameter specification format
  - Constraint system details
  - Design principles
  - Implementation compatibility
  - Source: https://github.com/strands-agents/agent-sop/blob/main/spec/agent-sops-specification.md

**Additional References:**
- [Strands Agent SOPs Repository](https://github.com/strands-agents/agent-sop) - Open source repository
- [AWS Blog: Introducing Strands Agent SOPs](https://aws.amazon.com/blogs/opensource/introducing-strands-agent-sops-natural-language-workflows-for-ai-agents/)
- [RFC 2119: Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119.html)

---

**Last Updated:** 2025-12-28

This comparison should help you understand when and how to use each format effectively!
