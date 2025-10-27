import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Star, Clock } from 'lucide-react-native';
import type { Restaurant } from '@/types';
import { PRICE_RANGE_GUIDE } from '@/mocks/restaurants';
import { useTheme } from '@/contexts/ThemeContext';
import { useRenderTracker } from '@/hooks/useRenderTracker';
import { trackUserAction } from '@/utils/analytics';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: (restaurant: Restaurant) => void;
}

export const RestaurantCard = React.memo<RestaurantCardProps>(({ restaurant, onPress }) => {
  const { colors } = useTheme();
  useRenderTracker('RestaurantCard');

  const handlePress = useCallback(() => {
    trackUserAction('view_restaurant', { id: restaurant.id, name: restaurant.name });
    onPress?.(restaurant);
  }, [onPress, restaurant]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.card, shadowColor: colors.shadow },
        pressed && styles.containerPressed,
      ]}
      testID={`restaurant-card-${restaurant.id}`}
      accessibilityLabel={`${restaurant.name}, ${restaurant.cuisine.join(', ')}, ${restaurant.rating} stars, delivery ${restaurant.deliveryTime.min} to ${restaurant.deliveryTime.max} minutes`}
      accessibilityRole="button"
      accessibilityHint="Double tap to view restaurant details"
      accessible={true}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        {!restaurant.isOpen && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {restaurant.name}
        </Text>

        <Text style={[styles.cuisine, { color: colors.textSecondary }]} numberOfLines={1}>
          {restaurant.cuisine.join(' • ')}
        </Text>

        <View style={styles.metadata}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.rating, { color: colors.text }]}>{restaurant.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.deliveryContainer}>
            <Clock size={14} color="#64748B" />
            <Text style={[styles.deliveryTime, { color: colors.textSecondary }]}>
              {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} min
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={[styles.price, { color: colors.textSecondary }]}>
            {PRICE_RANGE_GUIDE[restaurant.priceRange]}
          </Text>
        </View>

        {restaurant.dietaryOptions.length > 0 && (
          <View style={styles.tags}>
            {restaurant.dietaryOptions.slice(0, 2).map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.surface }]}>
                <Text style={[styles.tagText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  containerPressed: {
    opacity: 0.9,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#0F172A',
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTime: {
    fontSize: 13,
    color: '#64748B',
  },
  price: {
    fontSize: 13,
    color: '#64748B',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500' as const,
  },
});
