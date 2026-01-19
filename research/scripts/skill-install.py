#!/usr/bin/env python3
"""
Install a Claude Code skill to ~/.claude/skills/

This script accepts either:
1. A skill name (looks in skills/ directory)
2. A path to a skill directory
3. A path to a .skill package file

It will install the skill directly without packaging.

Usage:
    python3 skill-install.py SKILL_NAME_OR_PATH [OPTIONS]

Examples:
    # Install by name (finds in skills/)
    python3 skill-install.py skill-resiliency

    # Install from directory
    python3 skill-install.py ./skills/guided-ooda-loop

    # Install from .skill file
    python3 skill-install.py ./packages/skills/validated-knowledge-synthesis.skill

Note: To create a .skill package, use skill-package.py
"""

import argparse
import sys
import zipfile
import shutil
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


def determine_input_type(input_arg: str, repo_path: Path) -> tuple[str, Path, str]:
    """
    Determine what type of input was provided.

    Returns: (input_type, path, skill_name)
        input_type: 'skill_file', 'skill_dir', or 'skill_name'
        path: Path to the skill file or directory
        skill_name: Name of the skill
    """
    input_path = Path(input_arg).expanduser()

    # Case 1: .skill file path
    if input_path.is_file() and input_path.suffix == ".skill":
        skill_name = input_path.stem
        return ('skill_file', input_path.resolve(), skill_name)

    # Case 2: Directory path with SKILL.md
    if input_path.is_dir() and (input_path / "SKILL.md").exists():
        skill_name = input_path.name
        return ('skill_dir', input_path.resolve(), skill_name)

    # Case 3: Skill name (look in repo skills/)
    skill_dir = repo_path / "skills" / input_arg
    if skill_dir.is_dir() and (skill_dir / "SKILL.md").exists():
        return ('skill_name', skill_dir, input_arg)

    # Not found
    error(f"Could not find skill from input: {input_arg}\n"
          f"  • Not a .skill file\n"
          f"  • Not a directory with SKILL.md\n"
          f"  • Not found in {repo_path / 'skills'}")


def install_from_skill_file(skill_file: Path, install_dir: Path) -> tuple[Path, str]:
    """Install from a .skill package file (zip)."""
    # Validate and get skill name
    try:
        with zipfile.ZipFile(skill_file, 'r') as zf:
            names = zf.namelist()
            skill_md_files = [n for n in names if n.endswith("SKILL.md")]
            if not skill_md_files:
                error(f"Invalid .skill file: no SKILL.md found inside")
            skill_name = skill_md_files[0].split("/")[0]
    except zipfile.BadZipFile:
        error(f"Invalid .skill file (not a valid zip): {skill_file}")

    skill_install_dir = install_dir / skill_name

    # Remove existing installation
    if skill_install_dir.exists():
        info(f"Removing existing installation: {skill_install_dir}")
        shutil.rmtree(skill_install_dir)

    # Extract
    info(f"Extracting to {skill_install_dir}")
    with zipfile.ZipFile(skill_file, 'r') as zf:
        zf.extractall(install_dir)

    return skill_install_dir, skill_name


def install_from_directory(skill_dir: Path, skill_name: str, install_dir: Path) -> Path:
    """Install from a skill directory by copying."""
    skill_install_dir = install_dir / skill_name

    # Remove existing installation
    if skill_install_dir.exists():
        info(f"Removing existing installation: {skill_install_dir}")
        shutil.rmtree(skill_install_dir)

    # Copy directory
    info(f"Copying to {skill_install_dir}")
    shutil.copytree(skill_dir, skill_install_dir)

    return skill_install_dir


def verify_installation(skill_install_dir: Path, skill_name: str):
    """Print installation verification details."""
    print()
    print("-" * 60)
    print("INSTALLED CONTENTS")
    print("-" * 60)

    # Verify SKILL.md exists
    if not (skill_install_dir / "SKILL.md").exists():
        error(f"Installation failed: SKILL.md not found in {skill_install_dir}")

    print(f"✓ SKILL.md")

    # Check for references
    refs_dir = skill_install_dir / "references"
    if refs_dir.exists():
        ref_files = list(refs_dir.glob("*.md"))
        if ref_files:
            print(f"✓ references/ ({len(ref_files)} files)")
            for ref in ref_files:
                print(f"    - {ref.name}")

    # Check for scripts
    scripts_dir = skill_install_dir / "scripts"
    if scripts_dir.exists():
        script_files = list(scripts_dir.iterdir())
        if script_files:
            print(f"✓ scripts/ ({len(script_files)} files)")
            for script in script_files:
                print(f"    - {script.name}")

    # Check for examples
    examples_dir = skill_install_dir / "examples"
    if examples_dir.exists():
        example_files = list(examples_dir.iterdir())
        if example_files:
            print(f"✓ examples/ ({len(example_files)} files)")
            for example in example_files:
                print(f"    - {example.name}")

    # Check for assets
    assets_dir = skill_install_dir / "assets"
    if assets_dir.exists():
        asset_files = list(assets_dir.iterdir())
        if asset_files:
            print(f"✓ assets/ ({len(asset_files)} items)")


def main():
    parser = argparse.ArgumentParser(
        description="Install a Claude Code skill",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Install by name (finds in skills/ directory)
  %(prog)s skill-resiliency

  # Install from skill directory
  %(prog)s ./skills/guided-ooda-loop

  # Install from .skill package file
  %(prog)s ./packages/skills/validated-knowledge-synthesis.skill

Note: To create a .skill package, use skill-package.py
        """
    )

    parser.add_argument(
        "skill_input",
        help="Skill name, path to skill directory, or path to .skill file"
    )

    parser.add_argument(
        "--repo",
        type=Path,
        default=Path.cwd(),
        help="Repository root path for skill name lookup (default: current directory)"
    )

    parser.add_argument(
        "--install-dir",
        type=Path,
        default=Path.home() / ".claude" / "skills",
        help="Installation directory (default: ~/.claude/skills)"
    )

    args = parser.parse_args()

    # Expand paths
    repo_path = args.repo.expanduser().resolve()
    install_dir = args.install_dir.expanduser().resolve()

    print("=" * 60)
    print("SKILL INSTALLER")
    print("=" * 60)
    print()

    # Step 1: Determine input type
    print("Analyzing input...")
    input_type, skill_path, skill_name = determine_input_type(args.skill_input, repo_path)

    if input_type == 'skill_file':
        success(f"Found .skill package: {skill_name}")
    elif input_type == 'skill_dir':
        success(f"Found skill directory: {skill_name}")
    else:
        success(f"Found skill in repo: {skill_name}")

    info(f"Source: {skill_path}")
    print()

    # Step 2: Install
    print("Installing...")
    install_dir.mkdir(parents=True, exist_ok=True)

    if input_type == 'skill_file':
        skill_install_dir, skill_name = install_from_skill_file(skill_path, install_dir)
    else:
        skill_install_dir = install_from_directory(skill_path, skill_name, install_dir)

    success(f"Installed to {skill_install_dir}")

    # Step 3: Verify
    verify_installation(skill_install_dir, skill_name)

    # Done
    print()
    print("=" * 60)
    success(f"Skill '{skill_name}' installed successfully!")
    print()
    print("⚠️  Restart Claude Code or start a new session to use the skill.")
    print("=" * 60)


if __name__ == "__main__":
    main()
