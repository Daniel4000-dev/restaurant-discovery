import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchX } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState = React.memo<EmptyStateProps>(({ title, message, icon }) => {
  return (
    <View style={styles.container}>
      {icon || <SearchX size={64} color="#CBD5E1" />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
