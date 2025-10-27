import type { Restaurant, RestaurantFilter, PaginatedResponse, SortOption } from '@/types';
import { allMockRestaurants } from '@/mocks/restaurants';
import { analytics, trackApiCall } from '@/utils/analytics';


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

function filterRestaurants(restaurants: Restaurant[], filters?: RestaurantFilter): Restaurant[] {
  if (!filters) return restaurants;
  return restaurants.filter((restaurant) => {
    if (filters.cuisine?.length && !filters.cuisine.some(c => restaurant.cuisine.includes(c))) return false;
    if (filters.priceRange?.length && !filters.priceRange.includes(restaurant.priceRange)) return false;
    if (filters.minRating && restaurant.rating < filters.minRating) return false;
    if (filters.maxDeliveryTime && restaurant.deliveryTime.max > filters.maxDeliveryTime) return false;
    if (filters.dietaryOptions?.length && !filters.dietaryOptions.some(opt => restaurant.dietaryOptions.includes(opt))) return false;
    if (filters.isOpen !== undefined && restaurant.isOpen !== filters.isOpen) return false;
    return true;
  });
}


function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sortRestaurants(
  restaurants: Restaurant[],
  sortBy: SortOption,
  userLocation?: { latitude: number; longitude: number }
): Restaurant[] {
  const sorted = [...restaurants];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'deliveryTime':
      return sorted.sort((a, b) => a.deliveryTime.min - b.deliveryTime.min);
    case 'price':
      return sorted.sort((a, b) => a.priceRange - b.priceRange);
    case 'distance':
      if (!userLocation) return sorted;
      return sorted.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.location.latitude,
          a.location.longitude
        );
        const distB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.location.latitude,
          b.location.longitude
        );
        return distA - distB;
      });
    default:
      return sorted;
  }
}

function searchRestaurants(restaurants: Restaurant[], query: string): Restaurant[] {
  if (!query.trim()) return restaurants;

  const lowerQuery = query.toLowerCase().trim();
  return restaurants.filter((restaurant) => {
    const nameMatch = restaurant.name.toLowerCase().includes(lowerQuery);
    const cuisineMatch = restaurant.cuisine.some((c) => c.toLowerCase().includes(lowerQuery));
    return nameMatch || cuisineMatch;
  });
}

export async function fetchMockRestaurants(
  params: FetchRestaurantsParams = {}
): Promise<PaginatedResponse<Restaurant>> {
  analytics.startMeasure('fetch_mock_restaurants');
  const t0 = performance.now();

  await new Promise((resolve) => setTimeout(resolve, 300));
  const { filters, sortBy = 'rating', searchQuery, cursor, pageSize = PAGE_SIZE, userLocation } = params;
  let restaurants = [...allMockRestaurants];

  if (searchQuery) restaurants = searchRestaurants(restaurants, searchQuery);
  restaurants = filterRestaurants(restaurants, filters);
  restaurants = sortRestaurants(restaurants, sortBy, userLocation);

  const cursorIndex = cursor ? restaurants.findIndex((r) => r.id === cursor) + 1 : 0;
  const paginatedData = restaurants.slice(cursorIndex, cursorIndex + pageSize);
  const hasMore = cursorIndex + pageSize < restaurants.length;
  const nextCursor = hasMore && paginatedData.length > 0 ? paginatedData[paginatedData.length - 1].id : null;

  const t1 = performance.now();
  analytics.endMeasure('fetch_mock_restaurants', { count: paginatedData.length });
  trackApiCall('mock_fetchRestaurants', t1 - t0, true);

  return {
    data: paginatedData,
    nextCursor,
    hasMore,
  };
}

export async function searchMockRestaurantsByName(searchQuery: string): Promise<Restaurant[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!searchQuery.trim()) return [];

  const restaurants = searchRestaurants(allMockRestaurants, searchQuery);
  return restaurants.slice(0, 10);
}
