/**
 * Standardized CRUD Helper Functions
 * Use these across all screens for consistent CRUD operations
 */

export interface CrudState<T> {
  data: T | T[] | null;
  loading: boolean;
  error: string | null;
  refreshing?: boolean;
}

export interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

/**
 * Standard toast state initializer
 */
export const createToastState = (): ToastState => ({
  visible: false,
  message: '',
  type: 'info',
});

/**
 * Standard showToast function
 */
export const createShowToast = (
  setToast: React.Dispatch<React.SetStateAction<ToastState>>
) => {
  return (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };
};

/**
 * Standard error handler for API calls
 */
export const handleApiError = (error: any): string => {
  if (error.response?.data) {
    const errorData = error.response.data;
    
    // Handle detailed error response
    if (errorData.errors) {
      const firstKey = Object.keys(errorData.errors)[0];
      const firstError = errorData.errors[firstKey];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return `${firstKey}: ${firstError[0]}`;
      }
      if (typeof firstError === 'string') {
        return `${firstKey}: ${firstError}`;
      }
    }
    
    // Handle message field
    if (errorData.message) {
      return errorData.message;
    }
    
    // Handle detail field
    if (errorData.detail) {
      return errorData.detail;
    }
    
    // Handle string response
    if (typeof errorData === 'string') {
      return errorData;
    }
    
    // Handle error field
    if (errorData.error) {
      return errorData.error;
    }
    
    // Handle field-specific errors
    const firstKey = Object.keys(errorData)[0];
    if (firstKey) {
      const firstError = errorData[firstKey];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return `${firstKey}: ${firstError[0]}`;
      }
      if (typeof firstError === 'string') {
        return `${firstKey}: ${firstError}`;
      }
    }
  }
  
  // Fallback to error message
  return error.message || 'An unexpected error occurred';
};

/**
 * Standard validation helper
 */
export const validateRequired = (
  fields: { [key: string]: any },
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
): boolean => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      showToast(`Please enter ${key.replace(/_/g, ' ')}`, 'error');
      return false;
    }
  }
  return true;
};


