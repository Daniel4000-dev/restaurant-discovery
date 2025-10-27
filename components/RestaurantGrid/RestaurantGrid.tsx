import React, { useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  View,
  ListRenderItemInfo,
} from 'react-native';
import { RestaurantCard } from '@/components/RestaurantCard';
import { EmptyState } from '@/components/common/EmptyState';
import { AlertCircle } from 'lucide-react-native';
import type { Restaurant } from '@/types';
import { useRenderTracker } from '@/hooks/useRenderTracker';
import { trackUserAction } from '@/utils/analytics';


interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  query?: string;
  hasActiveFilters?: boolean;
  onLoadMore: () => void;
  onRefresh: () => Promise<void>;
  onRestaurantPress?: (restaurant: Restaurant) => void;
  testID?: string;
}

export const RestaurantGrid = React.memo<RestaurantGridProps>(
  ({
    restaurants,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    query,
    hasActiveFilters,
    onLoadMore,
    onRefresh,
    onRestaurantPress,
    testID,
  }) => {
    useRenderTracker('RestaurantGrid');

    const handleRestaurantPress = useCallback(
      (restaurant: Restaurant) => {
        trackUserAction('open_restaurant_detail', { id: restaurant.id });
        onRestaurantPress?.(restaurant);
      },
      [onRestaurantPress]
    );

    const handleEndReached = useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        trackUserAction('load_more_restaurants');
        onLoadMore();
      }
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    const renderRestaurant = useCallback(
      ({ item }: ListRenderItemInfo<Restaurant>) => (
        <RestaurantCard restaurant={item} onPress={handleRestaurantPress} />
      ),
      [handleRestaurantPress]
    );

    const renderFooter = useCallback(() => {
      if (!isFetchingNextPage) return null;
      return (
        <View 
          style={styles.footer}
          accessible={true}
          accessibilityLabel="Loading more restaurants"
          accessibilityRole="progressbar"
        >
          <ActivityIndicator size="large" color="#0EA5E9" testID="loading-indicator" />
        </View>
      );
    }, [isFetchingNextPage]);

    const renderEmpty = useCallback(() => {
      if (isLoading) return null;

      if (isError) {
        return (
          <EmptyState
            title="Something went wrong"
            message="We couldn't load restaurants. Please try again."
            icon={<AlertCircle size={64} color="#EF4444" />}
          />
        );
      }

      if (query?.trim()) {
        return (
          <EmptyState
            title="No results found"
            message={`We couldn't find any restaurants matching "${query}"`}
          />
        );
      }

      if (hasActiveFilters) {
        return (
          <EmptyState
            title="No restaurants found"
            message="Try adjusting your filters to see more results"
          />
        );
      }

      return (
        <EmptyState
          title="No restaurants available"
          message="Check back later for delicious options"
        />
      );
    }, [isLoading, isError, query, hasActiveFilters]);

    const keyExtractor = useCallback((item: Restaurant) => item.id, []);

    return (
      <FlatList
        testID={testID}
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={async () => {
              trackUserAction('refresh_restaurants');
              await onRefresh();
            }}
            tintColor="#0EA5E9"
            colors={['#0EA5E9']}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={5}
      />
    );
  }
);

RestaurantGrid.displayName = 'RestaurantGrid';

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
