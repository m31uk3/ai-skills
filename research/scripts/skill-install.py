#!/usr/bin/env python3
"""
Generic skill installer for Claude Code skills.

This script accepts either:
1. A skill name (looks in skills/ directory)
2. A path to a skill directory
3. A path to a .skill package file

It will:
1. Package the skill if needed (unless given a .skill file)
2. Install to ~/.claude/skills/
3. Verify installation

Usage:
    python3 skill-install.py SKILL_NAME_OR_PATH [OPTIONS]

Examples:
    # Install by name (finds in skills/)
    python3 skill-install.py skill-resiliency

    # Install from directory
    python3 skill-install.py ./skills/guided-ooda-loop

    # Install from .skill file
    python3 skill-install.py ./packages/skills/validated-knowledge-synthesis.skill

    # Force re-packaging
    python3 skill-install.py skill-resiliency --force
"""

import argparse
import subprocess
import sys
from pathlib import Path
import zipfile
import shutil

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
        success(f"Input type: .skill package file")
        return ('skill_file', input_path, skill_name)

    # Case 2: Directory path with SKILL.md
    if input_path.is_dir() and (input_path / "SKILL.md").exists():
        skill_name = input_path.name
        success(f"Input type: skill directory")
        return ('skill_dir', input_path, skill_name)

    # Case 3: Skill name (look in repo skills/)
    skill_dir = repo_path / "skills" / input_arg
    if skill_dir.is_dir() and (skill_dir / "SKILL.md").exists():
        success(f"Input type: skill name (found in repo)")
        return ('skill_name', skill_dir, input_arg)

    # Not found
    error(f"Could not find skill from input: {input_arg}\n"
          f"  • Not a .skill file\n"
          f"  • Not a directory with SKILL.md\n"
          f"  • Not found in {repo_path / 'skills'}")

