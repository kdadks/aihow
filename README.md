# AIhow

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys)

A comprehensive React/TypeScript application for AI tool recommendations, comparisons, and workflows. The platform helps users discover, compare, and integrate AI tools into their workflows.

## Core Features

### Tools Directory
- Searchable AI tool directory with categories
- Detailed tool comparisons and feature analysis
- User reviews and ratings system
- Tool bundling recommendations

### Smart Recommendations
- Personalized tool recommendations through assessment
- Workflow optimization suggestions
- Bundle creation based on user needs
- Voice search capability

### User System
- Profile management with avatars
- Role-based access control
- User reviews and ratings
- Saved tools and workflows

### Blog & Community
- Categorized blog posts
- Community forum with nested replies
- Topic organization and moderation
- User engagement tracking

## Architecture

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- React Query for data fetching
- Zustand for state management
- React Hook Form for forms
- React Error Boundary for error handling

### Backend
- Supabase for database and authentication
- PostgreSQL with Row Level Security
- Role-based access control
- API rate limiting
- TypeScript integration

### Testing
- Vitest for unit testing
- Cypress for E2E and component testing
- React Testing Library
- Continuous integration testing

## Development

### Prerequisites
- Node.js (version specified in .nvmrc)
- npm
- Supabase CLI

### Setup
\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your environment variables

# Set up database
supabase db reset

# Set up Cypress environment
npm run cypress:setup
\`\`\`

### Development Commands
\`\`\`bash
# Start development server
npm run dev

# Run tests
npm run test           # Unit tests
npm run test:e2e      # E2E tests
npm run test:all      # All tests

# Linting
npm run lint

# Build
npm run build         # Production build
npm run preview      # Preview build locally
\`\`\`

### Admin Setup
\`\`\`bash
# Create admin user
npm run create-admin

# Setup admin database
npm run setup-admin

# Reset admin password
npm run reset-admin-password
\`\`\`

## Project Structure

\`\`\`
├── src/
│   ├── admin/         # Admin portal components
│   ├── assets/        # Static assets
│   ├── auth/          # Authentication logic
│   ├── components/    # Reusable components
│   ├── data/          # Static data and types
│   ├── database/      # Database interfaces
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   ├── pages/         # Page components
│   ├── providers/     # Context providers
│   ├── routes/        # Route definitions
│   ├── services/      # API services
│   ├── stores/        # State management
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/           # Static files
├── scripts/          # Utility scripts
├── cypress/          # E2E tests
├── docs/            # Documentation
├── supabase/        # Database configuration
└── netlify/         # Netlify configuration
\`\`\`

## Deployment

The project is deployed on Netlify with continuous deployment:

### Development Deployment
\`\`\`bash
npm run netlify-deploy      # Deploy to preview URL
\`\`\`

### Production Deployment
\`\`\`bash
npm run netlify-deploy-prod # Deploy to production
\`\`\`

### Configuration Files
- `netlify.toml` - Main Netlify configuration
- `_redirects` - URL redirect rules
- `netlify/functions/` - Serverless functions
- `netlify/build-plugins.toml` - Build plugins configuration

## Documentation

Detailed documentation available in the `docs/` directory:

- [Database Setup](docs/DATABASE_SETUP.md)
- [Netlify Setup](docs/NETLIFY_SETUP.md)
- [Testing Guide](docs/TESTING.md)
- [Admin Auth Implementation](docs/admin-auth-implementation.md)
- [API Documentation](docs/API.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is proprietary and confidential.
