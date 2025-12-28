# AI Skills Repository - Agent Guidance

This repository contains the universal pattern for building reliable AI workflows, codified as reusable skills.

## Project Overview

**Purpose:** Capture and share the meta-pattern that has independently emerged across multiple AI systems (PDD, HumanLayer, SDD, Kiro Powers) for managing LLM uncertainty through structured workflows.

**Core Concept:** All reliable AI workflows follow the same 5-phase universal pattern:
1. Intake/Investigation - Validate inputs
2. Decomposition/Planning - Structure the work
3. Iterative Execution - Do the work with checkpoints
4. Validation/Review - Check quality
5. Decision Point - Human chooses next action

## Directory Structure

```
.
├── README.md              # Human-focused overview
├── AGENTS.md             # This file - AI agent guidance
├── skills/               # Individual skill definitions
│   ├── ai--workflow-engineering/
│   │   └── SKILL.md     # Meta-pattern for creating workflows
│   └── comms--response-quality-analysis/
│       └── SKILL.md     # Example: Response quality workflow
└── docs/                 # Documentation
    ├── FAQs.md          # Common questions and disambiguation
    ├── REFERENCES.md    # Citations and system comparisons
    └── SKILL-vs-SOP-FORMAT-COMPARISON.md
```

## Skill Format

Skills in this repository follow the **SKILL.md format** (Claude.ai Skills):

```yaml
---
name: skill-name
description: "Use when: (1) condition, (2) condition, (3) condition"
license: Optional
---

# Skill Content
[Token-optimized workflow following the universal pattern]
```

**Key characteristics:**
- YAML frontmatter with `name` and `description` (required)
- Description defines when Claude should trigger the skill
- Content follows 5-phase universal pattern
- Uses MUST/SHOULD/MAY constraint language (RFC 2119)
- Includes human checkpoints at decision points

## Creating New Skills

### 1. Follow the Meta-Pattern

Read [`skills/ai--workflow-engineering/SKILL.md`](skills/ai--workflow-engineering/SKILL.md) - it provides the complete pattern for creating reliable AI workflows.

### 2. Implement the 5 Phases

Every skill should include:
- **Intake/Investigation** - Validate inputs, gather context, establish constraints
- **Decomposition/Planning** - Break into components, define success criteria
- **Iterative Execution** - Execute with validation and human checkpoints
- **Validation/Review** - Run tests, calculate quality metrics
- **Decision Point** - Present options, wait for user direction

### 3. Use Explicit Constraints

Use RFC 2119 keywords:
- `MUST` - Absolute requirement
- `MUST NOT` - Absolute prohibition (include "because" rationale)
- `SHOULD` - Strong recommendation
- `MAY` - Optional

### 4. Add Human Checkpoints

Critical decisions require explicit user approval:
```markdown
**Checkpoint:** [Present state and findings]

Options:
[A] Proceed option
[B] Iterate/revise option
[C] Change approach option

You MUST wait for user response before proceeding.
```

### 5. Define Quality Metrics

Include testable validation:
- Coverage calculation (what % addressed)
- Pass/fail criteria
- Completeness checks
- Specificity measures

## Naming Convention

Skills follow the pattern: `{category}--{workflow-name}/SKILL.md`

**Categories:**
- `ai--` - AI/meta workflows
- `comms--` - Communication workflows
- `dev--` - Development workflows
- `analysis--` - Analysis workflows
- `planning--` - Planning workflows

**Examples:**
- `ai--workflow-engineering/SKILL.md`
- `comms--response-quality-analysis/SKILL.md`
- `dev--code-review/SKILL.md` (future)

## Testing Skills

Before adding a skill:

1. **Upload to Claude.ai** - Test with Claude Skills
2. **Run through scenarios** - Verify all phases work
3. **Check triggering** - Does description activate correctly?
4. **Validate checkpoints** - Human approval works?
5. **Measure quality** - Metrics calculate properly?

## Integration Options

Skills from this repository can be used as:

1. **Claude Skills** - Upload SKILL.md to Claude.ai Projects → Knowledge
2. **MCP prompts** - Use in Claude Code via Model Context Protocol
3. **Agent SOPs** - Convert to Strands Agent format
4. **Documentation** - Human-readable process guides
5. **POWER.md** - Convert for Kiro Powers format

## Code Style

### Markdown Conventions
- Use ATX headers (`#` style, not underline style)
- Use fenced code blocks with language tags
- Use `-` for unordered lists (consistent)
- Use `**bold**` for emphasis (not `__`)

### Constraint Language
- Always use uppercase: MUST, SHOULD, MAY
- Include rationale for MUST NOT: "You MUST NOT [action] because [reason]"
- Be specific and testable

### Checkpoint Format
```markdown
**Checkpoint:** [Question/summary]

[Present current state]

Options:
[A] [Option with outcome]
[B] [Option with outcome]

[Explicit instruction to wait]
```

## Development Workflow

### Adding a New Skill

1. Create directory: `skills/{category}--{name}/`
2. Create `SKILL.md` with YAML frontmatter
3. Implement 5-phase pattern
4. Add to documentation (if significant)
5. Test thoroughly
6. Submit PR (if contributing)

### Updating Existing Skills

1. Read current version completely
2. Identify what needs change
3. Preserve phase structure
4. Update constraints/checkpoints as needed
5. Test with real scenarios
6. Document changes in commit

## Quality Standards

Skills must meet these criteria:

**Structure:**
- [ ] All 5 phases present
- [ ] Entry/exit criteria defined
- [ ] Human checkpoints included

**Constraints:**
- [ ] Uses MUST/SHOULD/MAY
- [ ] Includes rationales
- [ ] All constraints testable

**Validation:**
- [ ] Success criteria defined
- [ ] Quality metrics included
- [ ] Pass/fail tests specified

**Documentation:**
- [ ] Clear description
- [ ] Usage examples
- [ ] Troubleshooting guidance

## Related Standards

This repository follows and relates to:

- **[SKILL.md](https://claude.ai)** - Claude.ai Skills format (what we use)
- **[AGENTS.md](https://agents.md/)** - This file format for project guidance
- **[Agent SOPs](https://github.com/strands-agents/agent-sop)** - Strands natural language workflows
- **[POWER.md](https://kiro.dev/blog/introducing-powers/)** - Kiro Powers format
- **.sop.md** - Platform-agnostic SOP format

See [`docs/FAQs.md`](docs/FAQs.md) for disambiguation and format comparison.

## Contributing

We welcome contributions of new skills that follow the universal pattern!

**Before contributing:**
1. Read the meta-pattern: [`skills/ai--workflow-engineering/SKILL.md`](skills/ai--workflow-engineering/SKILL.md)
2. Review existing skills for examples
3. Follow the quality standards above
4. Test thoroughly with Claude

**To contribute:**
1. Fork the repository
2. Create your skill following the naming convention
3. Ensure it passes quality standards
4. Submit a pull request with description

See [`docs/REFERENCES.md`](docs/REFERENCES.md) for citations and background on the pattern convergence.

## Questions?

- **Format questions:** See [`docs/FAQs.md`](docs/FAQs.md)
- **Pattern questions:** Read [`skills/ai--workflow-engineering/SKILL.md`](skills/ai--workflow-engineering/SKILL.md)
- **Reference systems:** Check [`docs/REFERENCES.md`](docs/REFERENCES.md)

## License

All skills in this repository are shared as a public good for the AI engineering community.

Individual skills may have specific licenses noted in their frontmatter.
