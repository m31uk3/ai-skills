# Response Quality Analysis

## Overview

This SOP guides you through analyzing a problem statement and validating your response coverage before posting. It ensures you're solving the actual problem asked, not the problem you're comfortable addressing. The process systematically validates problem quality, decomposes it into components, analyzes your response coverage, and provides actionable improvement suggestions.

Use this workflow when responding to questions in forums (Slack, Stack Overflow, internal knowledge bases), writing to mailing lists, or any situation where you want to ensure your answer actually addresses what was asked.

## Parameters

- **original_problem** (required): The question or problem statement you're responding to
- **draft_response** (required): Your proposed answer or solution
- **response_context** (optional): Where this response will be posted (e.g., "Slack #tpm-leadership", "internal wiki", "Stack Overflow")
- **work_dir** (optional, default: ".sop/response-analysis"): Directory for analysis artifacts

**Constraints for parameter acquisition:**
- You MUST ask for both original_problem and draft_response upfront in a single prompt
- You MUST support multiple input methods:
  - Direct paste from conversation
  - Screenshot or image of the question
  - Link to thread or document
  - File upload (for longer content)
- You MUST use appropriate tools (OCR, web fetch, file read) based on input method
- You MUST confirm successful acquisition before proceeding
- You MUST create the work directory if it doesn't exist
- You SHOULD save both inputs to {work_dir}/original-problem.md and {work_dir}/draft-response.md

## Steps

### 1. Problem Intake Validation

Verify the problem is well-formed enough to analyze.

**Constraints:**
- You MUST create {work_dir}/intake-validation.md if it doesn't exist
- You MUST check for these required elements in the original problem:
  1. **Specific question**: Can be answered with concrete mechanism (not "help me with X")
  2. **Current state**: Describes what exists now (evidence of the problem)
  3. **Desired state**: Clear target outcome (what "solved" looks like)
  4. **Constraints**: Environmental limitations (org structure, available tools, culture)
  5. **Prior attempts**: What's been tried or current approach
  
- You MUST score each element as:
  - ✅ Present (clearly stated with details)
  - ⚠️ Partial (mentioned but vague)
  - ❌ Missing (not addressed)

- You MUST calculate Problem Quality Score: (count of ✅) / 5
- You MUST document findings in {work_dir}/intake-validation.md with evidence quotes
- You MUST present validation results to user:
  ```
  Problem Quality Assessment
  ========================
  
  Score: X/5 elements present
  
  ✅ Present:
  - [Element name]: [Evidence quote]
  
  ⚠️ Partial:
  - [Element name]: [What's unclear]
  
  ❌ Missing:
  - [Element name]: [Why needed]
  
  Assessment: [Well-formed / Needs clarification / Poorly defined]
  
  Options:
  [A] Proceed with analysis (score >= 3/5)
  [B] Generate clarifying questions for OP
  [C] Note limitations and proceed anyway
  [D] Cannot analyze - problem too vague
  
  What would you like to do?
  ```

- You MUST NOT proceed with analysis if score < 3/5 without user confirmation
- You MUST NOT inflate scores - be honest about missing elements
- You MUST wait for explicit user direction before proceeding

### 2. Problem Decomposition

Break the problem into addressable components with success criteria.

**Constraints:**
- You MUST create {work_dir}/decomposition.md
- You MUST extract problem components based ONLY on evidence in original problem
- You MUST NOT add components that seem reasonable but aren't evidenced
- You MUST format each component as:
  ```markdown
  ## Component: [Name]
  
  **Evidence:** "[Direct quote from original problem]"
  
  **What they're asking for:** [Specific need]
  
  **Success criteria:** [Observable outcome that would solve this]
  
  **Priority:** [Critical / Important / Nice-to-have]
  ```

