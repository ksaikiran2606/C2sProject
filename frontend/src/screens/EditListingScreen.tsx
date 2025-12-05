import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { listingsService, Category, Listing } from '../services/listings';
import { uploadMultipleImages } from '../services/cloudinary';
import { COLORS } from '../constants/colors';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';

export const EditListingScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { listingId } = route.params;
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingListing, setLoadingListing] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    loadListing();
    loadCategories();
  }, [listingId]);

  const loadListing = async () => {
    try {
      const data = await listingsService.getListing(listingId);
      setListing(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setCategoryId(data.category.id);
      setLocation(data.location);
      setImages(data.images.map(img => img.image));
    } catch (error: any) {
      console.error('Error loading listing:', error);
      
      // Handle 404 - listing not found
      if (error.response?.status === 404) {
        showToast('Listing not found. It may have been deleted.', 'error');
      } else {
        showToast('Failed to load listing', 'error');
      }
      
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } finally {
      setLoadingListing(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await listingsService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Please enter a description', 'error');
      return;
    }
    if (!price.trim()) {
      showToast('Please enter a price', 'error');
      return;
    }
    if (!categoryId) {
      showToast('Please select a category', 'error');
      return;
    }
    if (!location.trim()) {
      showToast('Please enter a location', 'error');
      return;
    }
    if (images.length === 0) {
      showToast('Please add at least one image', 'error');
      return;
    }

    setLoading(true);

    try {
      let uploadedImages: string[] = [];
      try {
        uploadedImages = await uploadMultipleImages(images);
      } catch (uploadError: any) {
        uploadedImages = images;
      }

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        showToast('Please enter a valid price', 'error');
        setLoading(false);
        return;
      }

      const response = await listingsService.updateListing(listingId, {
        title: title.trim(),
        description: description.trim(),
        price: priceNumber.toString(),
        category_id: categoryId,
        location: location.trim(),
        images_data: uploadedImages, // Use images_data for update
      });

      // Show success toast
      showToast('Listing updated successfully!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Update listing error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Request data sent:', {
        title: title.trim(),
        description: description.trim(),
        price: priceNumber.toString(),
        category_id: categoryId,
        location: location.trim(),
        images_data: uploadedImages?.length || 0,
      });
      
      // Check if it's actually a success (sometimes backend returns error but updates)
      // If status is 200-299, treat as success
      if (error.response?.status >= 200 && error.response?.status < 300) {
        showToast('Listing updated successfully!', 'success');
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
        return;
      }
      
      // Extract detailed error message
      let errorMessage = 'Failed to update listing';
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for detailed error response
        if (errorData.errors) {
          // New format with detailed errors
          const errorKeys = Object.keys(errorData.errors);
          if (errorKeys.length > 0) {
            const firstKey = errorKeys[0];
            const firstError = errorData.errors[firstKey];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = `${firstKey}: ${firstError[0]}`;
            } else if (typeof firstError === 'string') {
              errorMessage = `${firstKey}: ${firstError}`;
            }
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          // Get first error from validation errors
          const firstKey = Object.keys(errorData)[0];
          if (firstKey) {
            const firstError = errorData[firstKey];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = `${firstKey}: ${firstError[0]}`;
            } else if (typeof firstError === 'string') {
              errorMessage = `${firstKey}: ${firstError}`;
            }
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

  if (loadingListing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Listing</Text>
      </View>

      <View style={styles.content}>
        <Input
          label="Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
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
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryOption,
                categoryId === cat.id && styles.categoryOptionSelected,
              ]}
              onPress={() => setCategoryId(cat.id)}
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
          ))}
        </View>

        <Input
          label="Location *"
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>Images *</Text>
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImages}>
            <Text style={styles.pickImageButtonText}>Pick Images</Text>
          </TouchableOpacity>
          <View style={styles.imageList}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
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

        <Button title="Update Listing" onPress={handleSubmit} loading={loading} />
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.PRIMARY,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  content: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 8,
  },
  categoryOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
  },
  categoryTextSelected: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: 16,
  },
  pickImageButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  pickImageButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  imageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
});

