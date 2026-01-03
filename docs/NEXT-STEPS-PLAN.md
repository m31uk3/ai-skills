# Next Steps Plan: Claude Code Plugins & Skills

**Created:** January 3, 2026
**Status:** Planning Phase
**Discovery:** Found comprehensive plugin-dev toolkit in Claude Code

---

## 🎯 Executive Summary

We discovered that **Skills are just one component of Claude Code Plugins**. The plugin ecosystem is much larger than we initially understood, and there's a complete plugin development toolkit already installed.

### Key Discovery

**Location:** `/Users/ljack/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev`

This is an official Anthropic plugin that provides:
- 7 specialized skills for plugin development
- 3 autonomous agents (agent-creator, plugin-validator, skill-reviewer)
- 1 workflow command (/plugin-dev:create-plugin)
- Complete documentation and utilities

---

## 📊 Current Understanding

### Plugin Ecosystem Hierarchy

```
Claude Code Plugin
├── Skills (modular knowledge packages)
│   └── SKILL.md with progressive disclosure
├── Commands (slash commands)
│   └── .md files with YAML frontmatter
├── Agents (autonomous subagents)
│   └── .md files with system prompts
├── Hooks (event-driven automation)
│   └── hooks.json + script files
└── MCP Servers (external integrations)
    └── .mcp.json configuration
```

### Two Parallel Systems

| Aspect | Agent Skills (Generic) | Claude Code Plugins |
|--------|----------------------|---------------------|
| **Scope** | Universal skill format | Claude Code specific |
| **Contains** | Only skills | Skills + Commands + Agents + Hooks + MCP |
| **Specification** | https://agentskills.io | Claude Code docs |
| **Marketplace** | anthropic-agent-skills | claude-plugins-official |
| **Example Package** | document-skills | plugin-dev |

### What We've Learned So Far

✅ **Completed:**
- Created medical-bill-analysis skill following Agent Skills spec
- Installed document-skills package (16 skills)
- Understood SKILL.md format and structure
- Documented skill creation process

❓ **New Questions:**
- How do Claude Code plugins differ from Agent Skills packages?
- Can we combine both approaches?
- Should we create a full plugin or just skills?
- What are hooks, agents, and MCP servers?

---

## 🗺️ Recommended Next Steps

### Phase 1: Deep Understanding (Week 1)

#### 1.1 Study Plugin-Dev Toolkit
**Priority:** HIGH
**Status:** In Progress

**Tasks:**
- [ ] Read all 7 skill SKILL.md files in plugin-dev
  - [ ] hook-development
  - [ ] mcp-integration
  - [ ] plugin-structure
  - [ ] plugin-settings
  - [ ] command-development
  - [ ] agent-development
  - [ ] skill-development
- [ ] Study the 3 agents
  - [ ] agent-creator.md
  - [ ] plugin-validator.md
  - [ ] skill-reviewer.md
- [ ] Examine the /plugin-dev:create-plugin workflow command
- [ ] Review all example scripts and references

**Deliverable:** Comprehensive understanding document

#### 1.2 Document Plugin vs Skills Distinction
**Priority:** HIGH
**Status:** Not Started

**Tasks:**
- [ ] Create comparison document
- [ ] Clarify when to use plugins vs standalone skills
- [ ] Document marketplace differences
- [ ] Update existing claude-code-skills-guide.md with plugin context

**Deliverable:** `plugins-vs-skills.md`

#### 1.3 Explore Other Components
**Priority:** MEDIUM
**Status:** Not Started

**Tasks:**
- [ ] Study hooks (event-driven automation)
  - What events are available?
  - How to create hooks?
  - Security implications?
- [ ] Study agents (autonomous subagents)
  - How are they different from main Claude?
  - When to use agents vs skills?
  - Agent frontmatter format?
- [ ] Study commands (slash commands)
  - Format and structure
  - Dynamic arguments
  - Best practices
- [ ] Study MCP servers (Model Context Protocol)
  - What is MCP?
  - Integration patterns
  - Available server types

**Deliverable:** Component documentation for each type

### Phase 2: Practical Application (Week 2)

#### 2.1 Refactor Medical Bill Analysis
**Priority:** MEDIUM
**Status:** Not Started

**Options:**
- **Option A:** Keep as standalone skill (Agent Skills format)
- **Option B:** Convert to full Claude Code plugin with additional components
- **Option C:** Create both versions to understand differences

