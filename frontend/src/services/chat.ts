import { apiClient } from './api';

export interface Message {
  id: number;
  sender: {
    id: number;
    username: string;
  };
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatRoom {
  id: number;
  listing: {
    id: number;
    title: string;
    price: string;
    images: Array<{ image: string }>;
  };
  buyer: {
    id: number;
    username: string;
  };
  seller: {
    id: number;
    username: string;
  };
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatRoomDetail extends ChatRoom {
  messages: Message[];
}

export const chatService = {
  async getChatRooms(): Promise<ChatRoom[]> {
    const response = await apiClient.get('/chat/rooms/');
    return response.data;
  },

  async getChatRoom(id: number): Promise<ChatRoomDetail> {
    const response = await apiClient.get(`/chat/rooms/${id}/`);
    return response.data;
  },

  async createOrGetChatRoom(listingId: number): Promise<ChatRoomDetail> {
    const response = await apiClient.post('/chat/rooms/create_or_get/', {
      listing_id: listingId,
    });
    return response.data;
  },

  async sendMessage(roomId: number, content: string): Promise<Message> {
    const response = await apiClient.post(`/chat/rooms/${roomId}/send_message/`, {
      content,
    });
    return response.data;
  },

  async markAsRead(roomId: number): Promise<void> {
    await apiClient.post(`/chat/rooms/${roomId}/mark_read/`);
  },
};


