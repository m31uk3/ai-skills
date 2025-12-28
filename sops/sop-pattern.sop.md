# AI Workflow Engineering Pattern (Meta-SOP)

## Overview

This SOP codifies the universal pattern for building reliable AI workflows that has independently emerged across multiple successful AI workflow systems (PDD, HumanLayer, Agent SOPs). It provides a structured approach to creating workflows that manage LLM uncertainty, coordinate human-AI collaboration, and ensure quality outcomes through explicit constraints, validation gates, and iterative refinement.

Use this meta-pattern when you need to create a new AI workflow, SOP, or structured process for solving complex problems with LLMs. The pattern works because it addresses fundamental challenges of probabilistic systems: managing uncertainty, decomposing complexity, validating progress, and coordinating human oversight at critical decision points.

## Parameters

- **workflow_domain** (required): The domain or problem space this workflow will address (e.g., "response quality analysis", "code review", "design documentation", "meeting facilitation")
- **primary_goal** (required): The main outcome the workflow should achieve
- **target_users** (optional): Who will use this workflow (e.g., "software engineers", "technical writers", "product managers")
- **output_location** (optional, default: "./workflows"): Directory where workflow artifacts will be created

**Constraints for parameter acquisition:**
- You MUST ask for all required parameters upfront in a single prompt
- You MUST ensure the workflow_domain is specific enough to be actionable
- You MUST confirm the primary_goal is measurable or observable
- You MUST NOT proceed without clear understanding of what success looks like
- You SHOULD ask clarifying questions if the domain or goal is ambiguous

## Steps

### 1. Workflow Domain Analysis

Understand the problem space and identify key challenges that the workflow must address.

**Constraints:**
- You MUST identify the core challenges in this domain that make it difficult without structure
- You MUST document what failure looks like without a workflow (e.g., "responses miss the actual question", "code reviews focus on style over substance")
- You MUST identify natural decision points where human judgment is critical
- You MUST identify where LLM uncertainty is highest and needs constraints
- You MUST create a file at {output_location}/domain-analysis.md documenting:
  - Problem statement
  - Failure modes without structure
  - Critical decision points
  - Sources of uncertainty
  - Success criteria
- You MUST ask the user to validate this analysis before proceeding

### 2. Input/Output Specification

Define what inputs the workflow requires and what outputs it produces.

**Constraints:**
- You MUST specify all required parameters with:
  - Name and type
  - Description
  - Whether required or optional
  - Default values for optional parameters
  - Validation constraints
- You MUST specify all outputs the workflow will produce with:
  - Artifact type (file, summary, score, decision)
  - Format specification
  - Success criteria for each output
- You MUST identify multiple input methods users might prefer:
  - Direct text input
  - File upload
  - URL/link
  - API integration
  - Other domain-specific methods
- You MUST define validation rules for inputs (what makes an input "well-formed")
- You MUST create a file at {output_location}/io-specification.md
- You MUST NOT proceed without clear, testable specifications

### 3. Phase Decomposition

Break the workflow into distinct phases with clear boundaries and transitions.

**Constraints:**
- You MUST follow the universal phase structure:
  1. **Intake/Investigation Phase** - Gather and validate inputs
  2. **Decomposition/Planning Phase** - Structure the work
  3. **Execution Phase(s)** - Do the work iteratively
  4. **Validation/Review Phase** - Check quality
  5. **Decision Point Phase** - Human chooses next action
- You MUST define for each phase:
  - Objective (what this phase accomplishes)
  - Entry criteria (what must be true to enter)
  - Exit criteria (what must be true to exit)
  - Key activities
  - Outputs produced
  - Checkpoint questions for user
- You MUST identify which phases can iterate back to previous phases
- You MUST identify where human confirmation is required vs optional
- You MUST create a file at {output_location}/phases.md
- You MUST include a mermaid state diagram showing phase transitions
- You MUST ask user: "Do these phases cover the complete workflow?"

### 4. Constraint Definition

Define explicit constraints that govern behavior within each phase.

**Constraints:**
- You MUST use RFC 2119 language (MUST/MUST NOT/SHOULD/SHOULD NOT/MAY)
- You MUST define constraints for each phase in three categories:
  
  **1. Action Constraints** - What the agent must/must not do:
  ```
  - You MUST [action] before [other action]
  - You MUST NOT [anti-pattern] because [reason]
  - You SHOULD [best practice] when [condition]
  ```
  
  **2. Interaction Constraints** - How to engage with the user:
  ```
  - You MUST ask ONE question at a time
  - You MUST wait for explicit user confirmation before proceeding
  - You MUST present [summary/options/state] before decision points
  ```
  
  **3. Validation Constraints** - How to verify correctness:
  ```
  - You MUST verify [condition] is met
  - You MUST check that [artifact] contains [required elements]
  - You MUST calculate [metric] and compare to [threshold]
  ```

