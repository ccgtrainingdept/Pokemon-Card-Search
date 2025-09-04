# Pokemon Card Search - Windows Setup Guide

## 🚀 Quick Start (Recommended)

### Prerequisites
- **Node.js** (version 16 or higher) - Download from [nodejs.org](https://nodejs.org/)

### Installation Steps

1. **Extract the Project**
   - Extract the backup file to a folder (e.g., `C:\pokemon-card-search\`)
   - Navigate to the project folder

2. **Run the Installer**
   - Double-click `install.bat`
   - Wait for installation to complete (may take 2-5 minutes)

3. **Start the Application**
   - Double-click `start.bat`
   - Your browser should automatically open to `http://localhost:3000`

## 🛠️ Manual Installation (Alternative)

If the batch files don't work, use these manual commands:

```bash
# Install dependencies (resolves the ERESOLVE error)
npm install --legacy-peer-deps

# Build the project
npm run build

# Start the server (choose one)
npm run start          # Production-like mode
npm run start:dev      # Development mode with hot reload
```

## 🌐 Access Your Application

Once started, open your browser and go to:
- **Main URL**: http://localhost:3000
- **Local Network**: http://[YOUR-IP]:3000 (accessible from other devices)

## 📁 Project Structure

```
pokemon-card-search/
├── install.bat           # Windows installer script
├── start.bat            # Start production server
├── start-dev.bat        # Start development server
├── .npmrc               # NPM configuration (fixes dependency issues)
├── package.json         # Updated with Windows-compatible scripts
├── src/                 # Source code
├── public/              # Static assets
├── dist/                # Built application (created after build)
└── WINDOWS_SETUP.md     # This file
```

## 🎯 Available Scripts

### Batch Files (Double-click to run)
- `install.bat` - Install all dependencies and build the project
- `start.bat` - Start the production server (recommended)
- `start-dev.bat` - Start development server with hot reload

### NPM Commands (Run in terminal)
- `npm run install:win` - Install dependencies with Windows compatibility
- `npm run setup:win` - Full setup (install + build)
- `npm run start` - Start production server
- `npm run start:dev` - Start development server
- `npm run build` - Build the project
- `npm run dev:win` - Development mode
- `npm run dev:wrangler` - Production-like mode

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. ERESOLVE Dependency Error
**Fixed automatically** with the included `.npmrc` file and `--legacy-peer-deps` flag.

#### 2. Node.js Not Found
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Choose the LTS (Long Term Support) version
- Restart your command prompt after installation

#### 3. Port Already in Use
If port 3000 is busy, the server will try the next available port.
Check the console output for the actual URL.

#### 4. Build Fails
```bash
# Clear cache and reinstall
npm cache clean --force
rmdir /s node_modules
npm install --legacy-peer-deps
npm run build
```

#### 5. Browser Doesn't Open Automatically
Manually open your browser and go to `http://localhost:3000`

### Performance Tips

- **Development Mode**: Use `start-dev.bat` for faster rebuilds during development
- **Production Mode**: Use `start.bat` for testing the final application
- **Network Access**: The server binds to `0.0.0.0`, so it's accessible from other devices on your network

## 🚀 Features Available

Once running, you can:
- **Search by Text**: Enter Pokemon card names (e.g., "Pikachu", "Charizard Base Set")
- **Upload Images**: Drag and drop card photos for analysis
- **Browse Sets**: Explore TCG expansions (Base Set, Jungle, Fossil, etc.)
- **External Links**: Access TCGPlayer, Serebii, and other card databases

## 📡 API Endpoints (For Developers)

The following endpoints are available while the server is running:

- `GET /api/search?q={query}` - Search Bulbapedia for cards
- `POST /api/analyze-image` - Upload and analyze card images  
- `GET /api/web-search?q={query}` - Get external resource suggestions
- `GET /api/sets` - List Pokemon TCG expansions
- `GET /api/search-set/{setName}` - Search cards within specific set

## 🔄 Development Workflow

For making changes to the application:

1. **Start Development Mode**: Run `start-dev.bat`
2. **Edit Files**: Make changes to files in `src/` or `public/`
3. **Auto Reload**: Changes will automatically appear in the browser
4. **Build for Production**: Run `npm run build` when ready to deploy

## 📞 Support

If you encounter issues:

1. **Check Node.js version**: `node --version` (should be 16+)
2. **Check NPM version**: `npm --version` 
3. **Clear cache**: `npm cache clean --force`
4. **Reinstall**: Delete `node_modules` folder and run `install.bat` again

## 🌟 Enjoy Your Pokemon Card Search Tool!

The application is now ready to help you search and identify Pokemon cards using Bulbapedia's extensive database!