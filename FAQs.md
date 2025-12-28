# Frequently Asked Questions

## Why This Pattern Emerges

This isn't coincidence—it's fundamental to managing LLM uncertainty.

Multiple teams independently discovered these patterns within a 12-month window (2024-2025), suggesting they represent fundamental solutions to common challenges, not arbitrary design choices.

### 1. LLMs are probabilistic, not deterministic

- Need **constraints** to bound the solution space
- Need **validation gates** to prevent drift
- Need **human checkpoints** at critical decision points

### 2. Complex tasks require decomposition

- LLMs struggle with large, ambiguous problems
- **Explicit steps** with **clear outputs** work
- **Iterative refinement** handles emergence better than one-shot

### 3. Context is limited and expensive

- Can't hold everything in context at once
- Need **intentional compaction**
- Need **checkpoint artifacts** to resume work

### 4. Human-AI collaboration requires structure

- Humans need **decision points**, not auto-pilot
- AI needs **explicit permission** to proceed
- Both need **shared understanding** of state
