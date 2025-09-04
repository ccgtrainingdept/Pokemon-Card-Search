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
        const response = await axios.post('/api/analyze-image', {
            image_data: uploadedImage
        });

        const analysis = response.data;
        
        // If we get detected text, use it for search
        if (analysis.detected_text && analysis.detected_text !== 'Placeholder: Card analysis coming soon') {
            document.getElementById('searchInput').value = analysis.detected_text;
            searchByText();
        } else {
            // Show image analysis results
            displayImageAnalysis(analysis);
        }
    } catch (error) {
        console.error('Image analysis error:', error);
        showError('Failed to analyze image. Please try again.');
    } finally {
        hideLoading();
    }
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

// Export functions for global use
window.searchByText = searchByText;
window.handleImageUpload = handleImageUpload;
window.searchSuggestion = searchSuggestion;
window.searchBySet = searchBySet;
window.searchByType = searchByType;
window.showWebSearchSuggestions = showWebSearchSuggestions;
window.loadTCGSets = loadTCGSets;
window.searchInSet = searchInSet;