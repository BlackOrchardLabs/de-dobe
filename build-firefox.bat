@echo off
REM Build script for Firefox version
REM Firefox uses manifest.json (original, approved version)

echo Building De:dobe for Firefox...

REM Create clean build directory
if exist builds\firefox rmdir /s /q builds\firefox
mkdir builds\firefox

REM Copy files from src
copy src\manifest.json builds\firefox\
copy src\background.js builds\firefox\
xcopy src\content builds\firefox\content\ /E /I /Y
xcopy src\popup builds\firefox\popup\ /E /I /Y

REM Create zip archive using PowerShell
cd builds\firefox
powershell -Command "Compress-Archive -Path * -DestinationPath ..\dedobe-firefox.zip -Force"
cd ..\..

echo.
echo ✓ Firefox build complete: builds\dedobe-firefox.zip
echo ✓ This build uses the Firefox-approved manifest.json (v0.1.0)
