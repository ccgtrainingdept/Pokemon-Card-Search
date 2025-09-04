# Pokemon Card Search Tool

## Project Overview
- **Name**: Pokemon Card Search
- **Goal**: Search and identify Pokemon trading cards using image recognition and text search
- **Features**: Bulbapedia integration, image upload analysis, TCG set browsing, external resource links

## URLs
- **Development**: https://3000-iva6xi4bkxthvqdp0s0lc-6532622b.e2b.dev
- **Production**: TBD (Ready for Cloudflare Pages deployment)

## Features Implemented

### ✅ Completed Features
1. **Text Search**: Search Bulbapedia for Pokemon cards by name
   - Enhanced TCG-specific filtering
   - Prioritizes Trading Card Game results
   - Fallback to general Pokemon content
   - Real-time search with formatted results

2. **Image Upload Interface**: Upload card images for analysis
   - Drag-and-drop file upload
   - File type and size validation (10MB limit)
   - Image preprocessing for analysis

3. **Bulbapedia Integration**: 
   - MediaWiki API integration
   - Card information extraction
   - Direct links to card pages
   - TCG set and expansion browsing

4. **External Resource Integration**:
   - Links to TCGPlayer, Pokemon Official, Serebii
   - Pokellector and Pokemon TCG Database integration
   - Price tracking and collection management links

5. **TCG Set Browser**:
   - Browse Pokemon card expansions
   - Set-specific card listings
   - Category-based navigation

### 🚧 Features Ready for Enhancement
1. **Image Analysis**: Currently provides intelligent suggestions
   - Framework ready for AI integration
   - Base64 image processing implemented
   - Placeholder for computer vision API

2. **Advanced Search Filters**:
   - Card rarity filtering
   - Type-based searches
   - Set/expansion specific searches

## API Endpoints

### Currently Functional Entry URIs:
- `GET /` - Main search interface
- `GET /api/search?q={query}` - Search Bulbapedia for cards
- `POST /api/analyze-image` - Upload and analyze card images
- `GET /api/web-search?q={query}` - Get external resource suggestions
- `GET /api/sets` - List Pokemon TCG expansions
- `GET /api/search-set/{setName}` - Search cards within specific set

### Parameters:
- **q**: Search query string
- **setName**: TCG expansion/set name
- **image_data**: Base64 encoded image data
- **image_url**: URL to card image

## Data Architecture

### Data Models:
- **Card Search Results**: Title, snippet, URL, size, TCG classification
- **TCG Sets**: Set name, card count, category links
- **Image Analysis**: Detected text, confidence scores, suggestions
- **External Resources**: Site links, descriptions, search URLs

### Storage Services:
- **Cloudflare Workers**: Edge-side API processing
- **External APIs**: Bulbapedia MediaWiki API integration
- **Static Assets**: Frontend resources via Cloudflare Pages

### Data Flow:
1. **User Input** → Frontend validation → API request
2. **API Processing** → Bulbapedia API calls → Data formatting
3. **Response Delivery** → JSON results → Frontend display
4. **External Links** → Direct integration with card databases

## User Guide

### Getting Started:
1. **Text Search**: Enter any Pokemon card name (e.g., "Pikachu", "Charizard Base Set")
2. **Image Search**: Click upload area and select a card image (PNG/JPG, max 10MB)
3. **Browse Sets**: Use "Browse Sets" to explore by expansion
4. **External Resources**: Click "Other Sites" for price tracking and additional databases

### Search Tips:
- Include set names for specific cards (e.g., "Charizard Base Set")
- Try partial names if exact matches fail
- Use image search for physical cards you own
- Browse sets to discover cards in specific expansions

### Advanced Features:
- **Quick Actions**: Fast access to popular searches
- **TCG Filtering**: Automatic prioritization of trading card results
- **Multi-Site Integration**: Easy access to pricing and collection tools

## Technical Stack

### Backend:
- **Framework**: Hono (TypeScript)
- **Runtime**: Cloudflare Workers
- **APIs**: Bulbapedia MediaWiki API
- **Build Tool**: Vite

### Frontend:
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **HTTP Client**: Axios
- **Interactive**: Vanilla JavaScript

### Development:
- **Package Manager**: npm
- **Process Manager**: PM2
- **Version Control**: Git
- **Deployment**: Cloudflare Pages

## Deployment Status
- **Platform**: Cloudflare Pages (Ready)
- **Status**: ✅ Development Active
- **Tech Stack**: Hono + TypeScript + TailwindCSS
- **Last Updated**: 2025-09-04

## Next Steps for Enhancement

### High Priority:
1. **AI Image Recognition**: Integrate with computer vision APIs
   - Text extraction from card images
   - Card identification by visual features
   - Set/rarity recognition

2. **Enhanced Card Data**: 
   - Parse card templates from Bulbapedia
   - Extract HP, attacks, rarity information
   - Display card images when available

### Medium Priority:
1. **User Collections**: Save and manage found cards
2. **Price Integration**: Real-time pricing from TCGPlayer
3. **Advanced Filters**: Rarity, type, HP range filtering
4. **Card Comparison**: Side-by-side card analysis

### Future Enhancements:
1. **Mobile App**: React Native companion
2. **Barcode Scanning**: QR/barcode card identification
3. **Collection Analytics**: Portfolio tracking and insights
4. **Social Features**: Share collections and trade recommendations

## Development Commands

```bash
# Start development server
npm run build && pm2 start ecosystem.config.cjs

# Test API endpoints
curl "http://localhost:3000/api/search?q=Pikachu"

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod
```

## Contributing
This project is designed as a comprehensive Pokemon card search tool with extensible architecture for additional features and integrations.