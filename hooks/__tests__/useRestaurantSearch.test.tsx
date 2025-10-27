import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRestaurantSearch } from '../useRestaurantSearch';
import * as mockRestaurantsApi from '@/api/mock-restaurants';
import type { Restaurant } from '@/types';

const mockRestaurants: Restaurant[] = [
  {
    id: 'test-1',
    name: 'Test Restaurant',
    image: 'https://example.com/image.jpg',
    cuisine: ['Nigerian'],
    deliveryTime: { min: 20, max: 30 },
    rating: 4.5,
    priceRange: 2,
    dietaryOptions: ['Halal'],
    isOpen: true,
    location: { latitude: 6.5244, longitude: 3.3792 },
  },
];

jest.mock('@/src/api/mock-restaurants', () => ({
  searchMockRestaurantsByName: jest.fn(),
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

describe('useRestaurantSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (mockRestaurantsApi.searchMockRestaurantsByName as jest.Mock).mockResolvedValue(mockRestaurants);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with empty query and no results', () => {
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    expect(result.current.query).toBe('');
    expect(result.current.debouncedQuery).toBe('');
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.searchError).toBe(null);
  });

  it('should update query immediately and debounce search', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setQuery('Test');
    });

    expect(result.current.query).toBe('Test');
    expect(result.current.debouncedQuery).toBe('');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.debouncedQuery).toBe('Test');
    });

    jest.useRealTimers();
  });

  it('should fetch search results after debounce', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setQuery('Restaurant');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.searchResults).toEqual(mockRestaurants);
    });

    expect(mockRestaurantsApi.searchMockRestaurantsByName).toHaveBeenCalledWith('Restaurant');

    jest.useRealTimers();
  });

  it('should not fetch when query is empty', async () => {
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setQuery('');
    });

    await waitFor(() => {
      expect(result.current.debouncedQuery).toBe('');
    });

    expect(mockRestaurantsApi.searchMockRestaurantsByName).not.toHaveBeenCalled();
  });

  it('should load recent searches from AsyncStorage on mount', async () => {
    const recentSearches = ['Pizza', 'Burger'];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(recentSearches));

    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual(recentSearches);
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@recent_searches');
  });

  it('should save recent search after successful search', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setQuery('Pizza');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.searchResults.length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@recent_searches',
        JSON.stringify(['Pizza'])
      );
    });

    jest.useRealTimers();
  });

  it('should clear all recent searches', async () => {
    const recentSearches = ['Pizza', 'Burger'];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(recentSearches));

    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual(recentSearches);
    });

    await act(async () => {
      await result.current.clearRecentSearches();
    });

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual([]);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@recent_searches');
  });

  it('should remove a specific recent search', async () => {
    const recentSearches = ['Pizza', 'Burger', 'Sushi'];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(recentSearches));

    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual(recentSearches);
    });

    await act(async () => {
      await result.current.removeRecentSearch('Burger');
    });

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual(['Pizza', 'Sushi']);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@recent_searches',
      JSON.stringify(['Pizza', 'Sushi'])
    );
  });

  it('should limit recent searches to MAX_RECENT_SEARCHES', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    const searches = Array.from({ length: 12 }, (_, i) => `Search ${i + 1}`);

    for (const search of searches) {
      act(() => {
        result.current.setQuery(search);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.debouncedQuery).toBe(search);
      });
    }

    await waitFor(() => {
      expect(result.current.recentSearches.length).toBeLessThanOrEqual(10);
    });

    jest.useRealTimers();
  });

  it('should handle search errors gracefully', async () => {
    jest.useFakeTimers();
    const error = new Error('Search failed');
    (mockRestaurantsApi.searchMockRestaurantsByName as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setQuery('Error Query');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.searchError).toBeTruthy();
    });

    jest.useRealTimers();
  });

  it('should deduplicate recent searches (case-insensitive)', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setQuery('Pizza');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.searchResults.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setQuery('pizza');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const pizzaCount = result.current.recentSearches.filter(
        s => s.toLowerCase() === 'pizza'
      ).length;
      expect(pizzaCount).toBeLessThanOrEqual(1);
    });

    jest.useRealTimers();
  });

  it('should handle AsyncStorage errors gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.recentSearches).toEqual([]);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading recent searches:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should expose correct loading state during search', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRestaurantSearch(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isSearching).toBe(false);

    act(() => {
      result.current.setQuery('Test');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });

    jest.useRealTimers();
  });
});
