# Email Configuration Setup

This document explains how to configure email functionality for the contact form.

## Overview

The contact form automatically routes emails to different recipients based on the inquiry type:

- **Support Email** (`support@how2doai.ai`): General Inquiry, Technical Support, Feedback, Press/Media
- **Sales Email** (`sales@how2doai.ai`): Bundle Implementation, Partnership

## SMTP Configuration

The system uses Hostinger's SMTP service with the following settings:

- **SMTP Host**: `smtp.hostinger.com`
- **Port**: `465` (SSL/TLS)
- **Security**: SSL/TLS enabled

## Environment Variables

You need to set the following environment variables:

```bash
SMTP_USER=your-email@hostinger.com
SMTP_PASS=your-app-password
```

### Setting Up Environment Variables

1. **For Development**:
   - Copy `.env.example` to `.env`
   - Fill in your actual SMTP credentials

2. **For Production (Netlify)**:
   - Go to your Netlify site dashboard
   - Navigate to Site settings → Environment variables
   - Add the following variables:
     - `SMTP_USER`: Your Hostinger email address
     - `SMTP_PASS`: Your email password or app-specific password

## Email Templates

The system sends two types of emails:

1. **Notification Email** (to support/sales team):
   - Contains all form details
   - Formatted in HTML with clear sections
   - Includes inquiry type and routing information

2. **Auto-reply Email** (to user):
   - Confirms receipt of their message
   - Provides expected response time
   - Includes message summary

## Testing

To test the email functionality:

1. Ensure environment variables are set correctly
2. Run the development server: `npm run dev`
3. Fill out the contact form with different inquiry types
4. Check that emails are routed to the correct recipients

## Troubleshooting

### Common Issues

1. **Email not sending**:
   - Check SMTP credentials are correct
   - Verify environment variables are set
   - Check Netlify function logs

2. **Authentication errors**:
   - Ensure you're using the correct email and password
   - For Gmail/Google Workspace, use app-specific passwords
   - For Hostinger, use the email account credentials

3. **Emails going to spam**:
   - Verify SPF/DKIM records are set up for your domain
   - Check email content for spam triggers
   - Consider using a professional email service

### Debug Information

The Netlify function logs will show:
- Email sending attempts
- SMTP connection status
- Error messages if sending fails

## Security Considerations

- Never commit actual credentials to version control
- Use environment variables for all sensitive data
- Consider using app-specific passwords when available
- Regularly rotate email passwords

## Email Routing Logic

```typescript
// Support types go to support@how2doai.ai
const supportTypes = ['general', 'support', 'feedback', 'press'];

// Sales types go to sales@how2doai.ai
const salesTypes = ['implementation', 'partnership'];
```

Any unknown inquiry types default to the support email address.