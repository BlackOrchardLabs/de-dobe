@echo off
REM Build Firefox extension v3.0.0

echo Building De:dobe v3.0.0 for Firefox...

REM Copy Firefox manifest
copy /Y manifest-firefox.json manifest.json

REM Create build directory
if not exist "builds" mkdir builds

REM Remove old build if exists
if exist "builds\de-dobe-v3.0.0-firefox.zip" del "builds\de-dobe-v3.0.0-firefox.zip"

REM Create zip (requires PowerShell)
powershell -Command "Compress-Archive -Path icons\*, extractors\*, content\*, plugins\*, popup\*, background.js, manifest.json, platform-router.js -DestinationPath builds\de-dobe-v3.0.0-firefox.zip -Force"

REM Restore main manifest
git checkout manifest.json

echo.
echo ✓ Firefox build complete: builds\de-dobe-v3.0.0-firefox.zip
echo.
echo To install:
echo 1. Open about:debugging#/runtime/this-firefox
echo 2. Click "Load Temporary Add-on"
echo 3. Select any file from the de-dobe folder
echo.
pause
