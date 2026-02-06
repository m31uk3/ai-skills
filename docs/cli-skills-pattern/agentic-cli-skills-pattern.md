# The Agentic CLI Skills Pattern

## Abstracting and Sandboxing Capabilities for AI Agents

*Research Date: 2026-02-06*
*References: [.sop/research/references.md](.sop/research/references.md)*

---

## Executive Summary

A design pattern has emerged across the AI agent ecosystem that fundamentally changes how agents acquire and exercise capabilities. Instead of hardcoding tool integrations or relying on monolithic prompts, **the agentic CLI skills pattern** packages domain expertise into filesystem-based modules that agents discover, load, and execute on demand---with sandboxing enforced at the OS level.

This document maps the pattern's architecture, traces its independent emergence across Anthropic (Agent Skills), Pydantic (Monty), OpenAI (Codex Skills), and others, and provides a **stages diagram** showing the spectrum of agentic capability from raw CLI commands through fully orchestrated agent workflows.

The pattern is investable not as a single product but as an **infrastructure layer**---the equivalent of package managers, containerization, and CI/CD pipelines for the agent era.

---

## 1. The Pattern

### 1.1 Core Insight

The central insight is a separation of concerns applied to AI agent capabilities:

| Concern | Mechanism | Controls |
|---------|-----------|----------|
| **What the agent knows** | SKILL.md instructions | Domain knowledge, workflows, best practices |
| **What the agent can do** | Scripts, CLI tools, MCP servers | Executable capabilities |
| **What the agent cannot do** | Sandbox runtime | Filesystem, network, resource limits |
| **How the agent discovers** | YAML frontmatter metadata | Progressive disclosure at startup |

These four concerns are **independently composable**. A skill can exist without a sandbox. A sandbox can restrict agents without skills. MCP servers can expose tools without either. But the full pattern combines all four into a layered architecture where each layer reinforces the others.

### 1.2 The Filesystem-First Principle

Every major implementation converges on **the filesystem as the universal interface**:

- **Anthropic Agent Skills**: Directories with `SKILL.md` + optional resources
- **OpenAI Codex Skills**: Same `SKILL.md` format (adopted Dec 2025)
- **Claude Code**: Skills as directories in `.claude/skills/` or `~/.claude/skills/`
- **Pydantic Monty**: Code as strings passed to a Rust interpreter (filesystem-adjacent)

The filesystem is the right abstraction because:
1. It's **universal**: every OS, every language, every CI system understands files
2. It's **composable**: skills are directories that can be nested, symlinked, version-controlled
3. It's **inspectable**: humans can read SKILL.md; no special tooling required
4. It's **progressive**: agents can `ls` to discover, `cat` to read, `bash` to execute

### 1.3 Progressive Disclosure

The defining architectural pattern is **progressive disclosure**---loading information in stages to manage context as a finite resource:

```
                    CONTEXT COST
                        |
                        |   Level 3+: Resources
                        |   (scripts, schemas, templates)
                        |   Loaded: as referenced
                        |   Cost: unlimited but only output
                        |         enters context
                        |
                        |   Level 2: Instructions
                        |   (SKILL.md body)
                        |   Loaded: when skill triggered
                        |   Cost: <5k tokens typical
                        |
                        |   Level 1: Metadata
                        |   (YAML frontmatter)
                        |   Loaded: always (at startup)
                        |   Cost: ~100 tokens per skill
                    ----+---------------------------------->
                        0     SKILLS INSTALLED
                              (can be hundreds)
```

This mirrors how humans use reference material: scan the table of contents (metadata), read the relevant chapter (instructions), consult the appendix only when needed (resources).

---

## 2. The Stages Diagram: Spectrum of Agentic Capabilities

This diagram maps the full spectrum from simplest to most complex, showing how each stage builds on the previous and what criteria differentiate them.

