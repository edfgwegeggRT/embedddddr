document.addEventListener('DOMContentLoaded', function() {
    // Get elements for the UV form
    const uvForm = document.getElementById('uv-form');
    const uvAddress = document.getElementById('uv-address');
    const errorMessage = document.getElementById('error-message');
    const embedContainer = document.getElementById('embed-container');
    const embedContent = document.getElementById('embed-content');
    const embedUrl = document.getElementById('embed-url');
    const emptyState = document.getElementById('empty-state');
    const copyButton = document.getElementById('copy-embed-code');
    const embedButton = document.getElementById('embed-button');

    // Initialize dynamic elements for fullscreen
    let fullscreenElement = null;
    
    // Handle UV form submission (browse)
    uvForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the URL value
        const url = uvAddress.value.trim();
        
        // Validate URL
        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        // Clear any previous errors
        clearError();
        
        try {
            // Create the proxied URL with Ultraviolet
            const encodedUrl = createProxiedUrl(url);
            
            // Navigate to the proxied page
            window.location.href = encodedUrl;
        } catch (error) {
            showError('Failed to proxy the content. Please try another URL.');
            console.error('Proxy error:', error);
        }
    });
    
    // Handle embed button click
    embedButton.addEventListener('click', function() {
        // Get the URL value
        const url = uvAddress.value.trim();
        
        // Validate URL
        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }
        
        // Clear any previous errors
        clearError();
        
        try {
            // Create the embed preview
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
        const url = uvAddress.value.trim();
        if (!url) return;
        
        // Create embed code for iframe with proxied URL
        const embedCode = `<iframe src="${window.location.origin}/embed?url=${encodeURIComponent(url)}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
        
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
            // Add protocol if missing
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        uvAddress.classList.add('is-invalid');
        errorMessage.style.display = 'block';
    }
    
    // Function to clear error message
    function clearError() {
        errorMessage.textContent = '';
        uvAddress.classList.remove('is-invalid');
        errorMessage.style.display = 'none';
    }
    
    // Function to create proxied URL using Ultraviolet
    function createProxiedUrl(url) {
        // Ensure URL has protocol
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        
        // Encode URL using Ultraviolet's encoding
        return __uv$config.prefix + __uv$config.encodeUrl(url);
    }
    
    // Function to create embed preview
    function createEmbed(url) {
        // Create iframe with proxied content
        const iframeSrc = `/proxy/${url}`;
        embedContent.innerHTML = `<iframe src="${iframeSrc}" frameborder="0" allowfullscreen></iframe>`;
        
        // Show a notice about proxied content
        const notice = document.createElement('div');
        notice.className = 'proxy-notice mt-2';
        notice.innerHTML = 'Content is being shown through our secure proxy. <a href="/embed?url=' + 
            encodeURIComponent(url) + '" target="_blank">Open in full page</a>';
        notice.style.color = '#ff073a';
        notice.style.fontSize = '0.8rem';
        notice.style.textAlign = 'center';
        
        // Add or update the notice
        const existingNotice = document.querySelector('.proxy-notice');
        if (existingNotice) {
            existingNotice.innerHTML = notice.innerHTML;
        } else {
            const noticeContainer = document.querySelector('#embed-container');
            if (noticeContainer) {
                noticeContainer.appendChild(notice);
            }
        }
    }
    
    // Open fullscreen embed
    function openFullscreenEmbed(url) {
        // Remove any existing fullscreen element
        if (fullscreenElement) {
            document.body.removeChild(fullscreenElement);
        }
        
        // Create fullscreen container
        fullscreenElement = document.createElement('div');
        fullscreenElement.className = 'fullscreen-embed';
        
        // Create controls
        const controls = document.createElement('div');
        controls.className = 'fullscreen-controls';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.title = 'Close fullscreen view';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(fullscreenElement);
            fullscreenElement = null;
        });
        
        controls.appendChild(closeButton);
        
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = `/proxy/${url}`;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        
        // Add to document
        fullscreenElement.appendChild(controls);
        fullscreenElement.appendChild(iframe);
        document.body.appendChild(fullscreenElement);
    }
    
    // Add input event listener to clear errors when typing
    uvAddress.addEventListener('input', function() {
        if (uvAddress.classList.contains('is-invalid')) {
            clearError();
        }
    });
});
