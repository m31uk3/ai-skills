# Monorepo vs Polyrepo: Agentic Coding Dynamics

This research examines the growing trend toward monorepos, specifically in the context of agentic coding dynamics and maximizing the benefits of CLAUDE.md and AGENTS.md hierarchical features.

## Executive Summary

The 2025-2026 consensus is that **monorepos are regaining ground**, driven significantly by **AI coding agent integration**. The key insight is that monorepos reduce the "coordination tax" across repositories while AI tooling helps offset the traditional "complexity tax" within the codebase.

For agentic coding specifically, monorepos provide:
1. **Unified context access** - AI agents can navigate all code without repository switching
2. **Atomic cross-project changes** - Single PRs span frontend, backend, and infrastructure
3. **Hierarchical memory alignment** - CLAUDE.md's recursive loading maps naturally to monorepo structure
4. **Path-specific rules** - Different conventions for different parts of the codebase

---

## Key Terminology

| Term | Definition |
|------|------------|
| **Monolith** | Software architecture: single, tightly-coupled application deployed as one unit |
| **Monorepo** | Source control strategy: multiple independent projects in one repository, built/deployed separately |
| **Polyrepo** | Source control strategy: each service/component in its own repository |
| **Agentic Coding** | AI-assisted development where agents autonomously navigate codebases and execute multi-step tasks |

> "A monolith is about how the application is built, while a monorepo is about how the code is organized. You can have a monolith inside a monorepo, microservices in a monorepo, or microservices in polyrepos."

---

## Part 1: Arguments FOR Monorepos

### 1.1 Agentic AI Benefits

