import { Resend } from 'resend';

let resend: Resend | null = null;

// Initialize Resend if API key is available
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured. Email would be sent to:', params.to);
    console.log('Subject:', params.subject);
    console.log('HTML content:', params.html);
    return true; // Return true for development mode
  }

  try {
    await resend.emails.send({
      to: params.to,
      from: params.from || 'FlowMindAI <no.reply.flowmind@gmail.com>',
      subject: params.subject,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}

export function generateVerificationEmail(
  firstName: string, 
  verificationUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Verify Your FlowMindAI Account</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FlowMindAI!</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Hi ${firstName},</p>
        
        <p style="margin-bottom: 20px;">
          Thank you for signing up for FlowMindAI! To complete your registration and start using our AI-powered workplace automation platform, please verify your email address.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
            Verify My Account
          </a>
        </div>
        
        <p style="margin-bottom: 20px;">
          If the button doesn't work, you can also copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-family: monospace;">
          ${verificationUrl}
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          This verification link will expire in 24 hours. If you didn't create an account with FlowMindAI, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          Best regards,<br>
          The FlowMindAI Team
        </p>
      </div>
    </body>
    </html>
  `;
}