@echo off
echo ================================================
echo    Pokemon Card Search - Starting Server
echo ================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run "install.bat" first.
    echo.
    pause
    exit /b 1
)

REM Check if dist folder exists
if not exist "dist" (
    echo Building project...
    npm run build
    if errorlevel 1 (
        echo.
        echo ERROR: Build failed!
        pause
        exit /b 1
    )
    echo Build complete!
    echo.
)

echo Starting Pokemon Card Search server...
echo.
echo ================================================
echo    Server Information
echo ================================================
echo   URL: http://localhost:3000
echo   Mode: Production-like (Wrangler Pages)
echo   
echo   Press Ctrl+C to stop the server
echo ================================================
echo.

REM Try to open browser automatically
timeout 3 > nul
start http://localhost:3000

REM Start the server
npm run dev:wrangler