```
STAGES OF AGENTIC CAPABILITY
============================================================

STAGE 0: RAW CLI COMMANDS
------------------------------------------------------------
  Examples:   git, npm, python, curl, grep, sed
  Discovery:  --help, man pages
  Isolation:  None
  Format:     Binary executables + man pages
  Agent Use:  Direct bash invocation
  Criterion:  "I already know how to use this tool"
              The agent must have seen it in training data

        |
        |  + structured instructions
        v

STAGE 1: SHELL/PYTHON SCRIPTS
------------------------------------------------------------
  Examples:   validate.sh, fill_form.py, deploy.sh
  Discovery:  Filename convention, referenced in SKILL.md
  Isolation:  None (inherits caller's permissions)
  Format:     Executable scripts (.sh, .py, .js)
  Agent Use:  bash scripts/validate.sh → output only
  Criterion:  "Deterministic operation, packaged for reuse"
              Script code never enters context window
              Only output is consumed

        |
        |  + metadata + progressive disclosure
        v

STAGE 2: AGENT SKILLS (SKILL.md)
------------------------------------------------------------
  Examples:   pdf-processing, code-review, data-pipeline
  Discovery:  YAML frontmatter scanned at startup
  Isolation:  None inherent (shared process)
  Format:     SKILL.md + optional scripts/resources dirs
  Agent Use:  Auto-triggered by matching description
  Criterion:  "Domain knowledge + workflow, loaded on demand"
              Cross-platform standard (Claude, Codex,
              Cursor, Copilot, Gemini CLI, Goose)

  Structure:
  ┌─────────────────────────────────┐
  │  skill-name/                    │
  │  ├── SKILL.md                   │ ← Required
  │  │   ├── YAML frontmatter      │ ← Level 1 (always)
  │  │   └── Markdown body          │ ← Level 2 (on trigger)
  │  ├── scripts/                   │ ← Level 3 (as needed)
  │  ├── references/                │ ← Level 3 (as needed)
  │  └── assets/                    │ ← Level 3 (as needed)
  └─────────────────────────────────┘

        |
        |  + dedicated binary + structured interface
        v

STAGE 3: CLI TOOLS WITH MAN PAGES
------------------------------------------------------------
  Examples:   pydantic-monty, gh, docker, terraform
  Discovery:  --help, man pages, shell completions
  Isolation:  Varies (Monty: built-in; others: none)
  Format:     Compiled binary or installed package
  Agent Use:  Invoked via bash with flags/args
  Criterion:  "Opinionated tool with structured I/O"
              More rigid interface than scripts
              Richer capabilities than SKILL.md alone

  Case Study - Pydantic Monty:
  ┌─────────────────────────────────────────────┐
  │  RESTRICTED PYTHON INTERPRETER              │
  │  ┌────────────────────────────────────────┐  │
  │  │  LLM-generated Python code             │  │
  │  │  ┌──────────────────────────┐          │  │
  │  │  │  call_tool("search", q)  │──────────│──│──→ External
  │  │  │  call_tool("write", d)   │  Only    │  │    Functions
  │  │  └──────────────────────────┘  approved │  │    (developer-
  │  │                                funcs    │  │     controlled)
  │  └────────────────────────────────────────┘  │
  │  No filesystem | No network | No env vars    │
  │  Startup: <1μs | Runtime: ~CPython           │
  └─────────────────────────────────────────────┘

  Python is ORTHOGONAL to all stages:
  - Stage 0: python as CLI command
  - Stage 1: python scripts inside skills
  - Stage 2: python referenced in SKILL.md instructions
  - Stage 3: Monty as restricted Python interpreter
  - Stage 4: python MCP servers
  - Stage 5: python orchestrating multi-agent workflows

        |
        |  + protocol standardization + process isolation
        v

STAGE 4: MCP SERVERS (Model Context Protocol)
------------------------------------------------------------
  Examples:   GitHub MCP, Stripe MCP, database connectors
  Discovery:  Protocol-defined tool listing
  Isolation:  Process-level (each server = separate process)
  Format:     JSON-RPC over stdio/SSE
  Agent Use:  Structured tool calls via protocol
  Criterion:  "External integration with credential scoping"
              Formal protocol (not just convention)
              Network-capable for external APIs
              Process isolation per server

  Architecture:
  ┌──────────────┐     JSON-RPC      ┌──────────────┐
  │  AI Agent     │ ◄──────────────► │  MCP Server   │
  │  (host)       │   stdio/SSE      │  (separate    │
  │               │                   │   process)    │
  │  - discovers  │                   │  - scoped     │
  │    tools      │                   │    credentials│
  │  - calls      │                   │  - tools      │
  │    functions   │                   │  - resources  │
  └──────────────┘                   └──────────────┘

        |
        |  + sandbox boundaries + orchestration
        v

STAGE 5: SANDBOXED AGENT WORKFLOWS
------------------------------------------------------------
  Examples:   Claude Code + sandbox, E2B agent tasks,
              Kubernetes agent-sandbox, Deep Agents
  Discovery:  Composite (skills + MCP + sandbox config)
  Isolation:  OS-level (filesystem + network + resources)
  Format:     Orchestration config + skills + MCP + sandbox
  Agent Use:  Autonomous multi-step execution within bounds
  Criterion:  "Full autonomy within enforced boundaries"
              Human-in-the-loop at decision points
              Checkpoint/resume across sessions
              Observable and measurable

  The Full Stack:
  ┌─────────────────────────────────────────────┐
  │             AGENT ORCHESTRATOR              │
  │  ┌───────────────────────────────────────┐  │
  │  │         SANDBOX BOUNDARY              │  │
  │  │  ┌─────────┐ ┌──────┐ ┌───────────┐  │  │
  │  │  │ Skills  │ │ CLI  │ │ Scripts   │  │  │
  │  │  │ (*.md)  │ │tools │ │ (*.py/sh) │  │  │
  │  │  └────┬────┘ └──┬───┘ └─────┬─────┘  │  │
  │  │       └─────────┼───────────┘         │  │
  │  │                 │                      │  │
  │  │           ┌─────┴──────┐               │  │
  │  │           │ Bash/Shell │               │  │
  │  │           │ (sandboxed)│               │  │
  │  │           └────────────┘               │  │
  │  │  Filesystem: CWD only | Network: deny │  │
  │  └───────────────────────────────────────┘  │
  │                     │                       │
  │              ┌──────┴───────┐                │
  │              │  MCP Servers │ (external)     │
  │              │  (separate   │                │
  │              │   processes) │                │
  │              └──────────────┘                │
  │                                             │
  │  Human checkpoints ←→ Agent autonomy        │
  └─────────────────────────────────────────────┘

============================================================
```

