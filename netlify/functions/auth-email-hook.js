import nodemailer from 'nodemailer';

/**
 * Netlify Function: Supabase Auth Send Email Hook
 * 
 * Replaces Supabase's built-in email templates with 100% custom HTML templates
 * for both How2doAI and Nirchal, sending via standard SMTP (Nodemailer) with
 * zero dependency on Resend or Sendgrid.
 */
export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const payload = await req.json();
    const { user, email_data } = payload;

    if (!user || !email_data) {
      return new Response(JSON.stringify({ error: 'Invalid payload structure' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { email, user_metadata } = user;
    const { token_hash, redirect_to, email_action_type } = email_data;

    // Detect project from user metadata (fallback to how2doai)
    const projectId = (user_metadata?.project_id || 'how2doai').toLowerCase();
    const fullName = user_metadata?.full_name || 'Valued User';

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://uyokvwgipoevdkinmhdj.supabase.co';
    
    // Construct the standard Supabase verification URL
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

    // Build Project-specific content and branding
    const isNirchal = projectId === 'nirchal';
    const brandName = isNirchal ? 'Nirchal' : 'How2doAI';
    const primaryColor = isNirchal ? '#059669' : '#4f46e5'; // Emerald for Nirchal, Indigo for How2doAI
    const accentColor = isNirchal ? '#10b981' : '#6366f1';
    const supportEmail = isNirchal ? 'support@nirchal.com' : 'support@how2doai.ai';

    let emailSubject = '';
    let headingText = '';
    let bodyText = '';
    let buttonText = '';

    if (email_action_type === 'signup') {
      emailSubject = `Confirm your ${brandName} account`;
      headingText = `Welcome to ${brandName}!`;
      bodyText = `Thank you for signing up. Please confirm your email address by clicking the button below to get started:`;
      buttonText = 'Confirm Email Address';
    } else if (email_action_type === 'recovery') {
      emailSubject = `Reset your ${brandName} password`;
      headingText = 'Password Reset Request';
      bodyText = `We received a request to reset your password for your ${brandName} account. Click the button below to choose a new password:`;
      buttonText = 'Reset Password';
    } else {
      emailSubject = `Your ${brandName} verification link`;
      headingText = 'Verification Link';
      bodyText = `Click the button below to continue:`;
      buttonText = 'Verify & Continue';
    }

    // Custom HTML Email Template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
                  
                  <!-- Header with Brand Accent -->
                  <tr>
                    <td style="background-color: ${primaryColor}; padding: 28px 36px; text-align: left;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                        ${brandName}
                      </h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 36px;">
                      <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #0f172a;">
                        ${headingText}
                      </h2>
                      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                        Hi ${fullName},
                      </p>
                      <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                        ${bodyText}
                      </p>

                      <!-- Action Button -->
                      <table cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                        <tr>
                          <td align="center" style="border-radius: 8px; background-color: ${primaryColor};">
                            <a href="${confirmationUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 28px 0 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                        If the button above does not work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 1.4; word-break: break-all; color: ${accentColor};">
                        <a href="${confirmationUrl}" style="color: ${accentColor}; text-decoration: underline;">${confirmationUrl}</a>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f1f5f9; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                      <p style="margin: 0 0 4px 0;">
                        This email was sent by <strong>${brandName}</strong>. If you did not request this, please ignore this email.
                      </p>
                      <p style="margin: 0;">
                        Questions? Contact us at <a href="mailto:${supportEmail}" style="color: ${primaryColor}; text-decoration: none;">${supportEmail}</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Initialize SMTP Transporter (Using your existing Hostinger / custom SMTP)
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error('SMTP credentials missing in environment variables (SMTP_USER / SMTP_PASS)');
      return new Response(JSON.stringify({ error: 'SMTP credentials missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const senderName = brandName;
    const fromAddress = `"${senderName}" <${smtpUser}>`;

    // Send the email via SMTP
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: emailSubject,
      html: html
    });

    console.log(`[auth-email-hook] Successfully sent ${email_action_type} email for ${projectId} to: ${email}`);

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[auth-email-hook] Error processing email hook:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
