import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Get user notifications
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await storage.getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    await storage.markNotificationAsRead(notificationId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export { router as notificationsRouter };