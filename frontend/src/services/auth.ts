import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  profile_picture?: string;
  location?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export const authService = {
  async register(username: string, email: string, password: string, phone_number?: string, location?: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register/', {
      username,
      email,
      password,
      password2: password,
      phone_number,
      location,
    });
    const data = response.data;
    await AsyncStorage.setItem('access_token', data.access);
    await AsyncStorage.setItem('refresh_token', data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login/', {
      username,
      password,
    });
    const data = response.data;
    await AsyncStorage.setItem('access_token', data.access);
    await AsyncStorage.setItem('refresh_token', data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await apiClient.post('/auth/logout/', { refresh: refreshToken });
        } catch (error) {
          // Ignore logout API errors - we'll clear storage anyway
          console.warn('Logout API call failed, clearing local storage:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear storage, even if API call fails
      try {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
        // Fallback: clear browser localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('access_token');
          window.localStorage.removeItem('refresh_token');
          window.localStorage.removeItem('user');
        }
      }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  },
};

