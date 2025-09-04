@echo off
echo ================================================
echo    Testing Installation Requirements
echo ================================================
echo.

echo 1. Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [✗] Node.js NOT FOUND
    echo Please install from https://nodejs.org/
    goto :end
) else (
    for /f "tokens=*" %%a in ('node --version') do echo [✓] Node.js: %%a
)

echo.
echo 2. Checking NPM...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [✗] NPM NOT FOUND
    goto :end
) else (
    for /f "tokens=*" %%a in ('npm --version') do echo [✓] NPM: %%a
)

echo.
echo 3. Checking project files...
if exist "package.json" (
    echo [✓] package.json found
) else (
    echo [✗] package.json missing - wrong directory?
    goto :end
)

if exist "src" (
    echo [✓] src folder found
) else (
    echo [✗] src folder missing
)

echo.
echo 4. Testing NPM install (dry run)...
npm install --dry-run --legacy-peer-deps >nul 2>&1
if errorlevel 1 (
    echo [⚠] NPM install might have issues
) else (
    echo [✓] NPM install should work
)

echo.
echo ================================================
echo    Test Results
echo ================================================
echo.
echo If you see all [✓] marks above, run: install.bat
echo If you see [✗] marks, fix those issues first.
echo.
echo For help, see MANUAL_INSTALL.md
echo.

:end
pause