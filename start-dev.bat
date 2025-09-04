@echo off
echo ================================================
echo    Pokemon Card Search - Development Mode
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

echo Starting Pokemon Card Search in development mode...
echo.
echo ================================================
echo    Development Server Information
echo ================================================
echo   URL: http://localhost:3000
echo   Mode: Development (Vite with HMR)
echo   Features: Hot Module Reloading
echo   
echo   Press Ctrl+C to stop the server
echo ================================================
echo.

REM Try to open browser automatically
timeout 3 > nul
start http://localhost:3000

REM Start the development server
npm run dev:win