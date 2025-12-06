import Constants from 'expo-constants';

// Get from app.json extra, .env (EXPO_PUBLIC_*), or fallback
export const API_BASE_URL = 
  Constants.expoConfig?.extra?.apiBaseUrl || 
  process.env.EXPO_PUBLIC_API_BASE_URL || 
  process.env.API_BASE_URL || 
  'http://localhost:8000/api';

export const WS_BASE_URL = 
  Constants.expoConfig?.extra?.wsBaseUrl || 
  process.env.EXPO_PUBLIC_WS_BASE_URL || 
  process.env.WS_BASE_URL || 
  'ws://localhost:8000';

export const CLOUDINARY_CLOUD_NAME = 
  Constants.expoConfig?.extra?.cloudinaryCloudName || 
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 
  process.env.CLOUDINARY_CLOUD_NAME || 
  '';

export const CLOUDINARY_UPLOAD_PRESET = 
  Constants.expoConfig?.extra?.cloudinaryUploadPreset || 
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
  process.env.CLOUDINARY_UPLOAD_PRESET || 
  '';

