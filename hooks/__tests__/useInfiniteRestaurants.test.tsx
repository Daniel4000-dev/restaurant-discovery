import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInfiniteRestaurants } from '../useInfiniteRestaurants';
import * as mockRestaurantsApi from '@/api/mock-restaurants';
import type { Restaurant } from '@/types';
import type { UseInfiniteRestaurantsParams } from '../useInfiniteRestaurants';

const mockRestaurant1: Restaurant = {
  id: 'test-1',
  name: 'Test Restaurant 1',
  image: 'https://example.com/image1.jpg',
  cuisine: ['Nigerian'],
  deliveryTime: { min: 20, max: 30 },
  rating: 4.5,
  priceRange: 2,
  dietaryOptions: ['Halal'],
  isOpen: true,
  location: { latitude: 6.5244, longitude: 3.3792 },
};

const mockRestaurant2: Restaurant = {
  id: 'test-2',
  name: 'Test Restaurant 2',
  image: 'https://example.com/image2.jpg',
  cuisine: ['Continental'],
  deliveryTime: { min: 30, max: 45 },
  rating: 4.2,
  priceRange: 3,
  dietaryOptions: ['Vegetarian'],
  isOpen: true,
  location: { latitude: 6.5344, longitude: 3.3892 },
};

const mockResponse = {
  data: [mockRestaurant1, mockRestaurant2],
  nextCursor: 'cursor-1',
  hasMore: true,
};

const mockResponseNoMore = {
  data: [mockRestaurant1],
  nextCursor: undefined,
  hasMore: false,
};

jest.mock('@/src/api/mock-restaurants', () => ({
  fetchMockRestaurants: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useInfiniteRestaurants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('should initialize with empty restaurants array', () => {
    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    expect(result.current.restaurants).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch restaurants on mount', async () => {
    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(2);
    });

    expect(result.current.restaurants).toEqual([mockRestaurant1, mockRestaurant2]);
    expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith({
      filters: undefined,
      sortBy: undefined,
      searchQuery: undefined,
      cursor: undefined,
      userLocation: undefined,
    });
  });

  it('should pass filters to fetch function', async () => {
    const filters = {
      cuisine: ['Nigerian'],
      priceRange: [2 as 1 | 2 | 3 | 4],
      minRating: 4.0,
    };

    renderHook(() => useInfiniteRestaurants({ filters }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ filters })
      );
    });
  });

  it('should pass sortBy to fetch function', async () => {
    const sortBy = 'rating' as const;

    renderHook(() => useInfiniteRestaurants({ sortBy }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy })
      );
    });
  });

  it('should pass searchQuery to fetch function', async () => {
    const searchQuery = 'Pizza';

    renderHook(() => useInfiniteRestaurants({ searchQuery }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ searchQuery })
      );
    });
  });

  it('should pass userLocation to fetch function', async () => {
    const userLocation = { latitude: 6.5244, longitude: 3.3792 };

    renderHook(() => useInfiniteRestaurants({ userLocation }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ userLocation })
      );
    });
  });

  it('should handle loadMore correctly', async () => {
    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(2);
    });

    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: 'cursor-1' })
      );
    });
  });

  it('should not loadMore when hasNextPage is false', async () => {
    (mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mockResolvedValue(mockResponseNoMore);

    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(1);
    });

    expect(result.current.hasNextPage).toBe(false);

    const callCount = (mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mock.calls.length;

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect((mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mock.calls.length).toBe(
        callCount
      );
    });
  });

  it('should not loadMore when already fetching', async () => {
    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(2);
    });

    act(() => {
      result.current.loadMore();
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    expect((mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mock.calls.length).toBe(2);
  });

  it('should handle refresh correctly', async () => {
    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(2);
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Fetch failed');
    (mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('should aggregate data from multiple pages', async () => {
    const page2Response = {
      data: [mockRestaurant2],
      nextCursor: undefined,
      hasMore: false,
    };

    (mockRestaurantsApi.fetchMockRestaurants as jest.Mock)
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(2);
    });

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(3);
    });

    expect(result.current.restaurants).toEqual([
      mockRestaurant1,
      mockRestaurant2,
      mockRestaurant2,
    ]);
  });

  it('should not fetch when enabled is false', async () => {
    renderHook(() => useInfiniteRestaurants({ enabled: false }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).not.toHaveBeenCalled();
    }, { timeout: 1000 }).catch(() => {});

    expect(mockRestaurantsApi.fetchMockRestaurants).not.toHaveBeenCalled();
  });

  it('should refetch when filters change', async () => {
    const { rerender } = renderHook(
      (props: UseInfiniteRestaurantsParams) => useInfiniteRestaurants(props),
      {
        wrapper: createWrapper(),
        initialProps: { filters: { cuisine: ['Nigerian'] } },
      }
    );

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ filters: { cuisine: ['Nigerian'] } })
      );
    });

    rerender({ filters: { cuisine: ['Continental'] } });

    await waitFor(() => {
      expect(mockRestaurantsApi.fetchMockRestaurants).toHaveBeenCalledWith(
        expect.objectContaining({ filters: { cuisine: ['Continental'] } })
      );
    });
  });

  it('should set isFetchingNextPage correctly', async () => {
    (mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.restaurants.length).toBe(2);
    });

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.isFetchingNextPage).toBe(true);

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });
  });

  it('should expose error object when fetch fails', async () => {
    const error = new Error('Network error');
    (mockRestaurantsApi.fetchMockRestaurants as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInfiniteRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error?.message).toBe('Network error');
  });
});
