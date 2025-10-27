import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from '../utils/debounce';
import { searchRestaurantsByName } from '@/api/restaurant'; // Unified
import { trackApiCall } from '@/utils/analytics';
import type { Restaurant } from '@/types';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;
const DEBOUNCE_MS = 300;

export interface UseRestaurantSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  searchResults: Restaurant[];
  isSearching: boolean;
  searchError: Error | null;
  recentSearches: string[];
  suggestions: string[]; // Restaurant names for suggestions
  clearRecentSearches: () => void;
  removeRecentSearch: (search: string) => void;
}

export function useRestaurantSearch(): UseRestaurantSearchReturn {
  const [query, setQueryState] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value);
      }, DEBOUNCE_MS),
    []
  );

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      debouncedSetQuery(value);
    },
    [debouncedSetQuery]
  );

  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['restaurant-search', debouncedQuery],
    queryFn: async () => {
      const startTime = Date.now();
      try {
        const results = await searchRestaurantsByName(debouncedQuery);
        const duration = Date.now() - startTime;
        trackApiCall('searchRestaurantsByName', duration, true);
        return results;
      } catch (err) {
        const duration = Date.now() - startTime;
        trackApiCall('searchRestaurantsByName', duration, false);
        throw err;
      }
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Suggestions: Map searchResults to names (empty if no results or loading)
  const suggestions = useMemo(
    () => (searchError ? [] : searchResults.map((r) => r.name).slice(0, 5)),
    [searchResults, searchError]
  );

  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Add to recents on successful debounced search with results
  useEffect(() => {
    if (debouncedQuery.trim() && searchResults.length > 0 && !recentSearches.includes(debouncedQuery.trim())) {
      saveRecentSearch(debouncedQuery.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, searchResults]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (search: string) => {
    try {
      const updated = [
        search,
        ...recentSearches.filter((s) => s.toLowerCase() !== search.toLowerCase()),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      console.log('Added to recents:', updated); // Debug: Remove later
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  const removeRecentSearch = useCallback(
    async (search: string) => {
      try {
        const updated = recentSearches.filter((s) => s !== search);
        setRecentSearches(updated);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error removing recent search:', error);
      }
    },
    [recentSearches]
  );

  return {
    query,
    setQuery,
    debouncedQuery,
    searchResults,
    isSearching,
    searchError: searchError as Error | null,
    recentSearches,
    suggestions,
    clearRecentSearches,
    removeRecentSearch,
  };
}