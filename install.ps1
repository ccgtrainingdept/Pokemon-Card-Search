# Pokemon Card Search - PowerShell Installer
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Pokemon Card Search - Windows Installer" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm version
try {
    $npmVersion = npm --version
    Write-Host "NPM version: $npmVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "ERROR: NPM is not available!" -ForegroundColor Red
    exit 1
}

Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "Using legacy-peer-deps to resolve dependency conflicts..." -ForegroundColor Yellow
Write-Host ""

# Install dependencies
try {
    npm install --legacy-peer-deps
    Write-Host ""
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Trying alternative installation method..." -ForegroundColor Yellow
    try {
        npm install --force
        Write-Host "Dependencies installed with --force flag!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Installation failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Building the project..." -ForegroundColor Yellow

# Build the project
try {
    npm run build
    Write-Host "Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Installation Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the Pokemon Card Search tool:" -ForegroundColor Green
Write-Host "  1. Run: ./start.ps1" -ForegroundColor White
Write-Host "  2. Or double-click 'start.bat'" -ForegroundColor White
Write-Host "  3. Or run: npm run start" -ForegroundColor White
Write-Host ""
Write-Host "The web application will be available at:" -ForegroundColor Green
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"