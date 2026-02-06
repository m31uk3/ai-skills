# Source Analysis: Agentic CLI Skills Ecosystem Landscape (Feb 2026)

## The Convergence

The period from late 2024 through early 2026 saw rapid convergence around a set of interlocking patterns for extending AI agent capabilities. What began as independent innovations at Anthropic (Skills, MCP, Sandbox), Pydantic (Monty), and others has crystallized into a recognizable architectural stack.

## The Three Layers

### Layer 1: Protocol (MCP - Model Context Protocol)
- **What**: Standardized JSON-RPC protocol for agent-tool communication
- **Analogy**: "USB-C for AI" - universal connector
- **Scope**: External integrations, APIs, databases, services
- **Isolation**: Process-level (each MCP server runs in its own process)
- **Governance**: Donated to Agentic AI Foundation (AAIF) under Linux Foundation, Dec 2025
- **Adoption**: SDKs for all major languages; thousands of community servers

### Layer 2: Skills (Agent Skills Standard)
- **What**: Folder-based packaging of instructions, scripts, and resources
- **Analogy**: "Onboarding guide for a new team member"
- **Scope**: Domain knowledge, workflows, best practices, local operations
- **Isolation**: None inherent (runs in agent's process)
- **Governance**: Open standard, originated by Anthropic
- **Adoption**: Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Goose, Gemini CLI

### Layer 3: Sandbox Runtime (Execution Boundary)
- **What**: OS-level restrictions on filesystem and network access
- **Implementations**:
  - Anthropic `sandbox-runtime`: bubblewrap/Seatbelt, no container needed
  - E2B: Firecracker microVMs (~150ms startup)
  - Daytona: Docker/Kata/Sysbox (27-90ms startup)
  - Pydantic Monty: Restricted interpreter (<1μs startup)
  - Kubernetes Agent Sandbox: Declarative API for agent workloads
- **Purpose**: Restrict what agents can access; complement to skills (which define what agents can DO)

## Platform Comparison Matrix

| Platform | MCP | Skills | Sandbox | CLI |
|----------|-----|--------|---------|-----|
| Claude Code | Yes | Yes (custom) | Yes (OS-level) | Yes |
| Claude API | Yes | Yes (pre-built + custom) | VM container | No |
| OpenAI Codex | - | Yes | Container | Yes |
| Cursor | Yes | Yes | - | No |
| GitHub Copilot | Yes | Yes | - | IDE |
| Gemini CLI | - | Yes | - | Yes |
| Deep Agents | Yes | Yes | Modal/Daytona/Runloop | Yes |
| Goose (Block) | Yes | Yes | - | Yes |

## The Spectrum of Agentic Capabilities

### From Simple to Complex (ascending abstraction):

1. **Raw CLI Commands** (`git`, `npm`, `python`)
   - Zero abstraction, full power, no guardrails
   - Agent uses `--help` or `man` to discover capabilities
   - Always available as the foundation

2. **Shell/Python Scripts** (`.sh`, `.py`)
   - Minimal abstraction over CLI commands
   - Deterministic operations packaged for reuse
   - The `scripts/` folder in skills

3. **SKILL.md Instructions** (markdown with YAML frontmatter)
   - Natural language procedures + references
   - Progressive disclosure (loaded on demand)
   - Cross-platform standard

4. **CLI Tools with Man Pages** (dedicated binaries)
   - Full CLI tools with `--help` documentation
   - Example: Pydantic Monty as a CLI-invocable interpreter
   - More opinionated than raw scripts

5. **MCP Servers** (protocol-based tool exposure)
   - Formal JSON-RPC protocol
   - Process isolation, credential scoping
   - Network-capable (external APIs, databases)

6. **Composite Agent Workflows** (multi-skill orchestration)
   - Skills + MCP + sandbox + checkpoints
   - The full 5-phase SOP pattern
   - Human-in-the-loop at decision points

## Key Design Patterns

### Progressive Disclosure
- Only load what's needed, when needed
- Metadata → Instructions → Resources → Script output
- Cursor, Claude, Manus all converge on this

### Security by Layers
- Skills define capabilities (what to do)
- Sandboxes restrict access (what not to do)
- MCP scopes credentials (who can do what)

### Python as Orthogonal Skill
- Python (and other languages) transcend the skills/MCP boundary
- Monty: Python as a sandboxed execution medium for tool calls
- PydanticAI "code-mode": LLM writes Python instead of making tool calls
- Python scripts inside skills: deterministic operations without context cost

## Emerging Trends

1. **MCP UI Framework** (Jan 2026): Skills can now trigger rich UI components from MCP servers, blurring the line between chatbot and application
2. **Agent-to-Agent Protocol (A2A)**: Standardized handshake for inter-agent delegation
3. **Kubernetes Agent Sandbox**: Declarative API for agent workloads at enterprise scale
4. **Skills Distribution**: skills.sh as package manager, OpenAI skills catalog
5. **Context Engineering**: Treating context as finite resource with diminishing returns

## LlamaIndex's Real-World Finding
They initially combined MCP (for planning context from docs) + Skills (for code generation workflows). Result: MCP documentation context was often sufficient; skills were rarely invoked. For fast-evolving contexts, a single source of truth (MCP) won. This suggests skills are best for **stable domain knowledge** while MCP is better for **dynamic, evolving context**.
