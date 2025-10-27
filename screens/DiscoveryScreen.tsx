import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchFilters } from '../hooks/useSearchFilters';
import { useInfiniteRestaurants } from '@/hooks/useInfiniteRestaurants';
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { SearchHeader } from '@/components/SearchHeader';
import { SearchSuggestions } from '@/components/SearchSuggestions';
import { FilterChips } from '@/components/FilterChips';
import { FilterModal } from '@/components/FilterModal';
import { RestaurantGrid } from '@/components/RestaurantGrid';
import { trackUserAction, getPerformanceReport } from '@/utils/analytics';
import type { Restaurant } from '@/types';
import { OfflineBanner } from '@/components/common/OfflineBanner';

export function DiscoveryScreen() {
  const { colors } = useTheme();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { query, setQuery, recentSearches, suggestions, clearRecentSearches, removeRecentSearch } = useRestaurantSearch();
  const { location } = useGeolocation();

  const {
    filters,
    activeFilterTags,
    toggleCuisine,
    togglePriceRange,
    toggleDietaryOption,
    setMinimumRating,
    setMaximumDeliveryTime,
    setOpenOnly,
    changeSortBy,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
    getRestaurantFilter,
  } = useSearchFilters();

  const {
    restaurants,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    refresh,
  } = useInfiniteRestaurants({
    filters: getRestaurantFilter(),
    sortBy: filters.sortBy,
    searchQuery: query,
    userLocation: location,
  });

  // Perf report on unmount
  useEffect(() => {
    return () => {
      console.log('DiscoveryScreen Perf Report:\n', getPerformanceReport());
    };
  }, []);

  // Debug: Log suggestions/recents changes
  useEffect(() => {
    console.log('Suggestions updated:', suggestions, 'Recents:', recentSearches);
  }, [suggestions, recentSearches]);

  // Suggestion handlers
  const handleSelectSuggestion = useCallback((selectedQuery: string) => {
    console.log('Selected suggestion:', selectedQuery); // Debug
    trackUserAction('selectSuggestion', { query: selectedQuery });
    setQuery(selectedQuery); // Triggers add to recents via hook effect
    setShowSuggestions(false);
  }, [setQuery]);

  const handleRemoveRecent = useCallback((search: string) => {
    console.log('Removed recent:', search); // Debug
    trackUserAction('removeRecent', { search });
    removeRecentSearch(search);
  }, [removeRecentSearch]);

  const handleClearRecent = useCallback(() => {
    console.log('Cleared recents'); // Debug
    trackUserAction('clearRecent');
    clearRecentSearches();
  }, [clearRecentSearches]);

  const handleFocus = useCallback(() => {
    console.log('Input focused - showing suggestions'); // Debug
    setShowSuggestions(true);
  }, []);

  const handleBlur = useCallback(() => {
    console.log('Input blurred - hiding suggestions'); // Debug
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  const handleOpenFilterModal = useCallback(() => {
    trackUserAction('openFilters');
    setFilterModalVisible(true);
    setShowSuggestions(false);
  }, []);

  const handleCloseFilterModal = useCallback(() => {
    setFilterModalVisible(false);
  }, []);

  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    trackUserAction('restaurantPress', { id: restaurant.id });
    console.log('Restaurant pressed:', restaurant.name);
  }, []);

  // Visibility: Show if content exists (recents, query, or suggestions)
  const hasSuggestionContent = recentSearches.length > 0 || query.length > 0 || suggestions.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <OfflineBanner />
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onFilterPress={handleOpenFilterModal}
        hasActiveFilters={hasActiveFilters}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {/* Suggestions: Render only if visible AND content */}
      {showSuggestions && hasSuggestionContent && (
        <SearchSuggestions
          recentSearches={recentSearches}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          onRemoveRecent={handleRemoveRecent}
          onClearRecent={handleClearRecent}
          visible={true} // Internal visible=true since we gate outside
          // testID="suggestions-dropdown" // Debug
        />
      )}

      <FilterChips
        tags={activeFilterTags}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      {isLoading && restaurants.length === 0 ? (
        <View 
          style={styles.loadingContainer}
          accessible={true}
          accessibilityLabel="Finding delicious restaurants"
          accessibilityRole="progressbar"
        >
          <ActivityIndicator size="large" color={colors.primary} testID="initial-loading-indicator" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Finding delicious restaurants...</Text>
        </View>
      ) : (
        <RestaurantGrid
          testID="restaurant-grid"
          restaurants={restaurants}
          isLoading={isLoading}
          isError={isError}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          query={query}
          hasActiveFilters={hasActiveFilters}
          onLoadMore={loadMore}
          onRefresh={refresh}
          onRestaurantPress={handleRestaurantPress}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={handleCloseFilterModal}
        filters={filters}
        onToggleCuisine={toggleCuisine}
        onTogglePriceRange={togglePriceRange}
        onToggleDietaryOption={toggleDietaryOption}
        onSetMinRating={setMinimumRating}
        onSetMaxDeliveryTime={setMaximumDeliveryTime}
        onSetOpenOnly={setOpenOnly}
        onChangeSortBy={changeSortBy}
        onResetFilters={clearAllFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative', // Anchor absolute suggestions
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500' as const,
  },
});