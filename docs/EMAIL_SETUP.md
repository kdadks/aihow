# Email Configuration Setup

This document explains how to set up email functionality for the contact form.

## Environment Variables Required

The email service requires the following environment variables:

- `SMTP_USER`: Your email address (e.g., support@how2doai.ai)
- `SMTP_PASS`: Your email password or app-specific password

## Local Development Setup

1. Create or update your `.env.local` file in the project root:
```
SMTP_USER=your-email@hostinger.com
SMTP_PASS=your-app-password
```

2. Test the configuration:
```bash
npm run test-email
```

## Production Setup (Netlify)

### Setting Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to your site
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:
   - `SMTP_USER`: your-email@hostinger.com
   - `SMTP_PASS`: your-app-password

### Important Notes

- Environment variables in Netlify are separate from your local `.env.local` file
- After adding environment variables, you need to redeploy your site
- Use app-specific passwords for Gmail or other email providers that support 2FA

## SMTP Configuration

The current configuration uses Hostinger SMTP:
- Host: smtp.hostinger.com
- Port: 465
- Secure: true (SSL/TLS)

## Testing Email Functionality

After deployment with proper environment variables:

1. Visit your contact form
2. Fill out and submit a test message
3. Check both:
   - The recipient email (support@how2doai.ai or sales@how2doai.ai)
   - The sender's email for the auto-reply

## Troubleshooting

### 500 Internal Server Error
- Check that environment variables are set in Netlify
- Verify SMTP credentials are correct
- Check Netlify function logs for detailed error messages

### Function Not Found
- Ensure the function is deployed to `netlify/functions/send-email.js`
- Check that the build completed successfully

### Email Not Received
- Check spam/junk folders
- Verify recipient email addresses are correct
- Test with different email providers

## Email Routing

Based on inquiry type, emails are routed as follows:

- **Support Types** (general, support, feedback, press) → support@how2doai.ai
- **Sales Types** (implementation, partnership) → sales@how2doai.ai
- **Unknown Types** → support@how2doai.ai (default)

## Security Considerations

- Never commit SMTP credentials to version control
- Use app-specific passwords when possible
- Consider using environment-specific email addresses for testing
- Implement rate limiting to prevent abuse (already included in the function)