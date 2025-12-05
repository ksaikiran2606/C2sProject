import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || process.env.API_BASE_URL || 'http://localhost:8000/api';
export const WS_BASE_URL = Constants.expoConfig?.extra?.wsBaseUrl || process.env.WS_BASE_URL || 'ws://localhost:8000';
export const CLOUDINARY_CLOUD_NAME = Constants.expoConfig?.extra?.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_UPLOAD_PRESET = Constants.expoConfig?.extra?.cloudinaryUploadPreset || process.env.CLOUDINARY_UPLOAD_PRESET || '';

