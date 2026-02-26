---
name: synthesize-knowledge-graph
description: "Transform source materials into K-DAGs (Knowledge DAGs) — modular, curated domain knowledge structured as directed acyclic graphs with typed edges, mermaid visualization, and prose context. Use when users want to build knowledge graphs from documents, synthesize multiple sources into structured ontologies, intersect existing K-DAGs to discover emergent relationships, or create machine-readable knowledge structures that resist context rot. Triggers on: 'build a knowledge graph', 'create a K-DAG', 'intersect these knowledge sources', 'map the relationships between these documents', 'synthesize an ontology from these sources'."
---

# Synthesize Knowledge Graph

Transform raw information into K-DAGs — Knowledge DAGs that encode domain knowledge as typed, directed acyclic graphs with prose context and mermaid visualization.

> **STATUS: DRAFT — See CHECKPOINT.md for design decisions and open questions.**

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| source_materials | Yes | Raw sources (text, file paths, URLs, or existing K-DAGs for intersection) |
| synthesis_topic | Yes | Subject being synthesized |
| target_audience | Yes | Intended users of the knowledge |
| operation | No | "synthesize" (default) or "intersect" |
| output_location | No | File path to save output |

## Workflow

### TODO — Complete after resolving open design questions in CHECKPOINT.md

Placeholder workflow:
1. Source validation (reuse VKS patterns)
2. Entity extraction — identify nodes across sources
3. Relationship extraction — identify typed edges
4. Ontology schema generation — define node types, edge types
5. K-DAG assembly — nodes, edges, confidence scores
6. Mermaid generation — auto-generate ontology visualization
7. Prose integration — write context with [[wikilinks]] to nodes
8. Validation — verify edge preservation, logical consistency
9. Output — single .md with YAML frontmatter + mermaid + prose

### Intersection Operation (when operation = "intersect")
1. Load 2+ existing K-DAGs
2. Identify cross-graph node matches (same or related concepts)
3. Discover emergent edges (relationships that exist only between graphs)
4. Produce intersection K-DAG with provenance tracking
5. Generate merged mermaid visualization

## Edge Types

| Type | Meaning | Example |
|------|---------|---------|
| causal | A causes B | "Context rot causes edge loss" |
| dependency | A requires B | "Agentic search depends on tool calls" |
| contradicts | A conflicts with B | "Doom narrative contradicts bull case" |
| supports | A strengthens B | "Tobi's eval practice supports capability frontier thesis" |
| enables | A makes B possible | "FAS enables interactive agentic search" |
| subsumes | A contains B as subset | "Agentic search subsumes ARAG" |

## Output Format

> **PENDING — Format decision depends on prior art research. See CHECKPOINT.md.**
