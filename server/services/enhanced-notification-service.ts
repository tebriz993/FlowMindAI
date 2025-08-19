import { IStorage } from '../storage';
import { InsertNotification } from '@shared/schema';
import { sendEmail, formatWorkflowEmailHtml, formatTicketEmailHtml } from './email-service';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'ticket_update' | 'workflow_approved' | 'workflow_rejected' | 'system' | 'general';
  actionUrl?: string;
  sendEmail?: boolean;
}

export class EnhancedNotificationService {
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

      console.log(`✓ Notification created for user ${payload.userId}: ${payload.title}`);
    } catch (error) {
      console.error('✗ Error creating notification:', error);
      throw error;
    }
  }

  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    try {
      const user = await this.storage.getUser(payload.userId);
      if (!user?.email) {
        console.warn(`User ${payload.userId} has no email address`);
        return;
      }

      const emailSubject = `FlowMindAI: ${payload.title}`;
      const emailBody = this.formatEmailBody(payload);

      await sendEmail({
        to: user.email,
        from: 'no.reply.flowmind@gmail.com',
        subject: emailSubject,
        html: emailBody
      });

      console.log(`✓ Email notification sent to ${user.email}`);
    } catch (error) {
      console.error('✗ Error sending email notification:', error);
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

  // Critical event triggers for guaranteed notifications
  async notifyTicketReply(ticketId: string, replyMessage: string): Promise<void> {
    const ticket = await this.storage.getTicket(ticketId);
    if (!ticket) return;

    await this.createNotification({
      userId: ticket.createdBy,
      title: 'New Reply on Your Ticket',
      message: `A new reply has been added to your ticket: "${ticket.subject}"`,
      type: 'ticket_update',
      actionUrl: `/tickets/${ticketId}`,
      sendEmail: true
    });
  }

  async notifyWorkflowDecision(workflowId: string, decision: 'approved' | 'rejected', note?: string): Promise<void> {
    const workflow = await this.storage.getWorkflow(workflowId);
    if (!workflow) return;

    const title = decision === 'approved' ? 'Request Approved' : 'Request Rejected';
    const message = `Your ${workflow.type.replace('_', ' ')} request has been ${decision}${note ? `: ${note}` : '.'}`;

    await this.createNotification({
      userId: workflow.createdBy,
      title,
      message,
      type: decision === 'approved' ? 'workflow_approved' : 'workflow_rejected',
      actionUrl: `/requests/${workflowId}`,
      sendEmail: true
    });
  }

  async notifyTicketAssigned(ticketId: string, assigneeId: string): Promise<void> {
    const ticket = await this.storage.getTicket(ticketId);
    if (!ticket) return;

    await this.createNotification({
      userId: assigneeId,
      title: 'New Ticket Assigned',
      message: `You have been assigned a new ticket: "${ticket.subject}"`,
      type: 'ticket_update',
      actionUrl: `/tickets/${ticketId}`,
      sendEmail: true
    });
  }

  async notifyTicketStatusUpdate(ticketId: string, newStatus: string): Promise<void> {
    const ticket = await this.storage.getTicket(ticketId);
    if (!ticket) return;

    await this.createNotification({
      userId: ticket.createdBy,
      title: 'Ticket Status Updated',
      message: `Your ticket "${ticket.subject}" status has been updated to ${newStatus.replace('_', ' ')}.`,
      type: 'ticket_update',
      actionUrl: `/tickets/${ticketId}`,
      sendEmail: true
    });
  }

  async getUserNotifications(userId: string): Promise<any[]> {
    return this.storage.getUserNotifications(userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.storage.markNotificationAsRead(notificationId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await this.storage.getUserNotifications(userId);
    return notifications.filter(n => !n.isRead).length;
  }
}

let enhancedNotificationService: EnhancedNotificationService | null = null;

export function initializeEnhancedNotificationService(storage: IStorage): EnhancedNotificationService {
  if (!enhancedNotificationService) {
    enhancedNotificationService = new EnhancedNotificationService(storage);
  }
  return enhancedNotificationService;
}

export function getEnhancedNotificationService(): EnhancedNotificationService {
  if (!enhancedNotificationService) {
    throw new Error('EnhancedNotificationService not initialized');
  }
  return enhancedNotificationService;
}