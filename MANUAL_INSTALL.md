# Manual Installation Guide (If Batch Files Don't Work)

## Step 1: Check Prerequisites

### Download and Install Node.js
1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. **IMPORTANT**: Make sure "Add to PATH" is checked during installation
5. Restart your computer after installation

### Verify Installation
Open Command Prompt (`cmd`) or PowerShell and run:
```bash
node --version
npm --version
```
You should see version numbers. If you get "command not found", Node.js isn't installed properly.

## Step 2: Extract and Navigate

1. Extract the project backup to a folder (e.g., `C:\pokemon-card-search\`)
2. Open Command Prompt (`cmd`)
3. Navigate to the project folder:
   ```bash
   cd C:\pokemon-card-search
   # (or wherever you extracted it)
   ```

## Step 3: Manual Installation

Run these commands one by one in Command Prompt:

### Clear NPM Cache
```bash
npm cache clean --force
```

### Install Dependencies (try each method if previous fails)
```bash
# Method 1 (preferred)
npm install --legacy-peer-deps

# If Method 1 fails, try Method 2
npm install --force

# If Method 2 fails, try Method 3
npm install
```

### Verify Installation
```bash
# Check if node_modules folder was created
dir node_modules
```

You should see a folder with many subfolders.

## Step 4: Build the Project

```bash
npm run build
```

This should create a `dist` folder. Verify with:
```bash
dir dist
```

## Step 5: Start the Application

Try these methods in order:

### Method 1: Development Server (Recommended)
```bash
npm run dev
```

### Method 2: Production-like Server  
```bash
npm run start
```

### Method 3: Manual Vite Start
```bash
npx vite --host 0.0.0.0 --port 3000
```

## Step 6: Open in Browser

Once you see a message like "Local: http://localhost:3000", open your browser and go to:
- http://localhost:3000

## Troubleshooting Common Issues

### "ERESOLVE unable to resolve dependency tree"
This is fixed by using `--legacy-peer-deps`. If it still fails:
1. Delete `node_modules` folder: `rmdir /s node_modules`
2. Try: `npm install --force`

### "Node.js not recognized"
1. Reinstall Node.js from https://nodejs.org/
2. Make sure "Add to PATH" is checked
3. Restart your computer
4. Try again

### "Permission denied" or "Access denied"
1. Run Command Prompt as Administrator:
   - Right-click Command Prompt → "Run as administrator"
2. Try the installation commands again

### Port 3000 already in use
1. The app will automatically try the next available port (3001, 3002, etc.)
2. Check the console output for the actual URL
3. Or stop other applications using port 3000

### Build fails
```bash
# Clear everything and start over
npm cache clean --force
rmdir /s node_modules
npm install --legacy-peer-deps
npm run build
```

### Browser doesn't open automatically
1. Look for a line like "Local: http://localhost:3000" in the console
2. Manually open your browser and go to that URL

## Alternative: Use Different Package Manager

If NPM continues to have issues, try Yarn:

### Install Yarn
```bash
npm install -g yarn
```

### Use Yarn instead
```bash
yarn install
yarn build  
yarn dev
```

## Verify Everything is Working

Once the server starts:
1. Open http://localhost:3000 in your browser
2. You should see the Pokemon Card Search interface
3. Try searching for "Pikachu" to test functionality
4. Try uploading an image to test the upload feature

## Quick Test Commands

```bash
# Test search API
curl "http://localhost:3000/api/search?q=Pikachu"

# Test if server is responding
curl http://localhost:3000
```

## Still Having Issues?

1. **Run debug.bat** to check what's missing
2. **Check Windows version** - make sure you're on Windows 10 or 11
3. **Disable antivirus temporarily** during installation
4. **Check firewall settings** - make sure Node.js is allowed
5. **Try in a different folder** - avoid folders with spaces or special characters

## Success Indicators

✅ You should see:
- "Local: http://localhost:3000" in the console
- Pokemon Card Search interface in your browser
- Search functionality working
- No error messages in the console

If you reach this point, congratulations! Your Pokemon Card Search tool is running successfully.