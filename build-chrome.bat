@echo off
REM Build Chrome extension v3.0.0

echo Building De:dobe v3.0.0 for Chrome...

REM Copy Chrome manifest
copy /Y manifest-chrome.json manifest.json

REM Create build directory
if not exist "builds" mkdir builds

REM Remove old build if exists
if exist "builds\de-dobe-v3.0.0-chrome.zip" del "builds\de-dobe-v3.0.0-chrome.zip"

REM Create zip (requires PowerShell)
powershell -Command "Compress-Archive -Path icons\*, extractors\*, content\*, plugins\*, popup\*, background.js, manifest.json, platform-router.js -DestinationPath builds\de-dobe-v3.0.0-chrome.zip -Force"

REM Restore main manifest
copy /Y manifest.json manifest.json

echo.
echo ✓ Chrome build complete: builds\de-dobe-v3.0.0-chrome.zip
echo.
echo To install:
echo 1. Open chrome://extensions/
echo 2. Enable "Developer mode" (top right)
echo 3. Click "Load unpacked"
echo 4. Select the de-dobe folder (NOT the zip)
echo.
pause
