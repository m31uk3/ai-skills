# Skill Status Scripts

Utilities for comparing skills between the repository and local installation.

## Scripts

### 1. `compare-skills.py` - Comprehensive Comparison

Full-featured Python script that compares skills across repository and `~/.claude/skills/` installation.

**Features:**
- Shows packaging status for all repository skills
- Shows installation status for all packaged skills
- Identifies action items (needs packaging, ready to install)
- Warns about skills installed but not in repo
- Provides exact commands to install available skills

**Usage:**
```bash
# Run from repository root
python3 research/scripts/compare-skills.py

# Specify custom paths
python3 research/scripts/compare-skills.py --repo /path/to/repo --installed ~/.claude/skills

# Exclude additional folders
python3 research/scripts/compare-skills.py --exclude anthropic test-skills
```

**Output Example:**
```
================================================================================
SKILL STATUS COMPARISON REPORT
================================================================================

Repository: /Users/ljack/github/ai-skills
Installed:  /Users/ljack/.claude/skills

SUMMARY
--------------------------------------------------------------------------------
  Repository skills:       7
  Packaged (.skill files): 4
  Installed locally:       2

REPOSITORY SKILLS STATUS
--------------------------------------------------------------------------------
guided-ooda-loop                         ✅ PACKAGED        ❌ NOT INSTALLED
                                           └─ packages/skills/guided-ooda-loop.skill
...

ACTION: READY TO INSTALL
--------------------------------------------------------------------------------
  • guided-ooda-loop
    unzip packages/skills/guided-ooda-loop.skill -d ~/.claude/skills/
```

---

### 2. `quick-status.sh` - Quick Bash Summary

Lightweight bash script for quick status checks without detailed output.

**Features:**
- Fast execution
- Simple counts and lists
- No dependencies beyond bash

**Usage:**
```bash
# Run from repository root
./research/scripts/quick-status.sh
```

**Output Example:**
```
=== QUICK SKILL STATUS ===

Repository skills:  7
Packaged (.skill):  4
Installed locally:  2

=== PACKAGED SKILLS ===
guided-ooda-loop
prompt-driven-development
validated-knowledge-synthesis
writing-eval-sloptastic

=== NOT PACKAGED ===
  • ai--workflow-engineering
  • comms--response-quality-analysis
  • skill-resiliency

=== INSTALLED ===
validated-knowledge-synthesis
writing-eval-sloptastic
```

---

## Comparison: When to Use Which

| Feature | compare-skills.py | quick-status.sh |
|---------|-------------------|-----------------|
| **Speed** | Moderate | Fast |
| **Detail** | Comprehensive | Summary |
| **Action Items** | Yes, with commands | No |
| **Custom Paths** | Yes (args) | No (hardcoded) |
| **Dependencies** | Python 3 | Bash only |
| **Best For** | Detailed audits, documentation | Quick checks during workflow |

---

## Common Workflows

### Check What Needs Installing
```bash
# Comprehensive view with exact commands
python3 research/scripts/compare-skills.py | grep -A 20 "READY TO INSTALL"

# Quick list only
./research/scripts/quick-status.sh | grep -A 10 "NOT PACKAGED"
```

### Before/After Packaging
```bash
# Before packaging a skill
./research/scripts/quick-status.sh

# Package the skill
python3 /path/to/package_skill.py skills/my-skill

# After - verify it appears
python3 research/scripts/compare-skills.py
```

### Installation Status Check
```bash
# See what's installed vs available
python3 research/scripts/compare-skills.py | grep -A 50 "REPOSITORY SKILLS STATUS"
```

---

## Directory Structure Expected

```
repo-root/
├── skills/               # Source skill directories
│   ├── skill-name/
│   │   └── SKILL.md
│   └── anthropic/       # Excluded by default
├── packages/
│   └── skills/          # Packaged .skill files
│       └── skill-name.skill
└── ~/.claude/skills/    # Installation directory
    └── skill-name/
        └── SKILL.md
```

---

## Script Maintenance

### Adding New Exclusions

**compare-skills.py:**
```bash
python3 research/scripts/compare-skills.py --exclude anthropic test-folder experimental
```

**quick-status.sh:**
Edit line 15:
```bash
if [ "$skill" != "anthropic" ] && [ "$skill" != "test-folder" ]; then
```

### Customizing Output

Both scripts are well-commented and easy to modify:
- `compare-skills.py`: Modify the `main()` function's print sections
- `quick-status.sh`: Edit echo statements directly

---

**Last Updated:** January 17, 2026
