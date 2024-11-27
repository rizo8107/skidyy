import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SavedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Courses</Text>
      <Text style={styles.subtitle}>Your bookmarked courses will appear here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});
