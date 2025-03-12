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
        
        const embedCode = `<embed src="${url}" type="application/x-unknown" width="100%" height="100%">`;
        
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
        // Clear previous embed content
        embedContent.innerHTML = '';
        
        // Create new embed element
        const embed = document.createElement('embed');
        embed.src = url;
        embed.type = 'application/x-unknown'; // Generic type
        embed.width = '100%';
        embed.height = '100%';
        
        // Add the embed to the container
        embedContent.appendChild(embed);
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
