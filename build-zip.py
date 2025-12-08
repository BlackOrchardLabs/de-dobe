#!/usr/bin/env python3
import zipfile
import os
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

print("=" * 60)
print("Building Chrome zip...")
print("=" * 60)
create_zip("builds/de-dobe-v3.0.0-chrome.zip", base_dir, files)

print("\n" + "=" * 60)
print("Chrome zip complete!")
print("=" * 60)
