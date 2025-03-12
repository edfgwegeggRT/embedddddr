# Embeddddr

A neon red and black themed static website that allows users to embed content from URLs using a proxied server to improve compatibility and avoid cross-origin issues.

## Features

- Enter any URL and display it through a proxied server
- Open embedded content in a new tab in fullscreen mode
- Copy embed code for use on other websites
- Proxy content to avoid cross-origin issues and improve compatibility
- Stylish neon red and black theme
- Fully static site with Netlify proxy functionality

## Deployment on Netlify

This site is ready for deployment on Netlify. Here's how to deploy it:

1. Sign up for a Netlify account at [netlify.com](https://www.netlify.com/)
2. Click the "New site from Git" button
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select this repository
5. Leave the build command empty (the site is already built)
6. Set the publish directory to `.` (the root of the repo)
7. Click "Deploy site"

The `netlify.toml` file in this repository already contains the necessary configuration for deployment.

## Local Development

To run this site locally, simply open the `index.html` file in a web browser. When running locally, the site will use a public CORS proxy service (corsproxy.io) for development purposes.

## How Proxy Works

The proxy functionality works differently depending on the environment:

1. **In production (Netlify)**: Uses Netlify's redirect/proxy functionality to fetch content server-side, avoiding CORS issues.
   - The `/proxy/*` path in netlify.toml is configured to proxy requests to external domains.
   - Headers are set to allow cross-origin access.

2. **In local development**: Uses corsproxy.io as a fallback to enable testing without deploying.

This approach:
- Improves compatibility with different content types
- Avoids cross-origin restrictions
- Allows embedding content from sites that otherwise couldn't be embedded
- Works with PDFs, videos, and other media types

## License

This project is open source and available for personal and commercial use.