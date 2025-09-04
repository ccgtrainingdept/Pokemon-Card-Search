import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes
app.get('/api/search', async (c) => {
  const query = c.req.query('q')
  if (!query) {
    return c.json({ error: 'Search query is required' }, 400)
  }

  try {
    // Enhanced search with TCG-specific filtering
    const tcgQuery = `${query} TCG`
    const searchUrl = `https://bulbapedia.bulbagarden.net/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(tcgQuery)}&format=json&origin=*&srlimit=20`
    const response = await fetch(searchUrl)
    const data = await response.json()

    // Get detailed information for each result
    const results = []
    if (data.query?.search) {
      for (const item of data.query.search.slice(0, 15)) {
        // Filter for likely TCG cards
        if (item.title.includes('TCG') || 
            item.title.includes('(Base Set)') ||
            item.title.includes('(Jungle)') ||
            item.title.includes('(Fossil)') ||
            item.title.includes('(Team Rocket)') ||
            item.snippet.includes('card') ||
            item.snippet.includes('TCG')) {
          
          results.push({
            title: item.title,
            snippet: item.snippet,
            url: `https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
            size: item.size,
            isTCG: true
          })
        }
      }
    }

    // If no TCG results, fall back to general search
    if (results.length === 0) {
      const fallbackUrl = `https://bulbapedia.bulbagarden.net/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=15`
      const fallbackResponse = await fetch(fallbackUrl)
      const fallbackData = await fallbackResponse.json()
      
      if (fallbackData.query?.search) {
        for (const item of fallbackData.query.search.slice(0, 10)) {
          results.push({
            title: item.title,
            snippet: item.snippet,
            url: `https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
            size: item.size,
            isTCG: false
          })
        }
      }
    }

    return c.json({ query, results, totalFound: results.length })
  } catch (error) {
    console.error('Search error:', error)
    return c.json({ error: 'Failed to search Bulbapedia' }, 500)
  }
})

// Get TCG sets/expansions
app.get('/api/sets', async (c) => {
  try {
    // Popular Pokemon TCG sets for browsing
    const popularSets = [
      { title: 'Base Set', description: 'The original Pokemon TCG set (1998)' },
      { title: 'Jungle', description: 'Second expansion with jungle Pokemon' },
      { title: 'Fossil', description: 'Third expansion with fossil Pokemon' },
      { title: 'Team Rocket', description: 'Dark Pokemon and Team Rocket cards' },
      { title: 'Gym Heroes', description: 'Gym Leader Pokemon cards' },
      { title: 'Gym Challenge', description: 'More Gym Leader Pokemon' },
      { title: 'Neo Genesis', description: 'First set with Generation II Pokemon' },
      { title: 'Neo Discovery', description: 'Second Neo series set' },
      { title: 'Neo Destiny', description: 'Third Neo series set' },
      { title: 'Expedition Base Set', description: 'E-Card series begins' },
      { title: 'Aquapolis', description: 'E-Card series water Pokemon' },
      { title: 'Skyridge', description: 'Final E-Card series set' },
      { title: 'Ruby & Sapphire', description: 'Generation III Pokemon debut' },
      { title: 'Sandstorm', description: 'Desert-themed Pokemon set' },
      { title: 'Dragon', description: 'Dragon-type Pokemon introduction' },
      { title: 'Team Magma vs Team Aqua', description: 'Hoenn villains clash' },
      { title: 'Hidden Legends', description: 'Legendary Pokemon focus' },
      { title: 'FireRed & LeafGreen', description: 'Kanto remakes tie-in' },
      { title: 'Deoxys', description: 'Mythical Pokemon Deoxys' },
      { title: 'Emerald', description: 'Emerald version tie-in' }
    ]
    
    const sets = popularSets.map(set => ({
      title: set.title,
      description: set.description,
      url: `https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(set.title + ' (TCG)')}`
    }))
    
    return c.json({ sets })
  } catch (error) {
    return c.json({ error: 'Failed to fetch TCG sets' }, 500)
  }
})

// Search within specific TCG set
app.get('/api/search-set/:setName', async (c) => {
  const setName = c.req.param('setName')
  
  try {
    const categoryName = `Category:${setName} cards`
    const setUrl = `https://bulbapedia.bulbagarden.net/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(categoryName)}&format=json&origin=*&cmlimit=100`
    const response = await fetch(setUrl)
    const data = await response.json()
    
    const cards = []
    if (data.query?.categorymembers) {
      for (const card of data.query.categorymembers) {
        cards.push({
          title: card.title,
          url: `https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(card.title.replace(/ /g, '_'))}`,
          id: card.pageid,
          set: setName
        })
      }
    }
    
    return c.json({ setName, cards })
  } catch (error) {
    return c.json({ error: 'Failed to search set' }, 500)
  }
})

app.post('/api/analyze-image', async (c) => {
  try {
    const body = await c.req.json()
    const { image_url, image_data } = body

    if (!image_url && !image_data) {
      return c.json({ error: 'Image URL or image data is required' }, 400)
    }

    // For now, since we can't directly integrate external AI services in the sandbox,
    // we'll extract any text from the request or provide smart suggestions
    // In a real deployment, this would integrate with AI image analysis services
    
    // Parse the image data URL if provided
    let detectedInfo = { text: '', confidence: 0.5, suggestions: [] }
    
    // Provide common Pokemon card search suggestions
    const commonCards = [
      'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew',
      'Lugia', 'Ho-oh', 'Rayquaza', 'Arceus', 'Dialga', 'Palkia',
      'Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Heroes',
      'Neo Genesis', 'Expedition', 'Aquapolis', 'Skyridge'
    ]
    
    // Random suggestions for demonstration
    const randomSuggestions = []
    for (let i = 0; i < 3; i++) {
      const randomCard = commonCards[Math.floor(Math.random() * commonCards.length)]
      if (!randomSuggestions.includes(randomCard)) {
        randomSuggestions.push(randomCard)
      }
    }
    
    return c.json({ 
      detected_text: 'Image uploaded successfully. Try searching with the suggestions below or enter a card name.',
      confidence: 0.7,
      suggestions: randomSuggestions,
      message: 'Image analysis is ready. In production, this would use AI to identify Pokemon cards automatically.'
    })
  } catch (error) {
    return c.json({ error: 'Failed to analyze image' }, 500)
  }
})

// Web search for additional resources
app.get('/api/web-search', async (c) => {
  const query = c.req.query('q')
  if (!query) {
    return c.json({ error: 'Search query is required' }, 400)
  }

  try {
    // This would integrate with web search APIs in production
    // For now, return structured search suggestions for popular Pokemon card sites
    const searchSuggestions = [
      {
        site: 'TCGPlayer',
        url: `https://www.tcgplayer.com/search/pokemon?q=${encodeURIComponent(query)}`,
        description: 'Buy and sell Pokemon cards with price tracking'
      },
      {
        site: 'Pokemon TCG Database',
        url: `https://pokemontcg.io/`,
        description: 'Complete Pokemon TCG card database with API'
      },
      {
        site: 'Serebii TCG',
        url: `https://www.serebii.net/card/`,
        description: 'Comprehensive Pokemon card information and sets'
      },
      {
        site: 'Pokemon Official',
        url: `https://www.pokemon.com/us/pokemon-tcg/`,
        description: 'Official Pokemon Trading Card Game website'
      },
      {
        site: 'Pokellector',
        url: `https://www.pokellector.com/search?q=${encodeURIComponent(query)}`,
        description: 'Pokemon card collection tracker and database'
      }
    ]

    return c.json({ 
      query, 
      suggestions: searchSuggestions,
      message: 'External search suggestions for Pokemon card resources'
    })
  } catch (error) {
    return c.json({ error: 'Failed to get web search suggestions' }, 500)
  }
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pokemon Card Search</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <header class="text-center mb-8">
                <h1 class="text-4xl font-bold text-blue-600 mb-2">
                    <i class="fas fa-search mr-2"></i>
                    Pokemon Card Search
                </h1>
                <p class="text-gray-600">Search Bulbapedia for Pokemon trading cards using images or card names</p>
            </header>

            <div class="max-w-6xl mx-auto">
                <!-- Search Methods -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Text Search -->
                        <div>
                            <h2 class="text-xl font-semibold mb-4">
                                <i class="fas fa-keyboard mr-2"></i>
                                Search by Name
                            </h2>
                            <div class="flex gap-2">
                                <input 
                                    type="text" 
                                    id="searchInput" 
                                    placeholder="Enter card name (e.g., Pikachu, Charizard)" 
                                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                <button 
                                    onclick="searchByText()" 
                                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <i class="fas fa-search mr-1"></i>
                                    Search
                                </button>
                            </div>
                        </div>

                        <!-- Image Upload -->
                        <div>
                            <h2 class="text-xl font-semibold mb-4">
                                <i class="fas fa-image mr-2"></i>
                                Search by Image
                            </h2>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors upload-area">
                                <input 
                                    type="file" 
                                    id="imageInput" 
                                    accept="image/*" 
                                    class="hidden" 
                                    onchange="handleImageUpload(this)"
                                >
                                <label for="imageInput" class="cursor-pointer">
                                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                    <p class="text-gray-600">Click to upload card image</p>
                                    <p class="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Action Buttons -->
                    <div class="border-t pt-4">
                        <h3 class="text-lg font-semibold mb-3 text-gray-800">
                            <i class="fas fa-bolt mr-2"></i>
                            Quick Actions
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="loadTCGSets()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                <i class="fas fa-layer-group mr-1"></i>
                                Browse Sets
                            </button>
                            <button onclick="showWebSearchSuggestions()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                <i class="fas fa-globe mr-1"></i>
                                Other Sites
                            </button>
                            <button onclick="searchSuggestion('Base Set')" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                                <i class="fas fa-star mr-1"></i>
                                Base Set
                            </button>
                            <button onclick="searchSuggestion('Charizard')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                                <i class="fas fa-fire mr-1"></i>
                                Popular Cards
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Results Section -->
                <div id="results" class="hidden">
                    <h3 class="text-2xl font-semibold mb-4">
                        <i class="fas fa-list mr-2"></i>
                        Search Results
                    </h3>
                    <div id="resultsContainer" class="space-y-4">
                        <!-- Results will be populated here -->
                    </div>
                </div>

                <!-- Loading Indicator -->
                <div id="loading" class="hidden text-center py-8">
                    <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                    <p class="mt-2 text-gray-600">Searching...</p>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
