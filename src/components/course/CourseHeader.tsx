import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Share2, Mail, Star } from 'lucide-react';

export const CourseHeader = () => {
  return (
    <View style={styles.header}>
      {/* Title & Category */}
      <View style={styles.titleSection}>
        <Text style={styles.category}>Web Development</Text>
        <Text style={styles.title}>Introduction to React Native</Text>
      </View>

      {/* Course Stats & Rating */}
      <View style={styles.statsContainer}>
        <Text style={styles.stats}>38 lessons • 4h 30min</Text>
        <View style={styles.rating}>
          <Star style={styles.ratingIcon} />
          <Text style={styles.ratingText}>4.5/5</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={styles.shareButton}>
          <Share2 style={styles.shareIcon} />
          <Text style={styles.shareButtonText}>Share</Text>
        </Pressable>
        <Pressable style={styles.emailButton}>
          <Mail style={styles.emailIcon} />
          <Text style={styles.emailButtonText}>Email Now</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleSection: {
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#7C3AED',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stats: {
    color: '#6B7280',
    marginRight: 24,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    color: '#F7DC6F',
  },
  ratingText: {
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  shareButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    color: '#6B7280',
  },
  shareButtonText: {
    color: '#6B7280',
  },
  emailButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    color: 'white',
  },
  emailButtonText: {
    color: 'white',
  },
});
