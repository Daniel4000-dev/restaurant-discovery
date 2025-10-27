import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { getPerformanceReport } from '@/utils/analytics';

export function PerformanceReportScreen() {
  const report = getPerformanceReport();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>{report}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  text: { fontFamily: 'monospace', fontSize: 14 },
});
