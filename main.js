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
        
        // Get the proxied URL for the embed code
        const proxiedUrl = createProxiedUrl(url);
        
        // Create embed code with the proxied URL
        const embedCode = `<iframe src="${proxiedUrl}" width="100%" height="500px" frameborder="0" allowfullscreen></iframe>`;
        
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
        // Create proxied URL
        const proxiedUrl = createProxiedUrl(url);
        
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
                        embed, iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                        .proxy-info {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            background: rgba(0,0,0,0.7);
                            color: #ff073a;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-family: sans-serif;
                            font-size: 12px;
                            z-index: 9999;
                        }
                    </style>
                </head>
                <body>
                    <div class="embed-container">
                        <iframe src="${proxiedUrl}" allowfullscreen="true"></iframe>
                        <div class="proxy-info">Proxied through embeddddr</div>
                    </div>
                </body>
                </html>
            `);
            newTab.document.close();
            
            // Try to request fullscreen after a slight delay to ensure the DOM is ready
            setTimeout(() => {
                try {
                    const embedElement = newTab.document.querySelector('iframe');
                    if (embedElement && embedElement.requestFullscreen) {
                        embedElement.requestFullscreen();
                    }
                } catch (err) {
                    console.log('Fullscreen request failed:', err);
                }
            }, 500);
        }
        
        // Also update the original page embed content for preview
        embedContent.innerHTML = `<iframe src="${proxiedUrl}" allowfullscreen="true"></iframe>`;
        
        // Show a notice about proxy status
        const notice = document.createElement('div');
        notice.className = 'plugin-notice mt-2';
        notice.innerHTML = 'Content is proxied and also opened in a new tab for fullscreen viewing.';
        notice.style.color = '#ff073a';
        notice.style.fontSize = '0.8rem';
        notice.style.textAlign = 'center';
        
        // Add the notice after the embed container
        const noticeContainer = document.querySelector('#embed-container');
        if (noticeContainer && !document.querySelector('.plugin-notice')) {
            noticeContainer.appendChild(notice);
        }
    }
    
    // Function to create a proxied URL
    function createProxiedUrl(url) {
        // For local development, handle differently than production
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
            // During local development, use a CORS proxy service
            return `https://corsproxy.io/?${encodeURIComponent(url)}`;
        } else {
            // On Netlify, use Netlify's redirect/proxy functionality
            return `/proxy/${url}`;
        }
    }
    
    // Add input event listener to clear errors when typing
    urlInput.addEventListener('input', function() {
        if (urlInput.classList.contains('is-invalid')) {
            clearError();
        }
    });
});