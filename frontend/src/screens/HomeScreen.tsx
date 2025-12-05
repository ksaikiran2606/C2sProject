import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { listingsService, Listing } from '../services/listings';
import { ListingCard } from '../components/ListingCard';
import { COLORS } from '../constants/colors';
import { SortFilterModal, SortOption, ConditionFilter } from '../components/SortFilterModal';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilterVisible, setSortFilterVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [currentCondition, setCurrentCondition] = useState<ConditionFilter>('all');
  const { isAuthenticated } = useAuth();

  const getOrderingParam = (sort: SortOption): string => {
    switch (sort) {
      case 'newest':
        return '-created_at';
      case 'oldest':
        return 'created_at';
      case 'price_low':
        return 'price';
      case 'price_high':
        return '-price';
      default:
        return '-created_at';
    }
  };

  const loadListings = useCallback(async () => {
    try {
      const params: any = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      params.ordering = getOrderingParam(currentSort);
      if (currentCondition !== 'all') {
        params.condition = currentCondition;
      }
      const response = await listingsService.getListings(params);
      setListings(response.results);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, currentSort, currentCondition]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // Refresh listings when screen comes into focus (e.g., after creating a listing)
  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [loadListings])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadListings();
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
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search listings..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.GRAY}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setSortFilterVisible(true)}
            >
              <Ionicons name="options-outline" size={24} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <SortFilterModal
        visible={sortFilterVisible}
        onClose={() => setSortFilterVisible(false)}
        onApply={(sort, condition) => {
          setCurrentSort(sort);
          setCurrentCondition(condition);
        }}
        currentSort={currentSort}
        currentCondition={currentCondition}
      />

      <FlatList
        data={listings}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => handleListingPress(item)}
            onFavoritePress={() => handleFavoritePress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.PRIMARY} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings found</Text>
            </View>
          ) : null
        }
      />
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
    marginBottom: 16,
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
  searchContainer: {
    marginTop: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  filterButton: {
    padding: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
});

