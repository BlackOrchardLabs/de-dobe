#!/bin/bash
# Build script for Chrome version
# Chrome uses manifest.chrome.json with Chrome-specific fixes

echo "Building De:dobe for Chrome..."

# Create clean build directory
rm -rf builds/chrome
mkdir -p builds/chrome

# Copy files from src
cp src/manifest.chrome.json builds/chrome/manifest.json
cp src/background.js builds/chrome/
cp -r src/content builds/chrome/
cp -r src/popup builds/chrome/

# Create zip archive
cd builds/chrome
zip -r ../dedobe-chrome.zip ./*
cd ../..

echo "✓ Chrome build complete: builds/dedobe-chrome.zip"
echo "✓ This build includes:"
echo "  - Runtime-gated Chrome fixes (service worker, DOM readiness)"
echo "  - Removed unused 'storage' permission"
echo "  - Chrome-compatible async messaging"
echo "  - Empty blob protection"
