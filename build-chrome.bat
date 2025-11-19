@echo off
REM Build script for Chrome version
REM Chrome uses manifest.chrome.json with Chrome-specific fixes

echo Building De:dobe for Chrome...

REM Create clean build directory
if exist builds\chrome rmdir /s /q builds\chrome
mkdir builds\chrome

REM Copy files from src
copy src\manifest.chrome.json builds\chrome\manifest.json
copy src\background.js builds\chrome\
xcopy src\content builds\chrome\content\ /E /I /Y
xcopy src\popup builds\chrome\popup\ /E /I /Y

REM Create zip archive using PowerShell
cd builds\chrome
powershell -Command "Compress-Archive -Path * -DestinationPath ..\dedobe-chrome.zip -Force"
cd ..\..

echo.
echo ✓ Chrome build complete: builds\dedobe-chrome.zip
echo ✓ This build includes:
echo   - Runtime-gated Chrome fixes (service worker, DOM readiness)
echo   - Removed unused 'storage' permission
echo   - Chrome-compatible async messaging
echo   - Empty blob protection