- You MUST include rationale for critical constraints using "because":
  ```
  You MUST NOT list all questions at once because this overwhelms users and leads to incomplete responses
  ```

- You MUST identify anti-patterns (common failure modes) and write constraints to prevent them
- You MUST make constraints observable and testable
- You MUST create a file at {output_location}/constraints.md organized by phase
- You MUST ask user: "Are there additional constraints or anti-patterns you've observed?"

### 5. Checkpoint Design

Design explicit checkpoints where human decision-making is required.

**Constraints:**
- You MUST identify at least one checkpoint per phase
- You MUST define for each checkpoint:
  - **Trigger**: When does this checkpoint occur?
  - **Context**: What information is presented to user?
  - **Options**: What choices does the user have?
  - **Default**: What happens if user provides no direction?
- You MUST use this checkpoint template:
  ```markdown
  ## Checkpoint: [Name]
  
  **Trigger:** [When this occurs]
  
  **Present to user:**
  - Current state: [Summary of progress]
  - Key findings: [Important discoveries or issues]
  - Quality metrics: [Scores, coverage, completeness]
  
  **Options:**
  [A] [First option - typically "proceed"]
  [B] [Second option - typically "iterate/revise"]  
  [C] [Third option - typically "change approach"]
  [D] [Fourth option - typically "request more info"]
  
  **Question:** [Explicit question to user]
  
  **Constraints:**
  - You MUST wait for user response
  - You MUST NOT auto-select an option
  - You MUST support returning to previous phases
  ```

- You MUST ensure checkpoints align with natural decision points identified in domain analysis
- You MUST NOT create checkpoints that are purely informational (no decision required)
- You MUST create a file at {output_location}/checkpoints.md
- You MUST ask user: "Are these the right decision points?"

### 6. Validation Framework

Define testable conditions and scoring mechanisms for quality assurance.

**Constraints:**
- You MUST create testable pass/fail conditions for:
  - Input validation (is input well-formed?)
  - Phase completion (is this phase done?)
  - Output quality (does output meet criteria?)
  - Overall workflow success (did we achieve the goal?)

- You MUST use this test definition template:
  ```markdown
  ## Test: [Name]
  
  **Purpose:** [What this validates]
  
  **Method:** [How to perform the test]
  
  **Pass criteria:** [Specific, observable conditions for pass]
  
  **Fail criteria:** [Specific, observable conditions for fail]
  
  **Partial criteria:** [Conditions for partial success, if applicable]
  
  **Score calculation:** [If numeric, how to calculate]
  ```

- You MUST define at least these core tests:
  1. **Completeness Test**: Are all required elements present?
  2. **Coverage Test**: Does output address all input components?
  3. **Specificity Test**: Is output actionable and concrete?
  4. **Context Test**: Does output fit the given constraints?

- You MUST define overall success metrics:
  - Minimum passing score/criteria
  - What constitutes "excellent" vs "acceptable" vs "needs revision"
  
- You MUST create a file at {output_location}/validation-framework.md
- You MUST include examples of pass/fail/partial cases
- You MUST ask user: "Are these the right quality criteria?"

### 7. Artifact Specification

Define the concrete outputs and intermediate artifacts the workflow produces.

**Constraints:**
- You MUST specify for each artifact:
  - File path/name pattern
  - Format (markdown, JSON, code, etc.)
  - Required sections/structure
  - Content constraints
  - When it's created/updated
  - Who can access it (user, agent, both)

- You MUST distinguish between:
  - **Checkpoint artifacts**: Preserve state for resumption (e.g., decomposition.md)
  - **Intermediate artifacts**: Support the process (e.g., research-notes.md)
  - **Final artifacts**: The workflow's main outputs (e.g., detailed-design.md)

- You MUST ensure artifacts support:
  - Resumption after interruption
  - Iteration and revision
  - Inspection by users
  - Context management (what to keep in LLM context vs. externalize)

- You MUST create a file at {output_location}/artifacts.md with:
  - Complete artifact list
  - Directory structure
  - File templates for key artifacts
  - Artifact lifecycle (create → update → archive)

- You MUST ask user: "Will these artifacts support your workflow needs?"

### 8. Example Scenarios

Create concrete examples showing the workflow in action.

