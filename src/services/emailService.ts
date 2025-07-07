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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
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