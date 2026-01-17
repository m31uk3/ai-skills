---
name: writing-eval-sloptastic
description: Quantitative framework for detecting AI-generated "slop" in prose through systematic analysis of structural, lexical, rhetorical, and logical patterns. Use when analyzing text authenticity, evaluating writing quality, detecting AI-generated content, or assessing whether prose has characteristic AI patterns like excessive parallelism, abstraction laddering, chiasmus abuse, platitudes, tautologies, or rhetorical overengineering.
---

# AI Slop Evaluation Framework

## Overview

This skill provides a quantifiable methodology for analyzing prose to detect AI-generated "slop"—text that employs rhetorical devices to sound profound while lacking substantive content. The framework evaluates six key dimensions with weighted scoring to produce an objective "AI Slop Score."

## Core Methodology

Evaluate text across six dimensions, each scored 0-100% based on specific quantifiable patterns:

1. **Structural Formulaicity** - Pattern density and mechanical construction
2. **Lexical Vapor** - Abstract vs. concrete language ratio
3. **Rhetorical Overengineering** - Overuse of literary devices
4. **Tonal Uncanniness** - Absence of hedging and human messiness
5. **Logical Void** - Circular reasoning and evidence-free claims
6. **Output Format** - Analysis structure and presentation

## Evaluation Process

### 1. Structural Formulaicity (Weight: 20%)

**What to measure:**
- **Parallel construction density**: Count explicit parallel structures (e.g., "You X, she Y" repeated patterns)
  - AI tell: >3% density indicates robotic sustaining of parallelism
- **Connector disease**: Count overused logical connectors ("That's why...", "This is because...")
  - AI tell: >1.5% of text indicates simulated coherence
- **Definitional tautology**: Count negation-redefinition patterns ("X isn't just Y, it's Z")
  - AI tell: >2 instances suggests strawman correction habit

**Scoring rubric:**
- 0-30%: Natural variation, broken patterns for emphasis
- 31-60%: Some repetitive structures but not systematic
- 61-85%: High pattern density, mechanical feel
- 86-100%: Robotic parallelism, formulaic throughout

### 2. Lexical Vapor (Weight: 15%)

**What to measure:**
- **Concrete-to-abstract ratio**: Count concrete vs. abstract nouns
  - Calculate ratio (concrete:abstract)
  - AI tell: Ratio <1:2 indicates abstraction overuse
- **Platitude density**: Count vague intensifiers and meaningless profundities
  - Examples: "real X", "natural growth", "stress is softened", "chaos becomes calm"
  - AI tell: One platitude per <2 sentences

**Scoring rubric:**
- 0-30%: Rich concrete details, specific examples
- 31-60%: Some abstraction but grounded
- 61-85%: High abstraction, vague language dominates
- 86-100%: Almost entirely abstract vapor

### 3. Rhetorical Overengineering (Weight: 15%)

**What to measure:**
- **Chiasmus abuse**: Count chiastic structures (X→Y, Y→X patterns)
  - AI tell: >4 instances per 200 words = systematic deployment
- **Abstraction laddering**: Track sentences that climb abstraction levels without returning to ground
  - Example: concrete → abstract → metaphysical → cosmic
- **Contradiction patterns**: Note claims of subtlety followed by obvious manifestations
  - Example: "This is quiet... It shows up in how [loud obvious things]"

**Scoring rubric:**
- 0-30%: Sparing use of devices for emphasis
- 31-60%: Some overuse but varied
- 61-85%: Systematic device deployment
- 86-100%: Every paragraph uses multiple devices

### 4. Tonal Uncanniness (Weight: 10%)

**What to measure:**
- **Hedging absence**: Count epistemic humility markers (maybe, sometimes, might, could, often)
  - AI tell: Zero instances in subjective claims = absolute certainty
- **Emotional labor asymmetry**: Compare action verbs assigned to different subjects
  - Calculate ratio of action burden
- **Defensive preemption**: Note vague gestures toward balance that don't address core issues

**Scoring rubric:**
- 0-30%: Natural hedging, epistemic humility present
- 31-60%: Some absolutes but balanced
- 61-85%: Mostly absolute claims, minimal hedging
- 86-100%: Zero hedging, universal quantifiers only

### 5. Logical Void (Weight: 20%)

**What to measure:**
- **Tautology count**: Identify circular definitions
  - Example: Defining X by assuming X
- **Evidence-free universalism**: Count universal claims without support
  - Example: "That's why men who provide feel like kings" (citation needed)
