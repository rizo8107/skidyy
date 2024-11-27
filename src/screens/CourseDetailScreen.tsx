import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CourseDetailScreenProps {
  route: {
    params: {
      courseId: string;
    };
  };
  navigation: any;
}

export const CourseDetailScreen = ({ route, navigation }: CourseDetailScreenProps) => {
  // Mock data - in a real app, this would be fetched based on courseId
  const course = {
    id: '1',
    title: 'Cybersecurity Fundamentals',
    category: 'Cybersecurity',
    duration: '8h 15m',
    rating: 4.9,
    thumbnail: 'https://picsum.photos/800/600?random=4',
    instructor: 'Alex Thompson',
    progress: 0,
    status: 'upcoming',
    description: 'Learn the fundamentals of cybersecurity, including network security, cryptography, and ethical hacking basics.',
    topics: [
      'Introduction to Cybersecurity',
      'Network Security Fundamentals',
      'Basic Cryptography',
      'Security Tools and Practices',
      'Ethical Hacking Introduction',
      'Security Policies and Procedures'
    ],
    requirements: [
      'Basic understanding of computer networks',
      'Familiarity with operating systems (Windows/Linux)',
      'No prior security knowledge required'
    ],
    whatYouWillLearn: [
      'Understand core cybersecurity concepts',
      'Learn basic cryptography principles',
      'Identify common security threats',
      'Implement basic security measures',
      'Use essential security tools',
      'Develop security-first mindset'
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: course.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.category}>{course.category}</Text>
          </View>
          <Pressable style={styles.enrollButton}>
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Feather name="clock" size={16} color="#6B7280" />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>
          <View style={styles.stat}>
            <Feather name="star" size={16} color="#6B7280" />
            <Text style={styles.statText}>{course.rating}</Text>
          </View>
          <View style={styles.stat}>
            <Feather name="user" size={16} color="#6B7280" />
            <Text style={styles.statText}>{course.instructor}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          {course.whatYouWillLearn.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Feather name="check-circle" size={16} color="#059669" />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {course.requirements.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Feather name="chevron-right" size={16} color="#6B7280" />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          {course.topics.map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <View style={styles.topicHeader}>
                <Feather name="play-circle" size={16} color="#6B7280" />
                <Text style={styles.topicTitle}>{topic}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.startButton}
          onPress={() => navigation.navigate('CoursePlayer', { courseId: route.params?.courseId })}
        >
          <Text style={styles.startButtonText}>Start Learning</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  thumbnail: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    flex: 1,
    marginRight: 16,
  },
  category: {
    fontSize: 16,
    color: '#6B7280',
  },
  enrollButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#6B7280',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  listItemText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  topicItem: {
    marginBottom: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicTitle: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
