import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { listingsService, Listing } from '../services/listings';
import { chatService } from '../services/chat';
import { COLORS } from '../constants/colors';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { formatPrice, formatDate } from '../utils/dateFormatter';
import { ListingCard } from '../components/ListingCard';
import { Ionicons } from '@expo/vector-icons';

export const ListingDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { listingId } = route.params;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);

  useEffect(() => {
    loadListing();
    loadSimilarListings();
  }, [listingId]);

  const loadListing = async () => {
    try {
      const data = await listingsService.getListing(listingId);
      setListing(data);
    } catch (error: any) {
      console.error('Error loading listing:', error);
      
      // Handle 404 - listing not found
      if (error.response?.status === 404) {
        showToast('Listing not found. It may have been deleted.', 'error');
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        showToast('Failed to load listing details', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    if (!listing) return;

    try {
      await listingsService.toggleFavorite(listing.id, listing.is_favorited);
      loadListing();
      showToast(listing.is_favorited ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
      showToast('Failed to update favorite', 'error');
    }
  };

  const handleChat = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    if (!listing || listing.seller.id === user?.id) {
      showToast('Cannot chat with yourself', 'error');
      return;
    }

    try {
      const chatRoom = await chatService.createOrGetChatRoom(listing.id);
      navigation.navigate('ChatRoom', { roomId: chatRoom.id });
    } catch (error) {
      showToast('Failed to start chat', 'error');
    }
  };

  const handleEdit = () => {
    if (!listing) return;
    navigation.navigate('EditListing', { listingId: listing.id });
  };

  const handleDelete = async () => {
    if (!listing) return;
    try {
      await listingsService.deleteListing(listing.id);
      showToast('Listing deleted successfully', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      showToast('Failed to delete listing', 'error');
    }
    setDeleteModal(false);
  };

  const handleShare = async () => {
    if (!listing) return;
    try {
      const shareUrl = `https://clicktosell.app/listing/${listing.id}`;
      const result = await Share.share({
        message: `Check out this listing: ${listing.title}\n${shareUrl}`,
        title: listing.title,
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        showToast('Failed to share listing', 'error');
      }
    }
  };

  const handleReport = async () => {
    if (!listing) return;
    try {
      await listingsService.reportListing(listing.id, 'Inappropriate content');
      showToast('Listing reported successfully. Thank you!', 'success');
      setReportModal(false);
    } catch (error) {
      showToast('Failed to report listing', 'error');
    }
  };

  const loadSimilarListings = async () => {
    try {
      const similar = await listingsService.getSimilarListings(listingId);
      setSimilarListings(similar);
    } catch (error) {
      console.error('Error loading similar listings:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Listing not found</Text>
        <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        {listing.seller.id === user?.id && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModal(true)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {primaryImage?.image ? (
        <Image
          source={{ uri: primaryImage.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>📷 No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{listing.title}</Text>
          <TouchableOpacity onPress={handleFavorite}>
            <Text style={styles.favoriteIcon}>{listing.is_favorited ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.location}>📍 {listing.location}</Text>
          <Text style={styles.date}>📅 {formatDate(listing.created_at)}</Text>
        </View>
        {listing.condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>
              Condition: {listing.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.category}>{listing.category.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller</Text>
          <Text style={styles.seller}>{listing.seller.username}</Text>
        </View>

        {listing.seller.id !== user?.id && (
          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <Text style={styles.chatButtonText}>Chat with Seller</Text>
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          {listing.seller.id !== user?.id && (
            <TouchableOpacity style={styles.actionButton} onPress={() => setReportModal(true)}>
              <Ionicons name="flag-outline" size={20} color="#FF4444" />
              <Text style={[styles.actionButtonText, { color: '#FF4444' }]}>Report</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>Similar Listings</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarListings.map((similar) => (
                <View key={similar.id} style={styles.similarCard}>
                  <ListingCard
                    listing={similar}
                    onPress={() => {
                      navigation.replace('ListingDetail', { listingId: similar.id });
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      <Modal
        visible={deleteModal}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />

      <Modal
        visible={reportModal}
        title="Report Listing"
        message="Are you sure you want to report this listing? Our team will review it."
        confirmText="Report"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleReport}
        onCancel={() => setReportModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.PRIMARY,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.DARK_GRAY,
    flex: 1,
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  date: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  conditionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 24,
  },
  conditionText: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    lineHeight: 24,
  },
  category: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  seller: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  chatButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  similarSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  similarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.DARK_GRAY,
    marginBottom: 16,
  },
  similarCard: {
    width: 280,
    marginRight: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.DARK_GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

