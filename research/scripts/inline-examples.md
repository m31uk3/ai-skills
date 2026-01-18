# Inline Script Examples

Quick one-liner scripts for status checks without saving files.

## Python One-Liners

### Compare Packaged vs Unpackaged
```bash
python3 - <<'PYEOF'
from pathlib import Path
skills = {d.name for d in Path("skills").iterdir() if d.is_dir() and d.name != "anthropic"}
packaged = {f.stem for f in Path("packages/skills").glob("*.skill")}
print(f"Repository: {len(skills)}, Packaged: {len(packaged)}")
print("\nNot packaged:")
for s in sorted(skills - packaged):
    print(f"  • {s}")
PYEOF
```

### Full Status Table
```bash
python3 - <<'PYEOF'
from pathlib import Path
skills = sorted([d.name for d in Path("skills").iterdir() if d.is_dir() and d.name != "anthropic"])
packaged = {f.stem for f in Path("packages/skills").glob("*.skill")}
print(f"{'Skill':<40} {'Status':<15} {'Package Location'}")
print("-" * 85)
for s in skills:
    status = "✅ PACKAGED" if s in packaged else "❌ NOT PACKAGED"
    loc = f"packages/skills/{s}.skill" if s in packaged else "-"
    print(f"{s:<40} {status:<15} {loc}")
PYEOF
```

### Check Installation Status
```bash
python3 - <<'PYEOF'
from pathlib import Path
home = Path.home()
packaged = {f.stem for f in Path("packages/skills").glob("*.skill")}
installed_dir = home / ".claude" / "skills"
installed = {d.name for d in installed_dir.iterdir() if d.is_dir() and (d / "SKILL.md").exists()} if installed_dir.exists() else set()

print("READY TO INSTALL:")
for s in sorted(packaged - installed):
    print(f"  unzip packages/skills/{s}.skill -d ~/.claude/skills/")
PYEOF
```

## Bash One-Liners

### Count Everything
```bash
echo "Repo: $(ls -1d skills/*/ | grep -v anthropic | wc -l | tr -d ' ') | Packaged: $(ls -1 packages/skills/*.skill 2>/dev/null | wc -l | tr -d ' ') | Installed: $(find ~/.claude/skills -maxdepth 1 -type d -exec test -f {}/SKILL.md \; -print 2>/dev/null | wc -l | tr -d ' ')"
```

### List Packaged Skills
```bash
ls -1 packages/skills/*.skill 2>/dev/null | xargs -n1 basename | sed 's/.skill$//' | sort
```

### List Not Packaged
```bash
for dir in skills/*/; do skill=$(basename "$dir"); [ "$skill" != "anthropic" ] && [ ! -f "packages/skills/${skill}.skill" ] && echo "$skill"; done
```

### List Installed Skills
```bash
find ~/.claude/skills -maxdepth 1 -type d -exec test -f {}/SKILL.md \; -print 2>/dev/null | xargs -n1 basename
```

### Package Size Summary
```bash
ls -lh packages/skills/*.skill 2>/dev/null | awk '{print $9, $5}' | sed 's|packages/skills/||'
```

## Combined Status Check (Bash)

```bash
echo "=== SKILL STATUS ===" && \
echo "" && \
echo "Repository:  $(ls -1d skills/*/ | grep -v anthropic | wc -l | tr -d ' ')" && \
echo "Packaged:    $(ls -1 packages/skills/*.skill 2>/dev/null | wc -l | tr -d ' ')" && \
echo "Installed:   $(find ~/.claude/skills -maxdepth 1 -type d -exec test -f {}/SKILL.md \; -print 2>/dev/null | wc -l | tr -d ' ')" && \
echo "" && \
echo "Not packaged:" && \
for dir in skills/*/; do skill=$(basename "$dir"); [ "$skill" != "anthropic" ] && [ ! -f "packages/skills/${skill}.skill" ] && echo "  • $skill"; done
```

## Usage Notes

### When to Use Inline Scripts

**Advantages:**
- No file creation needed
- Fast for one-time checks
- Easy to copy/paste in documentation
- Works anywhere with Python 3 or bash

**Disadvantages:**
- Not saved for reuse
- Harder to maintain
- No command-line arguments
- Less readable than dedicated scripts

### Recommended Workflow

1. **Daily checks**: Use inline one-liners or `quick-status.sh`
2. **Detailed audits**: Use `compare-skills.py`
3. **Documentation**: Copy output from `compare-skills.py`
4. **Automation**: Integrate `compare-skills.py` into CI/CD

---

**Last Updated:** January 17, 2026
