@echo off
echo ================================================
echo    Pokemon Card Search - Debug Information  
echo ================================================
echo.

echo Current Directory: %CD%
echo.

echo Checking required files:
if exist "package.json" (
    echo [✓] package.json found
) else (
    echo [✗] package.json missing!
)

if exist "src" (
    echo [✓] src folder found
) else (
    echo [✗] src folder missing!
)

if exist "public" (
    echo [✓] public folder found  
) else (
    echo [✗] public folder missing!
)

if exist "node_modules" (
    echo [✓] node_modules found
) else (
    echo [✗] node_modules missing - run install.bat
)

if exist "dist" (
    echo [✓] dist folder found
) else (
    echo [✗] dist folder missing - needs build
)

if exist ".npmrc" (
    echo [✓] .npmrc found
) else (
    echo [✗] .npmrc missing
)

echo.
echo Node.js check:
node --version 2>nul
if errorlevel 1 (
    echo [✗] Node.js not found or not in PATH
    echo Please install Node.js from https://nodejs.org/
) else (
    echo [✓] Node.js is working
)

echo.
echo NPM check:
npm --version 2>nul
if errorlevel 1 (
    echo [✗] NPM not found
) else (
    echo [✓] NPM is working
)

echo.
echo Directory contents:
dir /b

echo.
echo Package.json scripts (if exists):
if exist "package.json" (
    findstr "scripts" package.json
)

echo.
echo ================================================
echo    Debug Complete
echo ================================================
echo.
echo If you see missing items above, that's the issue!
echo.
pause