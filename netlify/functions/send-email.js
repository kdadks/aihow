import nodemailer from 'nodemailer';

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { name, email, company, phone, subject, message, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !subject || !message || !inquiryType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Determine recipient email based on inquiry type
    const supportTypes = ['general', 'support', 'feedback', 'press'];
    const salesTypes = ['implementation', 'partnership'];
    
    let recipientEmail;
    if (supportTypes.includes(inquiryType)) {
      recipientEmail = 'support@how2doai.ai';
    } else if (salesTypes.includes(inquiryType)) {
      recipientEmail = 'sales@how2doai.ai';
    } else {
      // Default to support for unknown types
      recipientEmail = 'support@how2doai.ai';
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return new Response(JSON.stringify({
        error: 'Email service not configured properly',
        details: 'SMTP credentials missing'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email content
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Inquiry Type:</strong> ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}</p>
            </div>

            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Subject</h3>
              <p>${subject}</p>
            </div>

            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Message</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>Note:</strong> This email was sent to ${recipientEmail} based on the inquiry type: ${inquiryType}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"AIhow Contact Form" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: `
Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${phone ? `Phone: ${phone}` : ''}
Inquiry Type: ${inquiryType}

Subject: ${subject}

Message:
${message}

---
This email was sent to ${recipientEmail} based on the inquiry type: ${inquiryType}
      `
    });

    // Send auto-reply to user
    const autoReplyContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Thank you for contacting How2doai!</h2>
            
            <p>Dear ${name},</p>
            
            <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Inquiry Type:</strong> ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            <p>In the meantime, feel free to explore our AI tool directory and recommendations at <a href="https://how2doai.ai" style="color: #2563eb;">how2doai.ai</a>.</p>
            
            <p>Best regards,<br>
            The How2doai Team</p>
            <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 5px; font-size: 14px; color: #6b7280;">
              <p style="margin: 0;"><strong>How2doai - AI Tool Discovery Platform</strong></p>
              <p style="margin: 5px 0 0 0;">Email: ${recipientEmail} | Website: https://how2doai.ai</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"How2doai Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting How2doai - We\'ll be in touch soon!',
      html: autoReplyContent,
      text: `
Dear ${name},

Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.

Your Message Summary:
- Subject: ${subject}
- Inquiry Type: ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}
- Submitted: ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

In the meantime, feel free to explore our AI tool directory and recommendations at https://how2doai.ai.

Best regards,
The How2doai Team

---
How2doai - AI Tool Discovery Platform
Email: ${recipientEmail} | Website: https://how2doai.ai
      `
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      recipientEmail: recipientEmail,
      messageId: info.messageId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};