### 2.1 Stage Criteria Matrix

| Stage | Discovery | Isolation | Format | Composability | Portability |
|-------|-----------|-----------|--------|---------------|-------------|
| 0: CLI Commands | `--help`/`man` | None | Binary | Low | OS-dependent |
| 1: Scripts | Filename | None | `.sh`/`.py` | Medium | Language-dependent |
| 2: Skills | YAML metadata | None | SKILL.md standard | High | Cross-platform |
| 3: CLI Tools | `--help` + docs | Varies | Binary + docs | Medium | Package-dependent |
| 4: MCP Servers | Protocol listing | Process-level | JSON-RPC | High | Protocol-standard |
| 5: Sandboxed Workflows | Composite | OS-level | Orchestration | Highest | Platform-specific |

### 2.2 The Orthogonality of Python (and Other Languages)

Python deserves special attention because it is genuinely **orthogonal to all stages**:

```
PYTHON ACROSS THE STAGES
============================================================

  Stage 0:  $ python script.py
            (raw CLI command)

  Stage 1:  skills/my-skill/scripts/validate.py
            (deterministic script, output-only)

  Stage 2:  Referenced in SKILL.md as workflow step
            ("Run scripts/analyze.py to extract metrics")

  Stage 3:  Pydantic Monty: Python AS the sandboxed medium
            (restricted interpreter, <1μs startup)

  Stage 4:  MCP server written in Python
            (fastmcp, pydantic-ai)

  Stage 5:  Python orchestrating multi-agent workflows
            (LangChain, PydanticAI code-mode)

============================================================
```

