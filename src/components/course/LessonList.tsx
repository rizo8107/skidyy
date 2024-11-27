import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  description: string;
  isLocked?: boolean;
}

interface LessonListProps {
  lesson: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
  onSubscribeClick?: () => void;
}

export const LessonList = ({
  lesson,
  currentLessonId,
  onLessonSelect,
  onSubscribeClick,
}: LessonListProps) => {
  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isLocked) {
      onSubscribeClick?.();
    } else {
      onLessonSelect(lesson);
    }
  };

  return (
    <View style={styles.container}>
      {lesson.map((lesson) => (
        <Pressable
          key={lesson.id}
          style={[
            styles.lessonItem,
            currentLessonId === lesson.id && styles.selectedLesson,
            lesson.isLocked && styles.lockedLesson,
          ]}
          onPress={() => handleLessonClick(lesson)}
        >
          <View style={styles.lessonContent}>
            <View style={styles.lessonHeader}>
              <View style={styles.titleContainer}>
                <Text 
                  style={[
                    styles.lessonTitle,
                    lesson.isLocked && styles.lockedText,
                  ]}
                  numberOfLines={1}
                >
                  {lesson.title}
                </Text>
                {lesson.isLocked && (
                  <Feather name="lock" size={16} color="rgba(107, 114, 128, 0.8)" style={styles.lockIcon} />
                )}
              </View>
              <Text 
                style={[
                  styles.duration,
                  lesson.isLocked && styles.lockedText,
                ]}
              >
                {lesson.duration}
              </Text>
            </View>
            <Text 
              style={[
                styles.description,
                lesson.isLocked && styles.lockedText,
              ]} 
              numberOfLines={2}
            >
              {lesson.description}
            </Text>
            {lesson.completed && !lesson.isLocked && (
              <View style={styles.completedBadge}>
                <Feather name="check" size={12} color="white" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lessonItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
    cursor: 'pointer',
  },
  selectedLesson: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  lockedLesson: {
    opacity: 0.8,
    backgroundColor: 'rgba(229, 231, 235, 0.1)',
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  lockIcon: {
    marginLeft: 8,
  },
  duration: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  lockedText: {
    color: 'rgba(107, 114, 128, 0.8)',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
});
