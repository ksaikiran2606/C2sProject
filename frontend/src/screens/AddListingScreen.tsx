import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { listingsService, Category } from '../services/listings';
import { uploadMultipleImages } from '../services/cloudinary';
import { COLORS } from '../constants/colors';
import { Toast } from '../components/Toast';

export const AddListingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  React.useEffect(() => {
    const checkAuth = async () => {
      // Double check authentication status
      if (!isAuthenticated) {
        navigation.navigate('Login');
        return;
      }
      loadCategories();
    };
    checkAuth();
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const data = await listingsService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Check authentication before submitting
    if (!isAuthenticated) {
      showToast('You must be logged in to create a listing', 'error');
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 2000);
      return;
    }

    // Detailed validation with specific error messages
    if (!title || !title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (!description || !description.trim()) {
      showToast('Please enter a description', 'error');
      return;
    }
    if (!price || !price.trim()) {
      showToast('Please enter a price', 'error');
      return;
    }
    if (!categoryId) {
      showToast('Please select a category', 'error');
      return;
    }
    if (!location || !location.trim()) {
      showToast('Please enter a location', 'error');
      return;
    }

    if (images.length === 0) {
      showToast('Please add at least one image', 'error');
      return;
    }

    setLoading(true);

    try {
      // Upload images (with fallback if Cloudinary not configured)
      let uploadedImages: string[] = [];
      try {
        uploadedImages = await uploadMultipleImages(images);
      } catch (uploadError: any) {
        // Silently fallback to local URIs for development
        uploadedImages = images;
      }

      // Ensure price is a valid number
      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        showToast('Please enter a valid price (must be a positive number)', 'error');
        setLoading(false);
        return;
      }

      // Double-check categoryId before sending
      if (!categoryId) {
        showToast('Please select a category before submitting', 'error');
        setLoading(false);
        return;
      }

      console.log('Submitting listing with data:', {
        title: title.trim(),
        description: description.trim(),
        price: priceNumber.toString(),
        category_id: categoryId,
        location: location.trim(),
        images_count: uploadedImages.length,
      });

      const response = await listingsService.createListing({
        title: title.trim(),
        description: description.trim(),
        price: priceNumber.toString(), // Convert to string for API
        category_id: categoryId, // Ensure this is a number
        location: location.trim(),
        images: uploadedImages,
      });

      // Show success message
      showToast('Listing created successfully!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Create listing error:', error);
      console.error('Error details:', error.response?.data);
      
      // Handle 401 Unauthorized - user needs to login
      if (error.response?.status === 401 || (error as any).isAuthError) {
        showToast('Your session has expired. Please login again.', 'error');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 2000);
        return;
      }
      
      // Show detailed error message
      const errorData = error.response?.data;
      let errorMessage = 'Failed to create listing';
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          // Handle field-specific validation errors - show first error
          const firstKey = Object.keys(errorData)[0];
          const firstError = errorData[firstKey];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = `${firstKey}: ${firstError[0]}`;
          } else if (typeof firstError === 'string') {
            errorMessage = `${firstKey}: ${firstError}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Listing</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Input
          label="Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter listing title"
        />

        <Input
          label="Description *"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
        />

        <Input
          label="Price *"
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Category *</Text>
          {!categoryId && (
            <Text style={styles.categoryWarning}>Please select a category</Text>
          )}
          {loadingCategories ? (
            <Text style={styles.loadingText}>Loading categories...</Text>
          ) : categories && categories.length > 0 ? (
            categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryOption,
                categoryId === cat.id && styles.categoryOptionSelected,
              ]}
              onPress={() => {
                console.log('Category selected:', cat.id, cat.name);
                setCategoryId(cat.id);
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  categoryId === cat.id && styles.categoryTextSelected,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.errorText}>No categories available</Text>
          )}
        </View>

        <Input
          label="Location *"
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>Images *</Text>
          <Button title="Pick Images" onPress={pickImages} variant="secondary" />
          <View style={styles.imageList}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <Button title="Create Listing" onPress={handleSubmit} loading={loading} />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 24,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 8,
  },
  categoryOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '20',
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
  },
  categoryTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: 24,
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  imageItem: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.GRAY,
    fontStyle: 'italic',
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF0000',
    padding: 12,
  },
  categoryWarning: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.PRIMARY,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
});

