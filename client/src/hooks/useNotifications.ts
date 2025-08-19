import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ticket_update' | 'workflow_approved' | 'workflow_rejected' | 'system' | 'general';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ['/api/notifications', userId],
    enabled: !!userId,
    refetchInterval: 30000, // Poll every 30 seconds for real-time updates
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
    },
    onSuccess: (_, notificationId) => {
      // Update the notifications cache
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });
}

export function useUnreadNotificationCount(userId?: string) {
  const { data: notifications = [] } = useNotifications(userId);
  return notifications.filter((n: Notification) => !n.isRead).length;
}