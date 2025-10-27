import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchHeader = React.memo<SearchHeaderProps>(
  ({ query, onQueryChange, onFilterPress, hasActiveFilters = false, onFocus, onBlur }) => {
    const { colors } = useTheme();
    const handleClear = useCallback(() => {
      onQueryChange('');
    }, [onQueryChange]);

    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={onQueryChange}
            onFocus={onFocus}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            testID="search-input"
            accessibilityLabel="Search restaurants"
            accessibilityHint="Enter restaurant name or cuisine type to search"
          />
          {query.length > 0 && (
            <Pressable 
              onPress={handleClear} 
              style={styles.clearButton} 
              testID="clear-search"
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={onFilterPress}
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: hasActiveFilters ? colors.primary : colors.background },
            pressed && styles.filterButtonPressed,
          ]}
          testID="filter-button"
          accessibilityLabel={hasActiveFilters ? 'Open filters (active filters applied)' : 'Open filters'}
          accessibilityRole="button"
          accessibilityState={{ selected: hasActiveFilters }}
        >
          <SlidersHorizontal
            size={20}
            color={hasActiveFilters ? '#FFFFFF' : colors.text}
          />
        </Pressable>
      </View>
    );
  }
);

SearchHeader.displayName = 'SearchHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    ...(Platform.OS === 'web' && {
        outlineStyle: 'none',
    }) as any,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  filterButtonActive: {
    backgroundColor: '#0EA5E9',
  },
  filterButtonPressed: {
    opacity: 0.7,
  },
});