**Recommended:** Option C for learning purposes

**Tasks if Option C:**
- [ ] Keep existing skill as-is
- [ ] Create plugin version with:
  - [ ] Command: `/medical-bill:analyze [directory]`
  - [ ] Agent: Specialized bill analysis agent
  - [ ] Hook: Validate bill files before processing
  - [ ] Settings: Store default save locations

**Deliverable:** Working plugin example

#### 2.2 Create New Plugin from Scratch
**Priority:** MEDIUM
**Status:** Not Started

**Idea:** Choose a simple, useful plugin idea

**Suggestions:**
1. **Project Documentation Plugin**
   - Skill: Generate project docs
   - Command: `/docs:update`
   - Agent: Doc reviewer

2. **Code Review Plugin**
   - Skill: Review guidelines
   - Command: `/review:pr`
   - Agent: Code reviewer
   - Hook: Auto-review on git commits

3. **Testing Assistant Plugin**
   - Skill: Test generation patterns
   - Command: `/test:generate`
   - Agent: Test writer
   - Hook: Run tests before commits

**Tasks:**
- [ ] Choose plugin idea
- [ ] Use `/plugin-dev:create-plugin` workflow
- [ ] Document the creation process
- [ ] Test and validate
- [ ] Share/publish to local marketplace

**Deliverable:** Complete plugin with documentation

### Phase 3: Advanced Integration (Week 3)

#### 3.1 MCP Server Integration
**Priority:** LOW
**Status:** Not Started

**Learning Goals:**
- Understand Model Context Protocol
- Create or integrate an MCP server
- Use external tools in skills/commands

**Possible Integrations:**
- Database connection (PostgreSQL/MySQL)
- API integration (GitHub, Jira, Slack)
- File system operations
- Cloud services (AWS, GCP)

**Tasks:**
- [ ] Study MCP specification
- [ ] Choose integration target
- [ ] Configure MCP server
- [ ] Create plugin that uses MCP tools
- [ ] Document integration patterns

**Deliverable:** MCP-enabled plugin

#### 3.2 Hook Development
**Priority:** LOW
**Status:** Not Started

**Learning Goals:**
- Create event-driven automation
- Validate tool usage
- Implement custom workflows

**Hook Ideas:**
- PreToolUse: Validate dangerous operations
- PostToolUse: Log all file changes
- SessionStart: Load project context
- Stop: Cleanup temporary files

**Tasks:**
- [ ] Study hook events and schemas
- [ ] Create hook scripts (bash/python)
- [ ] Use validation utilities
- [ ] Test hooks in real scenarios
- [ ] Document hook patterns

**Deliverable:** Hook library with examples

### Phase 4: Documentation & Sharing (Week 4)

#### 4.1 Complete Documentation Suite
**Priority:** HIGH
**Status:** Not Started

**Documents to Create:**
1. **Overview:** `README.md` for ai-skills repo
2. **Skills:** `claude-code-skills-guide.md` (✅ Done)
3. **Plugins:** `claude-code-plugins-guide.md` (New)
4. **Commands:** `command-development-guide.md` (New)
5. **Agents:** `agent-development-guide.md` (New)
6. **Hooks:** `hook-development-guide.md` (New)
7. **MCP:** `mcp-integration-guide.md` (New)
8. **Comparison:** `plugins-vs-skills.md` (New)
9. **Examples:** `examples/` directory with working code

**Tasks:**
- [ ] Create each guide
- [ ] Include working examples
- [ ] Add diagrams and flowcharts
- [ ] Cross-reference between docs
- [ ] Create quick-start guides

**Deliverable:** Complete documentation suite

#### 4.2 Create Reusable Templates
**Priority:** MEDIUM
**Status:** Not Started

**Templates to Create:**
- Skill template (SKILL.md boilerplate)
- Command template (.md with frontmatter)
- Agent template (.md with system prompt)
- Hook template (hooks.json + script)
- Plugin structure template (complete directory)
- MCP configuration templates

**Location:** `/Users/ljack/github/ai-skills/templates/`

**Tasks:**
- [ ] Create each template
- [ ] Add inline documentation
- [ ] Include usage examples
- [ ] Create template generator script

**Deliverable:** Templates library

#### 4.3 Share Knowledge
**Priority:** MEDIUM
**Status:** Not Started

**Options:**
1. Blog posts about discoveries
2. GitHub repository (ai-skills)
3. Contribute to Claude Code docs
4. Create video tutorials
5. Share on dev communities

