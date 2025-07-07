# Netlify Email Setup Guide

## Overview

Since we have two destination email addresses (`support@how2doai.ai` and `sales@how2doai.ai`), we need to configure a single SMTP account that can send emails to both addresses. The system will automatically route emails to the appropriate recipient based on the inquiry type.

## SMTP Configuration Options

### Option 1: Using One Email Account (Recommended)

Set up one email account that will **send** emails to both support and sales addresses.

#### Step 1: Create/Use an SMTP Account
You can use any of these options:
- A dedicated system email (e.g., `system@how2doai.ai`)
- Your main business email (e.g., `noreply@how2doai.ai`)
- The support email itself (`support@how2doai.ai`)

#### Step 2: Netlify Environment Variables
Go to your Netlify site dashboard → Site settings → Environment variables and add:

```bash
SMTP_USER=your-sending-email@how2doai.ai
SMTP_PASS=your-app-password
```

**How it works:**
- The system uses `SMTP_USER` to authenticate and send emails
- Emails are sent **TO** either `support@how2doai.ai` or `sales@how2doai.ai` based on inquiry type
- The `From` address will be your `SMTP_USER`
- The `Reply-To` will be set to the user's email address

### Option 2: Using Support Email as Sender

If you want to use the support email as the sender:

```bash
SMTP_USER=support@how2doai.ai
SMTP_PASS=your-support-email-password
```

**Advantage:** More authentic sender address
**Consideration:** Support email will receive all emails (including those meant for sales)

### Option 3: Using a Dedicated System Email (Best Practice)

Create a dedicated system email for sending:

```bash
SMTP_USER=system@how2doai.ai
SMTP_PASS=your-system-email-password
```

**Advantages:**
- Clean separation between system and user emails
- Better email deliverability
- Easier to manage and monitor

## Detailed Netlify Setup Steps

### Step 1: Access Netlify Dashboard
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Log in to your account
3. Select your AIhow project

### Step 2: Navigate to Environment Variables
1. Click on **Site settings** in the left sidebar
2. Scroll down to **Environment variables** section
3. Click **Add a variable**

### Step 3: Add SMTP Configuration
Add these two environment variables:

**Variable 1:**
- Key: `SMTP_USER`
- Value: `your-email@how2doai.ai` (the email that will send messages)

**Variable 2:**
- Key: `SMTP_PASS`
- Value: `your-email-password` (the password for the sending email)

### Step 4: Deploy
After adding the environment variables:
1. Redeploy your site (or trigger a new deploy)
2. The serverless function will now have access to the SMTP credentials

## Email Flow Diagram

```
User submits form → Netlify Function → SMTP Server → Recipient Email

Example flows:
1. General Inquiry → system@how2doai.ai → smtp.hostinger.com → support@how2doai.ai
2. Partnership → system@how2doai.ai → smtp.hostinger.com → sales@how2doai.ai
```

## Security Considerations

### App-Specific Passwords
If using Gmail or Google Workspace:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password instead of your regular password

### Email Provider Settings
For Hostinger:
- **SMTP Server:** smtp.hostinger.com
- **Port:** 465 (SSL/TLS)
- **Authentication:** Required
- **Security:** SSL/TLS

## Testing the Setup

### Step 1: Verify Environment Variables
In your Netlify dashboard, check that both variables are set correctly.

### Step 2: Test the Function
1. Deploy your site
2. Submit a test contact form
3. Check if emails are received at the correct addresses

### Step 3: Monitor Function Logs
1. Go to Netlify dashboard → Functions
2. Click on `send-email` function
3. Check the logs for any errors

## Common Issues and Solutions

### Issue 1: "Authentication Failed"
**Solution:** 
- Verify SMTP credentials are correct
- Check if 2FA is enabled (use app password)
- Ensure the email account allows SMTP access

### Issue 2: "Network Error"
**Solution:**
- Check SMTP server settings
- Verify port 465 is not blocked
- Try using port 587 with STARTTLS

### Issue 3: "Emails Not Received"
**Solution:**
- Check spam/junk folders
- Verify recipient email addresses are correct
- Check email provider's sending limits

## Alternative Configuration

If you prefer to use different SMTP accounts for each destination:

### Option A: Multiple Environment Variables
```bash
SMTP_USER_SUPPORT=support@how2doai.ai
SMTP_PASS_SUPPORT=support-password
SMTP_USER_SALES=sales@how2doai.ai
SMTP_PASS_SALES=sales-password
```

### Option B: Email Forwarding
Set up email forwarding:
1. Create one system email for SMTP
2. Configure forwarding rules to route to support/sales

## Recommendation

**For simplicity and reliability, I recommend Option 1 with a dedicated system email:**

1. Create `noreply@how2doai.ai` or `system@how2doai.ai`
2. Use this as your SMTP_USER
3. Let the system send emails to both support and sales addresses
4. Set up proper SPF/DKIM records for better deliverability

This approach is cleaner, more secure, and easier to manage than using multiple SMTP accounts.