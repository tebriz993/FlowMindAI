import sgMail from '@sendgrid/mail';

interface EmailOptions {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not found - email notifications will be logged only');
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      // Log email instead of sending when no API key
      console.log('Email would be sent:', {
        to: options.to,
        subject: options.subject,
        content: options.text || options.html
      });
      return true;
    }

    const msg = {
      to: options.to,
      from: options.from || 'no.reply.flowmind@gmail.com',
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export function formatWorkflowEmailHtml(type: string, decision: 'approved' | 'rejected', note?: string): string {
  const color = decision === 'approved' ? '#10B981' : '#EF4444';
  const icon = decision === 'approved' ? '✅' : '❌';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8fafc; padding: 40px 20px; text-align: center;">
        <h1 style="color: #1f2937; margin: 0;">FlowMindAI</h1>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Workplace Automation Platform</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 10px;">${icon}</div>
          <h2 style="color: ${color}; margin: 0; text-transform: capitalize;">${type.replace('_', ' ')} ${decision}</h2>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your ${type.replace('_', ' ')} request has been <strong>${decision}</strong>.
        </p>
        
        ${note ? `
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #374151; margin: 0 0 10px 0;">Note from Approver:</h4>
            <p style="color: #6b7280; margin: 0; font-style: italic;">"${note}"</p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.APP_URL || 'https://flowmind.ai'}/requests" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Details
          </a>
        </div>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; text-align: center;">
        <p style="color: #9ca3af; font-size: 14px; margin: 0;">
          This is an automated notification from FlowMindAI. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
}

export function formatTicketEmailHtml(subject: string, action: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8fafc; padding: 40px 20px; text-align: center;">
        <h1 style="color: #1f2937; margin: 0;">FlowMindAI</h1>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Workplace Automation Platform</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎫</div>
          <h2 style="color: #4f46e5; margin: 0;">Ticket Update</h2>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          ${action} for ticket: <strong>"${subject}"</strong>
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.APP_URL || 'https://flowmind.ai'}/tickets" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Ticket
          </a>
        </div>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; text-align: center;">
        <p style="color: #9ca3af; font-size: 14px; margin: 0;">
          This is an automated notification from FlowMindAI. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
}