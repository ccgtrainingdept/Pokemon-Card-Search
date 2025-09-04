@echo off
setlocal enabledelayedexpansion

echo ================================================
echo    Pokemon Card Search - Windows Installer
echo ================================================
echo.
echo Current directory: %CD%
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you're running this from the project directory.
    echo Expected files: package.json, src folder, public folder
    echo.
    dir
    echo.
    pause
    exit /b 1
)

echo Found package.json - Good!
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation.
    echo After installing Node.js, restart your computer and try again.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo Node.js version: !NODE_VERSION!

REM Check npm
echo Checking NPM...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: NPM is not available!
    echo NPM should come with Node.js. Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
echo NPM version: !NPM_VERSION!
echo.

echo Installing dependencies (this may take a few minutes)...
echo Using legacy-peer-deps to resolve dependency conflicts...
echo.

REM Clear npm cache first
echo Clearing npm cache...
npm cache clean --force

echo.
echo Starting installation...
npm install --legacy-peer-deps

if errorlevel 1 (
    echo.
    echo Installation with --legacy-peer-deps failed!
    echo Trying alternative method with --force...
    echo.
    
    npm install --force
    
    if errorlevel 1 (
        echo.
        echo ERROR: Both installation methods failed!
        echo.
        echo Possible solutions:
        echo 1. Check your internet connection
        echo 2. Try running as Administrator
        echo 3. Disable antivirus temporarily
        echo 4. Delete node_modules folder and try again
        echo.
        pause
        exit /b 1
    ) else (
        echo.
        echo Dependencies installed with --force flag!
    )
) else (
    echo.
    echo Dependencies installed successfully with --legacy-peer-deps!
)

echo.
echo Checking if node_modules was created...
if exist "node_modules" (
    echo node_modules folder created successfully!
) else (
    echo ERROR: node_modules folder not created!
    echo Installation may have failed silently.
    echo.
    pause
    exit /b 1
)

echo.
echo Building the project...
npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo This might be due to missing dependencies or configuration issues.
    echo.
    echo Try running these commands manually:
    echo   npm cache clean --force
    echo   npm install --legacy-peer-deps
    echo   npm run build
    echo.
    pause
    exit /b 1
)

echo.
echo Checking if dist folder was created...
if exist "dist" (
    echo dist folder created successfully!
) else (
    echo WARNING: dist folder not found after build!
    echo Build may have failed silently.
)

echo.
echo ================================================
echo    Installation Complete!
echo ================================================
echo.
echo Files created:
if exist "node_modules" echo [✓] node_modules (dependencies)
if exist "dist" echo [✓] dist (built application)
if exist ".npmrc" echo [✓] .npmrc (configuration)
echo.
echo To start the Pokemon Card Search tool:
echo   1. Double-click "start.bat"
echo   2. Or run in terminal: npm run start
echo.
echo The web application will be available at:
echo   http://localhost:3000
echo.
echo Press any key to exit...
pause >nul