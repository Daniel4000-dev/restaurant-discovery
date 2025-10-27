import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryConstraint,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Restaurant, RestaurantFilter, PaginatedResponse, SortOption } from '@/types';

const RESTAURANTS_COLLECTION = 'restaurants';
const PAGE_SIZE = 20;

export interface FetchRestaurantsParams {
  filters?: RestaurantFilter;
  sortBy?: SortOption;
  searchQuery?: string;
  cursor?: string;
  pageSize?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  }; 
}

export async function fetchRestaurants(
  params: FetchRestaurantsParams = {}
): Promise<PaginatedResponse<Restaurant>> {
  try {
    const {
      filters,
      sortBy = 'rating',
      searchQuery,
      cursor,
      pageSize = PAGE_SIZE,
      // Note: userLocation used client-side for distance sort
    } = params;

    const constraints: QueryConstraint[] = [];

    if (filters?.cuisine && filters.cuisine.length > 0) {
      constraints.push(where('cuisine', 'array-contains-any', filters.cuisine.slice(0, 10)));
    }

    if (filters?.priceRange && filters.priceRange.length > 0) {
      constraints.push(where('priceRange', 'in', filters.priceRange));
    }

    if (filters?.minRating) {
      constraints.push(where('rating', '>=', filters.minRating));
    }

    if (filters?.isOpen !== undefined) {
      constraints.push(where('isOpen', '==', filters.isOpen));
    }

    // Add orderBy only if not 'distance' (client-side)
    if (sortBy !== 'distance') {
      switch (sortBy) {
        case 'rating':
          constraints.push(orderBy('rating', 'desc'));
          break;
        case 'deliveryTime':
          constraints.push(orderBy('deliveryTime.min', 'asc'));
          break;
        case 'price':
          constraints.push(orderBy('priceRange', 'asc'));
          break;
      }
    }

    constraints.push(limit(pageSize));

    if (cursor) {
      const cursorDoc = await getCursorDocument(cursor);
      if (cursorDoc) {
        constraints.push(startAfter(cursorDoc));
      }
    }

    const q = query(collection(db, RESTAURANTS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    let restaurants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];

    if (searchQuery) {
      restaurants = filterBySearchQuery(restaurants, searchQuery);
    }

    if (filters?.dietaryOptions && filters.dietaryOptions.length > 0) {
      restaurants = restaurants.filter((restaurant) =>
        filters.dietaryOptions!.some((option) =>
          restaurant.dietaryOptions.includes(option)
        )
      );
    }

    if (filters?.maxDeliveryTime) {
      restaurants = restaurants.filter(
        (restaurant) => restaurant.deliveryTime.max <= filters.maxDeliveryTime!
      );
    }

    // Note: Distance sort applied client-side in hook

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;
    const hasMore = snapshot.docs.length === pageSize;

    return {
      data: restaurants,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error('Failed to fetch restaurants. Please try again.');
  }
}

async function getCursorDocument(
  cursor: string
): Promise<DocumentSnapshot | null> {
  try {
    const docRef = collection(db, RESTAURANTS_COLLECTION);
    const q = query(docRef, where('__name__', '==', cursor));
    const snapshot = await getDocs(q);
    return snapshot.docs[0] || null;
  } catch (error) {
    console.error('Error getting cursor document:', error);
    return null;
  }
}

function filterBySearchQuery(
  restaurants: Restaurant[],
  searchQuery: string
): Restaurant[] {
  const lowerQuery = searchQuery.toLowerCase().trim();
  if (!lowerQuery) return restaurants;

  return restaurants.filter((restaurant) => {
    const nameMatch = restaurant.name.toLowerCase().includes(lowerQuery);
    const cuisineMatch = restaurant.cuisine.some((c) =>
      c.toLowerCase().includes(lowerQuery)
    );
    return nameMatch || cuisineMatch;
  });
}

export async function searchRestaurantsByName(
  searchQuery: string
): Promise<Restaurant[]> {
  if (!searchQuery.trim()) return [];

  try {
    const q = query(collection(db, RESTAURANTS_COLLECTION), limit(50));
    const snapshot = await getDocs(q);

    const restaurants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];

    return filterBySearchQuery(restaurants, searchQuery).slice(0, 10);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('Search failed. Please try again.');
  }
}