The same is true (to varying degrees) for other Unix/Linux commands. `git`, `curl`, `jq`---these are Stage 0 capabilities that appear inside Stage 1 scripts, get referenced in Stage 2 skills, can be wrapped as Stage 3 tools, and operate within Stage 5 sandboxes. The stages describe **abstraction layers**, not replacements.

---

## 3. Implementation Deep Dives

### 3.1 Anthropic Agent Skills

**Architecture**: Filesystem-based, VM-backed, progressively disclosed.

The skill lifecycle:
1. **Install**: Place skill directory in `.claude/skills/` (project) or `~/.claude/skills/` (personal)
2. **Discover**: Agent scans YAML frontmatter at startup (~100 tokens per skill)
3. **Trigger**: User request matches skill description
4. **Load**: Agent reads SKILL.md via bash (Level 2, <5k tokens)
5. **Execute**: Agent follows instructions, reads referenced files, runs scripts
6. **Output**: Only script output enters context; code itself never loaded

**Key design decisions**:
- Metadata always loaded (enables "hundreds of skills without context penalty")
- Instructions lazy-loaded (only when relevant)
- Scripts executed, not loaded (only output consumes tokens)
- Same format works across Claude Code, Claude API, Claude.ai, Agent SDK

**Cross-platform adoption** (as of Feb 2026):
- Claude Code, OpenAI Codex CLI, Cursor, GitHub Copilot, Gemini CLI, Goose, Deep Agents

### 3.2 Pydantic Monty: The Interpreter as Sandbox

**Architecture**: Rust-compiled restricted Python interpreter with controlled external function interface.

