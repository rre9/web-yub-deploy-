// Article Highlight Script for English Version
// This script highlights search terms in article pages when navigating from search results

document.addEventListener('DOMContentLoaded', function() {
    // Extract query parameter 'q' from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        console.log('Search query found:', query);
        highlightSearchTerms(query);
    }
});

function highlightSearchTerms(query) {
    // Split query into individual terms
    const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
    
    if (searchTerms.length === 0) return;
    
    // Find the first occurrence of any search term
    let firstMatch = null;
    let firstMatchElement = null;
    
    searchTerms.forEach(term => {
        const match = findFirstMatch(term);
        if (match && (!firstMatch || match.index < firstMatch.index)) {
            firstMatch = match;
            firstMatchElement = match.element;
        }
    });
    
    if (firstMatch && firstMatchElement) {
        // Highlight all search terms
        searchTerms.forEach((term, index) => {
            highlightText(document.body, term, `highlight-${(index % 5) + 1}`);
        });
        
        // Scroll to the first match
        scrollToElement(firstMatchElement);
        
        // Remove highlights after 2 seconds
        setTimeout(() => {
            removeHighlights();
        }, 2000);
    }
}

function findFirstMatch(searchTerm) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    let earliestMatch = null;
    
    while (node = walker.nextNode()) {
        const text = node.textContent.toLowerCase();
        const term = searchTerm.toLowerCase();
        const index = text.indexOf(term);
        
        if (index !== -1) {
            const absoluteIndex = getAbsoluteTextIndex(node) + index;
            
            if (!earliestMatch || absoluteIndex < earliestMatch.index) {
                earliestMatch = {
                    index: absoluteIndex,
                    element: node.parentElement,
                    node: node,
                    textIndex: index
                };
            }
        }
    }
    
    return earliestMatch;
}

function getAbsoluteTextIndex(targetNode) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    let index = 0;
    
    while (node = walker.nextNode()) {
        if (node === targetNode) {
            return index;
        }
        index += node.textContent.length;
    }
    
    return 0;
}

function highlightText(element, searchTerm, highlightClass) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const lowerText = text.toLowerCase();
        const lowerTerm = searchTerm.toLowerCase();
        
        if (lowerText.includes(lowerTerm)) {
            const parent = textNode.parentNode;
            const fragment = document.createDocumentFragment();
            
            let lastIndex = 0;
            let index = 0;
            
            while ((index = lowerText.indexOf(lowerTerm, lastIndex)) !== -1) {
                // Add text before the match
                if (index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                }
                
                // Add highlighted match
                const span = document.createElement('span');
                span.className = `search-highlight ${highlightClass}`;
                span.textContent = text.substring(index, index + searchTerm.length);
                fragment.appendChild(span);
                
                lastIndex = index + searchTerm.length;
            }
            
            // Add remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }
            
            parent.replaceChild(fragment, textNode);
        }
    });
}

function scrollToElement(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
        
        // Add a temporary visual indicator
        element.style.transition = 'background-color 0.3s ease';
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
        
        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
        }, 1000);
    }
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

// Add CSS for highlight styles
const style = document.createElement('style');
style.textContent = `
    .search-highlight {
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .search-highlight.highlight-1 {
        background-color: #ffeb3b;
        color: #333;
    }
    
    .search-highlight.highlight-2 {
        background-color: #ff9800;
        color: white;
    }
    
    .search-highlight.highlight-3 {
        background-color: #e91e63;
        color: white;
    }
    
    .search-highlight.highlight-4 {
        background-color: #9c27b0;
        color: white;
    }
    
    .search-highlight.highlight-5 {
        background-color: #3f51b5;
        color: white;
    }
`;
document.head.appendChild(style);
