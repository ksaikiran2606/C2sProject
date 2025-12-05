import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { listingsService, Category, Listing } from '../services/listings';
import { ListingCard } from '../components/ListingCard';
import { COLORS } from '../constants/colors';
import { ImageCarousel } from '../components/ImageCarousel';
import { ReviewCard } from '../components/ReviewCard';
import { Footer } from '../components/Footer';

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  'Electronics': '📱',
  'Mobile Phones': '📱',
  'Laptops & Computers': '💻',
  'Appliances': '🔌',
  'Furniture': '🪑',
  'Vehicles': '🚗',
  'Clothing': '👕',
  'Books': '📚',
  'Sports & Outdoors': '⚽',
  'Home & Garden': '🏡',
  'Toys & Games': '🎮',
  'Other': '📦',
};

export const LandingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      userName: 'Rajesh Kumar',
      rating: 5,
      comment: 'Great experience! Bought a laptop and it was exactly as described. Seller was very responsive.',
      date: '2 days ago',
      product: 'MacBook Pro',
    },
    {
      id: 2,
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'Found my dream bike here! The process was smooth and the seller was honest about the condition.',
      date: '1 week ago',
      product: 'Royal Enfield',
    },
    {
      id: 3,
      userName: 'Amit Patel',
      rating: 4,
      comment: 'Good marketplace. Easy to list items and get responses quickly. Highly recommend!',
      date: '3 days ago',
      product: 'iPhone 12',
    },
    {
      id: 4,
      userName: 'Sneha Reddy',
      rating: 5,
      comment: 'Sold my furniture within 2 days! The app is user-friendly and the buyers are genuine.',
      date: '5 days ago',
      product: 'Sofa Set',
    },
  ];

  // Featured product images for carousel
  const featuredImages = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  ];

  useEffect(() => {
    loadCategories();
    loadListings();
  }, []);

  useEffect(() => {
    loadListings();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await listingsService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      const response = await listingsService.getListings(params);
      setListings(response.results);
      
      // Load featured listings
      try {
        const featuredParams: any = { is_featured: true };
        const featuredResponse = await listingsService.getListings(featuredParams);
        setFeaturedListings(featuredResponse.results.slice(0, 6));
      } catch (error) {
        console.error('Error loading featured listings:', error);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleListingPress = (listing: Listing) => {
    navigation.navigate('ListingDetail', { listingId: listing.id });
  };

  const handleFavoritePress = async (listing: Listing) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    try {
      await listingsService.toggleFavorite(listing.id, listing.is_favorited);
      loadListings();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image 
            source={require('../../assets/logo.jpg')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddListing')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Carousel */}
        <View style={styles.heroSection}>
          <ImageCarousel images={featuredImages} height={250} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Buy & Sell Anything</Text>
            <Text style={styles.heroSubtitle}>Your trusted marketplace</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('AddListing')}
            >
              <Text style={styles.ctaButtonText}>Start Selling</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* What Products Should Sell Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Can Sell</Text>
          <View style={styles.productGrid}>
            <View style={styles.productItem}>
              <Text style={styles.productIcon}>🚗</Text>
              <Text style={styles.productName}>Vehicles</Text>
              <Text style={styles.productDesc}>Cars, Bikes, Scooters</Text>
            </View>
            <View style={styles.productItem}>
              <Text style={styles.productIcon}>📱</Text>
              <Text style={styles.productName}>Electronics</Text>
              <Text style={styles.productDesc}>Phones, Laptops, TVs</Text>
            </View>
            <View style={styles.productItem}>
              <Text style={styles.productIcon}>🪑</Text>
              <Text style={styles.productName}>Furniture</Text>
              <Text style={styles.productDesc}>Sofas, Tables, Beds</Text>
            </View>
            <View style={styles.productItem}>
              <Text style={styles.productIcon}>👕</Text>
              <Text style={styles.productName}>Fashion</Text>
              <Text style={styles.productDesc}>Clothes, Shoes, Bags</Text>
            </View>
            <View style={styles.productItem}>
              <Text style={styles.productIcon}>🏠</Text>
              <Text style={styles.productName}>Home & Garden</Text>
              <Text style={styles.productDesc}>Appliances, Tools</Text>
            </View>
            <View style={styles.productItem}>
              <Text style={styles.productIcon}>🎮</Text>
              <Text style={styles.productName}>Games & Hobbies</Text>
              <Text style={styles.productDesc}>Toys, Sports, Books</Text>
            </View>
          </View>
        </View>

        {/* Featured Listings Carousel */}
        {featuredListings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Featured Listings</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
              {featuredListings.map((listing) => (
                <View key={listing.id} style={styles.featuredCard}>
                  <ListingCard
                    listing={listing}
                    onPress={() => handleListingPress(listing)}
                    onFavoritePress={() => handleFavoritePress(listing)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilter}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const icon = categoryIcons[category.name] || '📦';
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <Text style={styles.categoryIcon}>{icon}</Text>
                  <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Listings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Products`
              : 'All Products'}
          </Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : listings.length > 0 ? (
            <View style={styles.listingsGrid}>
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onPress={() => handleListingPress(listing)}
                  onFavoritePress={() => handleFavoritePress(listing)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings found</Text>
            </View>
          )}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Our Users Say</Text>
          <View style={styles.reviewsContainer}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </View>

        {/* Footer */}
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    marginBottom: 24,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.WHITE,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.DARK_GRAY,
    marginBottom: 16,
  },
  clearFilter: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productItem: {
    width: '48%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    marginBottom: 12,
  },
  productIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  featuredScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 280,
    marginRight: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: '#F0FDF4',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: COLORS.PRIMARY,
  },
  listingsGrid: {
    gap: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.GRAY,
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  reviewsContainer: {
    marginTop: 8,
  },
});
