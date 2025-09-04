# Pokemon Card Search - PowerShell Launcher
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Pokemon Card Search - Starting Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: Dependencies not installed!" -ForegroundColor Red
    Write-Host "Please run 'install.ps1' or 'install.bat' first." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "Building project..." -ForegroundColor Yellow
    try {
        npm run build
        Write-Host "Build complete!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Build failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host ""
}

Write-Host "Starting Pokemon Card Search server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   Server Information" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000" -ForegroundColor White
Write-Host "  Mode: Production-like (Wrangler Pages)" -ForegroundColor White
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Try to open browser automatically
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

# Start the server
npm run dev:wrangler