#### Unified Context Access
> "LLMs rely entirely on provided context. Monorepos have all code in one place... The agent can access backend, frontend, and infrastructure code without switching between repositories, while subtree separation keeps unrelated files from cluttering its working memory."
> — [Monorepo Tools: AI](https://monorepo.tools/ai)

AI agents operating in monorepos can:
- Traverse dependencies without authentication boundaries
- Understand cross-service impacts of changes
- Perform codebase-wide refactoring in single sessions

#### Atomic Cross-Project Changes
> "Monorepos enable powerful agentic AI workflows that are nearly impossible across distributed repositories. AI agents can perform atomic cross-project changes as single pull requests with full testing and review."
> — [Nx Blog](https://nx.dev/blog/nx-and-ai-why-they-work-together)

This is critical for:
- API contract changes (backend + frontend simultaneously)
- Shared library updates with dependent services
- Cross-cutting concerns like authentication or logging

#### Expanded "Reliable Transformations"
> "Agentic coding assistants significantly expand the range of 'reliable transformations' that can be done quickly, turning what were before long refactorings into minutes-long tasks. With this, the delta between what you can do in a monorepo compared to a polyrepo gets substantially more significant."
> — [Nx Blog](https://nx.dev/blog/nx-and-ai-why-they-work-together)

### 1.2 CLAUDE.md Hierarchical Memory Alignment

Claude Code's memory system is **purpose-built for monorepo structures**:

```
project-root/
├── CLAUDE.md                    # Loaded at launch (global conventions)
├── .claude/
│   └── rules/
│       ├── frontend/
│       │   ├── react.md         # paths: src/frontend/**/*.tsx
│       │   └── styles.md        # paths: **/*.css
│       └── backend/
│           ├── api.md           # paths: src/api/**/*.ts
│           └── database.md      # paths: **/migrations/**
├── packages/
│   ├── frontend/
│   │   └── CLAUDE.md            # Lazy-loaded when working here
│   └── backend/
│       └── CLAUDE.md            # Lazy-loaded when working here
└── services/
    └── auth/
        └── CLAUDE.md            # Lazy-loaded when working here
```

**Key Features**:

1. **Recursive Loading**: Claude reads CLAUDE.md files upward from cwd to root, merging contexts
2. **Lazy Subtree Loading**: Subdirectory CLAUDE.md files load only when accessing that area
3. **Path-Specific Rules**: YAML frontmatter scopes rules to file patterns:

```yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/**/*.controller.ts"
---
# API Development Rules
- All endpoints must validate input
- Use response DTOs, not raw entities
```

> "One developer reduced CLAUDE.md from 47k → 9k words by splitting context across frontend, backend, and core services."
> — [DEV Community](https://dev.to/anvodev/how-i-organized-my-claudemd-in-a-monorepo-with-too-many-contexts-37k7)

### 1.3 AGENTS.md Adoption

AGENTS.md provides a tool-agnostic standard that benefits monorepos:

> "As of 2025, over 20,000 open-source projects on GitHub have adopted AGENTS.md and major AI coding tools (OpenAI's Codex/Copilot, Google's Gemini/Jules, Cursor, Factory Droid, Aider, RooCode, etc.) all support reading it."
> — [AI Plain English](https://ai.plainenglish.io/agents-md-a-comprehensive-guide-to-agentic-ai-collaboration-571df0e78ccc)

Mercari's case study demonstrates the value:
> "AGENTS.md helped Mercari onboard engineers faster, reducing the amount of boilerplate they need to feed into prompts to create quality outputs, and creating a workflow for automatically updating documentation in their Web Monorepo."
> — [Mercari Engineering](https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/)

### 1.4 Enterprise Adoption at Scale

| Company | Monorepo Size | Tooling | Key Benefit |
|---------|---------------|---------|-------------|
| **Google** | 80+ TB, billions of LOC | Piper (custom), Bazel | Atomic changes, code sharing |
| **Meta** | Massive (exact size undisclosed) | Sapling, Buck | Unified collaboration |
| **Microsoft** | Windows repo: 300GB | VFS for Git | Unified tooling |
| **Uber** | 4,000+ microservices | Custom tooling | Simplified dependencies |

> "Google's monorepo is centralized and shared with more than 25,000 developers. In a typical week in 2015, approximately 15 million lines and 250,000 files were subject to change."
> — [QE Unit](https://qeunit.com/blog/how-google-does-monorepo/)

### 1.5 AI Offsetting Complexity Costs

> "Monorepos come with complexity costs that make people hesitant to adopt them. AI helps offset this complexity, making monorepo adoption much easier. AI can perform maintenance refactorings like removing dead code, updating deprecated patterns, and cleaning up tech debt."
> — [Nx Blog](https://nx.dev/blog/nx-and-ai-why-they-work-together)

Specific AI-assisted tasks:
- Dead code elimination across packages
- Dependency version alignment
- Pattern migration (e.g., callbacks → async/await)
- Documentation generation with full context

### 1.6 2026 Prediction

> "Agentic workflows are becoming increasingly common and need reliable context and predictable project structure. Open standards like AGENTS.md are explicitly intended to provide 'project-specific instructions and context' to agents. A monorepo can make that simpler: one canonical set of agent instructions and conventions at the top level, with clear subdirectories, ownership, and intent."
> — [Spectro Cloud](https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo) (January 2026)

---

## Part 2: Arguments AGAINST Monorepos

### 2.1 Git Performance at Scale

> "Basic Git commands like `git status` or `git checkout`, which usually take milliseconds in smaller repos, can grind to a halt. At Twitter, for example, the introduction of a git-based monorepo caused significant performance issues and led to simple commands taking minutes to complete."
> — [Depot](https://depot.dev/blog/monorepos-worth-the-hype)

| Scale | Issue | Mitigation |
|-------|-------|------------|
| 10GB+ | Clone times measured in hours | Shallow clones, sparse checkout |
| 50GB+ | IDE indexing fails | Partial checkouts, custom tooling |
| 100GB+ | Git operations timeout | Custom VCS (Google's Piper, Meta's Sapling) |

### 2.2 CI/CD Complexity

> "Every commit to your monorepo can trigger every CI job. Change a README in the documentation folder? That's 45 minutes of backend tests, frontend builds, and integration suites you get to patiently wait for."
> — [CircleCI](https://circleci.com/blog/monorepo-dev-practices/)

Required investments:
- Dependency graph analysis (Nx, Bazel, Pants)
- Affected-based testing
- Distributed build caching
- Custom merge queue management

### 2.3 Coupling and Dependency Problems

> "Monorepos make development faster, but also make it easier to create the kind of tangled dependencies that turn codebases into unmaintainable nightmares."
> — [CircleCI](https://circleci.com/blog/monorepo-dev-practices/)

Risks include:
- Leaky abstractions across packages
- Undeclared internal dependencies
- "Convenience coupling" that violates module boundaries

### 2.4 Security and Access Control

> "A breach in the monorepo can potentially expose the entire codebase."
> — [Aviator](https://www.aviator.co/blog/monorepo-vs-polyrepo/)

Challenges:
- Granular access control is harder to implement
- CODEOWNERS files become complex
- Compliance requirements may mandate separation
- Secret management across teams

### 2.5 Team Autonomy Trade-offs

> "Teams can manage their own release cycles and tooling. Smaller repos are faster to clone and build, and it's easier to restrict access to sensitive projects."
> — [Buildkite](https://buildkite.com/resources/blog/monorepo-polyrepo-choosing/)

Polyrepo strengths:
- Independent deployment schedules
- Technology diversity per service
- Clear ownership boundaries
- Simpler onboarding for new team members

### 2.6 Merge Conflicts at Scale

> "In a polyrepo, the backend team merges their API changes, the frontend team handles theirs separately. In a monorepo, both teams are competing for the same merge queue, forcing you to resolve conflicts in code you've never seen."
> — [Buildkite](https://buildkite.com/resources/blog/monorepo-polyrepo-choosing/)

---

## Part 3: Agentic Coding Limitations

### 3.1 The "Cold Start" Problem

> "Every session is a cold start, with no accumulated context and no persistence of what they've already discovered. Every time you reset the context or start a new session, you're working with another brand new hire."
> — [Pete Hodgson](https://blog.thepete.net/blog/2025/05/22/why-your-ai-coding-assistant-keeps-doing-it-wrong-and-how-to-fix-it/)

Impact on repository strategy:
- Monorepos benefit because all context is discoverable
- But polyrepos suffer more since agents can't traverse repository boundaries

### 3.2 Context Window Exhaustion

> "Today's prevailing wisdom treats the context window as a precious resource: it's consumed not only by the user's conversation, but also by the system prompt, tool descriptions, and instruction files like AGENTS.md."
> — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

Mitigation strategies:
- **Compaction**: Summarizing conversation history
- **Just-in-time retrieval**: Load files only when needed
- **Path-specific rules**: Only load relevant CLAUDE.md rules

### 3.3 Navigation in Large Codebases

> "Agents are forced to operate from fragments, extrapolating outward. That brittle strategy collapses under the weight of large, messy systems. This is the root cause: not a lack of raw capability, but the absence of familiarity."
> — [DevRamp](https://www.devramp.io/blog/why-ai-agents-stumble-in-large-complex-codebases/)

Why monorepos help despite this:
- Consistent file structure across packages
- Unified tooling (same build, test, lint commands)
- AGENTS.md/CLAUDE.md provides "aerial view"

---

## Part 4: Maximizing CLAUDE.md/AGENTS.md for Monorepos

### 4.1 Recommended Structure

```
monorepo/
├── CLAUDE.md                    # Global: company conventions, tone, formatting
├── AGENTS.md                    # Symlink or import: @CLAUDE.md
├── .claude/
│   ├── CLAUDE.md               # Optional: detailed project context
│   └── rules/
│       ├── 00-universal.md     # Always loaded
│       ├── 01-backend.md       # paths: packages/backend/**/*
│       ├── 02-frontend.md      # paths: packages/frontend/**/*
│       └── 03-infrastructure.md # paths: infra/**/*
├── packages/
│   ├── frontend/
│   │   └── CLAUDE.md           # React conventions, state management
│   ├── backend/
│   │   └── CLAUDE.md           # API design, database patterns
│   └── shared/
│       └── CLAUDE.md           # Shared types, validation rules
└── docs/
    └── architecture.md         # Reference: @docs/architecture.md
```

### 4.2 Path-Specific Rules Example

**`.claude/rules/01-backend.md`**:
```yaml
---
paths:
  - "packages/backend/**/*.ts"
  - "packages/api/**/*.ts"
---
# Backend Development Rules

## API Design
- Use DTOs for all request/response bodies
- Validate input at controller level
- Never expose database entities directly

## Database
- All migrations must be reversible
- Use transactions for multi-table operations

## Testing
- Unit tests alongside source files: `*.spec.ts`
- Integration tests in `__tests__/` directory
```

**`.claude/rules/02-frontend.md`**:
```yaml
---
paths:
  - "packages/frontend/**/*.tsx"
  - "packages/web/**/*.tsx"
---
# Frontend Development Rules

## React Patterns
- Functional components with hooks only
- Co-locate styles with components
- Use React Query for server state

## State Management
- Local state: useState/useReducer
- Global state: Zustand stores in /stores
```

### 4.3 Import Patterns

**Root `CLAUDE.md`**:
```markdown
# Company: Acme Corp

## Core Principles
- Write tests for all new functionality
- Document public APIs

## Architecture
@docs/architecture.md

## Git Workflow
@docs/git-workflow.md

## Package-Specific Guides
- Frontend: @packages/frontend/CLAUDE.md
- Backend: @packages/backend/CLAUDE.md
```

### 4.4 Multi-Tool Compatibility

For teams using multiple AI coding tools:

```bash
# Option 1: AGENTS.md as source of truth
ln -s AGENTS.md CLAUDE.md

# Option 2: CLAUDE.md imports AGENTS.md
echo "@AGENTS.md" > CLAUDE.md
```

Both approaches ensure consistency across:
- Claude Code (native CLAUDE.md support)
- Cursor (AGENTS.md support)
- Codex (AGENTS.md support)
- Gemini (AGENTS.md support)

---

## Part 5: Decision Framework

### 5.1 When to Choose Monorepo

| Factor | Recommendation |
|--------|----------------|
| Heavy AI agent usage | **Monorepo** - unified context access |
| Shared libraries between services | **Monorepo** - atomic updates |
| Cross-cutting refactoring needed | **Monorepo** - single PR spans all |
| Single deployment cadence | **Monorepo** - simplified versioning |
| Claude Code as primary tool | **Monorepo** - leverages hierarchical CLAUDE.md |

### 5.2 When to Choose Polyrepo

| Factor | Recommendation |
|--------|----------------|
| Teams need full autonomy | **Polyrepo** - independent cycles |
| Different tech stacks per service | **Polyrepo** - flexibility |
| Strict access control requirements | **Polyrepo** - granular permissions |
| External contractors on specific modules | **Polyrepo** - isolation |
| Services with vastly different lifecycles | **Polyrepo** - independent releases |

### 5.3 Hybrid Approach

Many enterprises adopt a middle ground:

```
organization/
├── monorepo-core/           # Shared libraries, common services
│   ├── CLAUDE.md
│   └── packages/
├── service-payments/        # Isolated for compliance
│   └── AGENTS.md
└── service-ml/              # Different tech stack (Python)
    └── AGENTS.md
```

> "Many enterprises now adopt a hybrid approach, using monorepos for frontend and shared libraries, while maintaining polyrepos for core backend microservices."
> — [Aviator](https://www.aviator.co/blog/monorepo-vs-polyrepo/)

---

## Part 6: The 2025 Consensus

> "The prevailing 2025 consensus is that 'the right answer isn't ideology—it's workload shape, team topology, and the tools you can actually operate.'"
> — [DEV Community](https://dev.to/md-afsar-mahmud/monorepo-vs-polyrepo-which-one-should-you-choose-in-2025-g77)

### Key Insights

1. **AI changes the calculus**: Agentic coding makes monorepo complexity more manageable while amplifying monorepo benefits

2. **Tooling has matured**: Nx, Turborepo, Bazel, and Pants solve many historical pain points

3. **Context is king**: For AI agents, unified context access is a decisive advantage

4. **Standards are emerging**: AGENTS.md (20,000+ projects) and CLAUDE.md hierarchies provide structured guidance

5. **The complexity tax moves**: Monorepos pay in codebase complexity; polyrepos pay in coordination complexity. AI reduces the first more than the second.

---

## References

### Monorepo vs Polyrepo Analysis
- [DEV Community: Monorepo vs Polyrepo 2025](https://dev.to/md-afsar-mahmud/monorepo-vs-polyrepo-which-one-should-you-choose-in-2025-g77)
- [Aviator: Monorepo vs Polyrepo](https://www.aviator.co/blog/monorepo-vs-polyrepo/)
- [Buildkite: Choosing Between Them](https://buildkite.com/resources/blog/monorepo-polyrepo-choosing/)
- [Graphite: Monorepo Guide](https://graphite.com/guides/monorepo-vs-polyrepo-pros-cons-tools)

### AI and Monorepos
- [Nx Blog: Nx and AI](https://nx.dev/blog/nx-and-ai-why-they-work-together)
- [Monorepo Tools: AI](https://monorepo.tools/ai)
- [Spectro Cloud: 2026 Year of Monorepo](https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo)
- [Mercari Engineering: Taming Agents](https://engineering.mercari.com/en/blog/entry/20251030-taming-agents-in-the-mercari-web-monorepo/)

### Agentic Coding Dynamics
- [Anthropic: Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [DevRamp: Why AI Agents Stumble](https://www.devramp.io/blog/why-ai-agents-stumble-in-large-complex-codebases/)
- [Pete Hodgson: AI Coding Assistant Mistakes](https://blog.thepete.net/blog/2025/05/22/why-your-ai-coding-assistant-keeps-doing-it-wrong-and-how-to-fix-it/)
- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### CLAUDE.md and AGENTS.md
- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory)
- [DEV Community: CLAUDE.md in Monorepo](https://dev.to/anvodev/how-i-organized-my-claudemd-in-a-monorepo-with-too-many-contexts-37k7)
- [Claude Fast: Rules Directory](https://claudefa.st/blog/guide/mechanics/rules-directory)
- [AI Plain English: AGENTS.md Guide](https://ai.plainenglish.io/agents-md-a-comprehensive-guide-to-agentic-ai-collaboration-571df0e78ccc)

### Enterprise Scale
- [QE Unit: How Google Does Monorepo](https://qeunit.com/blog/how-google-does-monorepo/)
- [Dan Luu: Advantages of Monorepos](https://danluu.com/monorepo/)
- [Graphite: Why Top Tech Companies Use Monorepos](https://graphite.com/guides/why-top-tech-companies-are-moving-to-monorepos)

### Challenges and Limitations
- [Depot: Monorepos Worth the Hype?](https://depot.dev/blog/monorepos-worth-the-hype)
- [CircleCI: Monorepo Development Practices](https://circleci.com/blog/monorepo-dev-practices/)
- [InfoWorld: The Case Against Monorepos](https://www.infoworld.com/article/2270672/the-case-against-monorepos.html)
- [Digma: 10 Common Monorepo Problems](https://digma.ai/10-common-problems-of-working-with-a-monorepo/)

---

## Conclusion

The growing trend toward monorepos is **substantiated**, particularly in the context of agentic coding:

**FOR Monorepos**:
- AI agents gain unified context access and can perform atomic cross-project changes
- CLAUDE.md's hierarchical memory system is purpose-built for monorepo structures
- Path-specific rules enable context-aware guidance per package
- 78% of developers use AI tools (Stack Overflow 2025), amplifying monorepo benefits

**AGAINST Monorepos**:
- Git performance degrades at scale (requires custom tooling)
- CI/CD complexity increases without proper dependency analysis
- Team autonomy and access control are harder to implement
- Coupling risks increase without strict boundaries

**The Bottom Line**:
> "The decision should be driven by organizational maturity, team structure, and long-term scalability goals rather than trends alone."

For teams heavily invested in agentic coding workflows with Claude Code, monorepos offer a clear structural advantage through hierarchical CLAUDE.md support and unified context access. The key is investing in proper tooling (Nx, Bazel, Turborepo) to offset complexity costs.
