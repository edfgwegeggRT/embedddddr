# Embeddddr

A neon red and black themed web application that allows users to browse and embed content from any URL using the Ultraviolet proxy service, providing anonymity and bypassing content restrictions.

## Features

- Browse any website anonymously through the Ultraviolet proxy
- Embed proxied content in your own websites
- Generate embeddable iframe code to share proxied content
- View content in full-page mode
- Neon red and black cyberpunk aesthetic
- Server-side proxy implementation for maximum compatibility

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Proxy Service**: Ultraviolet
- **Styling**: Bootstrap with custom neon theme

## Getting Started

### Prerequisites

- Python 3.6+
- Flask

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install flask requests gunicorn
   ```
3. Run the application:
   ```
   python main.py
   ```
   or with Gunicorn:
   ```
   gunicorn --bind 0.0.0.0:5000 main:app
   ```

### Usage

1. Enter a URL in the search box
2. Click "Browse" to navigate to the site through the proxy
3. Click "Embed" to create an embeddable version of the content
4. Use the "Copy" button to get the iframe code for embedding

## Proxy Implementation

The application uses a combination of server-side and client-side proxying:

1. **Server-side proxy**: All requests to `/proxy/` are forwarded through the Flask backend, which handles URL forwarding and header management.

2. **Ultraviolet integration**: For client-side browsing, the app integrates with Ultraviolet's JavaScript library to provide seamless browsing capabilities.

## Security Considerations

This proxy should be used responsibly:

- The proxy anonymizes browsing but is not a complete security solution
- Be aware of legal and terms of service implications when proxying content
- The application doesn't store browsing history or user data

## License

This project is open source and available for personal and educational use.

## Acknowledgments

- Ultraviolet proxy service for the core browsing technology
- Bootstrap for responsive design framework