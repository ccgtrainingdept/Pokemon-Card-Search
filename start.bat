@echo off
setlocal enabledelayedexpansion

echo ================================================
echo    Pokemon Card Search - Starting Server
echo ================================================
echo.
echo Current directory: %CD%
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you're running this from the project directory.
    echo.
    pause
    exit /b 1
)

echo Found package.json - Good!

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo Node.js version: !NODE_VERSION!

REM Check if node_modules exists
echo Checking dependencies...
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run "install.bat" first to install dependencies.
    echo.
    pause
    exit /b 1
)

echo Dependencies found - Good!

REM Check if dist folder exists
echo Checking build...
if not exist "dist" (
    echo dist folder not found. Building project...
    echo.
    
    npm run build
    if errorlevel 1 (
        echo.
        echo ERROR: Build failed!
        echo Try running "install.bat" again.
        echo.
        pause
        exit /b 1
    )
    echo Build complete!
    echo.
) else (
    echo Build found - Good!
)

echo.
echo Starting Pokemon Card Search server...
echo.
echo ================================================
echo    Server Information
echo ================================================
echo   URL: http://localhost:3000
echo   Mode: Development (Vite Server)
echo   
echo   This window must stay open while using the app
echo   Press Ctrl+C to stop the server
echo ================================================
echo.

echo Server will start in 5 seconds...
echo Browser will open automatically...
timeout 5 > nul

REM Start browser in background
start "" "http://localhost:3000"

echo.
echo Starting server now...
echo If you see errors, try running: npm run start:dev
echo.

REM Start the server - use dev mode which is more reliable
npm run start:dev