**Constraints:**
- You MUST create at least two example scenarios:
  1. **Success scenario**: Everything goes smoothly
  2. **Iteration scenario**: Multiple refinement cycles needed

- You MUST show for each example:
  - Initial inputs
  - Interaction at each checkpoint
  - User responses
  - Artifacts created
  - Final outputs
  - Quality scores

- You MUST write examples in dialogue format showing agent-user interaction
- You MUST include realistic failure modes and how workflow handles them
- You MUST demonstrate iteration back to earlier phases
- You MUST create a file at {output_location}/examples.md
- You MUST ask user: "Do these examples accurately represent real usage?"

### 9. Troubleshooting Guide

Document common issues and their resolutions.

**Constraints:**
- You MUST identify potential failure modes:
  - Inputs are incomplete or ambiguous
  - User gets stuck at a checkpoint
  - Quality metrics fail to improve with iteration
  - Workflow becomes too complex
  - Context limits are reached

- You MUST provide for each failure mode:
  - Symptoms (how to recognize it)
  - Causes (why it happens)
  - Resolution steps (what to do)
  - Prevention (how to avoid it)

- You MUST create a file at {output_location}/troubleshooting.md
- You MUST ask user: "What other issues have you encountered?"

### 10. Meta-Documentation

Create the final SOP document and any supporting materials.

**Constraints:**
- You MUST generate the complete SOP in standard format:
  ```markdown
  # [Workflow Name]
  
  ## Overview
  [What this workflow does and when to use it]
  
  ## Parameters
  [Required and optional inputs with constraints]
  
  ## Steps
  ### 1. [Phase Name]
  [Phase description with constraints]
  ...
  
  ## Examples
  [Concrete usage examples]
  
  ## Troubleshooting
  [Common issues and resolutions]
  ```

- You MUST create the complete SOP at {output_location}/workflow.sop.md
- You MUST create a summary document at {output_location}/README.md explaining:
  - What problem this workflow solves
  - When to use it
  - Quick start guide
  - File structure
  - Key principles

- You MUST create a visual workflow diagram using mermaid
- You SHOULD create a quick reference card with:
  - Phase checklist
  - Key constraints
  - Checkpoint questions

- You MUST ask user: "Would you like me to generate any additional formats (e.g., SKILL.md for Claude, MCP prompt format)?"

### 11. Validation and Testing

Test the workflow definition for completeness and usability.

**Constraints:**
- You MUST verify the workflow has:
  - [ ] Clear entry and exit criteria
  - [ ] All five core phases (intake, decomposition, execution, validation, decision)
  - [ ] Explicit constraints using MUST/SHOULD/MAY
  - [ ] Checkpoints at critical decision points
  - [ ] Testable validation conditions
  - [ ] Concrete examples
  - [ ] Troubleshooting guidance

- You MUST verify constraints are:
  - [ ] Observable (can be checked)
  - [ ] Specific (not vague)
  - [ ] Justified (include rationale for critical ones)

- You MUST verify checkpoints:
  - [ ] Prevent auto-progression
  - [ ] Present clear options
  - [ ] Support iteration

- You MUST create a validation report at {output_location}/validation-report.md
- You MUST score the workflow on:
  - Completeness (all required elements present)
  - Clarity (easy to understand)
  - Actionability (can be followed)
  - Robustness (handles edge cases)

- You MUST ask user: "What aspects need refinement before this workflow is ready?"

### 12. Iteration Checkpoint

Determine if the workflow is ready or needs revision.

**Constraints:**
- You MUST present a summary:
  ```
  Workflow Engineering Summary
  ============================
  Domain: [workflow_domain]
  Phases: [count] phases defined
  Constraints: [count] explicit constraints
  Checkpoints: [count] decision points
  Tests: [count] validation tests
  Artifacts: [count] output files
  
  Validation Score: X/10
  - Completeness: [score/details]
  - Clarity: [score/details]
  - Actionability: [score/details]
  - Robustness: [score/details]
  
  Ready for use: [Yes/Needs revision]
  ```

- You MUST ask user to choose:
  ```
  Options:
  [A] Workflow is ready - generate final deliverables
  [B] Revise specific sections (which ones?)
  [C] Add more examples or troubleshooting
  [D] Simplify - workflow is too complex
  [E] Test with a real scenario first
  ```

- You MUST NOT auto-proceed without user confirmation
- You MUST support iteration back to any previous step
- You MUST maintain all artifacts across iterations

### 13. Delivery and Packaging

Generate final deliverables in requested formats.

