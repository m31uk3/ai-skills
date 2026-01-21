# CLAUDE.md vs AGENTS.md: Research Summary

This research substantiates claims about using CLAUDE.md for Anthropic's Claude Code and the best practices for supporting multiple AI coding tools.

## Executive Summary

**CLAUDE.md** is Anthropic's proprietary memory system for Claude Code, offering native hierarchical memory loading and prioritization. **AGENTS.md** is an emerging open standard (created by Sourcegraph's Amp team) for AI coding agent configuration, supported by 20,000+ open-source projects and tools like Cursor, Codex, and Builder.io.

The two claims investigated are **substantiated** with specific caveats documented below.

---

## Claim 1: "Use CLAUDE.md for Anthropic's Claude Code if you want its native, prioritized memory"

### Verdict: **SUBSTANTIATED**

### Evidence

#### Native Memory Architecture

Anthropic's Claude Code implements a **4-level hierarchical memory system** with clear priority ordering:

| Priority | Level | Location | Purpose |
|----------|-------|----------|---------|
| 1 (lowest) | Enterprise Policy | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Organization-wide security policies |
| 2 | Project Memory | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-specific coding standards |
| 3 | Project Rules | `./.claude/rules/*.md` | Modular, topic-focused instructions |
| 4 (highest) | User Memory | `~/.claude/CLAUDE.md` or `./CLAUDE.local.md` | Individual preferences |

> "User-level rules are loaded before project rules, giving project rules higher priority."
> — [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory)

#### Recursive Loading Behavior

Claude Code reads CLAUDE.md files recursively:
- Starts in current working directory
- Recurses upward to (but not including) root directory `/`
- Also lazy-loads CLAUDE.md files from subdirectories when accessing files there

**Example**: Working in `foo/bar/`, Claude loads:
- `foo/bar/CLAUDE.md`
- `foo/CLAUDE.md`
- `~/.claude/CLAUDE.md`
- Enterprise policy files

This hierarchical loading is **unique to Claude Code** and provides layered context that AGENTS.md implementations do not offer.

#### Import Syntax

CLAUDE.md supports native imports:
```markdown
See @README for project overview and @package.json for available npm commands.

# Git Workflow
@docs/git-instructions.md

# Personal Preferences
@~/.claude/my-project-instructions.md
```

Features:
- Relative and absolute path support
- Recursive imports (max depth: 5)
- Imports ignored inside code blocks

#### Path-Specific Conditional Rules

CLAUDE.md supports YAML frontmatter for conditional loading:
```yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/**/*.{ts,tsx}"
---
# API Development Rules
- All API endpoints must include input validation
```

This scoped rule system is a Claude Code-specific feature.

### Why This Matters

AGENTS.md reads **only the nearest file** (typically in current directory or repository root), while Claude Code's CLAUDE.md **merges contexts upward** from the directory tree. For complex monorepos with different conventions per subdirectory, CLAUDE.md offers superior organization.

---

## Claim 2: "The best approach is often to create a symlink (ln -s AGENTS.md CLAUDE.md) or reference AGENTS.md within CLAUDE.md (@AGENTS.md) to support both"

### Verdict: **SUBSTANTIATED**

### Evidence

#### Community Consensus

