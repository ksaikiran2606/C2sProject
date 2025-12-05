import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Listing } from '../services/listings';
import { COLORS } from '../constants/colors';
import { formatPrice, formatDate } from '../utils/dateFormatter';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  onFavoritePress?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress, onFavoritePress }) => {
  const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0];
  
  // Handle image URI - base64 data URIs work everywhere
  const getImageUri = () => {
    if (primaryImage?.image) {
      const imageUri = primaryImage.image;
      // Base64 data URIs work in both web and native
      if (imageUri.startsWith('data:')) {
        return imageUri;
      }
      // Regular URLs work too
      if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        return imageUri;
      }
      // Cloudinary URLs
      if (imageUri.includes('cloudinary.com')) {
        return imageUri;
      }
      // Local file URIs don't work in web
      if (Platform.OS === 'web' && imageUri.startsWith('file://')) {
        return null;
      }
      // Try to use it anyway
      return imageUri;
    }
    return null; // Return null to show default background color
  };

  const imageUri = getImageUri();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
          onError={(error) => {
            console.warn('Image load error:', error);
          }}
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>
          {listing.is_featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>⭐ Featured</Text>
            </View>
          )}
        </View>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.location}>📍 {listing.location}</Text>
          <Text style={styles.date}>{formatDate(listing.created_at)}</Text>
        </View>
        {listing.condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>
              {listing.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
        )}
      </View>
      {onFavoritePress && (
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
          <Text style={styles.favoriteIcon}>{listing.is_favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.GRAY,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  featuredBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.GRAY,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  conditionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  conditionText: {
    fontSize: 12,
    color: COLORS.DARK_GRAY,
    fontWeight: '500',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 20,
  },
});

