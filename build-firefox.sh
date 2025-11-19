#!/bin/bash
# Build script for Firefox version
# Firefox uses manifest.json (original, approved version)

echo "Building De:dobe for Firefox..."

# Create clean build directory
rm -rf builds/firefox
mkdir -p builds/firefox

# Copy files from src
cp src/manifest.json builds/firefox/
cp src/background.js builds/firefox/
cp -r src/content builds/firefox/
cp -r src/popup builds/firefox/

# Create zip archive
cd builds/firefox
zip -r ../dedobe-firefox.zip ./*
cd ../..

echo "✓ Firefox build complete: builds/dedobe-firefox.zip"
echo "✓ This build uses the Firefox-approved manifest.json (v0.1.0)"
