import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { Clock, TrendingUp, Search } from 'lucide-react-native';
import { trackRenderTime } from '@/utils/analytics';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
}

interface SearchSuggestionsProps {
  recentSearches: string[];
  suggestions?: string[];
  onSelectSuggestion: (query: string) => void;
  onRemoveRecent: (search: string) => void;
  onClearRecent: () => void;
  visible: boolean;
}

const TRENDING_SEARCHES = [
  'Nigerian food',
  'Jollof rice',
  'Suya',
  'Fast food',
  'Vegetarian',
];

export const SearchSuggestions = React.memo<SearchSuggestionsProps>(
  ({ recentSearches, suggestions = [], onSelectSuggestion, onRemoveRecent, onClearRecent, visible }) => {
    // Perf: Track render time
    useEffect(() => {
      const start = Date.now();
      return () => trackRenderTime('SearchSuggestions', Date.now() - start);
    });

    const allSuggestions: SearchSuggestion[] = [
      ...recentSearches.map((text, index) => ({
        id: `recent-${index}`,
        text,
        type: 'recent' as const,
      })),
      ...suggestions.map((text, index) => ({
        id: `suggestion-${index}`,
        text,
        type: 'suggestion' as const,
      })),
      ...(recentSearches.length === 0 && suggestions.length === 0
        ? TRENDING_SEARCHES.map((text, index) => ({
            id: `trending-${index}`,
            text,
            type: 'trending' as const,
          }))
        : []),
    ];

    const renderSuggestion = useCallback(
      ({ item }: { item: SearchSuggestion }) => {
        return <SuggestionItem suggestion={item} onSelect={onSelectSuggestion} onRemove={onRemoveRecent} />;
      },
      [onSelectSuggestion, onRemoveRecent]
    );

    const renderHeader = useCallback(() => {
      if (recentSearches.length === 0) return null;
      return (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent Searches</Text>
          <Pressable onPress={onClearRecent} hitSlop={8}>
            <Text style={styles.clearButton}>Clear All</Text>
          </Pressable>
        </View>
      );
    }, [recentSearches.length, onClearRecent]);

    const keyExtractor = useCallback((item: SearchSuggestion) => item.id, []);

    if (!visible) return null;

    return (
      <View style={styles.container}>
        <FlatList
          data={allSuggestions}
          renderItem={renderSuggestion}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }
);

SearchSuggestions.displayName = 'SearchSuggestions';

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  onSelect: (query: string) => void;
  onRemove: (search: string) => void;
}

const SuggestionItem = React.memo<SuggestionItemProps>(({ suggestion, onSelect, onRemove }) => {
  const handlePress = useCallback(() => {
    onSelect(suggestion.text);
  }, [onSelect, suggestion.text]);

  const handleRemove = useCallback(() => {
    onRemove(suggestion.text);
  }, [onRemove, suggestion.text]);

  const getIcon = () => {
    switch (suggestion.type) {
      case 'recent':
        return <Clock size={20} color="#64748B" />;
      case 'trending':
        return <TrendingUp size={20} color="#0EA5E9" />;
      case 'suggestion':
        return <Search size={20} color="#64748B" />;
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.suggestionItem, pressed && styles.suggestionItemPressed]}
      accessibilityLabel={`${suggestion.type} search: ${suggestion.text}`}
      accessibilityRole="button"
    >
      <View style={styles.suggestionIcon}>{getIcon()}</View>
      <Text style={styles.suggestionText} numberOfLines={1}>
        {suggestion.text}
      </Text>
      {suggestion.type === 'recent' && (
        <Pressable
          onPress={handleRemove}
          hitSlop={8}
          style={styles.removeButton}
          accessibilityLabel={`Remove ${suggestion.text} from recent searches`}
          accessibilityRole="button"
        >
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      )}
    </Pressable>
  );
});

SuggestionItem.displayName = 'SuggestionItem';

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as const,
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    maxHeight: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    }),
    borderRadius: 12,
    marginHorizontal: 16,
    zIndex: 1000,
  },
  listContent: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#0F172A',
  },
  clearButton: {
    fontSize: 13,
    color: '#0EA5E9',
    fontWeight: '500' as const,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  suggestionItemPressed: {
    backgroundColor: '#F8FAFC',
  },
  suggestionIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  removeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 24,
    color: '#94A3B8',
    fontWeight: '300' as const,
  },
});