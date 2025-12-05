import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants/config';

// Helper function to convert image URI to base64
const uriToBase64 = async (uri: string): Promise<string> => {
  try {
    // If already base64, return as-is
    if (uri.startsWith('data:')) {
      return uri;
    }
    
    // For web, convert file:// or blob:// to base64
    if (uri.startsWith('file://') || uri.startsWith('blob:')) {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    
    // For React Native, use expo-file-system or similar
    // For now, return as-is if it's already a URL
    return uri;
  } catch (error) {
    console.warn('Failed to convert image to base64:', error);
    return uri; // Fallback to original URI
  }
};

export const uploadImage = async (uri: string): Promise<string> => {
  // Check if Cloudinary is configured
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    // For development: convert to base64 data URI
    // This can be stored in the database as text
    return await uriToBase64(uri);
  }

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Cloudinary upload failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary upload failed: No URL returned');
  }
  return data.secure_url;
};

export const uploadMultipleImages = async (uris: string[]): Promise<string[]> => {
  const uploadPromises = uris.map(uri => uploadImage(uri));
  return Promise.all(uploadPromises);
};

