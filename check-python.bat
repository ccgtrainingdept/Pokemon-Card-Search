@echo off
echo ================================================
echo    Python Installation Checker
echo ================================================
echo.

echo Checking Python installation...
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [✗] 'python' command not found
    echo.
    echo Trying 'python3'...
    python3 --version >nul 2>&1
    if errorlevel 1 (
        echo [✗] 'python3' command not found either
        echo.
        echo ❌ PYTHON NOT INSTALLED
        echo.
        echo To fix this:
        echo 1. Go to https://python.org/downloads/
        echo 2. Download Python 3.8 or newer
        echo 3. During installation, CHECK "Add Python to PATH"
        echo 4. Restart your computer after installation
        echo 5. Run this file again to verify
        echo.
    ) else (
        for /f "tokens=*" %%a in ('python3 --version') do (
            echo [✓] Python3: %%a
            echo.
            echo ✅ PYTHON IS READY!
            echo You can run: run-python.bat
        )
    )
) else (
    for /f "tokens=*" %%a in ('python --version') do (
        echo [✓] Python: %%a
        echo.
        echo ✅ PYTHON IS READY!
        echo You can run: run-python.bat
    )
)

echo.
echo Checking required modules...
echo.

python -c "import http.server, socketserver, json, urllib.request, webbrowser, threading, time" >nul 2>&1
if errorlevel 1 (
    python3 -c "import http.server, socketserver, json, urllib.request, webbrowser, threading, time" >nul 2>&1
    if errorlevel 1 (
        echo [⚠] Some modules might be missing, but should work with standard Python
    ) else (
        echo [✓] All required modules available
    )
) else (
    echo [✓] All required modules available
)

echo.
echo ================================================
echo    Check Complete
echo ================================================
pause