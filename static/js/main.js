document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const urlForm = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const errorMessage = document.getElementById('error-message');
    const embedContainer = document.getElementById('embed-container');
    const embedContent = document.getElementById('embed-content');
    const embedUrl = document.getElementById('embed-url');
    const emptyState = document.getElementById('empty-state');
    const copyButton = document.getElementById('copy-embed-code');

    // Handle form submission
    urlForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the URL value
        const url = urlInput.value.trim();
        
        // Validate URL
        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        // Clear any previous errors
        clearError();
        
        // Create the embed element
        try {
            createEmbed(url);
            
            // Hide empty state and show embed container
            emptyState.classList.add('d-none');
            embedContainer.classList.remove('d-none');
            
            // Set the displayed URL
            embedUrl.textContent = url;
        } catch (error) {
            showError('Failed to embed the content. Please try another URL.');
            console.error('Embed error:', error);
        }
    });
    
    // Copy embed code button
    copyButton.addEventListener('click', function() {
        const url = urlInput.value.trim();
        if (!url) return;
        
        // Simplified embed tag format as requested
        const embedCode = `<embed src="${url}">`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(embedCode)
            .then(() => {
                // Change button text temporarily
                const originalHTML = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    copyButton.innerHTML = originalHTML;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy embed code');
            });
    });
    
    // Function to validate URL
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        urlInput.classList.add('is-invalid');
        errorMessage.style.display = 'block';
    }
    
    // Function to clear error message
    function clearError() {
        errorMessage.textContent = '';
        urlInput.classList.remove('is-invalid');
        errorMessage.style.display = 'none';
    }
    
    // Function to create embed element
    function createEmbed(url) {
        // Open a new about:blank tab and fullscreen the embed
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
            // Add custom styling to the new tab
            newTab.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Embeddddr - Fullscreen View</title>
                    <style>
                        body, html { 
                            margin: 0; 
                            padding: 0; 
                            height: 100%; 
                            overflow: hidden; 
                            background: #121212;
                        }
                        .embed-container {
                            width: 100%;
                            height: 100vh;
                        }
                        embed {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="embed-container">
                        <embed src="${url}">
                    </div>
                </body>
                </html>
            `);
            newTab.document.close();
            
            // Try to request fullscreen after a slight delay to ensure the DOM is ready
            setTimeout(() => {
                try {
                    const embedElement = newTab.document.querySelector('embed');
                    if (embedElement && embedElement.requestFullscreen) {
                        embedElement.requestFullscreen();
                    }
                } catch (err) {
                    console.log('Fullscreen request failed:', err);
                }
            }, 500);
        }
        
        // Also update the original page embed content for preview
        embedContent.innerHTML = `<embed src="${url}">`;
        
        // Show a notice about plugin status
        const notice = document.createElement('div');
        notice.className = 'plugin-notice mt-2';
        notice.innerHTML = 'Content is also opened in a new tab. If you see "plugin not found" here, check the new tab.';
        notice.style.color = '#ff073a';
        notice.style.fontSize = '0.8rem';
        notice.style.textAlign = 'center';
        
        // Add the notice after the embed container
        const noticeContainer = document.querySelector('#embed-container');
        if (noticeContainer && !document.querySelector('.plugin-notice')) {
            noticeContainer.appendChild(notice);
        }
    }
    
    // Add input event listener to clear errors when typing
    urlInput.addEventListener('input', function() {
        if (urlInput.classList.contains('is-invalid')) {
            clearError();
        }
    });
    
    // Add example URL functionality (optional helper)
    document.querySelectorAll('.example-url').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const exampleUrl = this.getAttribute('data-url');
            urlInput.value = exampleUrl;
            urlForm.dispatchEvent(new Event('submit'));
        });
    });
});
