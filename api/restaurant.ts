import type {
  Restaurant,
  RestaurantFilter,
  PaginatedResponse,
  SortOption,
} from '@/types';
import * as mockApi from './mock-restaurants';
import * as firebaseApi from './firebase-restaurants';

const API_MODE =
  (process.env.EXPO_PUBLIC_API_MODE as 'mock' | 'firebase') ?? 'mock';

const isMock = API_MODE === 'mock';

export const fetchRestaurants = isMock
  ? mockApi.fetchMockRestaurants
  : firebaseApi.fetchRestaurants;

export const searchRestaurantsByName = isMock
  ? mockApi.searchMockRestaurantsByName
  : firebaseApi.searchRestaurantsByName;

export type {
  Restaurant,
  RestaurantFilter,
  PaginatedResponse,
  SortOption,
};

export type { FetchRestaurantsParams } from './mock-restaurants';
