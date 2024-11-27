import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { CourseCard } from '../components/course/CourseCard';
import { fetchCourses } from '../services/strapi';
import { STRAPI_URL } from '@env';

interface Course {
  id: number;
  documentId: string;
  CourseTitle: string;
  CourseCategory: string;
  CourseDuration: string;
  CourseRating: number;
  CourseThumbnail: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    formats?: {
      thumbnail?: {
        url: string;
      };
      small?: {
        url: string;
      };
      medium?: {
        url: string;
      };
      large?: {
        url: string;
      };
    };
  };
  CourseInstructor: string;
  CourseDescription: any[];
  CourseProgress?: number;
  CourseStatus?: string;
}

export const MyCoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        console.log('Courses response:', response);
        if (response?.data) {
          setCourses(response.data);
        } else {
          setError('No courses found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getImageUrl = (thumbnail: Course['CourseThumbnail'] | null | undefined) => {
    if (!thumbnail) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    
    // If we have a direct URL
    if (thumbnail.url && thumbnail.url.startsWith('http')) {
      return thumbnail.url;
    }

    // If we have a relative URL
    if (thumbnail.url) {
      return `${STRAPI_URL}${thumbnail.url}`;
    }

    // Try formats
    if (thumbnail.formats) {
      const format = thumbnail.formats.medium || thumbnail.formats.small || thumbnail.formats.thumbnail;
      if (format?.url) {
        return format.url.startsWith('http') ? format.url : `${STRAPI_URL}${format.url}`;
      }
    }

    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.subtitle}>Continue learning where you left off</Text>
      </View>
      
      <View style={styles.coursesSection}>
        <View style={styles.courseGrid}>
          {courses.length > 0 ? (
            courses.map((course) => (
              <View key={course.id} style={styles.cardWrapper}>
                <CourseCard
                  courseTitle={course.CourseTitle || 'Untitled Course'}
                  courseCategory={course.CourseCategory || 'Uncategorized'}
                  courseDuration={course.CourseDuration || '0h'}
                  courseRating={course.CourseRating || 0}
                  courseThumbnail={getImageUrl(course.CourseThumbnail)}
                  courseInstructor={course.CourseInstructor || 'Unknown Instructor'}
                  courseProgress={course.CourseProgress}
                  courseStatus={course.CourseStatus as any}
                  onPress={() => navigation.navigate('CoursePlayer', { 
                    courseId: course.documentId || course.id.toString()
                  })}
                  onResume={() => navigation.navigate('CoursePlayer', { 
                    courseId: course.documentId || course.id.toString()
                  })}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noCoursesText}>No courses available at the moment</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  coursesSection: {
    marginBottom: 32,
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  cardWrapper: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    minWidth: Platform.OS === 'web' ? 300 : undefined,
    maxWidth: Platform.OS === 'web' ? 400 : 340,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 32,
  },
});
