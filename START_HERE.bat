@echo off
echo ================================================
echo    Pokemon Card Search - Universal Launcher
echo ================================================
echo.
echo This will try the most stable method first.
echo.

echo Checking for Python (recommended)...
python --version >nul 2>&1
if errorlevel 1 (
    python3 --version >nul 2>&1
    if errorlevel 1 (
        echo [✗] Python not found
        echo.
        echo Checking for Node.js (alternative)...
        node --version >nul 2>&1
        if errorlevel 1 (
            echo [✗] Node.js not found either
            echo.
            echo ❌ NEITHER PYTHON NOR NODE.JS FOUND
            echo.
            echo RECOMMENDED SOLUTION:
            echo 1. Install Python from https://python.org/
            echo 2. Check "Add Python to PATH" during installation
            echo 3. Restart computer and run this file again
            echo.
            echo Alternative: Install Node.js from https://nodejs.org/
            echo (but Python is more reliable for this application)
            echo.
            pause
            exit /b 1
        ) else (
            echo [✓] Node.js found, but Python is recommended
            echo.
            echo Do you want to:
            echo   1. Install Python (recommended) - Press 1
            echo   2. Try Node.js anyway - Press 2
            echo   3. Exit - Press any other key
            echo.
            choice /c 12 /n /m "Your choice: "
            
            if errorlevel 2 (
                echo.
                echo Trying Node.js version...
                echo Note: This may have dependency issues
                echo.
                pause
                goto :nodejs
            ) else if errorlevel 1 (
                echo.
                echo Please install Python from https://python.org/
                echo Then run this file again.
                pause
                exit /b 1
            ) else (
                exit /b 1
            )
        )
    ) else (
        echo [✓] Python3 found - EXCELLENT!
        goto :python
    )
) else (
    echo [✓] Python found - EXCELLENT!
    goto :python
)

:python
echo.
echo ================================================
echo    Starting Python Version (Recommended)
echo ================================================
echo.
echo ✅ More stable than Node.js
echo ✅ No dependency issues  
echo ✅ Faster startup
echo ✅ Same functionality
echo.
echo Starting in 3 seconds...
timeout 3 >nul

run-python.bat
goto :end

:nodejs
echo.
echo ================================================
echo    Starting Node.js Version
echo ================================================
echo.
echo ⚠ This may encounter dependency issues
echo ⚠ If it fails, please install Python instead
echo.
echo Checking dependencies...
if not exist "node_modules" (
    echo Dependencies not installed. Running install.bat...
    call install.bat
    if errorlevel 1 (
        echo.
        echo ❌ Node.js installation failed!
        echo.
        echo RECOMMENDED: Install Python instead
        echo 1. Go to https://python.org/
        echo 2. Download and install Python  
        echo 3. Check "Add to PATH" during installation
        echo 4. Run START_HERE.bat again
        echo.
        pause
        exit /b 1
    )
)

echo Starting Node.js server...
call start.bat

:end
echo.
echo Server stopped. Thank you for using Pokemon Card Search!
pause