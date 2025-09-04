@echo off
echo ================================================
echo    Pokemon Card Search - Python Version
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Checking for python3...
    python3 --version >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Python is not installed!
        echo.
        echo Please install Python from https://python.org/
        echo Make sure to check "Add Python to PATH" during installation.
        echo.
        pause
        exit /b 1
    ) else (
        echo Python3 found! Using python3 command...
        set PYTHON_CMD=python3
    )
) else (
    for /f "tokens=*" %%a in ('python --version') do echo Found: %%a
    set PYTHON_CMD=python
)

echo.
echo Starting Pokemon Card Search server...
echo This is more stable than the Node.js version!
echo.
echo ================================================
echo    Server will start at: http://localhost:3000
echo    Browser will open automatically
echo    Press Ctrl+C to stop
echo ================================================
echo.

%PYTHON_CMD% python_server.py

echo.
echo Server stopped.
pause