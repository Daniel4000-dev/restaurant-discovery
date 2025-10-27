import { useCallback, useMemo, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchRestaurants, type FetchRestaurantsParams } from '@/api/restaurant';
import { useGeolocation } from './useGeolocation';
import { getPerformanceReport, trackApiCall, trackUserAction } from '@/utils/analytics';
import type { Restaurant, SortOption } from '@/types';

export interface UseInfiniteRestaurantsParams {
  filters?: FetchRestaurantsParams['filters'];
  sortBy?: FetchRestaurantsParams['sortBy'];
  searchQuery?: string;
  userLocation?: { latitude: number; longitude: number } | null;
  enabled?: boolean;
}

export interface UseInfiniteRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function sortRestaurantsClientSide(
  restaurants: Restaurant[],
  sortBy: SortOption,
  userLocation?: { latitude: number; longitude: number } | null
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

export function useInfiniteRestaurants(
  params: UseInfiniteRestaurantsParams = {}
): UseInfiniteRestaurantsReturn {
  const { filters, sortBy, searchQuery, userLocation, enabled = true } = params;
  const { calculateDistance: geoCalc } = useGeolocation(); // Reuse if needed

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['restaurants', { filters, sortBy, searchQuery, userLocation }],
    queryFn: async ({ pageParam }) => {
      const startTime = Date.now();
      try {
        const result = await fetchRestaurants({
          filters,
          sortBy,
          searchQuery,
          cursor: pageParam,
          userLocation: userLocation || undefined,
        });
        const duration = Date.now() - startTime;
        trackApiCall('fetchRestaurants', duration, true);
        return result;
      } catch (err) {
        const duration = Date.now() - startTime;
        trackApiCall('fetchRestaurants', duration, false);
        throw err;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    networkMode: 'offlineFirst', // Bonus: Better offline
  });

  // Client-side sort for distance (applied per page)
  const sortedPages = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.map((page) => ({
      ...page,
      data: sortRestaurantsClientSide(page.data, sortBy!, userLocation),
    }));
  }, [data?.pages, sortBy, userLocation]);

  const restaurants = useMemo(() => {
    if (!sortedPages) return [];
    return sortedPages.flatMap((page) => page.data);
  }, [sortedPages]);

  const loadMore = useCallback(() => {
    trackUserAction('loadMore');
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refresh = useCallback(async () => {
    trackUserAction('refresh');
    await refetch();
  }, [refetch]);

  // Perf: Track total fetch time on unmount or change
  useEffect(() => {
    return () => {
      // Optional: Log report here or expose
      console.log('Infinite Query Perf Report:', getPerformanceReport());
    };
  }, []);

  return {
    restaurants,
    isLoading,
    isError,
    error: error as Error | null,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    loadMore,
    refresh,
  };
}