- You MUST identify 2-5 components (if more, they're probably not distinct)
- You MUST assign priority based on:
  - Critical: Core to the question, must be addressed
  - Important: Strongly implied or explicitly mentioned
  - Nice-to-have: Would add value but not strictly necessary

- You MUST create a visual component map using mermaid:
  ```mermaid
  graph TD
    Q[Original Question] --> C1[Component 1]
    Q --> C2[Component 2]
    Q --> C3[Component 3]
  ```

- You MUST ask user:
  ```
  Problem Decomposition
  ====================
  
  I've identified [N] components:
  1. [Component name] - [Priority] - [One line description]
  2. [Component name] - [Priority] - [One line description]
  ...
  
  Questions:
  - Does this match your understanding of what they're asking?
  - Are there components I missed or incorrectly identified?
  - Should priorities be adjusted?
  ```

- You MUST NOT proceed without user confirmation
- You MUST revise decomposition based on user feedback
- You MUST update {work_dir}/decomposition.md with final version

### 3. Response Coverage Analysis

Map your draft response to problem components and calculate coverage.

**Constraints:**
- You MUST create {work_dir}/coverage-analysis.md
- You MUST analyze your draft response for each component:
  
  **Coverage calculation:**
  - 0% = Component not mentioned at all
  - 1-40% = Mentioned but vague/generic (no specifics)
  - 41-80% = Addressed with some specifics but incomplete
  - 81-100% = Fully addressed with concrete, actionable details
  
- You MUST justify coverage scores with evidence:
  ```markdown
  ## Component: [Name] - Coverage: X%
  
  **What they needed:** [Success criteria from decomposition]
  
  **What you provided:** 
  "[Quote from your response]"
  
  **Analysis:**
  - ✅ Strengths: [What you covered well]
  - ❌ Gaps: [What's missing or vague]
  - 📏 Specificity: [Concrete enough to implement?]
  
  **Coverage justification:** [Why this score]
  ```

- You MUST calculate overall coverage: average of component coverages
- You MUST weight by priority:
  - Critical components: 2x weight
  - Important components: 1x weight  
  - Nice-to-have: 0.5x weight

- You MUST create coverage matrix:
  ```
  Coverage Matrix
  ===============
  Component           | Priority  | Coverage | Weight | Contribution
  ----------------------------------------------------------------
  [Name]             | Critical  | X%      | 2.0    | Y
  [Name]             | Important | X%      | 1.0    | Y
  [Name]             | Nice      | X%      | 0.5    | Y
  
  Weighted Coverage: Z%
  ```

- You MUST identify the most critical gap (lowest coverage on highest priority)
- You MUST NOT be generous with coverage scores - be honest
- You MUST document in {work_dir}/coverage-analysis.md

### 4. Context Grounding Check

Verify your response fits the original context and constraints.

**Constraints:**
- You MUST create {work_dir}/context-check.md
- You MUST check for context mismatches:
  
  **1. Environment mismatch:**
  - Does your solution assume a different org structure?
  - Does it require tools/processes they didn't mention?
  - Does it assume a different culture (top-down vs bottom-up)?
  
  **2. Problem substitution:**
  - Are you solving the problem you've faced before?
  - Are you solving a related but different problem?
  - Are you solving a more general problem than asked?
  
  **3. Constraint violation:**
  - Does your solution violate stated constraints?
  - Does it require resources they said aren't available?
  - Does it assume capabilities they don't have?

- You MUST document each mismatch found:
  ```markdown
  ## Mismatch: [Type]
  
  **What they have:** [Their context from original problem]
  
  **What you assumed:** [Your assumption in response]
  
  **Impact:** [Why this matters]
  
  **Severity:** [Minor / Moderate / Critical]
  ```

- You MUST summarize context alignment:
  ```
  Context Grounding: [Strong / Moderate / Weak]
  - Environment: [Matches / Partially / Mismatches]
  - Problem: [Same / Related / Different]
  - Constraints: [Respected / Some violations / Major violations]
  
  Critical issue: [Describe if present]
  ```

- You MUST ask user:
  ```
  Are you solving THEIR problem or a similar one you've faced?
  
  [A] Their exact problem
  [B] A similar problem (need to adapt advice)
  [C] Different problem (need to reconsider approach)
  ```

- You MUST document in {work_dir}/context-check.md

### 5. Response Quality Validation

Run comprehensive testable conditions and score the response.

**Constraints:**
- You MUST create {work_dir}/validation-results.md
- You MUST run these tests:

  **Test 1: Restatement Test**
  - Can you restate the problem in your own words?
  - Would OP say "yes, that's exactly what I meant"?
  - Pass: Clear restatement matching all key elements
  - Fail: Restatement changes the problem

  **Test 2: Coverage Test**
  - Is weighted coverage >= 80%?
  - Are all Critical components >= 80% coverage?
  - Pass: Both conditions met
  - Partial: Weighted >= 60% OR criticals >= 60%
  - Fail: Below thresholds

  **Test 3: Specificity Test**
  - Can someone implement your advice tomorrow?
  - Does response include concrete mechanisms/steps?
  - Pass: Actionable with specifics
  - Partial: Has some specifics but gaps
  - Fail: Vague or generic advice

  **Test 4: Gap Acknowledgment Test**
  - Did you explicitly state what you didn't address?
  - Example: "This handles X but doesn't solve Y"
  - Pass: Gaps clearly acknowledged
  - Fail: Silent on limitations

  **Test 5: Context Grounding Test**
  - Does response fit their actual environment?
  - No critical context mismatches?
  - Pass: Strong alignment
  - Partial: Some adaptation needed
  - Fail: Major mismatches

  **Test 6: Implementation Path Test**
  - Can you trace: current state → your advice → solved state?
  - Are the steps connected without gaps?
  - Pass: Clear implementation path
  - Partial: Path exists but has gaps
  - Fail: Missing steps or logic jumps

- You MUST score each test: PASS (1.0) / PARTIAL (0.5) / FAIL (0.0)
- You MUST calculate Response Quality Score: (sum of test scores) / 6
- You MUST present results:
  ```
  Response Quality Assessment
  ===========================
  
  Coverage: X% (weighted)
  Quality Score: Y/6 tests passed
  
  ✅ PASS (1.0):
  - [Test name]: [Brief why]
  
  ⚠️ PARTIAL (0.5):
  - [Test name]: [What's missing]
  
  ❌ FAIL (0.0):
  - [Test name]: [Critical issue]
  
  Overall Assessment: [Excellent / Good / Needs Work / Poor]
  
  Critical Gap: [Most important missing piece]
  
  Recommendation: [Specific action]
  ```

- You MUST be honest in scoring - don't inflate to make user feel better
- You MUST document all results in {work_dir}/validation-results.md

### 6. Improvement Suggestions

Generate specific, actionable improvements for identified gaps.

**Constraints:**
- You MUST create {work_dir}/improvements.md
- You MUST provide suggestions for each gap (coverage < 80%)
- You MUST format each suggestion as:
  ```markdown
  ## Gap: [Component Name] - Currently X% coverage
  
  **What's missing:**
  [Specific elements needed to fully address this]
  
  **Current text:**
  "[Quote from your response or indicate not present]"
  
  **Suggested addition:**
  "[Concrete text that could be added - be specific]"
  
  **Why this helps:**
  [How this addresses the gap]
  
  **Priority:** [Critical / Important / Enhancement]
  ```

- You MUST order suggestions by priority (Critical first)
- You MUST make suggestions concrete enough to copy/paste
- You MUST ensure suggestions:
  - Use their context (not generic advice)
  - Are actionable (not "be more specific")
  - Connect to their stated problem
  - Provide mechanisms not just concepts

- You MUST NOT provide vague suggestions like:
  ❌ "Add more detail about the process"
  ✅ "Add: 'For intake, create a shared spreadsheet where Team A, B, C submit requests with [fields]. TPM reviews weekly and updates priority column.'"

- You MUST present to user:
  ```
  Improvement Suggestions
  ======================
  
  I've identified [N] gaps to address:
  
  Critical (must fix):
  1. [Component]: [One-line summary of gap]
  
  Important (should fix):
  2. [Component]: [One-line summary of gap]
  
  Enhancement (nice to have):
  3. [Component]: [One-line summary of gap]
  
  Which gaps would you like to address?
  [A] All critical gaps
  [B] All critical + important gaps
  [C] Specific gaps (which ones?)
  [D] None - proceed to decision
  ```

- You MUST wait for user selection
- You MUST document in {work_dir}/improvements.md

### 7. Revision Support (if requested)

Help improve the response by addressing selected gaps.

**Constraints:**
- You MUST work on ONE gap at a time
- You MUST for each gap:
  1. Show the current text (or indicate missing)
  2. Show the suggested addition
  3. Show the integrated result
  4. Calculate new coverage for this component
  
- You MUST present each revision as:
  ```
  Revision: [Component Name]
  ========================
  
  Current coverage: X% → Target: Y%
  
  --- BEFORE ---
  [Current relevant section or "Not addressed"]
  
  --- SUGGESTED ADDITION ---
  [New text to add]
  
  --- INTEGRATED RESULT ---
  [How it fits into full response]
  
  New coverage: Y%
  
  Approve this revision?
  [A] Yes, apply it
  [B] Modify suggestion (how?)
  [C] Skip this gap
  ```

- You MUST wait for approval on each revision
- You MUST update {work_dir}/draft-response.md with approved changes
- You MUST track revisions in {work_dir}/revision-history.md
- You MUST NOT make multiple changes without user review
- You MUST re-run coverage analysis after all revisions
- You MUST show updated scores:
  ```
  Revision Impact
  ===============
  
  Before: X% coverage, Y/6 quality score
  After:  X% coverage, Y/6 quality score
  
  Components improved:
  - [Component]: X% → Y%
  - [Component]: X% → Y%
  
  Tests improved:
  - [Test]: FAIL → PASS
  ```

### 8. Decision Point

Present final assessment and next action options.

**Constraints:**
- You MUST create {work_dir}/final-assessment.md
- You MUST present complete summary:
  ```
  Final Response Assessment
  =========================
  
  Problem Quality: X/5 elements
  Response Coverage: Y% (weighted)
  Quality Score: Z/6 tests
  
  Overall: [Excellent / Good / Acceptable / Needs Work / Poor]
  
  Strengths:
  - [What you covered well]
  
  Remaining Gaps:
  - [Critical gaps if any]
  - [Important gaps if any]
  
  Context Alignment: [Strong / Adequate / Weak]
  
  Recommendation: [Specific advice on whether to post]
  ```

- You MUST present clear options:
  ```
  What would you like to do?
  
  [A] Post response as-is
      → Coverage adequate for the question asked
      → Acknowledge limitations in post
  
  [B] Make additional revisions
      → Address: [specific gaps]
      → Expected improvement: X% → Y% coverage
  
  [C] Reconsider approach
      → Current approach may not fit their context
      → Consider: [alternative angle]
  
  [D] Request clarification from OP first
      → Missing critical info: [what you need]
      → Generate clarifying questions
  
  [E] Don't post this response
      → Coverage too low / major issues
      → Start over with different approach
  ```

- You MUST NOT recommend posting if:
  - Critical components have < 50% coverage
  - Context mismatches are severe
  - Quality score < 3/6

- You MUST explain why recommending each option
- You MUST wait for explicit user decision
- You MUST document final decision in {work_dir}/final-assessment.md

### 9. Post-Response Support (if posting)

Help format and frame the response for posting.

**Constraints:**
- You MUST ask: "Would you like help with:"
  ```
  [A] Add gap acknowledgment section
  [B] Frame limitations appropriately
  [C] Add clarifying questions to OP
  [D] Format for specific platform (Slack/Forum/etc)
  [E] None - I'm ready to post
  ```

- IF gap acknowledgment requested:
  - You MUST draft honest acknowledgment of limitations:
    ```
    "This addresses [components covered], but doesn't cover [gaps].
    For [gap], you might also want to consider [pointer]."
    ```
  - You MUST avoid over-apologizing
  - You MUST frame gaps as "areas for further discussion"

- IF platform formatting requested:
  - You MUST adapt to platform norms (Slack thread vs forum post)
  - You SHOULD add appropriate greeting/sign-off
  - You SHOULD structure for readability (spacing, emphasis)

- You MUST create final formatted response at {work_dir}/final-response.md
- You MUST present it to user for final approval

### 10. Learning Capture (optional)

Document insights for improving future responses.

**Constraints:**
- You MUST ask: "Would you like to capture learnings?"
- IF yes:
  - You MUST create {work_dir}/learnings.md
  - You SHOULD document:
    - What worked well in your approach
    - What you initially missed and why
    - Patterns in your blind spots
    - Improvements to make next time
  
- You SHOULD identify meta-patterns:
  ```
  Common issue: [Pattern you notice]
  Example: "I tend to solve feature overlap rather than dependency coordination"
  
  Improvement: [What to watch for next time]
  Example: "First check: is this about multiple teams requesting resources?"
  ```

- You MAY suggest: "Would you like me to analyze past responses for patterns?"

## Examples

### Example 1: Slack Response Analysis

**Input:**
```
original_problem: [Slack screenshot showing]
"How are folks handling multiple xfn dependency requests across a company? 
My org is basically work flying everywhere (boxes on the left). I'd like 
to shift to intra org prio and a single outbound list of priorities from 
team X to Team Y as shown on the right. Am I crazy? (edited)"

draft_response: [Your response about CPR office hours, convergence approach, 
feature taxonomies at Amazon]

response_context: "Slack #tpm-leadership channel"
```

**Interaction:**

```
Claude: Analyzing your response...

Problem Quality Assessment
========================

Score: 3/5 elements present

✅ Present:
- Specific question: "How to handle multiple xfn dependency requests"
- Current state: Diagram shows "work flying everywhere"
- Desired state: Diagram shows centralized coordination

⚠️ Partial:
- Constraints: Bottom-up culture implied but not explicit
- Prior attempts: "work flying everywhere currently" suggests trying something

❌ Missing:
None

Assessment: Well-formed enough to analyze

[A] Proceed with analysis

---

Problem Decomposition
====================

I've identified 4 components:

1. **Intake mechanism** - Critical
   Evidence: "multiple xfn dependency requests"
   What they need: Way to receive/collect requests from Teams A, B, C
   Success: Single place where Team X sees all incoming requests

2. **Prioritization framework** - Critical  
   Evidence: "single outbound list of priorities"
   What they need: Method to rank competing requests
   Success: Clear priority order that Teams A, B, C understand

3. **Communication/coordination** - Important
   Evidence: "from team X to Team Y" 
   What they need: How decisions get communicated
   Success: Stakeholders know status and reasoning

4. **Transition path** - Important
   Evidence: Left diagram → Right diagram
   What they need: How to move from chaos to structure
   Success: Concrete steps to implement the change

Does this match your understanding?

User: Yes, that's exactly right.

---

Coverage Analysis
================

Component: Intake mechanism - Coverage: 40%

What they needed: Single place to receive requests from multiple teams

What you provided: "CPR office hours which allows anyone to sign up"

Analysis:
✅ Strengths: Mentioned a mechanism (CPR)
❌ Gaps: 
  - How do requests actually get submitted?
  - What information is required?
  - How does Team X see consolidated view?
📏 Specificity: Too vague - "office hours" could mean many things

Coverage justification: Mentioned but lacks critical details

---

Component: Prioritization framework - Coverage: 0%

What they needed: Method to rank competing requests

What you provided: [No mention of prioritization method]

Analysis:
❌ Gaps: Not addressed at all

Coverage justification: Completely missing

---

Component: Communication/coordination - Coverage: 30%

What they needed: How decisions get communicated

What you provided: "Feature taxonomy... invaluable tool"

Analysis:
⚠️ Strengths: Mentions a coordination tool
❌ Gaps:
  - Indirect - taxonomy helps identify overlap, not coordinate requests
  - Doesn't explain how Team X communicates priorities to A, B, C
  - Assumes Amazon-style feature planning

Coverage justification: Tangentially related but doesn't answer question

---

Component: Transition path - Coverage: 10%

What they needed: How to move from current chaos to structure

What you provided: No concrete steps mentioned

Coverage justification: Not addressed

---

Coverage Matrix
===============
Component           | Priority  | Coverage | Weight | Contribution
----------------------------------------------------------------
Intake mechanism    | Critical  | 40%      | 2.0    | 0.40
Prioritization      | Critical  | 0%       | 2.0    | 0.00
Communication       | Important | 30%      | 1.0    | 0.30
Transition path     | Important | 10%      | 1.0    | 0.10

Weighted Coverage: 16% ⚠️

Critical Gap: Prioritization framework (0% coverage, Critical priority)

---

Context Grounding: Weak

Environment mismatch:
- They show diagram of direct team-to-team requests
- You assume Amazon-style org with "flagship product/UX leaders"
- Severity: Moderate - solution may not fit their structure

Problem substitution:
- They're asking: "How to coordinate incoming dependency requests"
- You're solving: "How to identify feature overlap and converge"
- Severity: Critical - these are related but different problems

---

Response Quality Assessment
===========================

Coverage: 16% (weighted)
Quality Score: 1.5/6 tests passed

✅ PASS:
- None

⚠️ PARTIAL:
- Specificity Test: CPR mentioned but not detailed enough
- Context Test: Has some relevant experience but wrong context
- Restatement Test: Would partially recognize their problem

❌ FAIL:
- Coverage Test: 16% vs 80% threshold
- Gap Acknowledgment Test: Gaps not mentioned
- Implementation Path Test: Can't trace current → solved

Overall Assessment: Needs Significant Work

Critical Gap: No prioritization mechanism provided

Recommendation: Major revisions needed before posting

---

What would you like to do?

[A] Post response as-is
    → Coverage: 16% - likely won't help them
    → Would need major gap acknowledgment

[B] Make additional revisions  
    → Address prioritization (0% → 80% = +32% coverage)
    → Clarify intake mechanism (+20% coverage)
    → Expected improvement: 16% → 68% coverage

[C] Reconsider approach
    → Current approach focuses on your Amazon experience
    → Consider: Ask them clarifying questions first

[D] Request clarification from OP first
    → Missing: Do they want tool recommendations or process advice?
    → Missing: What's their org culture like?

User: B - make revisions

---

Improvements
============

Critical Gap: Prioritization framework - Currently 0%

What's missing: Method to rank competing dependency requests

Suggested addition:
"For prioritization, establish a weekly dependency review where Team X's TPM:
1. Reviews all incoming requests in a shared tracker
2. Scores each by: Business impact, Urgency, Team X capacity
3. Publishes updated priority queue visible to all requesters
4. Adjusts weekly based on changing priorities

Use a simple scoring rubric (e.g., High/Med/Low for each factor) rather than complex calculations."

Why this helps: Provides concrete mechanism for the "single outbound list of priorities" they want

Priority: Critical

Approve this revision?

[A] Yes, apply it

User: A

[Continues with other gaps...]
```

### Example 2: Technical Documentation Review

**Input:**
```
original_problem: "Can you review my API documentation and tell me if it's complete?"
draft_response: [Your review of the docs]
response_context: "Internal code review"
```

**Interaction:**

```
Claude: I need to validate the problem before analyzing your review.

Problem Quality Assessment: 2/5 elements

✅ Present:
- Specific question: "Is API documentation complete?"

❌ Missing:
- Current state: What docs exist?
- Desired state: Complete for what purpose? (public API? internal?)
- Constraints: Any standards to follow?
- Prior attempts: First draft? Been reviewed before?

Assessment: Poorly defined

This problem needs clarification before I can assess if your review addresses it.

Options:
[D] Cannot analyze - problem too vague

Recommendation: Request more context from OP before proceeding with review.

Would you like me to generate clarifying questions to ask them?

User: Yes

Claude: Here are clarifying questions to ask:

1. "What's the purpose of this API documentation? (e.g., public developers, internal team, partners)"

2. "What does 'complete' mean in your context? Are you checking for:
   - All endpoints documented?
   - Code examples for each endpoint?
   - Error handling coverage?
   - Authentication flow?
   - All of the above?"

3. "Are there documentation standards I should compare against?"

4. "Has this been reviewed before, or is this a first draft?"

These will help ensure your review addresses what they actually need.
```

## Troubleshooting

### Low Coverage Despite Effort

**Symptoms:**
- You wrote a lot but coverage is still < 50%
- Lots of detail but doesn't address components

**Cause:**
- Solving a related but different problem
- Adding context that wasn't asked for
- Focusing on interesting tangents

**Resolution:**
1. Go back to decomposition - read their question again
2. For each paragraph you wrote, ask: "Which component does this address?"
3. Cut content that doesn't map to components
4. Add content specifically for uncovered components

**Prevention:**
- Start by restating the problem in your own words
- Map your outline to components before writing
- Check coverage before writing full response

### Context Mismatches Keep Appearing

**Symptoms:**
- Solutions require their org to work like yours
- Assumptions about available tools/processes
- Can't implement without major changes

**Cause:**
- Pattern-matching to your experience
- Not reading constraints carefully
- Making reasonable but unwarranted assumptions

**Resolution:**
1. List every assumption you made
2. Check each assumption against original problem
3. Either remove assumption or adapt solution
4. Frame as "If you have X, you could..." vs "You should do X"

**Prevention:**
- Explicitly note their constraints before responding
- Ask yourself: "Could this work in a different org structure?"
- Use conditional language when assumptions needed

### Tests Pass But Response Feels Wrong

**Symptoms:**
- Coverage looks good (>80%)
- Tests pass
- But something feels off

**Possible causes:**
- Gaming the metrics (generous coverage scores)
- Technically addresses components but not spirit of question
- Missing implicit context

**Resolution:**
1. Re-read original problem fresh
2. Ask: "If I received this response, would I be satisfied?"
3. Check if you addressed the *letter* vs *spirit* of question
4. Lower coverage scores if being too generous

**Prevention:**
- Be honest in coverage assessment
- Use "Would this help them?" as ultimate test
- Consider having someone else review your assessment

### Validation Takes Too Long

**Symptoms:**
- Analysis takes longer than writing response
- Process feels heavyweight for simple questions

**Cause:**
- Using full workflow for questions that don't need it
- Over-analyzing straightforward problems

**Resolution:**
- For simple, well-defined questions: Skip to Step 3 (coverage analysis)
- For obvious gaps: Skip validation, go straight to improvements
- Use judgment on how rigorous to be

**Quick heuristics:**
- Simple factual question → Don't need full process
- Asking for advice/approach → Use full process
- Vague or complex problem → Definitely use full process

## Version History

- v1.0 (2024-12-28): Initial SOP based on meta-pattern and analysis of Slack response example
