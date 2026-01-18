#!/usr/bin/env python3
"""
Compare skills across repository and installation directories.
Usage: python3 compare-skills.py [--repo PATH] [--installed PATH]
"""

import argparse
from pathlib import Path
from typing import Set, List, Tuple

def get_repo_skills(skills_dir: Path, exclude: List[str] = None) -> Set[str]:
    """Get all skills in the repository skills/ directory."""
    exclude = exclude or []
    if not skills_dir.exists():
        return set()
    return {
        d.name for d in skills_dir.iterdir() 
        if d.is_dir() and d.name not in exclude
    }

def get_packaged_skills(packages_dir: Path) -> Set[str]:
    """Get all packaged .skill files."""
    if not packages_dir.exists():
        return set()
    return {f.stem for f in packages_dir.glob("*.skill")}

def get_installed_skills(installed_dir: Path) -> Set[str]:
    """Get all installed skills in ~/.claude/skills/."""
    if not installed_dir.exists():
        return set()
    return {
        d.name for d in installed_dir.iterdir() 
        if d.is_dir() and (d / "SKILL.md").exists()
    }

def main():
    parser = argparse.ArgumentParser(description="Compare skill status across repo and installation")
    parser.add_argument("--repo", default=".", help="Repository root path")
    parser.add_argument("--installed", default="~/.claude/skills", help="Installed skills path")
    parser.add_argument("--exclude", nargs="+", default=["anthropic"], help="Folders to exclude")
    args = parser.parse_args()
    
    repo_path = Path(args.repo).expanduser().resolve()
    installed_path = Path(args.installed).expanduser().resolve()
    
    # Get sets
    repo_skills = get_repo_skills(repo_path / "skills", args.exclude)
    packaged_skills = get_packaged_skills(repo_path / "packages" / "skills")
    installed_skills = get_installed_skills(installed_path)
    
    # Calculate differences
    not_packaged = repo_skills - packaged_skills
    packaged_not_installed = packaged_skills - installed_skills
    installed_only = installed_skills - repo_skills
    
    # Print comprehensive report
    print("=" * 80)
    print("SKILL STATUS COMPARISON REPORT")
    print("=" * 80)
    print()
    
    print(f"Repository: {repo_path}")
    print(f"Installed:  {installed_path}")
    print()
    
    # Summary counts
    print("SUMMARY")
    print("-" * 80)
    print(f"  Repository skills:       {len(repo_skills)}")
    print(f"  Packaged (.skill files): {len(packaged_skills)}")
    print(f"  Installed locally:       {len(installed_skills)}")
    print()
    
    # Detailed breakdown
    print("REPOSITORY SKILLS STATUS")
    print("-" * 80)
    all_repo = sorted(repo_skills)
    for skill in all_repo:
        packaged = "✅ PACKAGED" if skill in packaged_skills else "❌ NOT PACKAGED"
        installed = "✅ INSTALLED" if skill in installed_skills else "❌ NOT INSTALLED"
        package_loc = f"packages/skills/{skill}.skill" if skill in packaged_skills else "-"
        
        print(f"{skill:<40} {packaged:<17} {installed}")
        if skill in packaged_skills:
            print(f"{'':40}   └─ {package_loc}")
    print()
    
    # Action items
    if not_packaged:
        print("ACTION: NEEDS PACKAGING")
        print("-" * 80)
        for skill in sorted(not_packaged):
            print(f"  • {skill}")
        print()
    
    if packaged_not_installed:
        print("ACTION: READY TO INSTALL")
        print("-" * 80)
        for skill in sorted(packaged_not_installed):
            print(f"  • {skill}")
            print(f"    unzip packages/skills/{skill}.skill -d ~/.claude/skills/")
        print()
    
    if installed_only:
        print("WARNING: INSTALLED BUT NOT IN REPO")
        print("-" * 80)
        for skill in sorted(installed_only):
            print(f"  • {skill} (installed at {installed_path / skill})")
        print()
    
    print("=" * 80)

if __name__ == "__main__":
    main()