**Constraints:**
- You MUST generate the workflow as a .sop.md file following standard format
- You MUST create a SKILL.md format if user wants to use with Claude
- You MUST create an MCP prompt format if user wants to use with Claude Code
- You MUST package all artifacts into the {output_location} directory
- You MUST create a final README.md with:
  - Quick start instructions
  - Usage examples
  - Links to all artifacts
  - Version information
  - Contribution guidelines (if applicable)

- You MUST present to user:
  ```
  Workflow Created Successfully
  ============================
  
  Files created:
  - {output_location}/workflow.sop.md (main SOP)
  - {output_location}/README.md (quick start)
  - {output_location}/domain-analysis.md
  - {output_location}/phases.md
  - {output_location}/constraints.md
  - [... other artifacts ...]
  
  Next steps:
  1. Review the workflow.sop.md file
  2. Test with a real scenario
  3. Iterate based on results
  4. Share with target users for feedback
  
  Would you like me to:
  [A] Walk through the workflow with a test case
  [B] Generate additional formats
  [C] Create training materials
  [D] We're done!
  ```

## Examples

### Example 1: Creating a "Code Review Quality" Workflow

**Input:**
```
workflow_domain: "code review quality assurance"
primary_goal: "ensure code reviews focus on architecture and correctness rather than style"
target_users: "senior engineers reviewing pull requests"
```

**Interaction at Domain Analysis:**
```
Agent: I've identified these key challenges for code review:

Failure modes without structure:
- Reviews focus on style (formatting, naming) over substance
- Reviewers miss architectural issues
- Inconsistent review depth across reviewers
- No validation that concerns were actually addressed

Critical decision points:
1. Is this PR ready for detailed review? (size, tests, description)
2. Are architectural concerns present? (if yes, block on those first)
3. Have all concerns been addressed? (before approval)

Does this match your experience?

User: Yes, but also add: reviewers sometimes approve without testing locally

Agent: Good catch. Adding to failure modes:
- Reviewers approve without validating functionality works
- No requirement to run tests or test manually

Should I add a checkpoint: "Have you pulled and tested this PR locally?"

User: Yes, make it required for PRs that change user-facing behavior

Agent: [Updates domain-analysis.md]

Proceeding to input/output specification...
```

**Generated Workflow Structure:**
```
code-review-quality/
├── workflow.sop.md
├── README.md
├── domain-analysis.md
├── io-specification.md
├── phases.md
│   (Phases: Intake → Readiness Check → Architectural Review → 
│    Implementation Review → Testing Validation → Approval Decision)
├── constraints.md
│   (E.g., "You MUST NOT approve PRs with architectural concerns
│    before those concerns are resolved")
├── checkpoints.md
├── validation-framework.md
│   (Tests: completeness, correctness, test coverage, functionality)
├── artifacts.md
│   (review-checklist.md, architectural-analysis.md, approval-summary.md)
├── examples.md
└── troubleshooting.md
```

### Example 2: Creating a "Meeting Facilitation" Workflow

**Input:**
```
workflow_domain: "technical meeting facilitation"
primary_goal: "ensure meetings have clear outcomes and action items"
target_users: "engineering managers running planning meetings"
```

**Key Phases Generated:**
1. Pre-meeting preparation (agenda validation, participant confirmation)
2. Meeting opening (goal setting, time boxing)
3. Discussion facilitation (parking lot, decision capture)
4. Action item creation (owner assignment, deadline setting)
5. Meeting closing (summary, next steps)

**Key Constraints Generated:**
```markdown
- You MUST NOT proceed past agenda validation if objectives are unclear
- You MUST capture decisions in real-time, not reconstruct afterwards
- You MUST assign an owner to each action item before closing
- You SHOULD time-box discussions and enforce limits
- You MAY suggest breaking into smaller meetings if agenda is too large
```

**Key Checkpoints Generated:**
- Before meeting: "Is agenda complete with clear objectives?"
- During discussion: "Should this topic be parked for later?"
- Before closing: "Does everyone agree on decisions and action items?"
- After meeting: "Were objectives met? Schedule follow-up needed?"

## Troubleshooting

### Workflow Becomes Too Complex

**Symptoms:**
- Too many phases (more than 7-8)
- Too many checkpoints (user fatigue)
- Constraints document exceeds 2 pages
- Examples are hard to follow

**Resolution:**
1. Merge similar phases
2. Identify which checkpoints are truly critical
3. Move detailed constraints to appendices
4. Split into multiple workflows (e.g., basic and advanced)

**Prevention:**
- Start simple, add complexity only when needed
- Each phase should have one clear objective
- Checkpoints only at real decision points

