import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        // Don't add auth header for public endpoints (listings and categories GET requests)
        const isPublicEndpoint = 
          (config.method === 'get' && 
           (config.url?.includes('/listings/') || config.url?.includes('/listings/categories/')));
        
        if (!isPublicEndpoint) {
          const token = await AsyncStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            // Log warning if no token for protected endpoint
            console.warn(`No access token found for protected endpoint: ${config.method?.toUpperCase()} ${config.url}`);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Check if this is a public endpoint that shouldn't require auth
        const isPublicEndpoint = 
          (originalRequest.method === 'get' && 
           (originalRequest.url?.includes('/listings/') || originalRequest.url?.includes('/listings/categories/')));

        // For public endpoints with 401, clear invalid token and retry without auth
        if (error.response?.status === 401 && isPublicEndpoint && !originalRequest._retry) {
          originalRequest._retry = true;
          // Remove auth header and retry
          delete originalRequest.headers.Authorization;
          return this.client(originalRequest);
        }

        // For protected endpoints, try token refresh
        if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (refreshToken) {
              // Try to refresh the token
              const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                refresh: refreshToken,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              const { access } = response.data;
              if (access) {
                await AsyncStorage.setItem('access_token', access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return this.client(originalRequest);
              }
            }
          } catch (refreshError: any) {
            // Token refresh failed - clear all auth data
            console.warn('Token refresh failed, clearing auth data:', refreshError.message);
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
            // Return the original error with a clear message
            const authError = new Error('Authentication required. Please login again.');
            (authError as any).response = error.response;
            (authError as any).isAuthError = true;
            return Promise.reject(authError);
          }
          
          // No refresh token available
          await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
          const authError = new Error('Authentication required. Please login.');
          (authError as any).response = error.response;
          (authError as any).isAuthError = true;
          return Promise.reject(authError);
        }

        return Promise.reject(error);
      }
    );
  }

  async get(endpoint: string, config = {}) {
    return this.client.get(endpoint, config);
  }

  async post(endpoint: string, data = {}, config = {}) {
    return this.client.post(endpoint, data, config);
  }

  async put(endpoint: string, data = {}, config = {}) {
    return this.client.put(endpoint, data, config);
  }

  async patch(endpoint: string, data = {}, config = {}) {
    return this.client.patch(endpoint, data, config);
  }

  async delete(endpoint: string, config = {}) {
    return this.client.delete(endpoint, config);
  }
}

export const apiClient = new ApiClient();

