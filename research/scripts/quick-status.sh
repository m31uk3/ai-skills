#!/bin/bash
# Quick status check for skills (repository vs installed)
# Usage: ./quick-status.sh

echo "=== QUICK SKILL STATUS ==="
echo ""

# Count skills in repo
REPO_COUNT=$(find skills -maxdepth 1 -type d ! -name "anthropic" ! -name "skills" | wc -l | tr -d ' ')
echo "Repository skills:  $REPO_COUNT"

# Count packaged skills
PKG_COUNT=$(ls -1 packages/skills/*.skill 2>/dev/null | wc -l | tr -d ' ')
echo "Packaged (.skill):  $PKG_COUNT"

# Count installed skills
if [ -d "$HOME/.claude/skills" ]; then
    INST_COUNT=$(find "$HOME/.claude/skills" -maxdepth 1 -type d ! -name "skills" -exec test -f {}/SKILL.md \; -print | wc -l | tr -d ' ')
    echo "Installed locally:  $INST_COUNT"
else
    echo "Installed locally:  0 (directory not found)"
fi

echo ""
echo "=== PACKAGED SKILLS ==="
ls -1 packages/skills/*.skill 2>/dev/null | xargs -n1 basename | sed 's/.skill$//' || echo "None"

echo ""
echo "=== NOT PACKAGED ==="
for dir in skills/*/; do
    skill=$(basename "$dir")
    if [ "$skill" != "anthropic" ] && [ ! -f "packages/skills/${skill}.skill" ]; then
        echo "  • $skill"
    fi
done

echo ""
echo "=== INSTALLED ==="
if [ -d "$HOME/.claude/skills" ]; then
    find "$HOME/.claude/skills" -maxdepth 1 -type d ! -name "skills" -exec test -f {}/SKILL.md \; -print | xargs -n1 basename || echo "None"
else
    echo "None (~/.claude/skills not found)"
fi
