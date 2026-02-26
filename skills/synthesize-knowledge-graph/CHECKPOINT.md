# Synthesize Knowledge Graph — Design Checkpoint

## Date: 2026-02-26

## Status: Skill design in progress. Base decisions made. Open research questions remain.

---

## Decided

### Skill Identity
- **Name:** synthesize-knowledge-graph
- **Relationship to VKS:** Standalone. Can consume VKS output as input. Does not depend on VKS.
- **Core function:** Transform source materials into K-DAGs (Knowledge DAGs) — modular, curated domain knowledge structured as directed acyclic graphs with prose context.

### K-DAG Definition (see /GenAI/Primitives/K-DAG.md)
- Nodes = facts, entities, concepts
- Edges = typed directed relationships (causal, dependency, contradicts, supports, enables, subsumes) with confidence scores
- Hierarchical, not flat. The hierarchy IS the knowledge.
- Modular — load on demand per inference query
- Edges are the value — context rot preferentially destroys edges

### Intersection as First-Class Operation
- Accept 2+ K-DAGs as input, produce a new K-DAG with cross-graph edges and emergent nodes
- This was the most powerful operation discovered in the session (see three-way intersection docs)

### Rich Edge Typing
- Typed edges: causal, dependency, contradicts, supports, enables, subsumes
- With confidence scores

### Output Format
- YAML frontmatter + Mermaid + Prose in one .md file
- Mermaid graph required for every K-DAG (at minimum: knowledge ontology / hierarchy)

### Mermaid as Visualization Layer
- Mermaid renders everywhere: GitHub, Obsidian, VS Code, GitLab, Notion
- LLMs generate mermaid natively — zero friction
- 74k+ GitHub stars, 8M+ users, $7.5M seed funding (Sequoia, Microsoft M12)
- MCP server exists for Claude Code integration

---

## Leaning Toward (Not Final)

### Simplify Further — [[Wikilinks]] + Mermaid Only
- User leans toward dropping custom ::rel syntax entirely
- Use only [[wikilinks]] for node references in prose (native Obsidian support)
- Let the mermaid code block be the single source of structural truth
- This means: prose contains [[NodeName]] links, mermaid block contains the typed ontology
- The MGN HTML renderer (Cytoscape) becomes optional power tool, not required

### BUT — Open Research Question
- **Does a notation already exist that intersects prose and ontologies in graph markdown syntax?**
- Check GitHub, academic papers, existing tools
- Someone must have explored this problem before
- If a good solution exists, adopt it rather than inventing custom notation

---

## Open Research (Resume Here)

### 1. Prior Art Search — Prose + Ontology Markdown Notation
Search for existing solutions that embed graph/ontology structure within markdown prose:
- GitHub repos combining knowledge graphs with markdown
- Academic work on "literate ontology" or "narrative knowledge graphs"
- Tools like Foam, Dendron, Logseq, TiddlyWiki — do any support typed relationships?
- Obsidian plugins for typed links / relationship definitions
- Any markdown extension that supports inline relationship notation

### 2. Prose Integration Gap
The unresolved design tension:
- Mermaid lives in fenced code blocks, separate from prose
- MGN's `[[Node]]` and `::rel` notation embeds structure IN prose
- If we drop ::rel, the mermaid block becomes structurally disconnected from the prose
- [[Wikilinks]] connect nodes but DON'T type the edges
- Question: Is there a lightweight way to type edges within prose without custom notation?

### 3. ::config Block Decision
- MGN's `::config` defines typed ontology schemas (node types with shapes/colors/sizes)
- Mermaid has `classDef` and `style` directives that partially cover this
- If we use mermaid-only, can we replicate the typed ontology schema within mermaid syntax?

### 4. MGN HTML Renderer Role
- File: /Users/ljack/Downloads/Markdown_Graph_Notation_Renderer.html
- Uses Cytoscape.js for interactive graph visualization
- Bidirectional click-highlight between prose and graph nodes
- Question: Keep as optional power tool? Bundle with skill? Or drop entirely?

---

## Session Artifacts (All in Obsidian)

### Documents Created
1. **Agentic Search vs Agentic RAG** — Curated context synthesis
   - Path: /GenAI/Primitives/Agentic Search vs Agentic RAG.md

2. **Intersection — Agentic Search x Capability-Dissipation Gap** — Two-way intersection (7 nodes)
   - Path: /GenAI/Primitives/Intersection - Agentic Search x Capability-Dissipation Gap.md

3. **Intersection — Agentic Search x Capability-Dissipation Gap x Tobi Lutke** — Three-way intersection (12 nodes)
   - Path: /GenAI/Primitives/Intersection - Agentic Search x Capability-Dissipation Gap x Tobi Lutke.md

4. **K-DAG** — Dedicated definition document
   - Path: /GenAI/Primitives/K-DAG.md

### Key Insight from Session
**"Structural understanding compounds; surface matching doesn't."**

This applies at every level: retrieval (RAG vs agentic search), code search (grep vs ast-grep), AI usage (prompting vs context engineering), organizational AI (pilot programs vs constitutions), leadership (consensus vs jazz band), career (learn AI vs map the gap).

### The Bug Hunt Example
Steel man for agentic search: "checkout is slow" → RAG retrieves checkout files (dead end) → agentic search follows imports across 3 files → discovers the cause lives in the RELATIONSHIP between files, not in any single file.

VKS does the same thing for knowledge synthesis. K-DAGs encode this so the relationships survive context rot.

### Context Rot Thesis
- Context rot preferentially destroys edges (relationships) while preserving nodes (facts)
- Hierarchical/DAG knowledge is most vulnerable because the reasoning chain breaks if ANY intermediate edge is dropped
- K-DAG defenses: modular loading, explicit edge encoding, hierarchical context isolation, eval frameworks that verify edge preservation
- User's original K-DAG thesis (Feb 2025) predicted this exact finding

---

## Source Materials Referenced

### Primary Sources
- Eitan Borgnia (Relace/LinkedIn) — Fast Agentic Search, Goldilocks regime
- Reddit r/Rag — Traditional RAG vs Agentic RAG
- KWDB YouTube — "$7,000 Raise AI Is Giving You" (capability-dissipation gap)
- Tobi Lutke / Acquired podcast — "How to Live in Everyone Else's Future"
- User's K-DAG thesis (Feb 2025) — DAGs in LLM Promotion
- MGN HTML Renderer — /Users/ljack/Downloads/Markdown_Graph_Notation_Renderer.html

### Prior Writing Found
- Context Windows Are Actors (Erlang OTP of AI)
- Ralph Wiggum Loop (Geoffrey Huntley context rot)
- Context Engineering for AI Coding Agents (smart zone / dumb zone)
- Palantir Ontology Core Concepts
- Knowledge Graph Ideas

---

## Next Steps (When Resuming)

1. **Research prior art** — prose + ontology graph notation (GitHub, tools, academic)
2. **Decide notation** — [[wikilinks]] + mermaid only? Or lightweight ::rel? Based on what prior art reveals.
3. **Draft SKILL.md** — Using skill-creator patterns from the official guide
4. **Define test cases** — 2-3 realistic synthesis prompts
5. **Build references/** — Edge type definitions, mermaid templates, output format spec
6. **Iterate** — Run evals, get feedback, improve