**Tasks:**
- [ ] Choose sharing platforms
- [ ] Create content calendar
- [ ] Write articles/posts
- [ ] Record demos
- [ ] Engage with community

**Deliverable:** Public knowledge base

---

## 🔍 Specific Research Questions

### Critical Questions to Answer

1. **Plugin vs Skill Packages**
   - When should I create a plugin vs an Agent Skills package?
   - Can I publish to both marketplaces?
   - Are they compatible?

2. **Best Practices**
   - How do Anthropic teams structure their plugins?
   - What are common patterns?
   - What should be avoided?

3. **Distribution**
   - How to publish to claude-plugins-official?
   - Can I create a private marketplace?
   - Local-only plugins vs shared plugins?

4. **Integration**
   - How do plugins interact with each other?
   - Can skills from different packages work together?
   - Dependency management?

5. **Testing**
   - How to test plugins before publishing?
   - Validation tools available?
   - CI/CD for plugin development?

---

## 📁 File Organization Plan

### Current Structure
```
/Users/ljack/github/ai-skills/
├── docs/
│   ├── claude-code-skills-guide.md (✅ Created)
│   ├── specification.md (✅ Copied)
│   ├── REFERENCES.md
│   └── ... (other docs)
├── skills/
│   └── (empty - to be populated)
└── README.md
```

### Proposed Structure
```
/Users/ljack/github/ai-skills/
├── docs/                                    # All documentation
│   ├── guides/
│   │   ├── claude-code-skills-guide.md     # ✅ Done
│   │   ├── claude-code-plugins-guide.md    # TODO
│   │   ├── command-development-guide.md    # TODO
│   │   ├── agent-development-guide.md      # TODO
│   │   ├── hook-development-guide.md       # TODO
│   │   └── mcp-integration-guide.md        # TODO
│   ├── comparisons/
│   │   ├── plugins-vs-skills.md            # TODO
│   │   ├── agents-vs-skills.md             # TODO
│   │   └── when-to-use-what.md             # TODO
│   ├── references/
│   │   ├── specification.md                # ✅ Done
│   │   ├── REFERENCES.md
│   │   └── official-docs-links.md          # TODO
│   └── examples/
│       ├── medical-bill-analysis/          # TODO
│       ├── simple-plugin/                  # TODO
│       └── mcp-integration/                # TODO
├── templates/                               # Reusable templates
│   ├── skill-template/
│   ├── plugin-template/
│   ├── command-template/
│   ├── agent-template/
│   └── hook-template/
├── plugins/                                 # Working plugins
│   ├── medical-bill-analysis/
│   └── ... (future plugins)
├── skills/                                  # Standalone skills
│   └── ... (standalone skills)
└── README.md                                # Repository overview
```

---

## 🎓 Learning Resources

### Official Documentation to Study

1. **Plugin-Dev Toolkit**
   - `/Users/ljack/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/README.md`
   - All 7 skills in `skills/` directory
   - All 3 agents in `agents/` directory

2. **Document-Skills Package**
   - `/Users/ljack/.claude/plugins/cache/anthropic-agent-skills/document-skills/`
   - 16 skills including skill-creator
   - Examples and references

3. **Agent Skills Specification**
   - https://agentskills.io/specification
   - `/Users/ljack/github/ai-skills/docs/specification.md`

4. **Claude Code Official Docs**
   - https://claude.com/claude-code
   - GitHub: https://github.com/anthropics/claude-code

### Command to Try

The plugin-dev toolkit includes a workflow command:
```bash
/plugin-dev:create-plugin [optional description]
```

This is an 8-phase guided process for creating plugins from scratch. **Highly recommended to try this!**

---

## ⚡ Quick Wins (Do First)

1. **Install plugin-dev if not already installed**
   ```bash
   /plugin install plugin-dev@claude-plugins-official
   ```

2. **Read plugin-dev README**
   - Already accessible at the path you found
   - Comprehensive overview of all capabilities

3. **Try the create-plugin workflow**
   ```bash
   /plugin-dev:create-plugin A simple example plugin
   ```
   - Follow the guided process
   - Document each step
   - Save as learning example

4. **Study one skill in depth**
   - Start with `skill-development` since we know skills best
   - Read SKILL.md fully
   - Review references
   - Compare to our medical-bill-analysis skill

