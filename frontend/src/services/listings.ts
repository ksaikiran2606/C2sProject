import { apiClient } from './api';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ListingImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  category: Category;
  location: string;
  seller: {
    id: number;
    username: string;
    email: string;
  };
  status: string;
  condition?: string;
  is_featured?: boolean;
  images: ListingImage[];
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingCreateData {
  title: string;
  description: string;
  price: string;
  category_id: number;
  location: string;
  images: string[];
}

export const listingsService = {
  async getListings(params?: {
    search?: string;
    category?: number;
    location?: string;
    ordering?: string;
    condition?: string;
    is_featured?: boolean;
    price__gte?: number;
    price__lte?: number;
    page?: number;
  }): Promise<{ results: Listing[]; count: number; next: string | null; previous: string | null }> {
    const response = await apiClient.get('/listings/', { params });
    return response.data;
  },

  async getListing(id: number): Promise<Listing> {
    const response = await apiClient.get(`/listings/${id}/`);
    return response.data;
  },

  async createListing(data: ListingCreateData): Promise<Listing> {
    const response = await apiClient.post('/listings/', data);
    return response.data;
  },

  async updateListing(id: number, data: Partial<ListingCreateData>): Promise<Listing> {
    const response = await apiClient.put(`/listings/${id}/`, data);
    return response.data;
  },

  async deleteListing(id: number): Promise<void> {
    await apiClient.delete(`/listings/${id}/`);
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/listings/categories/');
    return response.data;
  },

  async toggleFavorite(listingId: number, isFavorited: boolean): Promise<void> {
    if (isFavorited) {
      await apiClient.delete(`/listings/${listingId}/favorite/`);
    } else {
      await apiClient.post(`/listings/${listingId}/favorite/`);
    }
  },

  async getFavorites(): Promise<Listing[]> {
    const response = await apiClient.get('/listings/favorites/');
    return response.data.map((fav: any) => fav.listing);
  },

  async getMyListings(): Promise<Listing[]> {
    const response = await apiClient.get('/listings/my_listings/');
    return response.data;
  },

  async getSimilarListings(listingId: number): Promise<Listing[]> {
    const response = await apiClient.get(`/listings/${listingId}/similar/`);
    return response.data;
  },

  async reportListing(listingId: number, reason: string): Promise<void> {
    await apiClient.post(`/listings/${listingId}/report/`, { reason });
  },
};