### Constraints Are Not Testable

**Symptoms:**
- Constraints use vague language ("should be good", "make it better")
- No clear pass/fail criteria
- Can't verify if constraint was followed

**Resolution:**
1. Convert to MUST/SHOULD/MAY language
2. Add observable conditions
3. Include examples of pass and fail

**Example transformation:**
- Before: "You should make the response helpful"
- After: "You MUST include at least one concrete example for each recommendation"

### Users Ignore Checkpoints

**Symptoms:**
- Users just say "continue" without reviewing
- Workflow runs on auto-pilot
- Quality suffers

**Resolution:**
1. Make checkpoint summaries more scannable
2. Highlight critical information that needs attention
3. Ask specific questions rather than "proceed?"
4. Show impact of decision ("If you proceed without research, design may be incomplete")

**Prevention:**
- Design checkpoints around real uncertainty
- Present just enough context for informed decision
- Make options concrete and distinct

### Workflow Doesn't Handle Iteration Well

**Symptoms:**
- Hard to go back to previous phase
- Lost work when revising
- Unclear how to incorporate feedback

**Resolution:**
1. Add explicit iteration paths in phase diagram
2. Create versioned artifacts (design-v1.md, design-v2.md)
3. Add "revision checkpoint" after validation
4. Document what changes between iterations

**Prevention:**
- Build iteration paths into initial design
- Use checkpoint artifacts that preserve state
- Support non-linear progression from the start

## Universal Workflow Principles

The following principles should guide all AI workflows:

### 1. Explicit Over Implicit
- Make all constraints explicit with MUST/SHOULD/MAY
- Make all checkpoints explicit with clear options
- Make all artifacts explicit with defined structure
- Never rely on LLM "common sense"

### 2. Validate Early and Often
- Validate inputs before processing
- Validate outputs before delivery
- Validate assumptions at checkpoints
- Fail fast with clear error messages

### 3. Human-in-the-Loop at Critical Points
- Auto-progress only on mechanical steps
- Require confirmation for decisions
- Support iteration at any time
- Present context for informed choices

### 4. Observable and Measurable
- Every step produces observable artifact
- Every phase has measurable exit criteria
- Every output has quality metrics
- Every checkpoint has clear state summary

### 5. Robust to Interruption
- Support resumption from any checkpoint
- Preserve state in artifacts
- Don't rely on conversation context alone
- Make workflow progress inspectable

### 6. Iterative by Design
- Non-linear phase progression
- Easy to revise and refine
- Clear paths back to earlier phases
- Support multiple refinement cycles

### 7. Constrained but Flexible
- Rigid structure (phases, checkpoints)
- Flexible content (adapt to domain)
- Hard constraints (MUST) for critical paths
- Soft constraints (SHOULD) for best practices

## Meta-Validation Checklist

Use this to verify your workflow follows the universal pattern:

**Core Structure:**
- [ ] Has intake/validation phase
- [ ] Has decomposition/planning phase  
- [ ] Has iterative execution phase(s)
- [ ] Has validation/review phase
- [ ] Has decision point phase

**Constraints:**
- [ ] Uses RFC 2119 language (MUST/SHOULD/MAY)
- [ ] Includes rationale for critical constraints
- [ ] Defines anti-patterns to prevent
- [ ] All constraints are testable/observable

**Checkpoints:**
- [ ] At least one per major phase
- [ ] Prevents auto-progression
- [ ] Presents clear options
- [ ] Supports iteration backward

**Validation:**
- [ ] Defines success criteria
- [ ] Has measurable quality metrics
- [ ] Includes pass/fail tests
- [ ] Calculates completeness/coverage

**Artifacts:**
- [ ] Preserves checkpoint state
- [ ] Supports resumption
- [ ] User-inspectable
- [ ] Well-structured (templates provided)

**Examples:**
- [ ] Shows success scenario
- [ ] Shows iteration scenario
- [ ] Demonstrates checkpoints
- [ ] Shows quality validation

**Usability:**
- [ ] Clear when to use this workflow
- [ ] Concrete enough to follow
- [ ] Not overly complex (< 8 phases)
- [ ] Handles common failure modes

## Version History

- v1.0 (2024-12-28): Initial meta-pattern codification based on analysis of PDD, HumanLayer, Agent SOPs, and response quality patterns

## Contributing

This meta-pattern is designed to evolve. If you discover additional universal principles or patterns while building workflows, they should be added here. Consider this a living document that captures the emerging discipline of AI workflow engineering.
