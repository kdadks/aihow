export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  bundleReference?: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  recipientEmail?: string;
  messageId?: string;
}

export class EmailService {
  private static baseUrl = process.env.NODE_ENV === 'production' 
    ? '/.netlify/functions' 
    : 'http://localhost:8888/.netlify/functions';

  /**
   * Send contact form email
   */
  static async sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorDetails;
        try {
          const errorData = await response.json();
          errorDetails = errorData.error || errorData.details || `HTTP ${response.status}`;
        } catch {
          errorDetails = `HTTP ${response.status} - ${response.statusText}`;
        }
        throw new Error(`Failed to send email: ${errorDetails}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to email service. Please check your internet connection.';
        } else if (error.message.includes('HTTP 500')) {
          errorMessage = 'Email service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('HTTP 400')) {
          errorMessage = 'Invalid form data. Please check all required fields.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get recipient email based on inquiry type
   */
  static getRecipientEmail(inquiryType: string): string {
    const supportTypes = ['general', 'support', 'feedback', 'press'];
    const salesTypes = ['implementation', 'partnership'];
    
    if (supportTypes.includes(inquiryType)) {
      return 'support@how2doai.ai';
    } else if (salesTypes.includes(inquiryType)) {
      return 'sales@how2doai.ai';
    } else {
      // Default to support for unknown types
      return 'support@how2doai.ai';
    }
  }

  /**
   * Get inquiry type display name
   */
  static getInquiryTypeLabel(inquiryType: string): string {
    const labels: { [key: string]: string } = {
      'general': 'General Inquiry',
      'implementation': 'Bundle Implementation',
      'support': 'Technical Support',
      'partnership': 'Partnership',
      'feedback': 'Feedback',
      'press': 'Press/Media'
    };
    
    return labels[inquiryType] || inquiryType;
  }
}