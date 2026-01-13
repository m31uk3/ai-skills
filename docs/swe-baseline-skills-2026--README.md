# SWE Baseline Skills for 2026 - Documentation Overview

## What This Is

A curated context document that teaches the five baseline technical skills software engineers need in 2026 through hands-on agent construction. Combines a technical vlog transcript with a working Go codebase workshop to transform abstract AI coding concepts into concrete, buildable skills.

**Target audience**: Junior to mid-level software engineers who need practical experience building AI agents.

**Workshop repository**: [`github.com/ghuntley/how-to-build-a-coding-agent`](https://github.com/ghuntley/how-to-build-a-coding-agent)

---

## Major Changes from Original Version

### 1. **Skills-First Structure**

The document is now organized around **actionable skill development** rather than industry fear:

- **Section A**: Core Technical Skills (The Five Baseline Skills) - Each skill includes actual code snippets from the workshop with line number links
- **Section B**: Skill Development Path (Workshop Progression) - Step-by-step hands-on learning with specific files to run
- **Section C**: Advanced Concepts & Patterns - For deeper understanding
- **Section D**: Interview Preparation - Practical exercises and talking points
- **FAQs**: Industry context and career implications (moved out of main flow)

### 2. **Direct Code Examples Throughout**

Every concept now has **real, runnable code** from the workshop:

| Concept | Code Example | Link |
|---------|--------------|------|
| Inferencing loop | Message array append pattern | [`chat.go:99-106`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/chat.go#L99-L106) |
| Tool calling architecture | Tool registration and execution | [`read.go:219-251`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/read.go#L219-L251) |
| Tool execution loop | Nested loop structure | [`read.go:122-210`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/read.go#L122-L210) |
| Read primitive | File reading implementation | [`read.go:273-288`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/read.go#L273-L288) |
| List primitive | Directory traversal | [`list_files.go:302-355`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/list_files.go#L302-L355) |
| Bash primitive | Shell command execution | [`bash_tool.go:372-389`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/bash_tool.go#L372-L389) |
| Edit primitive | Search-and-replace editing | [`edit_tool.go:412-464`](https://github.com/ghuntley/how-to-build-a-coding-agent/blob/main/edit_tool.go#L412-L464) |

### 3. **Hands-On Learning Path**

Six progressive phases with specific commands to run:

```bash
# Phase 1: Basic Chat (0 tools)
go run chat.go
# Try: "Hello!" or "Tell me a joke"

# Phase 2: File Reader (1 tool)
go run read.go
# Try: "What's in riddle.txt?"

# Phase 3: File Explorer (2 tools)
go run list_files.go
# Try: "What files are in this project?"

# Phase 4: Command Runner (3 tools)
go run bash_tool.go
# Try: "Run git status"

# Phase 5: File Editor (4 tools) ← Full coding agent!
go run edit_tool.go
# Try: "Create a Python hello world script"

# Phase 6: Code Search (5 tools - optional)
go run code_search_tool.go
# Try: "Find all function definitions"
```

Each phase builds on the previous, adding one tool at a time.

### 4. **Content Reorganization**

**Moved to FAQs** (important but not skill-building):
- Industry economic context ($10.42/hour vs human wages)
- Z80 clean room design story
- Timeline and cohort discussion
- Corporate transformation lag predictions
- Consumer vs. builder divide
- Career anxiety and urgency framing

**Kept in main flow** (essential for building):
- The five baseline technical skills
- Code examples and architecture
- Workshop progression
- Interview preparation
- Practice exercises

### 5. **New Interview Preparation Section**

Added dedicated section with:

**Whiteboard exercises companies ask**:
- "Draw the inferencing loop. Label each part."
- "How does tool calling work? Explain the flow."
- "What are the four tool primitives? Why these four?"

**Three concrete practice exercises**:
1. **Weather agent** (30 minutes) - Add `get_weather` tool to `chat.go`
2. **Git integration** (45 minutes) - Add git tools to `bash_tool.go`
3. **Test coverage agent** (2 hours) - Build Ralph loop for automated testing

**Portfolio project ideas**:
- Complete workshop and push to GitHub
- Build custom tools (database query, API caller, code formatter)
- Build Ralph loops for real tasks
- Write blog posts explaining what you learned

---

## Document Structure

### Section A: Core Technical Skills

Five baseline skills with code examples:

1. **Inferencing Loop** - Request-response cycle, message arrays, stateless servers
2. **Tool Calling System** - Tool registration, execution, result handling
3. **Four Tool Primitives** - Read, List, Bash, Edit (with full implementations)
4. **Context Windows & Memory** - Stateless servers, context rot, mitigation strategies
5. **Agent Construction** - Shell loops, task picking, Ralph pattern

### Section B: Skill Development Path

Progressive workshop phases:
- Phase 1: Basic Chat (0 tools)
- Phase 2: File Reader (1 tool)
- Phase 3: File Explorer (2 tools)
- Phase 4: Command Runner (3 tools)
- Phase 5: File Editor (4 tools) ← **You have a full coding agent here**
- Phase 6: Code Search (5 tools - optional)

Each phase includes:
- Goal and file to run
- What changes from previous phase
- Commands to try
- What to observe
- Key insights

### Section C: Advanced Concepts

Deep dives into:
- Message array structure
- Schema generation patterns
- Error handling strategies
- Verbose logging techniques
- Building Ralph loops

### Section D: Interview Preparation

- Whiteboard exercises
- Coding exercises
- Conceptual questions
- Practice exercises (with time estimates)
- Portfolio project ideas
- Interview talking points

### FAQs: Industry Context

Answers to:
- What changed in 2026?
- Why does this matter now?
- What's the Z80 story?
- Timeline and cohort discussion
- Corporate transformation lag
- Experience vs. skill gap
- Consumer vs. builder divide
- What should I do next?

## How to Use This Document

### For Learning (Beginner)

1. **Read Section A** - Understand the five baseline skills conceptually
2. **Clone the workshop** - `git clone https://github.com/ghuntley/how-to-build-a-coding-agent`
3. **Follow Section B** - Run each phase, observe behavior, understand code
4. **Complete Section C** - Deepen your understanding of patterns
5. **Practice Section D** - Build the three exercises
6. **Read FAQs** - Understand industry context

**Time commitment**: 1-2 days for basic understanding, 1-2 weeks for mastery

### For Interview Prep (Intermediate)

1. **Whiteboard Section A skills** - Can you draw the inferencing loop?
2. **Complete all 6 phases** - Run every file, understand every change
3. **Build the 3 practice exercises** - Weather agent, git integration, test coverage
4. **Prepare talking points** - "I completed the workshop and built..."
5. **Review conceptual questions** - Practice explaining to others

**Time commitment**: 1 week intensive prep

### For Reference (Advanced)

1. **Section A** - Quick reference for architectures
2. **Section C** - Patterns and advanced techniques
3. **Code examples** - Copy-paste starting points for your agents
4. **Ralph loop templates** - Ready-to-use bash scripts

**Use case**: Building custom agents, explaining to teammates, designing systems

---

## Success Criteria

After completing this document and workshop, you should be able to:

**Technical Skills**:
- [ ] Draw the inferencing loop from memory
- [ ] Explain tool calling without notes
- [ ] Implement the four primitives in any language
- [ ] Build a working agent in 30 minutes
- [ ] Build a Ralph loop for automated tasks

**Interview Performance**:
- [ ] Whiteboard agent architecture confidently
- [ ] Answer "How do AI coding agents work?"
- [ ] Discuss context rot and mitigation strategies
- [ ] Demonstrate curiosity through portfolio projects

**Career Positioning**:
- [ ] Update resume with "AI Agent Construction" skills
- [ ] Portfolio project on GitHub
- [ ] Blog post or technical write-up
- [ ] Confidence discussing AI coding in interviews

---

## Source Materials

### Primary Sources

1. **Technical vlog**: "fundamental skills and knowledge you must have in 2026 for SWE" (Jr2auYrBDA4), January 13, 2026
2. **Workshop codebase**: [`github.com/ghuntley/how-to-build-a-coding-agent`](https://github.com/ghuntley/how-to-build-a-coding-agent) (5.5k+ stars)
3. **Ralph Wiggum docs**: Curated context and synthesized versions for organizational patterns

### Synthesis Approach

- **Convergent synthesis**: Technical skills + workshop code (unified hands-on learning path)
- **Convergent synthesis**: All five baseline skills (sequential building blocks)
- **Tension preservation**: Format choices and context-dependent decisions
- **Separation**: Industry context moved to FAQs (important but not skill-building)

### Validation

- All code examples are runnable and verified
- Line numbers reference actual workshop code
- Workshop progression is proven with 5.5k+ GitHub stars
- Industry analysis based on founder conversations and real experiments

---

## Related Documents

- **Main document**: `swe-baseline-skills-2026--curated-context.md` - The full curated context with all details
- **Ralph Wiggum**: `ralph-wiggum--curated-context.md` - Deep dive into autonomous AI coding loops
- **Ralph Wiggum v2**: `ralph-wiggum--synthesized-v2.md` - Implementation guide for Ralph loops

---

## Contributing & Feedback

This is a curated context document synthesizing a technical vlog with a hands-on workshop. The synthesis prioritizes:

1. **Reader empathy** - Junior to mid-level engineers learning agent construction
2. **Actionable skills** - Code examples you can run and learn from
3. **Concrete over abstract** - Real implementations over theory
4. **Logical organization** - Progressive skill building from simple to complex

If you find gaps, inaccuracies, or opportunities to improve:
- Open an issue on the workshop repository
- Suggest improvements to synthesis approach
- Share your experience completing the workshop

---

## License & Attribution

**Primary author**: Creator of Ralph Wiggum technique, experienced software engineer with deep knowledge of AI coding agents

**Workshop**: [`github.com/ghuntley/how-to-build-a-coding-agent`](https://github.com/ghuntley/how-to-build-a-coding-agent)

**Synthesis**: Applied VKS (Validated Knowledge Synthesis) v2.1 with curated context requirements:
- Golden Path criteria (Purpose, Clarity, Structure, Evidence, Action)
- Answer-Explain-Educate framework
- What-So What-Now What framework
- Short sentences, strong verbs, simple words
- Reader empathy as primary requirement

---

*Last updated: January 2026*
*Document type: Curated Context (hands-on learning optimized)*
*Target audience: Junior to mid-level software engineers*
*Time to complete: 1-2 weeks for mastery*
