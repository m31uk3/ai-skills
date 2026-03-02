# Synthesize Knowledge Graph — Design Checkpoint

## Date: 2026-02-26
## Status: Notation decided. Page-level structure design in progress.

---

## Decided

### Skill Identity
- **Name:** synthesize-knowledge-graph
- **Relationship to VKS:** Standalone. Can consume VKS output as input. Does not depend on VKS.
- **Core function:** Transform source materials into K-DAGs (Knowledge DAGs) — modular, curated domain knowledge structured as directed acyclic graphs with prose context.

### K-DAG Definition (see /GenAI/Primitives/K-DAG.md)
- Nodes = facts, entities, concepts
- Edges = typed directed relationships with confidence scores
- Hierarchical, not flat. The hierarchy IS the knowledge.
- Modular — load on demand per inference query
- Edges are the value — context rot preferentially destroys edges

### Notation: [[Wikilinks]] + Mermaid Only (FINAL)
- **[[wikilinks]]** in prose for node references (native Obsidian)
- **Mermaid flowchart** as single source of structural truth
- No custom `::rel` syntax. No plugin dependencies.
- LLM reads/writes mermaid to reconstruct/update the graph
- Future convergence target: Obsidian integrated knowledge graph views

### Safe Obsidian Mermaid Subset
Use only syntax confirmed working in Obsidian's bundled mermaid (~11.4):
- `A -->|relationship| B` — typed edges (the core triple)
- `<-->` — bidirectional edges
- `-.->` / `==>` — dotted/thick for visual distinction
- `subgraph Name ... end` — domain clustering / hierarchy
- `classDef` + `:::` — node typing via CSS classes
- **AVOID:** `@{}` node metadata (broken), edge IDs `e1@` (broken), rendering directives

### Edge Limit Strategy
- ~280 edges max per mermaid block in Obsidian
- Split across multiple mermaid blocks per domain/subgraph
- Each block is self-contained and parseable

### Intersection as First-Class Operation
- Accept 2+ K-DAGs as input, produce a new K-DAG
- Three-layer output model:
  1. **Consensus** — nodes/edges present in both (IAR semantics: survives all interpretations)
  2. **Tensions** — nodes/edges where sources conflict (paraconsistent: preserved, not resolved)
  3. **Extensions** — nodes/edges from single source (brave semantics: included with provenance)

### Rich Edge Typing (Expanded)

#### Structural Edges
| Type | Meaning |
|------|---------|
| causal | A causes B |
| dependency | A requires B |
| enables | A makes B possible |
| subsumes | A contains B as subset |

#### Epistemic Edges
| Type | Meaning |
|------|---------|
| supports | A strengthens B |
| contradicts | A conflicts with B |
| tensions | A and B coexist unresolved (productive tension) |
| qualifies | A narrows/constrains B without contradicting |
| supersedes | A replaces B (B preserved for lineage) |
| assumes | A depends on unstated assumption B |

#### Special Node Types
| Type | Purpose |
|------|---------|
| tension | Marks unresolved conflict between 2+ nodes |
| gap | Marks known unknown / missing evidence |
| synthesis | Product of resolving/qualifying a tension |

### Output Format
- YAML frontmatter + Mermaid + Prose in one .md file
- Mermaid graph required for every K-DAG
- Mermaid block IS the ontology (not a picture of it)

### Mermaid as Structural Truth Source
- No programmatic parser needed — LLM is the parser
- `A -->|rel| B` maps cleanly to subject-predicate-object triples
- Subgraphs map to domain/category hierarchy
- `classDef`/`:::` maps to node type classification
- Trivially parseable by regex: `^(\w+)\s*(-->|-.->|==>|<-->)\|([^|]+)\|\s*(\w+)$`

---

## Prior Art Research (Completed 2026-02-26)

### What Exists
- **Breadcrumbs plugin:** Hierarchy only (up/down/same/next/prev). No arbitrary typed edges.
- **Juggl plugin:** Typed links via `- linkType [[Node]]`. Single-word types only. Niche adoption. Developer built Neo4j export (hit Obsidian limits).
- **Dataview:** Query engine for YAML/inline fields. Can generate mermaid FROM metadata. Never reads mermaid AS data.
- **Argdown:** Markdown-native argument mapping (`+` support, `-` attack, `_` undercut). Fenced code blocks like mermaid. Interesting but too specialized.
- **Hegelion:** LLM dialectical reasoning (separate calls for thesis/antithesis/synthesis). MCP server exists.
- **OntoMermaid:** OWL → mermaid (one direction only).
- **Carleton X-Lab:** GPT-3 reading mermaid ER diagrams → RDF-Turtle. LLM as parser (same approach we're taking).

### What Nobody Has Done
- Treated mermaid as canonical graph definition (we're first)
- Arbitrary typed edges in Obsidian (Breadcrumbs = hierarchy only)
- Cross-document K-DAG intersection
- Tension preservation as first-class operation
- Confidence scores on relationships

### Tension Preservation Prior Art
- **Zettelkasten:** Never delete. Contradictions coexist via branching. Question notes as tension markers. Gap notes for known unknowns.
- **Paraconsistent logic:** Third truth value for contradictions. Reasoning continues for non-conflicting parts.
- **IAR/Brave semantics:** Formal models for intersection (conservative) vs union (exploratory) of conflicting knowledge.
- **IBIS (Issue-Based Information System):** `#issue`, `#position`, `#pro`, `#con` tagging. Practitioners use in Obsidian.

---

## Session Artifacts (All in Obsidian)

### Documents Created
1. **Agentic Search vs Agentic RAG** — /GenAI/Primitives/Agentic Search vs Agentic RAG.md
2. **Intersection — Agentic Search x Capability-Dissipation Gap** — 7 nodes
3. **Intersection — Agentic Search x Capability-Dissipation Gap x Tobi Lutke** — 12 nodes
4. **K-DAG** — /GenAI/Primitives/K-DAG.md

### Key Insight
**"Structural understanding compounds; surface matching doesn't."**

### Context Rot Thesis
- Context rot preferentially destroys edges while preserving nodes
- K-DAG defenses: modular loading, explicit edge encoding, hierarchical context isolation
- User's original K-DAG thesis (Feb 2025) predicted this

---

## Next Steps

1. ~~Research prior art~~ — DONE
2. ~~Decide notation~~ — DONE: [[wikilinks]] + mermaid only
3. **Design page-level micro-structure** — What does a K-DAG .md file look like section by section? How does micro (page) feed macro (vault-wide graph)?
4. **Draft full SKILL.md** — Complete workflow with all phases
5. **Define test cases** — 2-3 realistic synthesis + intersection prompts
6. **Build references/** — Edge type definitions, mermaid templates, output format spec, example K-DAGs
7. **Iterate** — Run evals, get feedback, improve
