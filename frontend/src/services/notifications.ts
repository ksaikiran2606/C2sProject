import { apiClient } from './api';

export interface Notification {
  id: number;
  notification_type: 'message' | 'offer' | 'approval' | 'rejection';
  title: string;
  message: string;
  listing?: {
    id: number;
    title: string;
  };
  is_read: boolean;
  created_at: string;
}

export const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get('/notifications/');
    return response.data;
  },

  async markAsRead(id: number): Promise<void> {
    await apiClient.post(`/notifications/${id}/mark_read/`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/mark_all_read/');
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get('/notifications/unread_count/');
    return response.data.count;
  },
};


