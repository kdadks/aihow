# Netlify Email Setup - Visual Guide

## Step-by-Step Netlify Configuration

### Step 1: Access Your Netlify Site Dashboard
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Log in with your credentials
3. Click on your **AIhow** project from the sites list

### Step 2: Navigate to Site Settings
1. On your site dashboard, look for the **Site settings** tab
2. Click on **Site settings** (usually in the top navigation or sidebar)

### Step 3: Find Environment Variables Section
1. In the Site settings page, scroll down to find **Environment variables**
2. Or look for **Build & deploy** → **Environment variables**
3. Click on **Environment variables**

### Step 4: Add SMTP Variables
Click **Add a variable** and add these two variables:

#### Variable 1: SMTP_USER
```
Key: SMTP_USER
Value: your-email@how2doai.ai
```
*This is the email account that will send the messages*

#### Variable 2: SMTP_PASS
```
Key: SMTP_PASS
Value: your-email-password
```
*This is the password for the sending email account*

### Step 5: Save and Deploy
1. Click **Save** after adding both variables
2. Trigger a new deployment:
   - Option A: Push a new commit to your GitHub repository
   - Option B: Go to **Deploys** tab and click **Trigger deploy** → **Deploy site**

## Visual Reference

```
Netlify Dashboard
├── Site Overview
├── Site Settings ← Click here
│   ├── General
│   ├── Build & deploy
│   ├── Environment variables ← Then click here
│   │   ├── SMTP_USER = your-email@how2doai.ai
│   │   └── SMTP_PASS = your-email-password
│   ├── Domain management
│   └── ...
└── Functions
    └── send-email ← Your function will appear here after deployment
```

## Email Setup Options

### Option 1: Use Support Email (Simple)
```bash
SMTP_USER=support@how2doai.ai
SMTP_PASS=your-support-email-password
```

### Option 2: Use Dedicated System Email (Recommended)
```bash
SMTP_USER=system@how2doai.ai
SMTP_PASS=your-system-email-password
```

### Option 3: Use No-Reply Email
```bash
SMTP_USER=noreply@how2doai.ai
SMTP_PASS=your-noreply-email-password
```

## After Setup - Testing

1. **Deploy your site** (if not auto-deployed)
2. **Visit your contact form** at `https://your-site.netlify.app/contact`
3. **Submit a test form** with different inquiry types
4. **Check email delivery**:
   - General Inquiry → should go to `support@how2doai.ai`
   - Bundle Implementation → should go to `sales@how2doai.ai`

## Troubleshooting

### Check Function Logs
1. Go to Netlify Dashboard → **Functions**
2. Click on **send-email** function
3. Check the logs for any errors

### Common Error Messages
- **"Authentication failed"** → Check SMTP credentials
- **"Network timeout"** → Check SMTP server settings
- **"Module not found"** → Ensure deployment included all files

## Security Best Practices

1. **Never commit passwords to your repository**
2. **Use app-specific passwords** for Gmail/Google Workspace
3. **Enable 2-factor authentication** on your email accounts
4. **Regularly rotate passwords**

## Email Provider Specific Settings

### For Hostinger Email
- SMTP Server: `smtp.hostinger.com`
- Port: `465` (SSL/TLS)
- Use your full email address as username
- Use your email password

### For Gmail/Google Workspace
- SMTP Server: `smtp.gmail.com`
- Port: `465` (SSL/TLS)
- Enable 2-factor authentication
- Generate and use app-specific password

### For Outlook/Hotmail
- SMTP Server: `smtp-mail.outlook.com`
- Port: `587` (STARTTLS)
- Use your email address as username
- Use your email password

## Final Verification

After completing the setup:

1. ✅ Environment variables are set in Netlify
2. ✅ Site has been redeployed
3. ✅ Contact form submits successfully
4. ✅ Emails are received at correct addresses
5. ✅ Auto-reply emails are sent to users

## Need Help?

If you encounter issues:
1. Check the [detailed setup guide](./NETLIFY_EMAIL_SETUP.md)
2. Review the [implementation documentation](./CONTACT_FORM_IMPLEMENTATION.md)
3. Run the email test: `npm run test-email`