- **Confidence-specificity ratio**: Note inverse relationship
  - AI tell: Highest confidence in most abstract claims

**Scoring rubric:**
- 0-30%: Claims supported, specific evidence given
- 31-60%: Some unsupported claims but not pervasive
- 61-85%: Many tautologies and universal claims
- 86-100%: Almost entirely circular reasoning

### 6. Platitude Density (Weight: 20%)

**What to measure:**
- **Meaningful-nothing phrases**: Count statements that sound profound but carry zero specific meaning
  - Examples: "multiply the life you're building", "growth feels natural", "aligned with intention"
- **Frequency**: Calculate platitudes per sentence
  - AI tell: >1 platitude per 2 sentences

**Scoring rubric:**
- 0-30%: Specific, concrete language throughout
- 31-60%: Some vague phrases but mostly substantive
- 61-85%: High platitude frequency
- 86-100%: Nearly every sentence is a platitude

## Output Format

Structure your analysis as follows:

1. **The Original Text** - Quote the full text being analyzed at the top

2. **Table of Contents** - Link to all major sections for easy navigation

3. **Detailed Analysis** - For each dimension:
   - Section header with percentage score
   - Subsections (A, B, C) for specific patterns
   - Quantified counts and ratios
   - **AI Tell** callouts highlighting key patterns
   - Examples from the text with specific quotes

4. **Quantified Scoring Table** - Present all metrics with:
   - Metric name
   - Raw score (0-100%)
   - Weight (percentage)
   - Weighted contribution
   - **Total AI Slop Score** (sum of weighted scores)

5. **Core Theory Section** - Synthesize findings into overarching patterns:
   - Name the phenomenon (e.g., "Rhetorical Autopilot")
   - List 3-5 key principles explaining why it reads as AI
   - Conclude with **The Fatal Tell** - a memorable one-sentence summary

6. **References** - If applicable, cite sources

## Key Principles

### The "Rhetorical Autopilot" Theory

AI slop emerges from five core patterns:

1. **Pattern over substance**: Optimizes for *sounding* persuasive through formulaic devices rather than building actual arguments
2. **Abstraction escape velocity**: Each sentence drifts higher into abstraction to avoid falsifiable claims
3. **Symmetry addiction**: Overuse of balanced structures creates artificial harmony masking logical gaps
4. **Emotional LARP**: Mimics emotional depth through vocabulary without demonstrating it through specificity
5. **Zero revision markers**: No human messiness—no enjambment, broken patterns, or self-correction

### The Fatal Tell

**It reads like a first draft that thinks it's a final draft.**

Human writers create messy first drafts, then refine. AI generates pre-polished text that mistakes rhetorical flourish for earned wisdom.

## Examples

### High AI Slop Score (83%+)

**Characteristics:**
- 4%+ parallel construction density
- 1:3+ abstract-to-concrete ratio
- 6+ chiastic structures per 200 words
- Zero hedging language
- One platitude every 1.8 sentences
- Universal claims without evidence

### Low AI Slop Score (<30%)

**Characteristics:**
- Broken patterns and natural variation
- Rich concrete details and specific examples
- Sparing use of rhetorical devices
- Epistemic humility markers present
- Claims supported with evidence
- Revision markers and organic flow

## Analysis Tips

- **Count systematically**: Don't estimate—actually count patterns, structures, and word types
- **Calculate ratios**: Use precise ratios (e.g., 1:3.3) not ranges
- **Quote extensively**: Pull exact phrases to demonstrate patterns
- **Use tables**: Present quantified data in clear tables
- **Highlight AI tells**: Use ==highlighting== or **bold** for key AI patterns
- **Be precise**: Give exact percentages and counts, not approximations
- **Stay objective**: Focus on measurable patterns, not subjective judgment

## Advanced Patterns

### Compound Patterns

Watch for combinations that amplify AI tells:

- Parallel construction + chiasmus + platitude = Triple threat
- Abstraction ladder + tautology = Circular ascent
- Zero hedging + universal claims = Absolute vapor

### Context Matters

Consider the domain:

- **Marketing copy**: Higher tolerance for parallelism and abstraction
- **Academic writing**: Higher tolerance for hedging and qualifiers
- **Social media**: Lower expectations for evidence and support
- **Literary prose**: Natural use of rhetorical devices

Adjust thresholds based on genre expectations.

## References

For detailed examples and additional patterns, see:
- `references/sloptastic-examples.md` - Complete analysis examples with annotations