Where other approaches sandbox the environment (restricting what a full Python runtime can access), Monty sandboxes the **language itself** (providing a restricted runtime where dangerous operations don't exist).

| Approach | Language | Startup | Isolation | Mechanism |
|----------|----------|---------|-----------|-----------|
| Docker | Full Python | ~195ms | Container | Process/namespace |
| E2B | Full Python | ~150ms | Firecracker microVM | Hardware virtualization |
| Pyodide | Full Python | ~2800ms | WASM | Browser sandbox |
| `exec()` | Full Python | <1ms | None | Dangerous |
| **Monty** | **Restricted Python** | **<1μs** | **Built-in** | **Language omission** |

**The external function pattern**:
```python
# Developer defines allowed functions
m = pydantic_monty.Monty(
    code=llm_generated_code,
    inputs=['user_query'],
    external_functions=['search_db', 'write_file', 'call_api']
)

# LLM code can only call these approved functions
# Everything else (filesystem, network, env) simply doesn't exist
```

**Snapshot/resume**: Execution state serializable to bytes, enabling:
- Pause at external function calls for host-side processing
- Fork execution for parallel exploration
- Persist state across process boundaries

### 3.3 Anthropic Sandbox Runtime

**Architecture**: OS-level enforcement without containers.

```
┌────────────────────────────────────────┐
│  Host OS                               │
│  ┌──────────────────────────────────┐  │
│  │  sandbox-runtime                 │  │
│  │  (bubblewrap on Linux,           │  │
│  │   Seatbelt on macOS)             │  │
│  │                                  │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │  Sandboxed Process         │  │  │
│  │  │  - Read: entire FS         │  │  │
│  │  │  - Write: CWD only         │  │  │
│  │  │  - Network: deny-all       │  │  │
│  │  │    (allow-listed domains   │  │  │
│  │  │     via proxy)             │  │  │
│  │  │  - Covers subprocesses     │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**Key properties**:
- No container required (no Docker, no VM)
- Uses native OS primitives (bubblewrap, Seatbelt)
- Covers all spawned subprocesses (not just direct calls)
- Network routed through proxy for domain allow-listing
- Open source: `@anthropic-ai/sandbox-runtime`
- Reduces permission prompts by 84%

### 3.4 The Broader Sandbox Ecosystem

| Platform | Isolation Tech | Startup | License | Focus |
|----------|---------------|---------|---------|-------|
| Anthropic sandbox-runtime | bubblewrap/Seatbelt | <1ms | Open source | Developer tools |
| E2B | Firecracker microVM | ~150ms | Apache-2.0 | Agent cloud |
| Daytona | Docker/Kata/Sysbox | 27-90ms | AGPL-3.0 | Raw performance |
| Modal | gVisor | Function-based | Proprietary | GPU + serverless |
| Pydantic Monty | Language restriction | <1μs | MIT | Interpreter-level |
| Kubernetes agent-sandbox | gVisor/Kata (pluggable) | Varies | Apache-2.0 | Enterprise scale |

---

## 4. Why This Pattern Matters

### 4.1 The Composability Thesis

The agentic CLI skills pattern isn't a single product---it's a **composable infrastructure layer**. Like how containerization (Docker) + orchestration (Kubernetes) + CI/CD (GitHub Actions) formed the modern DevOps stack, the agentic stack is forming as:

```
AGENTIC INFRASTRUCTURE STACK
============================================================

  ┌─────────────────────────────────────────┐
  │  ORCHESTRATION                          │
  │  (Agent SDK, PydanticAI, LangChain)     │
  ├─────────────────────────────────────────┤
  │  SKILLS LAYER                           │
  │  (SKILL.md standard, progressive        │
  │   disclosure, cross-platform)           │
  ├─────────────────────────────────────────┤
  │  PROTOCOL LAYER                         │
  │  (MCP: JSON-RPC, process isolation,     │
  │   credential scoping)                   │
  ├─────────────────────────────────────────┤
  │  SANDBOX LAYER                          │
  │  (OS-level, container, or interpreter   │
  │   restriction)                          │
  ├─────────────────────────────────────────┤
  │  RUNTIME                                │
  │  (CLI commands, Python, shell, Node.js) │
  └─────────────────────────────────────────┘

============================================================
```

Each layer is independently valuable and independently replaceable. You can use skills without MCP, MCP without sandboxing, sandboxing without skills. But the full stack, composed together, enables **safe autonomous agent operation at scale**.

### 4.2 Key Properties of the Pattern

1. **Filesystem-first**: Universal interface, no proprietary formats
2. **Progressive disclosure**: Context is a finite resource; load only what's needed
3. **Security by layers**: Skills (capabilities) + sandbox (restrictions) + MCP (scoping)
4. **Cross-platform standard**: Same SKILL.md works in Claude, Codex, Cursor, Copilot
5. **Language-orthogonal**: Python, shell, Rust, JavaScript all participate at every stage
6. **Human-in-the-loop compatible**: Checkpoints, approval gates, observable execution

### 4.3 The "More Agentic CLI Tooling, More Faster" Thesis

The pattern accelerates agent capability development because:

1. **Skills are cheap to create**: A markdown file with YAML frontmatter. No SDK, no compilation, no deployment pipeline. Write a `SKILL.md`, drop it in a directory, done.

2. **Skills compound**: Each skill makes the agent better at one thing, and skills compose. A code-review skill + a testing skill + a deployment skill = a CI/CD agent.

3. **CLI tools are the universal substrate**: Every existing Unix command, every Python package, every installed binary is immediately available as a Stage 0 capability. Skills layer domain knowledge on top.

4. **Sandboxing enables trust**: Without sandboxing, you have to approve every action. With sandboxing, you define boundaries once and let the agent operate autonomously within them. 84% fewer permission prompts.

5. **The standard is converging**: Claude Code, Codex, Cursor, Copilot, Gemini CLI, Goose---all support the same SKILL.md format. Write once, run everywhere.

### 4.4 What's Missing (Investment Opportunities)

The pattern is emerging but incomplete. Gaps include:

| Gap | Current State | Opportunity |
|-----|---------------|-------------|
| **Skills package manager** | skills.sh (early), GitHub repos | npm-for-skills: versioning, dependencies, registry |
| **Skills testing** | Manual | Automated skill validation, regression testing |
| **Skills observability** | Ad hoc logging | Structured telemetry for skill execution |
| **Cross-platform sandbox** | Platform-specific implementations | Universal sandbox runtime |
| **Skill composition** | Manual orchestration | Declarative skill pipelines |
| **Enterprise governance** | Per-user or per-org | Role-based skill access, audit trails |
| **Skill marketplace** | Community catalogs | Curated, reviewed, monetizable skill marketplace |

---

## 5. The MCP / Skills / CLI Relationship

### 5.1 Complementary, Not Competing

A common misconception is that MCP and Skills compete. They don't. They address different concerns:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   MCP:     "How do I talk to external systems?"      │
│            Protocol. Process isolation. Credentials.  │
│                                                      │
│   Skills:  "How do I know what to do?"               │
│            Knowledge. Workflows. Best practices.      │
│                                                      │
│   CLI:     "How do I actually do it?"                │
│            Execution. Commands. Scripts.              │
│                                                      │
│   Sandbox: "What am I NOT allowed to do?"            │
│            Filesystem. Network. Resources.            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.2 When to Use Each

| Use Case | Best Fit | Why |
|----------|----------|-----|
| External API integration | MCP Server | Process isolation, credential scoping |
| Domain workflow knowledge | Agent Skill | Progressive disclosure, cross-platform |
| Deterministic operation | Script (in skill) | Reliable, output-only, no context cost |
| Dynamic/evolving context | MCP Server | Single source of truth, auto-updating |
| Stable best practices | Agent Skill | Versioned, human-readable, auditable |
| Raw system operation | CLI command | Maximum flexibility, zero overhead |
| Sandboxed autonomous work | Sandbox + Skills | Define boundaries, let agent operate freely |

### 5.3 LlamaIndex's Empirical Finding

LlamaIndex tested Skills + MCP together and found that for fast-evolving contexts, MCP's single-source-of-truth model (connected to live documentation) outperformed static Skills. Their recommendation: **Skills for stable domain knowledge, MCP for dynamic context**.

---

## 6. Security Models Compared

### 6.1 The Isolation Hierarchy

```
ISOLATION STRENGTH (weakest → strongest)
============================================================

  V8 Isolates (Cloudflare Workers)
  ├── Instant startup
  ├── WASM-only
  └── Shared runtime ←── weakest

  Docker Containers
  ├── Process isolation, shared kernel
  ├── ~195ms startup
  └── Mature ecosystem

  gVisor (Modal, some K8s)
  ├── User-space kernel
  ├── Syscall interception
  └── Stronger than Docker, lighter than VMs

  Firecracker / Kata (E2B, K8s agent-sandbox)
  ├── Hardware virtualization
  ├── ~150ms startup
  └── Near-VM isolation without VM overhead

  Full VM (Claude API container)
  ├── Complete isolation
  ├── Highest startup cost
  └── Strongest guarantees ←── strongest

  ORTHOGONAL: Language Restriction (Monty)
  ├── <1μs startup
  ├── Dangerous operations don't exist
  └── Complements any layer above

============================================================
```

### 6.2 Anthropic's Dual Approach

Anthropic uniquely maintains **both** approaches:
1. **Skills**: No isolation (trust-based, audit-the-SKILL.md)
2. **Sandbox Runtime**: OS-level isolation (restrict filesystem + network)

Both originated at Anthropic. They take opposite approaches to the same problem. Skills assume trust and add capability. Sandboxes assume distrust and remove capability. Together, they define the operating envelope: what the agent **should** do (skills) within what the agent **can** do (sandbox).

---

## 7. Conclusion

The agentic CLI skills pattern represents a genuine infrastructure shift---comparable in significance to containerization or package management. The convergence is remarkable: Anthropic, OpenAI, Google, Block, LangChain, Pydantic, Cursor, and GitHub have all independently arrived at compatible implementations of the same core architecture.

The pattern succeeds because it respects three constraints simultaneously:
1. **Context is finite**: Progressive disclosure manages the token budget
2. **Security requires layers**: No single mechanism is sufficient
3. **Tools already exist**: The Unix philosophy (small tools, composed via pipes) translates directly into the agent era

The stages diagram (Section 2) provides the framework for understanding where any given agentic capability sits on the spectrum---from a raw `git` command (Stage 0) to a fully sandboxed multi-skill workflow (Stage 5)---and what criteria differentiate each stage.

Python, shell, and other languages are orthogonal to this hierarchy. They participate at every stage. The stages describe **abstraction and governance layers**, not language choices.

The pattern is early. The standards are converging but not yet stable. The tooling gaps (package management, testing, observability, governance) represent the clearest opportunities for investment---not in any single product, but in the infrastructure that makes the entire pattern work.

---

## Appendix A: Key References

### Primary Sources
- [Anthropic Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Pydantic Monty Repository](https://github.com/pydantic/monty)
- [Anthropic Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime)
- [OpenAI Codex Skills](https://developers.openai.com/codex/skills/)
- [Agent Skills Open Standard](https://github.com/agentskills/agentskills)

### Analysis & Comparison
- [Agent Skills vs MCP (Friedrichs-IT)](https://www.friedrichs-it.de/blog/agent-skills-vs-model-context-protocol/)
- [Skills vs MCP Tools (LlamaIndex)](https://www.llamaindex.ai/blog/skills-vs-mcp-tools-for-agents-when-to-use-what)
- [MCP vs Tools vs Skills (Logto)](https://blog.logto.io/mcp-tools-agentskill)
- [Claude Skills vs MCP 2026 Guide](https://www.cometapi.com/claude-skills-vs-mcp-the-2026-guide-to-agentic-architecture/)

### Architecture & Patterns
- [Agent Design Patterns (RLanceMartin, Jan 2026)](https://rlancemartin.github.io/2026/01/09/agent_design/)
- [Agentic Architecture Patterns (Speakeasy)](https://www.speakeasy.com/mcp/using-mcp/ai-agents/architecture-patterns)
- [Enterprise Agentic Architecture (Salesforce)](https://architect.salesforce.com/fundamentals/enterprise-agentic-architecture)

### Sandbox Ecosystem
- [E2B Agent Cloud](https://e2b.dev/)
- [Agent Sandbox Skill](https://github.com/disler/agent-sandbox-skill)
- [Kubernetes Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
- [Claude Code Sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)

### Ecosystem & Adoption
- [Simon Willison on OpenAI Skills Adoption](https://simonwillison.net/2025/Dec/12/openai-skills/)
- [OpenAI Skills Catalog](https://github.com/openai/skills)
- [Awesome Agent Skills](https://github.com/skillmatic-ai/awesome-agent-skills)
- [Deep Agents CLI (LangChain)](https://docs.langchain.com/oss/python/deepagents/cli)

---

## Appendix B: Full Research Materials

Detailed source analyses and raw references are available in:
- [.sop/research/references.md](.sop/research/references.md)
- [.sop/research/source-analysis--anthropic-agent-skills.md](.sop/research/source-analysis--anthropic-agent-skills.md)
- [.sop/research/source-analysis--pydantic-monty.md](.sop/research/source-analysis--pydantic-monty.md)
- [.sop/research/source-analysis--ecosystem-landscape.md](.sop/research/source-analysis--ecosystem-landscape.md)
