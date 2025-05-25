# Netlify Deployment Setup Instructions

Follow these steps to deploy your project on Netlify:

## Option 1: Deploy via Netlify UI (Recommended)

1. Create an account on [Netlify](https://app.netlify.com/) if you don't have one
2. Click on "Add new site" > "Import an existing project"
3. Choose GitHub as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select the repository: `kdadks/aihow`
6. Configure the build settings:
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

## Option 2: Deploy via Netlify CLI

If you want to use the Netlify CLI (which requires fixing the permission issues):

1. Fix permission issues:
   ```
   sudo chown -R $(whoami) ~/Library/Preferences/netlify/
   ```
2. Log in to Netlify:
   ```
   npx netlify login
   ```
3. Initialize your project:
   ```
   npx netlify init
   ```
4. Follow the prompts to connect to your GitHub repository

## Setting up Continuous Deployment

To set up continuous deployment with GitHub Actions, you need to add these secrets to your GitHub repository:

1. Go to your GitHub repository > Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `NETLIFY_AUTH_TOKEN`: Get from Netlify user settings > Applications > Personal access tokens
   - `NETLIFY_SITE_ID`: Found in your Netlify site settings > Site details > API ID

## Update README Badge

After you've deployed your site, update the Netlify badge in your README.md by replacing:
- `YOUR_NETLIFY_SITE_ID` with your actual Netlify Site ID
- `YOUR_NETLIFY_SITE_NAME` with your site's name on Netlify

## Test Deployment

To test a deployment locally:
```
npm run build
npx netlify deploy
```

To deploy to production:
```
npm run build
npx netlify deploy --prod
```
