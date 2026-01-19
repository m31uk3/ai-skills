#!/usr/bin/env python3
"""
Package a Claude Code skill into a .skill file.

This script accepts either:
1. A skill name (looks in skills/ directory)
2. A path to a skill directory

It will validate and package the skill to packages/skills/

Usage:
    python3 skill-package.py SKILL_NAME_OR_PATH [OPTIONS]

Examples:
    # Package by name (finds in skills/)
    python3 skill-package.py skill-resiliency

    # Package from directory
    python3 skill-package.py ./skills/guided-ooda-loop

    # Force re-packaging
    python3 skill-package.py skill-resiliency --force

    # Custom output directory
    python3 skill-package.py skill-resiliency --output ./dist
"""

import argparse
import subprocess
import sys
from pathlib import Path


def error(msg: str):
    """Print error and exit."""
    print(f"❌ ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def success(msg: str):
    """Print success message."""
    print(f"✅ {msg}")


def info(msg: str):
    """Print info message."""
    print(f"ℹ️  {msg}")


def find_skill(input_arg: str, repo_path: Path) -> tuple[Path, str]:
    """
    Find skill directory from input.

    Returns: (skill_dir, skill_name)
    """
    input_path = Path(input_arg).expanduser()

    # Case 1: Directory path with SKILL.md
    if input_path.is_dir() and (input_path / "SKILL.md").exists():
        skill_name = input_path.name
        return (input_path.resolve(), skill_name)

    # Case 2: Skill name (look in repo skills/)
    skill_dir = repo_path / "skills" / input_arg
    if skill_dir.is_dir() and (skill_dir / "SKILL.md").exists():
        return (skill_dir, input_arg)

    # Not found
    error(f"Could not find skill from input: {input_arg}\n"
          f"  • Not a directory with SKILL.md\n"
          f"  • Not found in {repo_path / 'skills'}")


def find_package_script() -> Path:
    """Find the package_skill.py script from skill-creator plugin."""
    possible_locations = [
        Path.home() / ".claude" / "plugins" / "cache" / "anthropic-agent-skills",
    ]

    for loc in possible_locations:
        if loc.exists():
            found = list(loc.rglob("package_skill.py"))
            if found:
                return found[0]

    error("Could not find package_skill.py script.\n"
          "Is the skill-creator plugin installed?")


def package_skill(skill_dir: Path, skill_name: str, output_dir: Path, force: bool = False) -> Path:
    """Package the skill using package_skill.py."""
    output_dir.mkdir(parents=True, exist_ok=True)
    package_path = output_dir / f"{skill_name}.skill"

    # Check if already packaged
    if package_path.exists() and not force:
        info(f"Package already exists at {package_path}")
        info("Use --force to re-package")
        return package_path

    if force and package_path.exists():
        info(f"Removing existing package: {package_path}")
        package_path.unlink()

    package_script = find_package_script()
    info(f"Using packager: {package_script}")

    # Run package script
    result = subprocess.run(
        [sys.executable, str(package_script), str(skill_dir), str(output_dir)],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        error(f"Packaging failed:\n{result.stderr}\n{result.stdout}")

    # Verify package was created
    if not package_path.exists():
        # Check if it was created elsewhere
        alt_path = skill_dir.parent / f"{skill_name}.skill"
        if alt_path.exists():
            import shutil
            info(f"Moving package from {alt_path} to {package_path}")
            shutil.move(str(alt_path), str(package_path))
        else:
            error(f"Package file not created at expected location: {package_path}")

    return package_path


def main():
    parser = argparse.ArgumentParser(
        description="Package a Claude Code skill into a .skill file",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Package by name (finds in skills/ directory)
  %(prog)s skill-resiliency

  # Package from skill directory
  %(prog)s ./skills/guided-ooda-loop

  # Force re-packaging
  %(prog)s skill-resiliency --force

  # Custom output directory
  %(prog)s skill-resiliency --output ./dist
        """
    )

    parser.add_argument(
        "skill_input",
        help="Skill name or path to skill directory"
    )

    parser.add_argument(
        "--repo",
        type=Path,
        default=Path.cwd(),
        help="Repository root path (default: current directory)"
    )

    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=None,
        help="Output directory (default: {repo}/packages/skills)"
    )

    parser.add_argument(
        "--force", "-f",
        action="store_true",
        help="Force re-packaging even if .skill file exists"
    )

    args = parser.parse_args()

    # Expand paths
    repo_path = args.repo.expanduser().resolve()
    output_dir = (args.output or repo_path / "packages" / "skills").expanduser().resolve()

    print("=" * 60)
    print("SKILL PACKAGER")
    print("=" * 60)
    print()

    # Step 1: Find skill
    print("Finding skill...")
    skill_dir, skill_name = find_skill(args.skill_input, repo_path)
    success(f"Found: {skill_name}")
    info(f"Path: {skill_dir}")
    print()

    # Step 2: Package
    print("Packaging skill...")
    package_path = package_skill(skill_dir, skill_name, output_dir, args.force)
    print()

    # Done
    print("=" * 60)
    success(f"Package created: {package_path}")
    print()
    print("To install, run:")
    print(f"  python3 skill-install.py {package_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
