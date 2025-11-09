#!/usr/bin/env python3
"""
Update team member markdown files with optimized picture tags.
Converts simple img tags to picture tags with AVIF, WebP, and JPEG formats.
"""

import re
import sys
from pathlib import Path

def update_team_file(filepath):
    """Update a single team member file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the team member name from the filename
    name = filepath.stem  # e.g., 'denopus' from 'denopus.md'
    
    # Pattern to match current image markdown (with or without class attribute)
    # Matches: ![Name](path/to/image.jpg){: .class} or ![Name](path/to/image.jpg)
    pattern = rf'!\[([^\]]+)\]\(\.\./assets/images/team/{name}-alesi\.jpg\)(\{{: \.agent-profile-image\}})?'
    
    # Check if file already has picture tag
    if '<picture>' in content:
        print(f"✓  {name}: Already has picture tag, skipping...")
        return False
    
    # Find the match
    match = re.search(pattern, content)
    if not match:
        print(f"⚠  {name}: No matching image tag found, skipping...")
        return False
    
    alt_text = match.group(1)
    has_class = match.group(2) is not None
    
    # Create picture tag replacement
    class_attr = '{: .agent-profile-image}' if has_class else ''
    
    picture_tag = f'''<picture>
  <source srcset="../assets/images/team/{name}-alesi.avif" type="image/avif">
  <source srcset="../assets/images/team/{name}-alesi.webp" type="image/webp">
  <img src="../assets/images/team/{name}-alesi.jpg" alt="{alt_text}" loading="lazy"{' class="agent-profile-image"' if has_class else ''}>
</picture>{class_attr if has_class else ''}'''
    
    # Replace the image tag with picture tag
    new_content = re.sub(pattern, picture_tag, content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ {name}: Updated successfully!")
    return True

def main():
    """Update all specified team member files."""
    files_to_update = [
        'denopus', 'gunta', 'john', 'lenna', 
        'leon', 'marco', 'olu', 'wolfgang'
    ]
    
    team_dir = Path('docs/team')
    updated_count = 0
    
    print("🖼️  Updating team member markdown files with optimized picture tags...\n")
    
    for name in files_to_update:
        filepath = team_dir / f"{name}.md"
        if filepath.exists():
            if update_team_file(filepath):
                updated_count += 1
        else:
            print(f"❌ {name}: File not found!")
    
    print(f"\n✅ Batch update complete! Updated {updated_count} files.")
    print("\nTo verify changes:")
    print("  git diff docs/team/")
    print("\nTo rebuild site:")
    print("  docker exec nostalgic_bohr mkdocs build --clean")

if __name__ == '__main__':
    main()
