# Obsidian Ecosystem Research: Structured Knowledge Graphs

## Date: 2026-02-26

---

## 1. Native Graph View

**Data sources:** Only `[[wikilinks]]` (internal links). Optionally displays tags and attachments as nodes.

**What it CANNOT do:**
- No edge types or relationship labels. All edges are identical unlabeled lines.
- No semantic grouping by relationship type.
- No programmatic access to the graph data.
- No filtering by link type, direction, or metadata.
- Becomes visually useless at scale ("hairball problem").

**What it CAN do:**
- Filter nodes by search query, tags, attachments, orphans, existing-files-only.
- Color-code node groups matching search criteria.
- Adjust physics forces (center, repel, link distance).
- Show arrows for link direction.
- Local graph view with configurable depth.

**Verdict:** Decoration, not infrastructure. Useful for serendipitous discovery. Irrelevant for structured knowledge graphs.

---

## 2. Key Plugins

### 2a. Juggl (typed graph visualization)

**Status:** Production but niche. Built on Cytoscape.js. Designed as advanced local graph view.

**Typed link syntax (two methods):**

```markdown
<!-- Method 1: Markdown list syntax (native Juggl) -->
- painted [[The Night Watch]]
- influences [[Vermeer]]

<!-- Method 2: Dataview inline fields (requires Breadcrumbs) -->
painted:: [[The Night Watch]]
influences:: [[Vermeer]]
```

**Constraint:** Link type must be a **single word**. `has painted` will NOT parse.

**Styling:** Full CSS control over edges by type. Cytoscape.js under the hood = powerful layout algorithms.

**Proposed future syntax (NOT implemented):**
```markdown
[[Note name|alias|linkType|property1=value1]]
```

**Verdict:** The closest thing to a typed-link graph viewer in Obsidian. But single-word constraint and niche adoption are limiting. The Juggl developer also built obsidian-neo4j-graph-view, suggesting the Obsidian-native approach hit its limits.

---

### 2b. Breadcrumbs (hierarchical typed relationships)

**Status:** Production. V4 rewrite with WASM graph engine. Actively maintained.

**Core edge fields:** `up`, `down`, `same`, `next`, `prev` (customizable names).

**Frontmatter syntax:**
```yaml
---
up: "[[Parent Note]]"
down:
  - "[[Child A]]"
  - "[[Child B]]"
same: "[[Sibling Note]]"
next: "[[Following Note]]"
prev: "[[Previous Note]]"
---
```

**Inline syntax (Dataview-compatible):**
```markdown
up:: [[Parent Note]]
```

**Custom field names:** Can rename `up` to `author`, `same` to `related`, etc.

**Implied relationships:** Automatic transitive inference. E.g., configurable rule: if A-->up-->X and B-->up-->X, then A--same--B (siblings from shared parent).

**Alternative hierarchy sources (V4):**
- Tag notes (`BC-tag-note-tag`)
- List/hierarchy notes (nested bullet lists become parent-child edges)
- Dendron-style path hierarchies
- Folder structure mapping
- Regex pattern matching
- Date-based organization

**Views:** Matrix, Tree, Path (trail), Previous/Next, Grid.

**Codeblock visualizations:**
```
```breadcrumbs
type: tree
```
```
Also supports mermaid and markmap output from codeblocks.

**V4 breaking changes:** Removed Juggl view, Ducks view, and Visualizations view. Signal: moving away from Juggl dependency.

**Verdict:** Most production-ready typed-relationship system in Obsidian. Hierarchical by design (5 directional fields). Excellent for parent-child-sibling traversal. NOT designed for arbitrary relationship types like `contradicts`, `enables`, `causes`.

---

### 2c. Dataview (query engine + inline fields)

**Status:** De facto standard. Massive adoption.

**Frontmatter fields:**
```yaml
---
alias: "document"
tags:
  - concept
  - review
rating: 8
status: draft
---
```

**Inline field syntax:**
```markdown
<!-- Standalone (own line) -->
Type:: #type/concept
Status:: active
Related:: [[Other Note]]

<!-- Embedded in prose (bracket syntax) -->
I'd rate this [rating:: 9] out of 10.

<!-- Hidden key (parenthesis syntax) -->
This is a (internal-id:: 42) reference.
```

