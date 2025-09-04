# 🔍 Pokemon Card Search Tool

A comprehensive web application for searching and identifying Pokemon trading cards using Bulbapedia integration, image analysis, and external resource links.

## 🎯 **Live Demo**
- **GitHub Repository**: https://github.com/ccgtrainingdept/Pokemon-Card-Search
- **Features**: Text search, image upload, TCG set browsing, external database integration

## 🚀 **Quick Start (Windows)**

### **Recommended: Python Version (Most Stable)**
1. **Download**: Clone or download this repository
2. **Install Python**: Get Python 3.8+ from [python.org](https://python.org/) (check "Add to PATH")
3. **Run**: Double-click `START_HERE.bat` or `run-python.bat`
4. **Open**: Browser opens automatically to http://localhost:3000

### **Alternative: Node.js Version**
1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/)
2. **Run installer**: Double-click `install.bat`
3. **Start server**: Double-click `start.bat`
4. **Access**: Open http://localhost:3000

## 🌟 **Key Features**

### **🔍 Search Capabilities**
- **Text Search**: Search Bulbapedia for Pokemon cards by name
- **TCG-Specific Filtering**: Prioritizes Trading Card Game results
- **Image Upload**: Upload card photos for analysis (AI-ready framework)
- **Set Browsing**: Explore cards by expansion (Base Set, Jungle, Fossil, etc.)

### **🌐 External Integration**
- **Bulbapedia API**: Direct integration with MediaWiki search
- **TCGPlayer Links**: Price tracking and marketplace access
- **Multiple Databases**: Serebii, Pokemon Official, Pokellector
- **Real-time Results**: Fast API responses with formatted data

### **⚡ User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Quick Actions**: Fast access to popular searches
- **Auto-complete**: Smart suggestions and search hints
- **Modern UI**: Tailwind CSS with Font Awesome icons

## 📁 **Project Structure**

```
Pokemon-Card-Search/
├── 🐍 Python Version (Recommended)
│   ├── python_server.py      # Self-contained server (all features)
│   ├── run-python.bat        # Python launcher
│   ├── check-python.bat      # Python installation checker
│   └── PYTHON_SETUP.md       # Python setup guide
│
├── 🟢 Node.js Version (Advanced)
│   ├── src/
│   │   └── index.tsx         # Hono application entry
│   ├── public/static/
│   │   ├── app.js           # Frontend JavaScript
│   │   └── style.css        # Custom styles
│   ├── install.bat          # Node.js installer
│   ├── start.bat            # Node.js launcher
│   └── package.json         # Dependencies and scripts
│
├── 📚 Documentation
│   ├── README.md            # This file
│   ├── WINDOWS_SETUP.md     # Windows installation guide
│   ├── MANUAL_INSTALL.md    # Step-by-step troubleshooting
│   └── PYTHON_SETUP.md      # Python version guide
│
└── 🛠️ Utilities
    ├── START_HERE.bat       # Universal launcher
    ├── debug.bat           # Diagnostic tools
    └── test-install.bat    # Prerequisites checker
```

## 🔧 **Technology Stack**

### **Python Version:**
- **Backend**: Python 3.8+ (built-in modules only)
- **HTTP Server**: Python http.server (no external dependencies)
- **API Integration**: urllib for Bulbapedia MediaWiki API
- **Frontend**: Embedded HTML with Tailwind CSS

### **Node.js Version:**
- **Backend**: Hono framework (TypeScript)
- **Runtime**: Cloudflare Workers / Node.js
- **Build Tool**: Vite
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Deployment**: Cloudflare Pages ready

## 📊 **API Endpoints**

| Endpoint | Method | Description | Parameters |
|----------|---------|-------------|------------|
| `/` | GET | Main application interface | - |
| `/api/search` | GET | Search Bulbapedia for cards | `q` (query string) |
| `/api/analyze-image` | POST | Upload and analyze card images | `image_data` (base64) |
| `/api/web-search` | GET | Get external resource suggestions | `q` (query string) |
| `/api/sets` | GET | List Pokemon TCG expansions | - |
| `/api/search-set/{setName}` | GET | Search cards within specific set | `setName` (path param) |

