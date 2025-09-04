#!/usr/bin/env python3
"""
Pokemon Card Search - Python Server
A standalone Python implementation that doesn't require Node.js
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import webbrowser
import threading
import time
import os
import sys

PORT = 3000

class PokemonCardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.serve_main_page()
        elif self.path.startswith('/api/search'):
            self.handle_search_api()
        elif self.path.startswith('/api/sets'):
            self.handle_sets_api()
        elif self.path.startswith('/api/web-search'):
            self.handle_web_search_api()
        elif self.path.startswith('/static/'):
            self.serve_static_file()
        else:
            self.send_error(404, "File not found")
    
    def do_POST(self):
        if self.path == '/api/analyze-image':
            self.handle_image_analysis()
        else:
            self.send_error(404, "Endpoint not found")
    
    def serve_main_page(self):
        """Serve the main HTML page"""
        html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pokemon Card Search</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .upload-area:hover { background-color: #f8fafc; border-color: #3b82f6; }
        .search-result { transition: all 0.3s ease; }
        .search-result:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-blue-600 mb-2">
                <i class="fas fa-search mr-2"></i>
                Pokemon Card Search
            </h1>
            <p class="text-gray-600">Search Bulbapedia for Pokemon trading cards using images or card names</p>
            <p class="text-sm text-green-600 mt-2">🐍 Running on Python Server (More Stable!)</p>
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

    <script>
        // Frontend JavaScript
        async function searchByText() {
            const query = document.getElementById('searchInput').value.trim();
            if (!query) {
                alert('Please enter a search term');
                return;
            }

            showLoading();
            hideResults();

            try {
                const response = await fetch('/api/search?q=' + encodeURIComponent(query));
                const data = await response.json();
                displayResults(data.results, `Search results for "${query}"`);
            } catch (error) {
                console.error('Search error:', error);
                showError('Failed to search. Please try again.');
            } finally {
                hideLoading();
            }
        }

        function handleImageUpload(input) {
            const file = input.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }

            showLoading();
            hideResults();

            // Simulate image analysis
            setTimeout(() => {
                displayImageAnalysis({
                    detected_text: 'Image uploaded successfully!',
                    confidence: 0.8,
                    suggestions: ['Pikachu', 'Charizard', 'Base Set']
                });
                hideLoading();
            }, 2000);
        }

        function displayResults(results, title) {
            const resultsDiv = document.getElementById('results');
            const containerDiv = document.getElementById('resultsContainer');
            
            if (!results || results.length === 0) {
                containerDiv.innerHTML = `
                    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                        <div class="flex">
                            <i class="fas fa-exclamation-triangle mr-2 mt-1"></i>
                            <div>
                                <p class="font-bold">No results found</p>
                                <p>Try different keywords or check the spelling</p>
                            </div>
                        </div>
                    </div>
                `;
                resultsDiv.classList.remove('hidden');
                return;
            }

            let html = `<p class="text-gray-600 mb-4">${title} (${results.length} results found)</p>`;
            
            results.forEach((result, index) => {
                const tcgBadge = result.isTCG ? '<span class="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full mr-2">TCG</span>' : '';
                
                html += `
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow search-result">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1">
                                <div class="mb-2">
                                    ${tcgBadge}
                                    <span class="text-xs text-gray-500">#${index + 1}</span>
                                </div>
                                <h4 class="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                    <a href="${result.url}" target="_blank" rel="noopener noreferrer">
                                        ${result.title}
                                    </a>
                                </h4>
                            </div>
                            <i class="fas fa-external-link-alt text-gray-400"></i>
                        </div>
                        
                        <div class="text-gray-700 mb-3">
                            ${result.snippet || 'No description available'}
                        </div>
                        
                        <div class="flex items-center justify-between text-sm text-gray-500">
                            <span>
                                <i class="fas fa-file-alt mr-1"></i>
                                Size: ${result.size} bytes
                            </span>
                            <a 
                                href="${result.url}" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View on Bulbapedia <i class="fas fa-arrow-right ml-1"></i>
                            </a>
                        </div>
                    </div>
                `;
            });

            containerDiv.innerHTML = html;
            resultsDiv.classList.remove('hidden');
        }

        function displayImageAnalysis(analysis) {
            const resultsDiv = document.getElementById('results');
            const containerDiv = document.getElementById('resultsContainer');
            
            let html = `
                <div class="bg-blue-50 rounded-lg p-6">
                    <h4 class="text-lg font-semibold text-blue-800 mb-4">
                        <i class="fas fa-eye mr-2"></i>
                        Image Analysis Results
                    </h4>
                    
                    <div class="space-y-3">
                        <div>
                            <span class="font-medium text-gray-700">Detected Text:</span>
                            <span class="ml-2 text-gray-600">${analysis.detected_text}</span>
                        </div>
                        
                        <div>
                            <span class="font-medium text-gray-700">Confidence:</span>
                            <span class="ml-2 text-gray-600">${(analysis.confidence * 100).toFixed(1)}%</span>
                        </div>
                        
                        <div>
                            <span class="font-medium text-gray-700">Suggestions:</span>
                            <div class="ml-2 mt-1 flex flex-wrap gap-2">
                                ${analysis.suggestions.map(suggestion => 
                                    `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200" onclick="searchSuggestion('${suggestion}')">${suggestion}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            containerDiv.innerHTML = html;
            resultsDiv.classList.remove('hidden');
        }

        async function loadTCGSets() {
            showLoading();
            
            try {
                const response = await fetch('/api/sets');
                const data = await response.json();
                displayTCGSets(data.sets);
            } catch (error) {
                console.error('Error loading TCG sets:', error);
                showError('Failed to load TCG sets');
            } finally {
                hideLoading();
            }
        }

        function displayTCGSets(sets) {
            const resultsDiv = document.getElementById('results');
            const containerDiv = document.getElementById('resultsContainer');
            
            let html = `
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-3">
                        <i class="fas fa-layer-group mr-2"></i>
                        Pokemon TCG Expansions & Sets
                    </h3>
                    <p class="text-gray-600 mb-4">
                        Browse Pokemon cards by expansion set or series.
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;
            
            sets.forEach((set) => {
                html += `
                    <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200" onclick="searchSuggestion('${set.title}')">
                        <h4 class="font-semibold text-gray-800 mb-2">${set.title}</h4>
                        <p class="text-xs text-gray-600 mb-2">${set.description}</p>
                        <div class="text-sm text-gray-600 flex items-center justify-between">
                            <span>
                                <i class="fas fa-cards-blank mr-1"></i>
                                Expansion Set
                            </span>
                            <i class="fas fa-arrow-right text-blue-600"></i>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;

            containerDiv.innerHTML = html;
            resultsDiv.classList.remove('hidden');
        }

        async function showWebSearchSuggestions() {
            const query = document.getElementById('searchInput').value.trim() || 'Pokemon cards';
            
            showLoading();
            
            try {
                const response = await fetch('/api/web-search?q=' + encodeURIComponent(query));
                const data = await response.json();
                displayWebSearchSuggestions(data.suggestions, query);
            } catch (error) {
                console.error('Web search error:', error);
                showError('Failed to get web search suggestions');
            } finally {
                hideLoading();
            }
        }

        function displayWebSearchSuggestions(suggestions, query) {
            const resultsDiv = document.getElementById('results');
            const containerDiv = document.getElementById('resultsContainer');
            
            let html = `
                <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-3">
                        <i class="fas fa-globe mr-2"></i>
                        Search "${query}" on Other Pokemon Card Sites
                    </h3>
                    <p class="text-gray-600 mb-4">
                        Expand your search beyond Bulbapedia to find more information, prices, and card details.
                    </p>
                </div>
            `;
            
            suggestions.forEach((suggestion) => {
                html += `
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-green-500">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-800 mb-2">
                                    <i class="fas fa-link mr-2 text-green-600"></i>
                                    ${suggestion.site}
                                </h4>
                                <p class="text-gray-600 mb-3">${suggestion.description}</p>
                                <a 
                                    href="${suggestion.url}" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    <i class="fas fa-search mr-2"></i>
                                    Search on ${suggestion.site}
                                </a>
                            </div>
                            <div class="text-3xl text-gray-300">
                                <i class="fas fa-external-link-alt"></i>
                            </div>
                        </div>
                    </div>
                `;
            });

            containerDiv.innerHTML = html;
            resultsDiv.classList.remove('hidden');
        }

        function searchSuggestion(suggestion) {
            document.getElementById('searchInput').value = suggestion;
            searchByText();
        }

        function showLoading() {
            document.getElementById('loading').classList.remove('hidden');
        }

        function hideLoading() {
            document.getElementById('loading').classList.add('hidden');
        }

        function showResults() {
            document.getElementById('results').classList.remove('hidden');
        }

        function hideResults() {
            document.getElementById('results').classList.add('hidden');
        }

        function showError(message) {
            const resultsDiv = document.getElementById('results');
            const containerDiv = document.getElementById('resultsContainer');
            
            containerDiv.innerHTML = `
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <div class="flex">
                        <i class="fas fa-exclamation-circle mr-2 mt-1"></i>
                        <div>
                            <p class="font-bold">Error</p>
                            <p>${message}</p>
                        </div>
                    </div>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
        }

        // Add Enter key support
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchByText();
                    }
                });
            }
        });
    </script>
</body>
</html>
        """
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(html_content.encode())
    
    def handle_search_api(self):
        """Handle search API requests"""
        try:
            # Parse query parameter
            parsed_url = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed_url.query)
            query = params.get('q', [''])[0]
            
            if not query:
                self.send_json_response({'error': 'Search query is required'}, 400)
                return
            
            # Enhanced search with TCG-specific filtering
            tcg_query = f"{query} TCG"
            search_url = f"https://bulbapedia.bulbagarden.net/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(tcg_query)}&format=json&origin=*&srlimit=20"
            
            # Make request to Bulbapedia
            with urllib.request.urlopen(search_url) as response:
                data = json.loads(response.read().decode())
            
            results = []
            if data.get('query', {}).get('search'):
                for item in data['query']['search'][:15]:
                    # Filter for likely TCG cards
                    is_tcg = any(keyword in item['title'] for keyword in ['TCG', '(Base Set)', '(Jungle)', '(Fossil)', '(Team Rocket)']) or \
                             any(keyword in item['snippet'] for keyword in ['card', 'TCG'])
                    
                    results.append({
                        'title': item['title'],
                        'snippet': item['snippet'],
                        'url': f"https://bulbapedia.bulbagarden.net/wiki/{urllib.parse.quote(item['title'].replace(' ', '_'))}",
                        'size': item['size'],
                        'isTCG': is_tcg
                    })
            
            # If no TCG results, try general search
            if not results:
                fallback_url = f"https://bulbapedia.bulbagarden.net/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&format=json&origin=*&srlimit=15"
                
                with urllib.request.urlopen(fallback_url) as response:
                    fallback_data = json.loads(response.read().decode())
                
                if fallback_data.get('query', {}).get('search'):
                    for item in fallback_data['query']['search'][:10]:
                        results.append({
                            'title': item['title'],
                            'snippet': item['snippet'],
                            'url': f"https://bulbapedia.bulbagarden.net/wiki/{urllib.parse.quote(item['title'].replace(' ', '_'))}",
                            'size': item['size'],
                            'isTCG': False
                        })
            
            self.send_json_response({'query': query, 'results': results, 'totalFound': len(results)})
            
        except Exception as e:
            print(f"Search API error: {e}")
            self.send_json_response({'error': 'Failed to search Bulbapedia'}, 500)
    
    def handle_sets_api(self):
        """Handle TCG sets API requests"""
        popular_sets = [
            {'title': 'Base Set', 'description': 'The original Pokemon TCG set (1998)'},
            {'title': 'Jungle', 'description': 'Second expansion with jungle Pokemon'},
            {'title': 'Fossil', 'description': 'Third expansion with fossil Pokemon'},
            {'title': 'Team Rocket', 'description': 'Dark Pokemon and Team Rocket cards'},
            {'title': 'Gym Heroes', 'description': 'Gym Leader Pokemon cards'},
            {'title': 'Gym Challenge', 'description': 'More Gym Leader Pokemon'},
            {'title': 'Neo Genesis', 'description': 'First set with Generation II Pokemon'},
            {'title': 'Neo Discovery', 'description': 'Second Neo series set'},
            {'title': 'Neo Destiny', 'description': 'Third Neo series set'},
            {'title': 'Expedition Base Set', 'description': 'E-Card series begins'},
            {'title': 'Aquapolis', 'description': 'E-Card series water Pokemon'},
            {'title': 'Skyridge', 'description': 'Final E-Card series set'},
            {'title': 'Ruby & Sapphire', 'description': 'Generation III Pokemon debut'},
            {'title': 'Sandstorm', 'description': 'Desert-themed Pokemon set'},
            {'title': 'Dragon', 'description': 'Dragon-type Pokemon introduction'},
            {'title': 'Team Magma vs Team Aqua', 'description': 'Hoenn villains clash'},
            {'title': 'Hidden Legends', 'description': 'Legendary Pokemon focus'},
            {'title': 'FireRed & LeafGreen', 'description': 'Kanto remakes tie-in'},
            {'title': 'Deoxys', 'description': 'Mythical Pokemon Deoxys'},
            {'title': 'Emerald', 'description': 'Emerald version tie-in'}
        ]
        
        sets = []
        for set_info in popular_sets:
            sets.append({
                'title': set_info['title'],
                'description': set_info['description'],
                'url': f"https://bulbapedia.bulbagarden.net/wiki/{urllib.parse.quote(set_info['title'] + ' (TCG)')}"
            })
        
        self.send_json_response({'sets': sets})
    
    def handle_web_search_api(self):
        """Handle web search suggestions API"""
        parsed_url = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed_url.query)
        query = params.get('q', ['Pokemon cards'])[0]
        
        search_suggestions = [
            {
                'site': 'TCGPlayer',
                'url': f'https://www.tcgplayer.com/search/pokemon?q={urllib.parse.quote(query)}',
                'description': 'Buy and sell Pokemon cards with price tracking'
            },
            {
                'site': 'Pokemon TCG Database',
                'url': 'https://pokemontcg.io/',
                'description': 'Complete Pokemon TCG card database with API'
            },
            {
                'site': 'Serebii TCG',
                'url': 'https://www.serebii.net/card/',
                'description': 'Comprehensive Pokemon card information and sets'
            },
            {
                'site': 'Pokemon Official',
                'url': 'https://www.pokemon.com/us/pokemon-tcg/',
                'description': 'Official Pokemon Trading Card Game website'
            },
            {
                'site': 'Pokellector',
                'url': f'https://www.pokellector.com/search?q={urllib.parse.quote(query)}',
                'description': 'Pokemon card collection tracker and database'
            }
        ]

        self.send_json_response({
            'query': query, 
            'suggestions': search_suggestions,
            'message': 'External search suggestions for Pokemon card resources'
        })
    
    def handle_image_analysis(self):
        """Handle image analysis API"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Simulate image analysis
            common_cards = [
                'Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Mew',
                'Lugia', 'Ho-oh', 'Rayquaza', 'Arceus', 'Dialga', 'Palkia',
                'Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Heroes',
                'Neo Genesis', 'Expedition', 'Aquapolis', 'Skyridge'
            ]
            
            import random
            random_suggestions = random.sample(common_cards, 3)
            
            response_data = {
                'detected_text': 'Image uploaded successfully. Try searching with the suggestions below or enter a card name.',
                'confidence': 0.7,
                'suggestions': random_suggestions,
                'message': 'Image analysis is ready. In production, this would use AI to identify Pokemon cards automatically.'
            }
            
            self.send_json_response(response_data)
            
        except Exception as e:
            print(f"Image analysis error: {e}")
            self.send_json_response({'error': 'Failed to analyze image'}, 500)
    
    def serve_static_file(self):
        """Serve static files"""
        # For simplicity, we'll return a 404 for static files since everything is embedded
        self.send_error(404, "Static files not implemented in Python version")
    
    def send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

def open_browser():
    """Open browser after a delay"""
    time.sleep(2)
    webbrowser.open(f'http://localhost:{PORT}')

def main():
    """Main function to start the server"""
    try:
        # Check if port is available
        with socketserver.TCPServer(("", PORT), PokemonCardHandler) as httpd:
            print("=" * 50)
            print("🐍 Pokemon Card Search - Python Server")
            print("=" * 50)
            print(f"✅ Server running at: http://localhost:{PORT}")
            print(f"✅ No Node.js required!")
            print(f"✅ More stable than the Node.js version")
            print("")
            print("🔍 Features available:")
            print("  • Search Pokemon cards by name")
            print("  • Upload card images for analysis")
            print("  • Browse TCG sets and expansions")
            print("  • Access external card databases")
            print("")
            print("Press Ctrl+C to stop the server")
            print("=" * 50)
            
            # Open browser in a separate thread
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            # Start the server
            httpd.serve_forever()
            
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use!")
            print("Try closing other applications or restart your computer.")
            print("Or edit this file to change the PORT variable to a different number.")
        else:
            print(f"❌ Server error: {e}")
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()