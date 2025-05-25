# AIhow

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys)

A comprehensive React application for AI tool recommendations, comparisons, and workflows.

## Features

- AI tool directory and search
- Personalized tool recommendations
- Tool comparisons and bundling
- Workflow suggestions
- Voice search capability

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run build-preview

# Deploy to Netlify preview URL
npm run netlify-deploy

# Deploy to Netlify production URL
npm run netlify-deploy-prod
```

## Deployment

This project is automatically deployed to Netlify when changes are pushed to the main branch through GitHub Actions.

### Netlify Configuration

- `netlify.toml` - Main Netlify configuration
- `_redirects` - URL redirect rules
- `netlify/functions` - Serverless functions
- `netlify/build-plugins.toml` - Build plugins configuration

For detailed instructions on setting up Netlify deployment, see [NETLIFY_SETUP.md](NETLIFY_SETUP.md)

## Continuous Deployment

The project uses GitHub Actions workflow in `.github/workflows/netlify-deploy.yml` to automatically build and deploy the site whenever changes are pushed to the main branch.

## Technologies

- React
- TypeScript
- React Router
- Tailwind CSS
- Vite
- Supabase
- Netlify
