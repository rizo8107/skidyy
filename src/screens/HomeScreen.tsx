import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { CourseCard } from '../components/course/CourseCard';
import { fetchCourses } from '../services/strapi';
import { STRAPI_URL } from '@env';

interface Course {
  id: number;
  CourseTitle: string;
  CourseCategory: string;
  CourseDuration: string;
  CourseRating: number;
  CourseThumbnail: {
    data: {
      attributes: {
        url: string;
        formats: {
          thumbnail: {
            url: string;
          };
          small: {
            url: string;
          };
          medium: {
            url: string;
          };
          large: {
            url: string;
          };
        };
      };
    };
  };
  CourseInstructor: string;
  CourseDescription: Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
  CourseProgress: number;
  CourseStatus: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export const HomeScreen = ({ navigation }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        console.log('Courses in HomeScreen:', response);
        if (response?.data) {
          // Map the response data directly since it's already in the correct format
          const coursesData = response.data.map(item => ({
            id: item.id,
            documentId: item.documentId,
            CourseTitle: item.CourseTitle,
            CourseCategory: item.CourseCategory,
            CourseDuration: item.CourseDuration,
            CourseRating: item.CourseRating,
            CourseThumbnail: item.CourseThumbnail,
            CourseInstructor: item.CourseInstructor,
            CourseProgress: item.CourseProgress,
            CourseStatus: item.CourseStatus
          }));
          console.log('Mapped course data:', coursesData);
          setCourses(coursesData);
        }
      } catch (err) {
        setError('Failed to load courses');
        console.error('Error in HomeScreen:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getImageUrl = (thumbnail: any) => {
    if (!thumbnail?.data?.attributes) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }

    const { url, formats } = thumbnail.data.attributes;

    // If we have a direct URL
    if (url) {
      return url.startsWith('/') ? `${STRAPI_URL}${url}` : url;
    }

    // If we have formats, try to get the most appropriate size
    if (formats) {
      const format = formats.medium || formats.small || formats.thumbnail;
      if (format?.url) {
        return format.url.startsWith('/') ? `${STRAPI_URL}${format.url}` : format.url;
      }
    }

    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  const handleCoursePress = (course: Course) => {
    console.log('Navigating to course:', course);
    navigation.navigate('CoursePlayer', {
      documentId: course.documentId || String(course.id)
    });
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
        <Text style={styles.welcomeText}>Welcome to SKiddy</Text>
        <Text style={styles.subText}>Start your learning journey today</Text>
      </View>
      
      <View style={styles.coursesSection}>
        <Text style={styles.sectionTitle}>Featured Courses</Text>
        <View style={styles.courseGrid}>
          {courses.length > 0 ? (
            courses.map((course) => {
              console.log('Course data:', course);
              return (
                <View key={course.id} style={styles.cardWrapper}>
                  <CourseCard
                    courseTitle={course.CourseTitle || 'Untitled Course'}
                    courseCategory={course.CourseCategory || 'Uncategorized'}
                    courseDuration={course.CourseDuration || '0h'}
                    courseRating={course.CourseRating || 0}
                    courseThumbnail={getImageUrl(course.CourseThumbnail)}
                    courseInstructor={course.CourseInstructor || 'Unknown Instructor'}
                    courseProgress={course.CourseProgress}
                    courseStatus={course.CourseStatus}
                    onPress={() => handleCoursePress(course)}
                  />
                </View>
              );
            })
          ) : (
            <View style={styles.noCoursesContainer}>
              <Text style={styles.noCoursesText}>No courses available</Text>
            </View>
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
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subText: {
    fontSize: 18,
    color: '#6B7280',
  },
  coursesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
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
  noCoursesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
