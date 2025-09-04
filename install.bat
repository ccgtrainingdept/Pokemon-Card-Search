@echo off
echo ================================================
echo    Pokemon Card Search - Windows Installer
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo NPM version:
npm --version
echo.

echo Installing dependencies (this may take a few minutes)...
echo Using legacy-peer-deps to resolve dependency conflicts...
echo.

npm install --legacy-peer-deps

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo.
    echo Trying alternative installation method...
    npm install --force
    
    if errorlevel 1 (
        echo.
        echo ERROR: Installation failed with both methods!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
)

echo.
echo Dependencies installed successfully!
echo.

echo Building the project...
npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo    Installation Complete!
echo ================================================
echo.
echo To start the Pokemon Card Search tool:
echo   1. Double-click "start.bat"
echo   2. Or run: npm run start
echo.
echo The web application will be available at:
echo   http://localhost:3000
echo.
pause