import { IStorage } from '../storage';
import { InsertNotification } from '@shared/schema';

export class DemoNotificationsService {
  constructor(private storage: IStorage) {}

  async createDemoNotifications(): Promise<void> {
    console.log('Creating demo notifications...');

    const demoNotifications: InsertNotification[] = [
      {
        userId: 'dev-admin',
        title: 'Welcome to FlowMindAI',
        message: 'Your notification system is now active! You will receive updates about tickets and workflow approvals.',
        type: 'system',
        isRead: false,
        actionUrl: '/admin/dashboard'
      },
      {
        userId: 'dev-admin',
        title: 'Ticket Updated',
        message: 'A ticket regarding "Password Reset Request" has been updated to resolved.',
        type: 'ticket_update',
        isRead: false,
        actionUrl: '/admin/tickets'
      },
      {
        userId: 'dev-admin',
        title: 'Request Approved',
        message: 'A leave request from John Doe has been approved.',
        type: 'workflow_approved',
        isRead: true,
        actionUrl: '/admin/workflows'
      },
    ];

    try {
      for (const notification of demoNotifications) {
        await this.storage.createNotification(notification);
      }
      console.log(`✅ Created ${demoNotifications.length} demo notifications`);
    } catch (error) {
      console.error('Error creating demo notifications:', error);
    }
  }
}