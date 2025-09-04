# 🎯 Pokemon Card Search - Windows Installation

## 🚀 One-Click Installation

### Step 1: Prerequisites
- **Install Node.js** from [nodejs.org](https://nodejs.org/) (version 16 or higher)
- **Download and extract** this project to your desired folder

### Step 2: Install & Run
Choose your preferred method:

#### Option A: Batch Files (Easiest)
1. **Double-click `install.bat`** - Installs everything automatically
2. **Double-click `start.bat`** - Launches the application
3. **Browser opens automatically** to http://localhost:3000

#### Option B: PowerShell (Alternative)
1. **Right-click `install.ps1`** → "Run with PowerShell"
2. **Right-click `start.ps1`** → "Run with PowerShell"
3. **Open browser** to http://localhost:3000

#### Option C: Command Line (Manual)
```bash
npm install --legacy-peer-deps
npm run build
npm run start
```

## 🎮 How to Use

Once running at http://localhost:3000, you can:

### 🔍 **Search Features**
- **Text Search**: Type Pokemon card names (e.g., "Pikachu", "Charizard Base Set")
- **Image Upload**: Drag & drop photos of your Pokemon cards
- **Set Browser**: Click "Browse Sets" to explore expansions (Base Set, Jungle, etc.)
- **External Links**: Access TCGPlayer, Serebii, and other card databases

### ⚡ **Quick Actions**
- **Browse Sets**: Explore TCG expansions by era
- **Other Sites**: Links to price tracking and databases
- **Popular Cards**: Quick search for Charizard, Base Set, etc.

## 🔧 Available Scripts

### For Daily Use:
- **`start.bat`** - Start the full application (recommended)
- **`start-dev.bat`** - Development mode with auto-reload

### For Development:
- **`install.bat`** - One-time setup and installation
- **`npm run build`** - Build the project
- **`npm run start`** - Start production server
- **`npm run start:dev`** - Start development server

## ❗ Troubleshooting

### Common Issues:

**🔴 ERESOLVE Dependency Error**
- **Fixed automatically** with included configuration
- The `.npmrc` file resolves this issue

**🔴 "Node.js not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart command prompt after installation

**🔴 "Port 3000 in use"**
- Close other applications using port 3000
- Or the app will use the next available port

**🔴 Build fails**
```bash
npm cache clean --force
rmdir /s node_modules  # Delete node_modules folder
install.bat            # Reinstall everything
```

## 🌟 Features Overview

### Core Functionality:
- **Bulbapedia Integration**: Direct search of the largest Pokemon card database
- **TCG-Specific Results**: Prioritizes actual trading cards over general Pokemon info
- **Set Navigation**: Browse cards by expansion (Base Set, Jungle, Fossil, etc.)
- **External Resources**: Links to TCGPlayer for pricing, Serebii for details

### Technical Features:
- **Fast Performance**: Edge-optimized Cloudflare Workers architecture
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Search**: Instant results as you type
- **Modern Interface**: Clean, professional design with Tailwind CSS

## 📁 Project Structure
```
pokemon-card-search/
├── install.bat          # Windows installer
├── start.bat            # Production launcher  
├── start-dev.bat        # Development launcher
├── install.ps1          # PowerShell installer
├── start.ps1            # PowerShell launcher
├── .npmrc               # NPM configuration (fixes dependency issues)
├── WINDOWS_SETUP.md     # Detailed setup guide
├── README_WINDOWS.md    # This file
├── src/                 # Application source code
├── public/              # Static assets (CSS, JS, images)
├── dist/                # Built application (created after build)
└── package.json         # Dependencies and scripts
```

## 🚀 Next Steps

After installation:
1. **Bookmark** http://localhost:3000 for easy access
2. **Test the search** with "Pikachu" or "Charizard"
3. **Try image upload** with any Pokemon card photo
4. **Explore sets** using the "Browse Sets" feature
5. **Check external resources** for pricing and collection management

## 🛠️ Development Mode

For making modifications:
1. **Run `start-dev.bat`** for auto-reload during development
2. **Edit files** in `src/` or `public/` folders
3. **See changes instantly** in your browser
4. **Build for production** with `npm run build`

## 💡 Tips & Tricks

- **Search Tips**: Include set names for specific cards (e.g., "Charizard Base Set")
- **Image Quality**: Higher resolution images work better for analysis
- **Network Access**: Server runs on `0.0.0.0`, accessible from other devices on your network
- **Multiple Sessions**: You can open multiple browser tabs/windows

## 🏆 Enjoy Your Pokemon Card Search Tool!

You now have a powerful, locally-running Pokemon card search application that integrates with Bulbapedia's comprehensive database. Perfect for collectors, traders, and Pokemon enthusiasts!