This approach is documented in:
1. [GitHub Issue #6235](https://github.com/anthropics/claude-code/issues/6235) - 1,955+ reactions requesting AGENTS.md support
2. Multiple community workarounds adopted while awaiting official support
3. Major project maintainers (including Apache Superset) using this pattern

#### Method 1: Symlink Approach

```bash
ln -s AGENTS.md CLAUDE.md
```

**Benefits**:
- Claude Code follows symlinks transparently
- No content duplication
- Update AGENTS.md once, all tools see changes
- Git-clean (CLAUDE.md symlink points to tracked AGENTS.md)

**Confirmed behavior**:
> "Claude Code follows symlinks transparently, reading and editing the target files directly. When you reference a symlink in your project, Claude operates on the actual file it points to."
> — [ClaudeLog Documentation](https://claudelog.com/faqs/claude-md-agents-md-symlink/)

**Migration command**:
```bash
mv CLAUDE.md AGENTS.md && ln -s AGENTS.md CLAUDE.md
```

#### Method 2: Reference/Import Approach

Create a minimal `CLAUDE.md`:
```markdown
@AGENTS.md
```

Or with additional Claude-specific content:
```markdown
# Project Instructions
Strictly follow the rules in ./AGENTS.md

# Claude-Specific Extensions
- Use Claude's sub-agent system for complex refactoring
- Prefer MCP servers for external tool integration
```

**Benefits**:
- Allows Claude-specific additions
- Works with Claude's import syntax
- Maintains single source of truth

#### Method 3: Hooks Approach (Advanced)

For automated injection via Claude Code's session hooks:
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "hooks": [{
        "type": "command",
        "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/append_agentsmd_context.sh"
      }]
    }]
  }
}
```

### Tool Support Landscape

| Tool | AGENTS.md Support | CLAUDE.md Support |
|------|-------------------|-------------------|
| Claude Code | Not native (Issue #6235 open) | Native |
| Cursor | Yes | Via symlink |
| Codex (OpenAI) | Yes | Via symlink |
| Amp (Sourcegraph) | Yes | Via symlink |
| Builder.io | Yes | Via symlink |
| Roo Code | Yes | Via symlink |
| Gemini | Partial | Via symlink |

### Recommendation

For projects needing multi-tool support:

1. **Single source of truth**: Maintain `AGENTS.md` as canonical
2. **Claude compatibility**: Either:
   - `ln -s AGENTS.md CLAUDE.md` (simplest)
   - Create `CLAUDE.md` containing only `@AGENTS.md`
3. **Claude-specific features**: If needed, add them to `CLAUDE.md` after the import

---

## Trade-offs and Considerations

### When to Use CLAUDE.md Exclusively

- Project only uses Claude Code
- Need hierarchical memory with directory layering
- Using Claude-specific features (sub-agents, MCP servers, custom slash commands)
- Enterprise environment requiring policy-level defaults

### When to Use AGENTS.md with Symlink/Reference

- Team uses multiple AI coding tools
- Contributing to open-source (20,000+ projects use AGENTS.md)
- Want vendor-neutral configuration
- Prefer standardization over tool-specific features

### Potential Issues

1. **Context Duplication**: If both files exist with overlapping content, tokens are wasted
2. **Priority Conflicts**: Claude's recursive loading may cause unexpected layering
3. **Feature Parity**: AGENTS.md doesn't support Claude's conditional path-based rules

---

## References

### Primary Sources
- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory)
- [GitHub Issue #6235 - Support AGENTS.md](https://github.com/anthropics/claude-code/issues/6235)
- [Anthropic Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Community Documentation
- [ClaudeLog FAQ: CLAUDE.md to AGENTS.md Symlink](https://claudelog.com/faqs/claude-md-agents-md-symlink/)
- [Builder.io: Improve AI Code Output with AGENTS.md](https://www.builder.io/blog/agents-md)
- [AGENTS.md Migration Guide](https://solmaz.io/log/2025/09/08/claude-md-agents-md-migration-guide/)
- [Kaushik Gopal: Keep AGENTS.md in Sync](https://kau.sh/blog/agents-md/)

### Standards and Specifications
- [AGENTS.md Standard](https://pnote.eu/notes/agents-md/)
- [Complete Guide to AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md)
- [Tessl: AGENTS.md Open Standard](https://tessl.io/blog/the-rise-of-agents-md-an-open-standard-and-single-source-of-truth-for-ai-coding-agents/)

### Discussion Threads
- [Reddit: How CLAUDE.md and AGENTS.md Actually Work](https://www.reddit.com/r/vibecoding/comments/1psarnb/how_claudemd_and_agentsmd_actually_work_and_why/)
- [Reddit: AGENTS.md vs CLAUDE.md](https://www.reddit.com/r/GithubCopilot/comments/1nee01w/agentsmd_vs_claudemd/)
- [HumanLayer Blog: Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

---

## Conclusion

Both claims are substantiated:

1. **CLAUDE.md provides native, prioritized memory** through a 4-level hierarchical system with recursive loading, import syntax, and conditional rules — features unique to Claude Code.

2. **Symlinks and references are the recommended bridge** between CLAUDE.md and AGENTS.md, with strong community adoption (1,955+ reactions on GitHub), multiple documented approaches, and transparent symlink handling by Claude Code.

The optimal strategy depends on your tooling ecosystem. For Claude-exclusive workflows, leverage CLAUDE.md's full feature set. For multi-tool environments, use AGENTS.md as the source of truth with a symlink or import reference for Claude compatibility.
