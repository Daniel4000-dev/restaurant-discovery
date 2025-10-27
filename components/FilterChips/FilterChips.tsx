import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import type { ActiveFilterTag } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface FilterChipsProps {
  tags: ActiveFilterTag[];
  onRemove: (tagId: string) => void;
  onClearAll: () => void;
}

export const FilterChips = React.memo<FilterChipsProps>(
  ({ tags, onRemove, onClearAll }) => {
    const { colors } = useTheme();
    if (tags.length === 0) return null;

    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {tags.map((tag) => (
            <FilterChip key={tag.id} tag={tag} onRemove={onRemove} colors={colors} />
          ))}

          <Pressable
            onPress={onClearAll}
            style={({ pressed }) => [
              styles.clearAllButton,
              pressed && styles.clearAllButtonPressed,
            ]}
            testID="clear-all-filters"
            accessibilityLabel="Clear all filters"
            accessibilityRole="button"
            accessibilityHint="Double tap to remove all active filters"
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
);

FilterChips.displayName = 'FilterChips';

interface FilterChipProps {
  tag: ActiveFilterTag;
  onRemove: (tagId: string) => void;
  colors: any;
}

const FilterChip = React.memo<FilterChipProps>(({ tag, onRemove, colors }) => {
  const handleRemove = useCallback(() => {
    onRemove(tag.id);
  }, [tag.id, onRemove]);

  return (
    <View style={[styles.chip, { backgroundColor: colors.info + '20', borderColor: colors.info + '40' }]}>
      <Text style={[styles.chipText, { color: colors.info }]} numberOfLines={1}>
        {tag.label}
      </Text>
      <Pressable
        onPress={handleRemove}
        style={styles.chipRemove}
        testID={`remove-filter-${tag.id}`}
        hitSlop={8}
        accessibilityLabel={`Remove ${tag.label} filter`}
        accessibilityRole="button"
        accessibilityHint="Double tap to remove this filter"
      >
        <X size={14} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
});

FilterChip.displayName = 'FilterChip';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  chipText: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '500' as const,
    maxWidth: 150,
  },
  chipRemove: {
    padding: 2,
  },
  clearAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
  },
  clearAllButtonPressed: {
    opacity: 0.7,
  },
  clearAllText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600' as const,
  },
});
