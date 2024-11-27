import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Lesson {
  id: number;
  attributes: {
    documentId: string;
    LessonTitle: string;
    LessonDescription: string;
    LessonVideoUrl: string;
    LessonDuration: string;
    LessonOrder: number;
    LessonIsLocked: boolean;
  };
}

interface LessonListSidebarProps {
  lesson: {
    data: Lesson[];
  };
  currentLesson: Lesson | null;
  onLessonSelect: (lesson: Lesson) => void;
}

export const LessonListSidebar = ({
  lesson,
  currentLesson,
  onLessonSelect,
}: LessonListSidebarProps) => {
  // Sort lessons by order
  const sortedLessons = [...(lesson?.data || [])].sort(
    (a, b) => a.attributes.LessonOrder - b.attributes.LessonOrder
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Content</Text>
        <Text style={styles.lessonCount}>{lesson?.data?.length || 0} Lessons</Text>
      </View>

      <ScrollView style={styles.lessonList} showsVerticalScrollIndicator={false}>
        {sortedLessons.map((lesson, index) => (
          <Pressable
            key={lesson.id}
            style={[
              styles.lessonItem,
              currentLesson?.id === lesson.id && styles.currentLesson
            ]}
            onPress={() => onLessonSelect(lesson)}
          >
            <View style={styles.lessonContent}>
              <View style={styles.lessonHeader}>
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <Text 
                  style={[
                    styles.lessonTitle,
                    currentLesson?.id === lesson.id && styles.currentLessonTitle
                  ]}
                  numberOfLines={2}
                >
                  {lesson.attributes.LessonTitle}
                </Text>
              </View>
              <View style={styles.lessonMeta}>
                <View style={styles.durationContainer}>
                  <Feather name="clock" size={14} color="#6B7280" />
                  <Text style={styles.lessonDuration}>{lesson.attributes.LessonDuration}</Text>
                </View>
                {lesson.attributes.LessonIsLocked && (
                  <View style={styles.lockedContainer}>
                    <Feather name="lock" size={14} color="#6B7280" />
                    <Text style={styles.lockedText}>Locked</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...(Platform.OS === 'web' ? { width: 320 } : {}),
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  lessonCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  lessonList: {
    flex: 1,
  },
  lessonItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  currentLesson: {
    backgroundColor: '#F3F4F6',
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  lessonTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  currentLessonTitle: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});