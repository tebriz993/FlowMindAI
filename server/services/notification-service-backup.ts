import { IStorage } from '../storage';
import { InsertNotification } from '@shared/schema';
import { sendEmail } from './email-service';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'ticket_update' | 'workflow_approved' | 'workflow_rejected' | 'system' | 'general';
  actionUrl?: string;
  sendEmail?: boolean;
}

export class NotificationService {
  constructor(private storage: IStorage) {}

  async createNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Create in-app notification
      const notification: InsertNotification = {
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        actionUrl: payload.actionUrl,
        isRead: false,
      };

      await this.storage.createNotification(notification);

      // Send email notification if requested
      if (payload.sendEmail) {
        await this.sendEmailNotification(payload);
      }

      console.log(`Notification created for user ${payload.userId}: ${payload.title}`);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Get user details for email
      const user = await this.storage.getUser(payload.userId);
      if (!user || !user.email) {
        console.warn(`User ${payload.userId} has no email address`);
        return;
      }

      // Format email based on notification type
      let emailSubject = payload.title;
      let emailBody = this.formatEmailBody(payload);

      await sendEmail({
        to: user.email,
        from: 'no.reply.flowmind@gmail.com',
        subject: emailSubject,
        html: emailBody
      });

      console.log(`Email notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw error - email failure shouldn't break notification creation
    }
  }

  private formatEmailBody(payload: NotificationPayload): string {
    const actionButton = payload.actionUrl 
      ? `<a href="${payload.actionUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px;">View Details</a>`
      : '';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center;">
          <h1 style="color: #1f2937; margin: 0;">FlowMindAI</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Workplace Automation Platform</p>
        </div>
        
        <div style="padding: 30px 20px; background-color: white;">
          <h2 style="color: #374151; margin: 0 0 20px 0;">${payload.title}</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">${payload.message}</p>
          ${actionButton}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            This is an automated notification from FlowMindAI.
          </p>
        </div>
      </div>
    `;
  }
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #374151;">${payload.title}</h2>
        <p style="color: #6B7280; line-height: 1.6;">${payload.message}</p>
        ${actionButton}
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="color: #9CA3AF; font-size: 12px;">
          This is an automated notification from FlowMindAI. 
          If you have any questions, please contact your system administrator.
        </p>
      </div>
    `;
  }

  // Helper methods for common notification types
  async notifyTicketUpdate(userId: string, ticketId: string, status: string, subject: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Ticket Updated',
      message: `Your ticket "${subject}" has been updated to ${status.replace('_', ' ')}.`,
      type: 'ticket_update',
      actionUrl: `/portal/tickets/${ticketId}`,
      sendEmail: true
    });
  }

  async notifyWorkflowApproved(userId: string, workflowId: string, workflowType: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Request Approved',
      message: `Your ${workflowType.replace('_', ' ')} request has been approved.`,
      type: 'workflow_approved',
      actionUrl: `/portal/requests/${workflowId}`,
      sendEmail: true
    });
  }

  async notifyWorkflowRejected(userId: string, workflowId: string, workflowType: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Request Rejected',
      message: `Your ${workflowType.replace('_', ' ')} request has been rejected.`,
      type: 'workflow_rejected',
      actionUrl: `/portal/requests/${workflowId}`,
      sendEmail: true
    });
  }

  async notifySystemMessage(userId: string, title: string, message: string): Promise<void> {
    await this.createNotification({
      userId,
      title,
      message,
      type: 'system',
      sendEmail: false
    });
  }
}

let notificationServiceInstance: NotificationService | null = null;

export function initializeNotificationService(storage: IStorage): NotificationService {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService(storage);
  }
  return notificationServiceInstance;
}

export function getNotificationService(): NotificationService {
  if (!notificationServiceInstance) {
    throw new Error('NotificationService not initialized. Call initializeNotificationService first.');
  }
  return notificationServiceInstance;
}