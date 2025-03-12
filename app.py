import os
import requests
from flask import Flask, render_template, request, Response, redirect, url_for, send_from_directory
from urllib.parse import urlparse, urljoin

# Create the Flask application
app = Flask(__name__, static_folder='static')
app.secret_key = os.environ.get("SESSION_SECRET", "embeddddr-secret-key")

@app.route('/')
def index():
    """Render the main index page."""
    return render_template('index.html')

@app.route('/proxy/<path:url>')
def proxy(url):
    """Proxy service that forwards requests to the target URL."""
    try:
        # Ensure the URL has a scheme
        if not urlparse(url).scheme:
            url = 'https://' + url
            
        # Forward the request to the target URL
        resp = requests.request(
            method=request.method,
            url=url,
            headers={key: value for (key, value) in request.headers if key != 'Host'},
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False,
            stream=True
        )
        
        # Create response object
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items()
                   if name.lower() not in excluded_headers]
        
        # Add CORS headers
        headers.append(('Access-Control-Allow-Origin', '*'))
        headers.append(('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'))
        headers.append(('Access-Control-Allow-Headers', '*'))
        
        response = Response(resp.content, resp.status_code, headers)
        return response
    except Exception as e:
        return f"Error proxying URL: {str(e)}", 500

@app.route('/service/<path:url>')
def service_proxy(url):
    """UV service proxy endpoint."""
    return proxy(url)

@app.route('/bare/')
def bare_proxy():
    """Bare server proxy endpoint."""
    target_url = request.args.get('url')
    if not target_url:
        return "Missing URL parameter", 400
    return proxy(target_url)

@app.route('/uv/<path:filename>')
def serve_uv_files(filename):
    """Serve Ultraviolet static files."""
    return send_from_directory('static/uv', filename)

@app.route('/embed')
def embed_view():
    """Render the embed view for a given URL."""
    url = request.args.get('url')
    if not url:
        return redirect(url_for('index'))
    
    # Pass the URL to the template for embedding
    return render_template('embed.html', url=url)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