**Key detail:** Double colon `::` required for inline fields. Single `:` is YAML-only.

**Queryable with DQL:**
```dataview
TABLE status, related
FROM #concept
WHERE status = "active"
SORT rating DESC
```

**DataviewJS for programmatic output:**
```dataviewjs
const pages = dv.pages('#concept');
// Generate mermaid, tables, lists, anything
dv.paragraph("```mermaid\ngraph TD\n...\n```");
```

**Implicit fields:** `file.name`, `file.cday`, `file.outlinks`, `file.etags`, `file.tasks` — all queryable without explicit metadata.

**Verdict:** The query engine. Reads both YAML frontmatter and inline `::` fields. DataviewJS can generate mermaid diagrams from metadata, which is the proven pattern for "data-driven mermaid."

---

### 2d. Graph Analysis

**Status:** Production. By same developer as Breadcrumbs (SkepticMystic).

**Algorithms:** Similarity, Link Prediction, Co-Citations, Community Detection.

**Co-citations:** Second-order backlinks. Counts how often two notes are cited together, weighted by proximity. Surfaces implicit relationships.

**Verdict:** Analytical, not structural. Discovers relationships rather than defining them. Complementary to typed-link approaches.

---

### 2e. Bases (core plugin, new)

**Status:** Core plugin since Obsidian 1.9 (Aug 2025). Actively developed.

**What it does:** Database-style views over notes using YAML frontmatter properties.

**Views:** Table, Gallery, Maps (as of 1.10.3).

**Data source:** YAML frontmatter properties only. Does NOT read Dataview inline fields.

**Limitations:** No nested YAML. Property type is vault-global (a field named `rating` must be the same type everywhere). No inline field support.

**Verdict:** Obsidian's official answer to Notion databases. Reads frontmatter, ignores inline fields. Reinforces YAML frontmatter as the canonical metadata location.

---

## 3. Mermaid in Obsidian

### Native support
Obsidian renders `mermaid` fenced code blocks natively. Pure visualization. No plugin reads mermaid blocks as structured data.

