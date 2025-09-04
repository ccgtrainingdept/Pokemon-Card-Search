# Contributing to Pokemon Card Search

Thank you for your interest in contributing to the Pokemon Card Search project! This guide will help you get started.

## 🚀 Quick Start for Contributors

### Prerequisites
- **Node.js 16+** (for development)
- **Python 3.8+** (for testing Python version)
- **Git** for version control

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/ccgtrainingdept/Pokemon-Card-Search.git
   cd Pokemon-Card-Search
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start Development Server**
   ```bash
   npm run build
   npm run dev
   ```

4. **Test Python Version**
   ```bash
   python python_server.py
   ```

## 🛠️ Development Guidelines

### Code Style
- **TypeScript/JavaScript**: Use modern ES6+ syntax
- **Python**: Follow PEP 8 style guidelines  
- **HTML/CSS**: Use semantic HTML and Tailwind CSS classes
- **Comments**: Document complex logic and API integrations

### Project Structure
```
src/
├── index.tsx          # Main Hono application
├── routes/            # API route handlers (future)
└── types/             # TypeScript definitions (future)

public/static/
├── app.js            # Frontend JavaScript
└── style.css         # Custom CSS styles

python_server.py      # Self-contained Python server
```

## 🎯 Areas for Contribution

### High Priority
1. **AI Image Analysis Integration**
   - GPT-4 Vision API integration
   - Text extraction from card images
   - Card identification algorithms

2. **Enhanced Search Features**
   - Advanced filtering (rarity, type, HP)
   - Search suggestions and autocomplete
   - Search history and favorites

3. **Mobile Optimization**
   - Progressive Web App features
   - Touch-friendly interface improvements
   - Offline functionality

### Medium Priority
1. **External API Integrations**
   - TCGPlayer API for real-time pricing
   - Pokemon TCG API for additional data
   - Collection management features

2. **User Experience**
   - Dark mode theme
   - Accessibility improvements
   - Performance optimizations

3. **Documentation**
   - Video tutorials
   - API documentation improvements
   - Deployment guides for other platforms

### Future Features
1. **User Accounts & Collections**
   - Save favorite cards
   - Collection tracking
   - Wishlist functionality

2. **Social Features**
   - Share card findings
   - Community ratings
   - Trading suggestions

## 🔧 Technical Contributions

### API Endpoints
When adding new endpoints, follow this pattern:

```typescript
// Node.js version (src/index.tsx)
app.get('/api/new-endpoint', async (c) => {
  try {
    // Implementation here
    return c.json({ success: true, data: result })
  } catch (error) {
    return c.json({ error: 'Description' }, 500)
  }
})
```

```python
# Python version (python_server.py)
def handle_new_endpoint(self):
    try:
        # Implementation here
        self.send_json_response({'success': True, 'data': result})
    except Exception as e:
        self.send_json_response({'error': 'Description'}, 500)
```

### Frontend JavaScript
Use modern JavaScript patterns:

```javascript
// Use async/await for API calls
async function newFeature() {
    try {
        showLoading()
        const response = await fetch('/api/new-endpoint')
        const data = await response.json()
        displayResults(data)
    } catch (error) {
        showError('Feature failed')
    } finally {
        hideLoading()
    }
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Text search functionality
- [ ] Image upload and analysis  
- [ ] TCG set browsing
- [ ] External links work correctly
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Test Both Versions
- [ ] Node.js version works locally
- [ ] Python version works independently
- [ ] All API endpoints return correct data
- [ ] Error handling works properly

## 📝 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Test thoroughly on both versions
   - Update documentation if needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add feature: description of changes"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

### PR Requirements
- **Clear description** of changes made
- **Testing notes** - what was tested and how
- **Screenshots** if UI changes were made
- **Breaking changes** clearly documented
- **Updated documentation** if APIs changed

## 🐛 Bug Reports

When reporting bugs, please include:
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, browser, version)
- **Error messages** or console logs
- **Screenshots** if applicable

## 💡 Feature Requests

For new features:
- **Describe the problem** it solves
- **Explain the proposed solution**
- **Consider implementation complexity**
- **Think about user impact**

## 🌟 Recognition

Contributors will be:
- Listed in project acknowledgments
- Credited in release notes
- Given collaborator access for significant contributions

## 📞 Questions?

- **Open an Issue** for technical questions
- **Start a Discussion** for feature brainstorming
- **Check existing Issues** before creating new ones

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for helping make Pokemon Card Search better! 🎉**