def package_skill(repo_path: Path, skill_dir: Path, skill_name: str, force: bool = False) -> Path:
    """Package the skill using package_skill.py."""
    packages_dir = repo_path / "packages" / "skills"
    packages_dir.mkdir(parents=True, exist_ok=True)

    package_path = packages_dir / f"{skill_name}.skill"

    # Check if already packaged
    if package_path.exists() and not force:
        info(f"Skill already packaged at {package_path}")
        return package_path

    if force and package_path.exists():
        info(f"Force packaging: removing existing {package_path}")
        package_path.unlink()

    # Find package_skill.py script
    package_script = None
    possible_locations = [
        Path.home() / ".claude" / "plugins" / "cache" / "anthropic-agent-skills",
    ]

    for loc in possible_locations:
        if loc.exists():
            found = list(loc.rglob("package_skill.py"))
            if found:
                package_script = found[0]
                break

    if not package_script:
        error("Could not find package_skill.py script. Is the skill-creator plugin installed?")

    info(f"Packaging skill using {package_script}")

    # Run package script
    result = subprocess.run(
        [sys.executable, str(package_script), str(skill_dir)],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        error(f"Packaging failed:\n{result.stderr}")

    # Check where package was created (script creates in repo root or packages/skills/)
    if not package_path.exists():
        # Check if it was created in repo root
        root_package = repo_path / f"{skill_name}.skill"
        if root_package.exists():
            info(f"Moving package from {root_package} to {package_path}")
            shutil.move(str(root_package), str(package_path))
        else:
            error(f"Package file not created at {package_path} or {root_package}")

    success(f"Packaged skill to {package_path}")
    return package_path

def install_skill(package_path: Path, skill_name: str, install_dir: Path) -> Path:
    """Install skill to ~/.claude/skills/."""
    # Ensure install directory exists
    install_dir.mkdir(parents=True, exist_ok=True)

    skill_install_dir = install_dir / skill_name

    # Remove existing installation if present
    if skill_install_dir.exists():
        info(f"Removing existing installation at {skill_install_dir}")
        shutil.rmtree(skill_install_dir)

    info(f"Installing to {skill_install_dir}")

    # Extract .skill file (it's a zip)
    try:
        with zipfile.ZipFile(package_path, 'r') as zip_ref:
            zip_ref.extractall(install_dir)
    except zipfile.BadZipFile:
        error(f"Invalid .skill file: {package_path}")

    # Verify installation
    if not skill_install_dir.exists():
        error(f"Installation failed: {skill_install_dir} not found")

    if not (skill_install_dir / "SKILL.md").exists():
        error(f"Installation failed: SKILL.md not found in {skill_install_dir}")

    success(f"Installed skill to {skill_install_dir}")
    return skill_install_dir

def verify_installation(skill_install_dir: Path, skill_name: str):
    """Verify the skill is properly installed."""
    print("\n" + "=" * 70)
    print("INSTALLATION VERIFICATION")
    print("=" * 70)

    # Check SKILL.md
    skill_md = skill_install_dir / "SKILL.md"
    print(f"✓ SKILL.md exists: {skill_md.exists()}")

    # Check for references
    refs_dir = skill_install_dir / "references"
    if refs_dir.exists():
        ref_files = list(refs_dir.glob("*.md"))
        print(f"✓ References: {len(ref_files)} files found")
        for ref in ref_files:
            print(f"  - {ref.name}")

    # Check for scripts
    scripts_dir = skill_install_dir / "scripts"
    if scripts_dir.exists():
        script_files = list(scripts_dir.iterdir())
        print(f"✓ Scripts: {len(script_files)} files found")
        for script in script_files:
            print(f"  - {script.name}")

    # Check for examples
    examples_dir = skill_install_dir / "examples"
    if examples_dir.exists():
        example_files = list(examples_dir.iterdir())
        print(f"✓ Examples: {len(example_files)} files found")
        for example in example_files:
            print(f"  - {example.name}")

    print("\n" + "=" * 70)
    success(f"Skill '{skill_name}' is properly installed!")
    print("\n⚠️  IMPORTANT: Restart Claude Code or start a new session to use the skill.")
    print("=" * 70)

def main():
    parser = argparse.ArgumentParser(
        description="Package and install a Claude Code skill",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Install by name (finds in skills/ directory)
  %(prog)s skill-resiliency

  # Install from skill directory
  %(prog)s ./skills/guided-ooda-loop

  # Install from .skill package file
  %(prog)s ./packages/skills/validated-knowledge-synthesis.skill

  # Force re-packaging
  %(prog)s skill-resiliency --force
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
        help="Repository root path (default: current directory)"
    )

    parser.add_argument(
        "--install-dir",
        type=Path,
        default=Path.home() / ".claude" / "skills",
        help="Installation directory (default: ~/.claude/skills)"
    )

    parser.add_argument(
        "--force",
        action="store_true",
        help="Force re-packaging even if .skill file exists"
    )

    args = parser.parse_args()

    # Expand paths
    repo_path = args.repo.expanduser().resolve()
    install_dir = args.install_dir.expanduser().resolve()

    print("=" * 70)
    print(f"SKILL INSTALLER")
    print("=" * 70)
    print()

    # Step 1: Determine input type
    print("Step 1: Analyzing input...")
    input_type, skill_path, skill_name = determine_input_type(args.skill_input, repo_path)
    info(f"Skill name: {skill_name}")
    info(f"Skill path: {skill_path}")
    print()

    # Step 2: Get or create package
    if input_type == 'skill_file':
        print("Step 2: Using provided .skill file...")
        package_path = skill_path
        info(f"Package: {package_path}")
    else:
        print("Step 2: Packaging skill...")
        package_path = package_skill(repo_path, skill_path, skill_name, args.force)
    print()

    # Step 3: Install skill
    print("Step 3: Installing skill...")
    skill_install_dir = install_skill(package_path, skill_name, install_dir)
    print()

    # Step 4: Verify installation
    print("Step 4: Verifying installation...")
    verify_installation(skill_install_dir, skill_name)

if __name__ == "__main__":
    main()
