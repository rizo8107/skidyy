import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { LessonListSidebar } from '../components/course/LessonListSidebar';
import { LessonResources } from '../components/course/LessonResources';
import { fetchCourseByDocumentId, fetchResources } from '../services/strapi';

interface Resource {
  id: number;
  attributes: {
    title: string;
    description: string;
    url: string;
    type: string;
  };
}

interface Course {
  id: number;
  documentId: string;
  CourseTitle: string;
  CourseDescription: Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
  CourseCategory: string;
  CourseDuration: string;
  CourseRating: number;
  CourseInstructor: string;
  CourseVideoUrl: string;
  CourseProgress: number;
  CourseStatus: string;
  CourseThumbnail: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
        formats: {
          thumbnail: { url: string; };
          small: { url: string; };
          medium: { url: string; };
          large: { url: string; };
        };
      };
    };
  };
  lessons: Array<{
    id: number;
    attributes: {
      documentId: string;
      LessonTitle: string;
      LessonDescription: string;
      LessonVideoUrl: string;
      LessonDuration: string;
      LessonOrder: number;
      LessonIsLocked: boolean;
      resources?: Resource[];
    };
  }>;
}

export const CoursePlayerScreen = ({ route }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Course['lessons'][0] | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const [showSidebar, setShowSidebar] = useState(width >= 1024);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setError(null);
        setLoading(true);

        const documentId = route?.params?.documentId || route?.params?.courseId;
        console.log('Loading course with documentId:', documentId);
        
        if (!documentId) {
          throw new Error('Course document ID is missing');
        }

        const response = await fetchCourseByDocumentId(documentId);
        console.log('Course response:', response);
        
        if (!response?.data) {
          throw new Error('Course not found');
        }

        const courseData = {
          id: response.data.id,
          documentId: response.data.documentId,
          CourseTitle: response.data.CourseTitle,
          CourseDescription: response.data.CourseDescription,
          CourseCategory: response.data.CourseCategory,
          CourseDuration: response.data.CourseDuration,
          CourseRating: response.data.CourseRating,
          CourseInstructor: response.data.CourseInstructor,
          CourseVideoUrl: response.data.CourseVideoUrl,
          CourseProgress: response.data.CourseProgress,
          CourseStatus: response.data.CourseStatus,
          CourseThumbnail: response.data.CourseThumbnail,
          lessons: response.data.lessons || []
        };
        
        if (courseData.lessons) {
          courseData.lessons = courseData.lessons.map(lesson => ({
            id: lesson.id,
            attributes: {
              documentId: String(lesson.id),
              LessonTitle: lesson.LessonTitle || 'Untitled Lesson',
              LessonDescription: lesson.LessonDescription || '',
              LessonVideoUrl: lesson.LessonVideoUrl || '',
              LessonDuration: lesson.LessonDuration || '0',
              LessonOrder: lesson.LessonOrder || 0,
              LessonIsLocked: lesson.LessonIsLocked || false
            }
          }));
        }
        
        console.log('Setting course data:', courseData);
        setCourse(courseData);

        if (courseData.lessons?.[0]) {
          setCurrentLesson(courseData.lessons[0]);
          loadResources(courseData.lessons[0].id);
        }
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [route?.params?.documentId, route?.params?.courseId]);

  const loadResources = async (lessonId: number) => {
    try {
      setResourcesError(null);
      setResourcesLoading(true);
      setResources([]); // Clear previous resources

      const response = await fetchResources(String(lessonId));
      if (!response?.data) {
        throw new Error('No resources found');
      }
      
      setResources(response.data);
    } catch (err) {
      console.error('Error loading resources:', err);
      setResourcesError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setResourcesLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Course['lessons'][0]) => {
    setCurrentLesson(lesson);
    loadResources(lesson.id);
  };

  useEffect(() => {
    setShowSidebar(width >= 1024);
  }, [width]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderResources = () => {
    if (resourcesLoading) {
      return (
        <View style={styles.resourcesLoadingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <Text style={styles.resourcesLoadingText}>Loading resources...</Text>
        </View>
      );
    }

    if (resourcesError) {
      return (
        <View style={styles.resourcesErrorContainer}>
          <Text style={styles.resourcesErrorText}>{resourcesError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => currentLesson && loadResources(currentLesson.id)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <LessonResources
        resources={resources}
        selectedResourceId={undefined}
        isEditing={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.content, width < 1024 && styles.mobileContent]}>
          <View style={[
            styles.mainContent,
            width < 768 && styles.mainContentMobile
          ]}>
            {/* Video Player */}
            <View style={[
              styles.videoSection,
              width < 768 && styles.videoSectionMobile
            ]}>
              <VideoPlayer
                videoUrl={currentLesson?.attributes.LessonVideoUrl || course?.CourseVideoUrl}
                thumbnailUrl={course?.CourseThumbnail?.data?.attributes?.url}
              />
            </View>

            {/* Lesson Info */}
            <View style={[
              styles.lessonInfo,
              width < 768 && styles.lessonInfoMobile
            ]}>
              <Text style={[
                styles.courseTitle,
                width < 768 && styles.courseTitleMobile
              ]}>{course?.CourseTitle}</Text>
              <Text style={[
                styles.lessonTitle,
                width < 768 && styles.lessonTitleMobile
              ]}>{currentLesson?.attributes.LessonTitle}</Text>
              <Text style={styles.lessonDescription}>
                {currentLesson?.attributes.LessonDescription}
              </Text>
              
              {/* Mobile Lesson List */}
              {width < 1024 && course?.lessons && course.lessons.length > 0 && (
                <View style={[
                  styles.mobileLessonList,
                  width < 768 && styles.mobileLessonListSmall
                ]}>
                  <LessonListSidebar
                    lesson={{ data: course.lessons }}
                    currentLesson={currentLesson}
                    onLessonSelect={handleLessonSelect}
                  />
                </View>
              )}
              
              {/* Lesson Resources */}
              <View style={[
                styles.resourcesSection,
                width < 768 && styles.resourcesSectionMobile
              ]}>
                {renderResources()}
              </View>
            </View>
          </View>

          {/* Desktop Lesson Sidebar */}
          {width >= 1024 && course?.lessons && course.lessons.length > 0 && (
            <View style={styles.sidebar}>
              <LessonListSidebar
                lesson={{ data: course.lessons }}
                currentLesson={currentLesson}
                onLessonSelect={handleLessonSelect}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    flexDirection: 'row',
    minHeight: Platform.OS === 'web' ? '100vh' : 'auto',
  },
  mobileContent: {
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: 24,
  },
  mainContentMobile: {
    padding: 16,
  },
  sidebar: {
    width: 320,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'auto',
  },
  mobileLessonList: {
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    maxHeight: 400,
    overflow: 'hidden',
  },
  mobileLessonListSmall: {
    marginBottom: 16,
    maxHeight: 300,
  },
  videoSection: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoSectionMobile: {
    marginBottom: 16,
    borderRadius: 8,
  },
  lessonInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonInfoMobile: {
    padding: 16,
    borderRadius: 8,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  courseTitleMobile: {
    fontSize: 20,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  lessonTitleMobile: {
    fontSize: 18,
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
    lineHeight: 24,
  },
  resourcesSection: {
    marginTop: 24,
  },
  resourcesSectionMobile: {
    marginTop: 16,
  },
  resourcesLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  resourcesLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  resourcesErrorContainer: {
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
  },
  resourcesErrorText: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
});
