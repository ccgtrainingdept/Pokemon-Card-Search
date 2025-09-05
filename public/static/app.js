// Pokemon Card Search Frontend JavaScript

let currentSearchType = 'text';
let uploadedImage = null;

// Search by text function
async function searchByText() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    showLoading();
    hideResults();

    try {
        const response = await axios.get('/api/search', {
            params: { q: query }
        });

        displayResults(response.data.results, `Text search results for "${query}"`);
    } catch (error) {
        console.error('Search error:', error);
        showError('Failed to search. Please try again.');
    } finally {
        hideLoading();
    }
}

// Handle image upload
function handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImage = e.target.result;
        analyzeImage();
    };
    reader.readAsDataURL(file);
}

// Analyze uploaded image
async function analyzeImage() {
    if (!uploadedImage) return;

    showLoading();
    hideResults();

    try {
        // First get the image analysis with Google search URLs
        const analysisResponse = await axios.post('/api/analyze-image', {
            image_data: uploadedImage
        });

        // Then get Google Image Search options
        const googleSearchResponse = await axios.post('/api/google-image-search', {
            image_data: uploadedImage,
            search_query: 'pokemon card tcg'
        });

        const analysis = analysisResponse.data;
        const googleSearch = googleSearchResponse.data;
        
        // Combine the results
        const combinedResults = {
            ...analysis,
            google_search: googleSearch
        };
        
        // Show enhanced image analysis with Google Image Search
        displayImageAnalysisWithGoogle(combinedResults);
        
    } catch (error) {
        console.error('Image analysis error:', error);
        showError('Failed to analyze image. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display image analysis with Google Image Search integration
function displayImageAnalysisWithGoogle(analysis) {
    const resultsDiv = document.getElementById('results');
    const containerDiv = document.getElementById('resultsContainer');
    
    let html = `
        <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
            <h4 class="text-xl font-semibold text-blue-800 mb-4">
                <i class="fas fa-camera mr-2"></i>
                Image Analysis & Google Search
            </h4>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Local Analysis -->
                <div class="bg-white rounded-lg p-4">
                    <h5 class="font-semibold text-gray-800 mb-3">
                        <i class="fas fa-search mr-2"></i>
                        Quick Suggestions
                    </h5>
                    <div class="space-y-2">
                        <div>
                            <span class="text-sm font-medium text-gray-600">Status:</span>
                            <span class="ml-2 text-green-600">${analysis.detected_text}</span>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-600">Try searching:</span>
                            <div class="mt-2 flex flex-wrap gap-2">
                                ${analysis.suggestions.map(suggestion => 
                                    `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200" onclick="searchSuggestion('${suggestion}')">${suggestion}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Google Image Search -->
                <div class="bg-white rounded-lg p-4">
                    <h5 class="font-semibold text-gray-800 mb-3">
                        <i class="fab fa-google mr-2"></i>
                        Google Image Search
                    </h5>
                    <div class="space-y-2">
                        <a href="${analysis.google_search.search_urls.google_lens}" target="_blank" 
                           class="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center">
                            <i class="fas fa-camera-retro mr-2"></i>
                            Search with Google Lens
                        </a>
                        <a href="${analysis.google_search.search_urls.contextual_search}" target="_blank"
                           class="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center">
                            <i class="fas fa-images mr-2"></i>
                            Pokemon Card Images
                        </a>
                        <a href="${analysis.google_search.search_urls.tcg_search}" target="_blank"
                           class="block w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-center">
                            <i class="fas fa-search mr-2"></i>
                            TCG Card Search
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Tips -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <h5 class="font-semibold text-yellow-800 mb-2">
                <i class="fas fa-lightbulb mr-2"></i>
                Search Tips for Better Results
            </h5>
            <ul class="text-sm text-yellow-700 space-y-1">
                ${analysis.google_search.search_tips.map(tip => `<li>• ${tip}</li>`).join('')}
            </ul>
        </div>

        <!-- Manual Upload Option -->
        <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">
                <i class="fas fa-upload mr-2"></i>
                Manual Upload to Google Images
            </h5>
            <p class="text-sm text-gray-600 mb-3">
                For the most accurate results, you can manually upload your image to Google Images:
            </p>
            <div class="space-y-2">
                <a href="https://images.google.com/" target="_blank"
                   class="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                    <i class="fab fa-google mr-2"></i>
                    Open Google Images
                </a>
                <p class="text-xs text-gray-500">
                    Click the camera icon in Google Images search box, then upload your card image
                </p>
            </div>
        </div>
    `;

    containerDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
}

// Display search results
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
                        <button onclick="showWebSearchSuggestions()" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                            Search Other Resources
                        </button>
                    </div>
                </div>
            </div>
        `;
        resultsDiv.classList.remove('hidden');
        return;
    }

    let html = `
        <div class="flex justify-between items-center mb-4">
            <p class="text-gray-600">${title} (${results.length} results found)</p>
            <button onclick="showWebSearchSuggestions()" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                <i class="fas fa-globe mr-1"></i>
                Search Other Sites
            </button>
        </div>
    `;
    
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
                    <div class="flex gap-2">
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
            </div>
        `;
    });

    containerDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
}

// Display image analysis results
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
            
            <p class="text-sm text-gray-500 mt-4">
                <i class="fas fa-info-circle mr-1"></i>
                Click on suggestions to search for related cards
            </p>
        </div>
    `;

    containerDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
}

// Search by suggestion
function searchSuggestion(suggestion) {
    document.getElementById('searchInput').value = suggestion;
    searchByText();
}

// Show loading indicator
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Show results section
function showResults() {
    document.getElementById('results').classList.remove('hidden');
}

// Hide results section
function hideResults() {
    document.getElementById('results').classList.add('hidden');
}

// Show error message
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

// Add Enter key support for search input
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

// Advanced search functions
function searchBySet(setName) {
    document.getElementById('searchInput').value = `"${setName}" cards`;
    searchByText();
}

function searchByType(pokemonType) {
    document.getElementById('searchInput').value = `${pokemonType} pokemon cards`;
    searchByText();
}

// Show web search suggestions
async function showWebSearchSuggestions() {
    const query = document.getElementById('searchInput').value.trim() || 'Pokemon cards';
    
    showLoading();
    
    try {
        const response = await axios.get('/api/web-search', {
            params: { q: query }
        });

        displayWebSearchSuggestions(response.data.suggestions, query);
    } catch (error) {
        console.error('Web search error:', error);
        showError('Failed to get web search suggestions');
    } finally {
        hideLoading();
    }
}

// Display web search suggestions
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
    
    suggestions.forEach((suggestion, index) => {
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
    
    // Add back to Bulbapedia search button
    html += `
        <div class="bg-blue-50 p-4 rounded-lg mt-6 text-center">
            <button onclick="searchByText()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Bulbapedia Search
            </button>
        </div>
    `;

    containerDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
}

// Load TCG sets for browsing
async function loadTCGSets() {
    showLoading();
    
    try {
        const response = await axios.get('/api/sets');
        displayTCGSets(response.data.sets);
    } catch (error) {
        console.error('Error loading TCG sets:', error);
        showError('Failed to load TCG sets');
    } finally {
        hideLoading();
    }
}

// Display TCG sets
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
    
    sets.forEach((set, index) => {
        html += `
            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200" onclick="searchInSet('${set.title}')">
                <h4 class="font-semibold text-gray-800 mb-2">${set.title}</h4>
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

// Search within a specific set
async function searchInSet(setName) {
    showLoading();
    
    try {
        const response = await axios.get(`/api/search-set/${encodeURIComponent(setName)}`);
        displaySetCards(response.data.cards, setName);
    } catch (error) {
        console.error('Error searching set:', error);
        showError('Failed to search in set');
    } finally {
        hideLoading();
    }
}

// Display cards from a specific set
function displaySetCards(cards, setName) {
    const resultsDiv = document.getElementById('results');
    const containerDiv = document.getElementById('resultsContainer');
    
    let html = `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">
                <i class="fas fa-layer-group mr-2"></i>
                Cards from "${setName}"
            </h3>
            <p class="text-gray-600 mb-4">
                ${cards.length} cards found in this expansion set.
            </p>
            <button onclick="loadTCGSets()" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm">
                <i class="fas fa-arrow-left mr-1"></i>
                Back to Sets
            </button>
        </div>
    `;
    
    if (cards.length === 0) {
        html += `
            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                <p>No cards found in this set category.</p>
            </div>
        `;
    } else {
        cards.forEach((card, index) => {
            html += `
                <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="font-semibold text-blue-600 hover:text-blue-800">
                                <a href="${card.url}" target="_blank" rel="noopener noreferrer">
                                    ${card.title}
                                </a>
                            </h4>
                            <p class="text-sm text-gray-600">${setName}</p>
                        </div>
                        <i class="fas fa-external-link-alt text-gray-400"></i>
                    </div>
                </div>
            `;
        });
    }

    containerDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
}

// Open Google Image Search for Pokemon cards
async function openGoogleImageSearch() {
    showLoading();
    
    try {
        const response = await axios.post('/api/google-image-search', {
            search_query: 'pokemon card tcg'
        });

        displayGoogleImageSearchOptions(response.data);
    } catch (error) {
        console.error('Google Image Search error:', error);
        showError('Failed to load Google Image Search options');
    } finally {
        hideLoading();
    }
}

// Display Google Image Search options
function displayGoogleImageSearchOptions(data) {
    const resultsDiv = document.getElementById('results');
    const containerDiv = document.getElementById('resultsContainer');
    
    let html = `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">
                <i class="fab fa-google mr-2 text-blue-600"></i>
                Google Image Search for Pokemon Cards
            </h3>
            <p class="text-gray-600 mb-4">
                Use Google's powerful image search to find Pokemon cards by uploading images or searching visually.
            </p>
        </div>

        <!-- Google Search Options -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Visual Search -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-camera-retro mr-2 text-blue-600"></i>
                    Visual Search Tools
                </h4>
                <div class="space-y-3">
                    <a href="${data.search_urls.google_lens}" target="_blank"
                       class="block w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center font-medium">
                        <i class="fas fa-search mr-2"></i>
                        Google Lens
                        <div class="text-sm opacity-90 mt-1">Best for visual card identification</div>
                    </a>
                    <a href="${data.search_urls.search_by_image}" target="_blank"
                       class="block w-full px-4 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center font-medium">
                        <i class="fas fa-image mr-2"></i>
                        Search by Image
                        <div class="text-sm opacity-90 mt-1">Traditional reverse image search</div>
                    </a>
                </div>
            </div>

            <!-- Text-based Pokemon Searches -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-images mr-2 text-green-600"></i>
                    Pokemon Card Searches
                </h4>
                <div class="space-y-3">
                    <a href="${data.search_urls.pokemon_card_search}" target="_blank"
                       class="block w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center font-medium">
                        <i class="fas fa-search mr-2"></i>
                        Pokemon Cards
                        <div class="text-sm opacity-90 mt-1">General Pokemon card images</div>
                    </a>
                    <a href="${data.search_urls.tcg_search}" target="_blank"
                       class="block w-full px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-center font-medium">
                        <i class="fas fa-layer-group mr-2"></i>
                        TCG Cards
                        <div class="text-sm opacity-90 mt-1">Trading Card Game specific</div>
                    </a>
                    <a href="${data.search_urls.contextual_search}" target="_blank"
                       class="block w-full px-4 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-center font-medium">
                        <i class="fas fa-star mr-2"></i>
                        Contextual Search  
                        <div class="text-sm opacity-90 mt-1">Pokemon TCG with context</div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Search Tips -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
            <h4 class="text-lg font-semibold text-yellow-800 mb-3">
                <i class="fas fa-lightbulb mr-2"></i>
                Tips for Better Google Image Search Results
            </h4>
            <div class="grid md:grid-cols-2 gap-4">
                <ul class="text-sm text-yellow-700 space-y-2">
                    ${data.search_tips.slice(0, Math.ceil(data.search_tips.length/2)).map(tip => `<li class="flex items-start"><i class="fas fa-check-circle mr-2 mt-0.5 text-yellow-600"></i>${tip}</li>`).join('')}
                </ul>
                <ul class="text-sm text-yellow-700 space-y-2">
                    ${data.search_tips.slice(Math.ceil(data.search_tips.length/2)).map(tip => `<li class="flex items-start"><i class="fas fa-check-circle mr-2 mt-0.5 text-yellow-600"></i>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>

        <!-- Popular Search Terms -->
        <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="fas fa-tags mr-2"></i>
                Popular Pokemon Card Search Terms
            </h4>
            <div class="flex flex-wrap gap-2">
                ${data.pokemon_search_terms.map(term => `
                    <span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-300 transition-colors"
                          onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(term)}&tbm=isch', '_blank')">
                        ${term}
                    </span>
                `).join('')}
            </div>
        </div>

        <!-- How to Use Section -->
        <div class="bg-blue-50 rounded-lg p-6 mt-6">
            <h4 class="text-lg font-semibold text-blue-800 mb-3">
                <i class="fas fa-question-circle mr-2"></i>
                How to Use Google Image Search for Pokemon Cards
            </h4>
            <div class="grid md:grid-cols-3 gap-4 text-sm">
                <div class="text-center">
                    <div class="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-camera text-blue-600"></i>
                    </div>
                    <h5 class="font-medium text-blue-800">1. Take/Upload Photo</h5>
                    <p class="text-blue-600">Take a clear photo of your Pokemon card or use an existing image</p>
                </div>
                <div class="text-center">
                    <div class="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-search text-blue-600"></i>
                    </div>
                    <h5 class="font-medium text-blue-800">2. Use Google Tools</h5>
                    <p class="text-blue-600">Click Google Lens or Search by Image to find similar cards</p>
                </div>
                <div class="text-center">
                    <div class="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-list text-blue-600"></i>
                    </div>
                    <h5 class="font-medium text-blue-800">3. Browse Results</h5>
                    <p class="text-blue-600">Explore similar cards, prices, and information from various sources</p>
                </div>
            </div>
        </div>
    `;

    containerDiv.innerHTML = html;
    resultsDiv.classList.remove('hidden');
}

// Export functions for global use
window.searchByText = searchByText;
window.handleImageUpload = handleImageUpload;
window.searchSuggestion = searchSuggestion;
window.searchBySet = searchBySet;
window.searchByType = searchByType;
window.showWebSearchSuggestions = showWebSearchSuggestions;
window.loadTCGSets = loadTCGSets;
window.searchInSet = searchInSet;
window.openGoogleImageSearch = openGoogleImageSearch;