## 🎮 **How to Use**

### **Text Search:**
1. Enter Pokemon card names (e.g., "Pikachu", "Charizard Base Set")
2. Get results with direct Bulbapedia links
3. TCG cards are prioritized in results

### **Image Analysis:**
1. Click upload area or drag & drop card images
2. AI framework analyzes uploaded images
3. Get smart suggestions for further searching

### **Set Browsing:**
1. Click "Browse Sets" for expansion navigation
2. Explore Base Set, Jungle, Fossil, and 20+ other sets
3. Click any set to search for specific cards

### **External Resources:**
1. Use "Other Sites" for price checking
2. Direct links to TCGPlayer, Serebii, Pokemon Official
3. Access collection management tools

## 🛠️ **Development**

### **Local Development:**
```bash
# Python version (recommended)
python python_server.py

# Node.js version
npm install --legacy-peer-deps
npm run build
npm run dev
```

### **Production Deployment:**
```bash
# Cloudflare Pages (Node.js version)
npm run build
wrangler pages deploy dist

# Self-hosted (Python version)
python python_server.py
# Access via http://localhost:3000
```

## 🔍 **Troubleshooting**

### **Common Windows Issues:**

**Python Version Issues:**
- **Python not found**: Install from python.org, check "Add to PATH"
- **Port in use**: Edit `python_server.py`, change `PORT = 3000` to another number

**Node.js Version Issues:**
- **ERESOLVE errors**: Use `npm install --legacy-peer-deps`
- **Build fails**: Run `npm cache clean --force` then reinstall
- **localhost not found**: Ensure build completed successfully

### **Quick Diagnostics:**
- **Run `debug.bat`**: Shows missing files/dependencies
- **Run `test-install.bat`**: Checks prerequisites
- **Check `MANUAL_INSTALL.md`**: Step-by-step troubleshooting

## 🌟 **Why Two Versions?**

### **Python Version (Recommended for Users):**
- ✅ **Zero dependencies** - uses built-in Python modules
- ✅ **No build process** - runs directly
- ✅ **More stable** - fewer failure points
- ✅ **Easier setup** - minimal configuration
- ✅ **Same features** - 100% functionality preserved

### **Node.js Version (For Developers/Deployment):**
- ⚡ **Cloudflare ready** - optimized for edge deployment
- 🔧 **Hot reload** - development server with auto-refresh  
- 📦 **Production builds** - optimized bundles
- 🚀 **Scalable** - serverless architecture
- 🛠️ **Extensible** - easier to add advanced features

## 📈 **Future Enhancements**

### **AI Integration:**
- **GPT-4 Vision**: Automatic card identification from images
- **Text extraction**: OCR for card names and details
- **Set recognition**: Automatic expansion identification

### **Enhanced Features:**
- **User collections**: Save and manage found cards
- **Price tracking**: Real-time TCGPlayer integration
- **Advanced filters**: Rarity, type, HP range filtering
- **Card comparison**: Side-by-side analysis

### **Mobile & Desktop:**
- **Progressive Web App**: Offline functionality
- **Mobile optimization**: Touch-friendly interface
- **Desktop app**: Electron wrapper
- **Browser extension**: Quick card lookup

## 📄 **License**

MIT License - Feel free to use, modify, and distribute.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 **Acknowledgments**

- **Bulbapedia**: Pokemon card database and MediaWiki API
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Hono**: Lightweight web framework
- **Cloudflare**: Edge computing platform

---

**⭐ Star this repository if you find it useful!**

**🐛 Report issues or request features in the [Issues](https://github.com/ccgtrainingdept/Pokemon-Card-Search/issues) section.**