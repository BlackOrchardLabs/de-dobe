#!/usr/bin/env python3
import zipfile
import os
import shutil
from pathlib import Path

def create_zip(output_file, base_dir, files):
    """Create a zip file with forward slashes in paths"""
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_pattern in files:
            file_path = Path(base_dir) / file_pattern
            if file_path.is_file():
                # Store with forward slashes
                arcname = file_pattern.replace('\\', '/')
                print(f"Adding: {arcname}")
                zipf.write(file_path, arcname)
            elif file_path.is_dir():
                # Recursively add directory contents
                for root, dirs, filenames in os.walk(file_path):
                    for filename in filenames:
                        full_path = os.path.join(root, filename)
                        # Calculate relative path and use forward slashes
                        rel_path = os.path.relpath(full_path, base_dir)
                        arcname = rel_path.replace('\\', '/')
                        print(f"Adding: {arcname}")
                        zipf.write(full_path, arcname)

# Backup Chrome manifest and copy Firefox manifest
print("=" * 60)
print("Swapping to Firefox manifest...")
print("=" * 60)
shutil.copy("manifest.json", "manifest-backup.json")
shutil.copy("manifest-firefox.json", "manifest.json")

base_dir = "."
files = [
    "background.js",
    "manifest.json",
    "platform-router.js",
    "icons",
    "extractors",
    "content",
    "plugins",
    "popup"
]

print("\n" + "=" * 60)
print("Building Firefox zip...")
print("=" * 60)
create_zip("builds/de-dobe-v3.0.0-firefox.zip", base_dir, files)

# Restore Chrome manifest
print("\n" + "=" * 60)
print("Restoring Chrome manifest...")
print("=" * 60)
shutil.copy("manifest-backup.json", "manifest.json")
os.remove("manifest-backup.json")

print("\n" + "=" * 60)
print("Firefox zip complete!")
print("=" * 60)