5. **Update our documentation**
   - Add "Plugins vs Skills" section to existing guide
   - Create NEXT-STEPS-PLAN.md (this document)
   - Add references to plugin-dev

---

## 🤔 Decision Points

### Immediate Decisions Needed

1. **Focus Area**
   - [ ] **Option A:** Master skills first, plugins later
   - [ ] **Option B:** Learn all plugin components in parallel
   - [ ] **Option C:** Deep dive into one component at a time

   **Recommendation:** Option C - one component at a time

2. **Project Direction**
   - [ ] **Option A:** Create learning examples only
   - [ ] **Option B:** Build production-ready plugins
   - [ ] **Option C:** Both - learn with examples, build real tools

   **Recommendation:** Option C

3. **Documentation Strategy**
   - [ ] **Option A:** Document as we learn (continuous)
   - [ ] **Option B:** Learn first, document later (batch)
   - [ ] **Option C:** Mix - quick notes while learning, polish later

   **Recommendation:** Option C

---

## 📅 Suggested Timeline

### Week 1: Deep Dive into Plugin-Dev
- **Mon-Tue:** Study all 7 skills
- **Wed-Thu:** Study agents and commands
- **Fri:** Create comprehensive plugin guide

### Week 2: Hands-On Practice
- **Mon-Tue:** Try /plugin-dev:create-plugin workflow
- **Wed-Thu:** Refactor medical-bill-analysis as plugin
- **Fri:** Document learnings and create templates

### Week 3: Advanced Components
- **Mon-Tue:** Hook development and testing
- **Wed-Thu:** MCP integration experiments
- **Fri:** Create integration examples

### Week 4: Documentation & Sharing
- **Mon-Tue:** Complete all guides
- **Wed-Thu:** Create templates library
- **Fri:** Publish and share knowledge

---

## 🎯 Success Criteria

By the end of this plan, we should have:

✅ **Understanding**
- [ ] Complete knowledge of plugin ecosystem
- [ ] Clear distinction between plugins and skills
- [ ] Understanding of all component types
- [ ] Knowledge of best practices

✅ **Documentation**
- [ ] Comprehensive guides for each component
- [ ] Working examples and templates
- [ ] Comparison documents
- [ ] Quick-start guides

✅ **Practical Skills**
- [ ] Created at least 3 working plugins
- [ ] Integrated MCP server
- [ ] Implemented custom hooks
- [ ] Generated agents

✅ **Sharing**
- [ ] Published documentation
- [ ] Shared examples
- [ ] Contributed to community
- [ ] Created reusable templates

---

## 📝 Notes & Observations

### What We Got Right
- Medical bill analysis skill follows proper Agent Skills spec
- Directory structure is correct
- YAML frontmatter format is valid
- Progressive disclosure principle understood

### What We Learned
- Skills are just one component of plugins
- There are TWO parallel systems (Agent Skills vs Claude Code Plugins)
- Official tooling exists (plugin-dev)
- Much more to learn about hooks, agents, MCP

### What's Exciting
- Plugin-dev toolkit provides comprehensive guidance
- AI-assisted agent creation with agent-creator
- Workflow commands for guided development
- Rich ecosystem of examples to learn from

### What's Unclear (Research Needed)
- Exact relationship between Agent Skills and Claude Code Plugins
- Can we publish to both marketplaces?
- Are they interoperable?
- What's the migration path?

---

## 🔗 Key References

1. **Plugin-Dev Toolkit**
   - Path: `/Users/ljack/.claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev`
   - Author: Daisy Hollman (daisy@anthropic.com)
   - Version: 0.1.0

2. **Our Documentation**
   - Skills Guide: `/Users/ljack/github/ai-skills/docs/claude-code-skills-guide.md`
   - This Plan: `/Users/ljack/github/ai-skills/docs/NEXT-STEPS-PLAN.md`

3. **Installed Skills**
   - Medical Bill Analysis: `/Users/ljack/github/lemel-bills/.claude/skills/medical-bill-analysis/`
   - Document Skills: `/Users/ljack/.claude/plugins/cache/anthropic-agent-skills/document-skills/`

4. **Official Resources**
   - Agent Skills: https://agentskills.io
   - Claude Code: https://claude.com/claude-code
   - GitHub: https://github.com/anthropics/claude-code

---

**Next Action:** Start with Phase 1.1 - Study the plugin-dev toolkit's 7 skills

**Status:** Ready to begin
**Created:** January 3, 2026
**Last Updated:** January 3, 2026