### Existing plugins
| Plugin | Purpose | Parses mermaid as data? |
|--------|---------|------------------------|
| Mermaid Tools | Toolbar for creating diagrams | No |
| Mermaid View | First-class .mmd file support | No |
| Mehrmaid | Obsidian markdown inside mermaid nodes | No (renders INTO mermaid, not FROM) |
| Export Graph View | Exports vault graph AS .mmd | No (generates mermaid, doesn't read it) |

### The proven pattern: Dataview --> Mermaid (not Mermaid --> Data)

The established workflow is **metadata-first, mermaid-as-output**:

```dataviewjs
const pages = dv.pages('#task');
let gantt = "gantt\n  dateFormat YYYY-MM-DD\n";
for (let p of pages) {
  gantt += `  ${p.file.name} : ${p.status}, ${p.ID}, ${p.start}, ${p.end}\n`;
}
dv.paragraph("```mermaid\n" + gantt + "\n```");
```

**Nobody in the Obsidian ecosystem treats mermaid blocks as a data source.** The data flows: `frontmatter/inline fields --> Dataview query --> mermaid output`.

### Implication for K-DAG
If mermaid is "single source of structural truth," we're going against the grain. The ecosystem convention is: metadata is the source of truth, mermaid is the rendering.

---

## 4. YAML Frontmatter Conventions

### Obsidian-native properties
```yaml
---
tags:
  - concept
  - knowledge-graph
aliases:
  - "KG"
cssclasses:
  - wide-page
---
```

**Supported types (Bases/Properties UI):** Text, List, Number, Checkbox, Date, Date+time.

**Constraints:**
- No nested objects (flat key-value only).
- Property name = one type across entire vault.
- `tags`, `aliases`, `cssclasses` are reserved (plurals required since 1.9).

### Dataview extends this
Dataview reads all frontmatter plus inline `::` fields. Supports links in YAML:
```yaml
---
related:
  - "[[Note A]]"
  - "[[Note B]]"
parent: "[[Parent Note]]"
---
```

### Convention in practice
Power users split between:
- **YAML purists:** Everything in frontmatter. Compatible with Bases, Properties UI, and Dataview.
- **Inline pragmatists:** Use `key:: value` in prose for context-local metadata. Dataview-only (Bases ignores these).

---

## 5. Community Patterns: MOCs and Hierarchy

### Map of Content (MOC) structure
Typical MOC note:
```markdown
# Domain Knowledge MOC

## Core Concepts
- [[Concept A]] — foundational theory
- [[Concept B]] — extends A with practical applications

## Tensions
- [[Concept A]] vs [[Concept C]] — disagree on mechanism
- See [[Debate Note]] for resolution attempts

## Open Questions
- How does [[Concept D]] relate to [[Concept A]]?
```

**Key properties:**
- One note can appear in multiple MOCs (unlike folders).
- MOCs are just notes with links -- no special file type.
- Structure emerges organically; premature MOC creation is considered an anti-pattern.
- Nick Milo's "LYT" (Linking Your Thinking) framework is the dominant MOC methodology.

### How people handle tension/contradiction
**No standard notation exists.** Common approaches:
- Prose description ("A contradicts B because...")
- Dedicated "debate" or "comparison" notes
- Tags like `#tension` or `#open-question`
- Dataview status fields: `status:: contested`

Nobody uses typed edges for contradiction/tension in practice. This is a gap.

### Epistemic status
Some users add frontmatter:
```yaml
---
confidence: high | medium | low | speculative
epistemic-status: "established consensus"
---
```
But there's no community standard. Each vault invents its own.

---

## 6. Summary: What Exists vs What's Missing

### Production-ready (use these)
| Capability | Tool | Syntax |
|-----------|------|--------|
| Hierarchical typed edges | Breadcrumbs | `up:: [[X]]` in frontmatter/inline |
| Queryable metadata | Dataview | `key:: value` inline, YAML frontmatter |
| Database views | Bases | YAML frontmatter properties |
| Data-driven diagrams | DataviewJS --> Mermaid | JS generates mermaid strings |
| Interactive typed graph | Juggl | `- linkType [[Node]]` list syntax |

### Missing (opportunity for K-DAG)
| Gap | Description |
|-----|------------|
| Arbitrary typed edges | Breadcrumbs is hierarchical only (up/down/same/next/prev). No `contradicts`, `causes`, `enables`. |
| Confidence/weight on edges | No plugin supports weighted or scored relationships. |
| Mermaid as data source | Zero plugins read mermaid blocks as structured data. Flow is always metadata-->mermaid, never reverse. |
| Contradiction/tension modeling | No standard notation or tooling. Pure prose. |
| Cross-document graph operations | No intersection, merge, or diff of knowledge subgraphs. |
| Epistemic status conventions | No community standard. Each vault ad-hoc. |

---

## 7. Design Implications for K-DAG

### Work WITH the ecosystem
1. **Use YAML frontmatter** for note-level metadata (type, confidence, status). Bases and Dataview both read it.
2. **Use Dataview inline fields** (`key:: value`) for context-local metadata in prose. Dataview reads it; Bases ignores it but that's fine.
3. **Use `[[wikilinks]]`** for node references in prose. Every Obsidian tool understands them.
4. **Use Breadcrumbs `up::`/`down::`** for hierarchy IF hierarchical navigation is desired.

### The mermaid question
The ecosystem says: metadata is truth, mermaid is rendering. Two options:

**Option A: Mermaid as single structural truth (your current lean)**
- Pro: Human-readable ontology in one place. LLMs generate it natively.
- Con: No plugin reads it. You'd need custom tooling to extract structure.
- Con: Disconnected from Dataview/Breadcrumbs ecosystem.

**Option B: Metadata is truth, mermaid is generated**
- Pro: Works with Dataview, Breadcrumbs, Bases, Juggl out of the box.
- Pro: DataviewJS can generate mermaid from inline fields.
- Con: Structure is scattered across frontmatter + inline fields (harder for LLMs to generate correctly).
- Con: No single visual "ontology block" in the document.

**Option C (Hybrid): Both, with metadata as source of truth**
- Frontmatter defines typed edges: `causes:: [[Node B]]`, `contradicts:: [[Node C]]`
- Mermaid block is generated/maintained as a human-readable summary
- LLM generates both: metadata fields AND mermaid block
- Mermaid block is documentation, not data
- Dataview can query the metadata; mermaid provides the visual

Option C maps most naturally to how the Obsidian ecosystem already works.
