import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import type { FilterState, SortOption } from '@/types';
import { NIGERIAN_CUISINES, DIETARY_OPTIONS, PRICE_RANGE_GUIDE } from '@/mocks/restaurants';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onToggleCuisine: (cuisine: string) => void;
  onTogglePriceRange: (price: 1 | 2 | 3 | 4) => void;
  onToggleDietaryOption: (option: string) => void;
  onSetMinRating: (rating: number | undefined) => void;
  onSetMaxDeliveryTime: (time: number | undefined) => void;
  onSetOpenOnly: (isOpen: boolean | undefined) => void;
  onChangeSortBy: (sortBy: SortOption) => void;
  onResetFilters: () => void;
}

export const FilterModal = React.memo<FilterModalProps>(
  ({
    visible,
    onClose,
    filters,
    onToggleCuisine,
    onTogglePriceRange,
    onToggleDietaryOption,
    onSetMinRating,
    onSetMaxDeliveryTime,
    onSetOpenOnly,
    onChangeSortBy,
    onResetFilters,
  }) => {
    const handleResetAndClose = useCallback(() => {
      onResetFilters();
      onClose();
    }, [onResetFilters, onClose]);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <Pressable onPress={onClose} style={styles.closeButton} testID="close-filter-modal">
              <X size={24} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <FilterSection title="Sort By">
              <View style={styles.sortGrid}>
                <SortOptionItem
                  label="Rating"
                  value="rating"
                  selected={filters.sortBy === 'rating'}
                  onPress={() => onChangeSortBy('rating')}
                />
                <SortOptionItem
                  label="Delivery"
                  value="deliveryTime"
                  selected={filters.sortBy === 'deliveryTime'}
                  onPress={() => onChangeSortBy('deliveryTime')}
                />
                <SortOptionItem
                  label="Price"
                  value="price"
                  selected={filters.sortBy === 'price'}
                  onPress={() => onChangeSortBy('price')}
                />
                <SortOptionItem
                  label="Distance" // New
                  value="distance"
                  selected={filters.sortBy === 'distance'}
                  onPress={() => onChangeSortBy('distance')}
                />
              </View>
            </FilterSection>

            <FilterSection title="Cuisine">
              <View style={styles.optionsWrap}>
                {NIGERIAN_CUISINES.map((cuisine) => (
                  <FilterOption
                    key={cuisine}
                    label={cuisine}
                    selected={filters.cuisine.includes(cuisine)}
                    onPress={() => onToggleCuisine(cuisine)}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Price Range">
              <View style={styles.optionsWrap}>
                {([1, 2, 3, 4] as const).map((price) => (
                  <FilterOption
                    key={price}
                    label={PRICE_RANGE_GUIDE[price]}
                    selected={filters.priceRange.includes(price)}
                    onPress={() => onTogglePriceRange(price)}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Dietary Options">
              <View style={styles.optionsWrap}>
                {DIETARY_OPTIONS.map((option) => (
                  <FilterOption
                    key={option}
                    label={option}
                    selected={filters.dietaryOptions.includes(option)}
                    onPress={() => onToggleDietaryOption(option)}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Minimum Rating">
              <View style={styles.optionsRow}>
                <RatingOption
                  rating={4.0}
                  selected={filters.minRating === 4.0}
                  onPress={() => onSetMinRating(filters.minRating === 4.0 ? undefined : 4.0)}
                />
                <RatingOption
                  rating={4.5}
                  selected={filters.minRating === 4.5}
                  onPress={() => onSetMinRating(filters.minRating === 4.5 ? undefined : 4.5)}
                />
              </View>
            </FilterSection>

            <FilterSection title="Maximum Delivery Time">
              <View style={styles.optionsRow}>
                <DeliveryOption
                  minutes={30}
                  selected={filters.maxDeliveryTime === 30}
                  onPress={() =>
                    onSetMaxDeliveryTime(filters.maxDeliveryTime === 30 ? undefined : 30)
                  }
                />
                <DeliveryOption
                  minutes={45}
                  selected={filters.maxDeliveryTime === 45}
                  onPress={() =>
                    onSetMaxDeliveryTime(filters.maxDeliveryTime === 45 ? undefined : 45)
                  }
                />
                <DeliveryOption
                  minutes={60}
                  selected={filters.maxDeliveryTime === 60}
                  onPress={() =>
                    onSetMaxDeliveryTime(filters.maxDeliveryTime === 60 ? undefined : 60)
                  }
                />
              </View>
            </FilterSection>

            <FilterSection title="Availability">
              <FilterOption
                label="Open Now"
                selected={filters.isOpen === true}
                onPress={() => onSetOpenOnly(filters.isOpen ? undefined : true)}
              />
            </FilterSection>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={handleResetAndClose}
              style={({ pressed }) => [styles.resetButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.applyButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
);

FilterModal.displayName = 'FilterModal';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = React.memo<FilterSectionProps>(({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
));

FilterSection.displayName = 'FilterSection';

interface FilterOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const FilterOption = React.memo<FilterOptionProps>(({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.option,
      selected && styles.optionSelected,
      pressed && styles.optionPressed,
    ]}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {label}
    </Text>
    {selected && <Check size={16} color="#FFFFFF" />}
  </Pressable>
));

FilterOption.displayName = 'FilterOption';

interface SortOptionItemProps {
  label: string;
  value: string;
  selected: boolean;
  onPress: () => void;
}

const SortOptionItem = React.memo<SortOptionItemProps>(({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.sortOption,
      selected && styles.sortOptionSelected,
      pressed && styles.optionPressed,
    ]}
  >
    <Text style={[styles.sortOptionText, selected && styles.sortOptionTextSelected]}>
      {label}
    </Text>
  </Pressable>
));

SortOptionItem.displayName = 'SortOptionItem';

interface RatingOptionProps {
  rating: number;
  selected: boolean;
  onPress: () => void;
}

const RatingOption = React.memo<RatingOptionProps>(({ rating, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.ratingOption,
      selected && styles.optionSelected,
      pressed && styles.optionPressed,
    ]}
  >
    <Text style={[styles.ratingText, selected && styles.optionTextSelected]}>
      {rating}+ ⭐
    </Text>
  </Pressable>
));

RatingOption.displayName = 'RatingOption';

interface DeliveryOptionProps {
  minutes: number;
  selected: boolean;
  onPress: () => void;
}

const DeliveryOption = React.memo<DeliveryOptionProps>(({ minutes, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.deliveryOption,
      selected && styles.optionSelected,
      pressed && styles.optionPressed,
    ]}
  >
    <Text style={[styles.deliveryText, selected && styles.optionTextSelected]}>
      Under {minutes} min
    </Text>
  </Pressable>
));

DeliveryOption.displayName = 'DeliveryOption';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#0F172A',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#0F172A',
    marginBottom: 12,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionSelected: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500' as const,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  sortOption: {
    minWidth: '48%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortOptionSelected: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600' as const,
  },
  sortOptionTextSelected: {
    color: '#FFFFFF',
  },
  ratingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ratingText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600' as const,
  },
  deliveryOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deliveryText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600' as const,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});