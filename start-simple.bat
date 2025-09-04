@echo off
setlocal enabledelayedexpansion

echo ================================================
echo    Pokemon Card Search - Simple Start
echo ================================================
echo.

REM Basic checks
if not exist "package.json" (
    echo ERROR: Not in project directory!
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo ERROR: Run install.bat first!
    pause
    exit /b 1
)

echo Starting simple development server...
echo URL will be: http://localhost:3000
echo.

REM Open browser after 3 seconds
start "" cmd /c "timeout 3 >nul && start http://localhost:3000"

echo Starting Vite development server...
echo.
npm run dev

echo.
echo Server stopped.
pause