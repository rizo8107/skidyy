import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CourseCardProps {
  courseTitle: string;
  courseDescription?: string;
  courseCategory: string;
  courseDuration: string;
  courseRating: number;
  courseThumbnail: string;
  courseInstructor: string;
  onPress: () => void;
  onResume?: () => void;
  onSave?: () => void;
  onRemoveFromSaved?: () => void;
  isSaved?: boolean;
}

export const CourseCard = ({ 
  courseTitle, 
  courseDescription,
  courseCategory, 
  courseDuration, 
  courseRating, 
  courseThumbnail, 
  courseInstructor,
  onPress,
  onResume,
  onSave,
  onRemoveFromSaved,
  isSaved
}: CourseCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: courseThumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{courseTitle}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{courseCategory}</Text>
          </View>
        </View>

        {courseDescription && (
          <Text style={styles.description} numberOfLines={2}>
            {courseDescription}
          </Text>
        )}

        <View style={styles.instructorRow}>
          <Feather name="user" size={14} color="#6B7280" />
          <Text style={styles.instructor}>{courseInstructor}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Feather name="clock" size={14} color="#6B7280" />
            <Text style={styles.statText}>{courseDuration}</Text>
          </View>
          <View style={styles.stat}>
            <Feather name="star" size={14} color="#6B7280" />
            <Text style={styles.statText}>{courseRating}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {onResume && (
            <Pressable style={styles.actionButton} onPress={onResume}>
              <Feather name="play-circle" size={20} color="#7C3AED" />
              <Text style={styles.actionText}>Resume</Text>
            </Pressable>
          )}
          
          {(onSave || onRemoveFromSaved) && (
            <Pressable 
              style={styles.actionButton} 
              onPress={isSaved ? onRemoveFromSaved : onSave}
            >
              <Feather 
                name={isSaved ? "bookmark" : "bookmark-plus"} 
                size={20} 
                color={isSaved ? "#7C3AED" : "#6B7280"} 
              />
              <Text style={[styles.actionText, isSaved && styles.savedText]}>
                {isSaved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  categoryContainer: {
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructor: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  savedText: {
    color: '#7C3AED',
  },
});
