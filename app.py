import os
from flask import Flask, render_template

# Create the Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "embeddddr-secret-key")

@app.route('/')
def index():
    """Render the main index page."""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
