# Source Analysis: Anthropic Agent Skills

## Source
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://www.anthropic.com/engineering/claude-code-sandboxing

## Key Architecture

### What Are Agent Skills?
Modular, filesystem-based capabilities that extend Claude's functionality. Each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant.

### Progressive Disclosure (3-Level Loading)

| Level | When Loaded | Token Cost | Content |
|-------|------------|------------|---------|
| **Level 1: Metadata** | Always (startup) | ~100 tokens/skill | `name` + `description` YAML frontmatter |
| **Level 2: Instructions** | When triggered | <5k tokens | SKILL.md body |
| **Level 3+: Resources** | As needed | Effectively unlimited | Scripts, docs, templates (run via bash) |

### Skill Directory Structure
```
skill-name/
├── SKILL.md          # Required: YAML frontmatter + instructions
├── FORMS.md          # Optional: additional instruction files
├── REFERENCE.md      # Optional: reference materials
└── scripts/
    └── fill_form.py  # Optional: executable scripts
```

### VM Environment
- Claude operates in a virtual machine with filesystem access
- Skills exist as directories; Claude interacts via bash commands
- Scripts execute via bash; only output enters context (code never loaded)
- No practical limit on bundled content

### SKILL.md Format
```yaml
---
name: your-skill-name      # max 64 chars, lowercase/numbers/hyphens
description: Brief description  # max 1024 chars
---
# Markdown body with instructions
```

### Cross-Platform Support
- **Claude API**: Pre-built + custom skills via `skill_id` in `container` param
- **Claude Code**: Custom skills only, filesystem-based
- **Claude Agent SDK**: Custom skills via `.claude/skills/`
- **Claude.ai**: Pre-built + custom (zip upload in Settings)

### Pre-built Skills
- PowerPoint (pptx)
- Excel (xlsx)
- Word (docx)
- PDF (pdf)

### Security Model
- No isolation between skills or from core process
- Trust-based: only use from trusted sources
- Malicious skills can invoke tools/execute code in harmful ways
- External URL fetching is particularly risky

## Sandboxing (Separate from Skills)

### OS-Level Isolation
- Uses Linux bubblewrap and macOS Seatbelt
- Filesystem isolation: restricts to CWD + subdirectories
- Network isolation: all access denied by default, must allow-list domains
- Covers spawned scripts and subprocesses

### Open Source Package
- `@anthropic-ai/sandbox-runtime` on npm
- GitHub: https://github.com/anthropic-experimental/sandbox-runtime
- No container required
- Research preview; APIs may evolve

### Impact
- Reduces permission prompts by 84% in Anthropic's internal usage
- Enables safer autonomous agent operation

## Key Insight
Skills and sandboxing are **complementary but separate concerns**:
- Skills = what the agent CAN do (capabilities, knowledge)
- Sandboxing = what the agent CANNOT do (restrictions, boundaries)
