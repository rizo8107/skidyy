import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FAQItem } from '../components/help/FAQItem';
import { SupportTicketForm } from '../components/help/SupportTicketForm';

// Mock FAQs data
const mockFAQs = [
  {
    id: '1',
    question: 'How do I enroll in a course?',
    answer: 'To enroll in a course, navigate to the course page and click the "Enroll Now" button. If the course is paid, you\'ll be directed to the payment page. Once enrolled, the course will appear in your "My Courses" section.',
    category: 'Courses',
  },
  {
    id: '2',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the link to create a new password.',
    category: 'Account',
  },
  {
    id: '3',
    question: 'How do I cancel my subscription?',
    answer: 'Go to Settings > Subscription > Manage Subscription. Click on "Cancel Subscription" and follow the prompts. Your access will continue until the end of your billing period.',
    category: 'Billing',
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers in selected regions.',
    category: 'Billing',
  },
  {
    id: '5',
    question: 'How do I download course materials?',
    answer: 'Course materials can be downloaded from the course page. Look for the download icon next to downloadable resources. Note that not all courses offer downloadable content.',
    category: 'Technical',
  },
];

// Mock system status
const systemStatus = {
  status: 'operational',
  lastUpdated: new Date(),
  services: [
    { name: 'Course Platform', status: 'operational' },
    { name: 'Video Streaming', status: 'operational' },
    { name: 'Payment System', status: 'operational' },
    { name: 'User Authentication', status: 'operational' },
  ],
};

export const HelpScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredFAQs, setFilteredFAQs] = useState(mockFAQs);

  const categories = ['All', ...new Set(mockFAQs.map(faq => faq.category))];

  useEffect(() => {
    const filtered = mockFAQs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredFAQs(filtered);
  }, [searchQuery, selectedCategory]);

  const handleSubmitTicket = async (ticket: any) => {
    try {
      // TODO: Implement API call
      await fetch('/api/help-center/tickets', {
        method: 'POST',
        body: JSON.stringify(ticket),
      });
      alert('Ticket submitted successfully!');
    } catch (error) {
      alert('Failed to submit ticket. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>Find answers or get support</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.systemStatus}>
        <View style={styles.statusHeader}>
          <Feather 
            name={systemStatus.status === 'operational' ? 'check-circle' : 'alert-circle'} 
            size={20} 
            color={systemStatus.status === 'operational' ? '#059669' : '#DC2626'} 
          />
          <Text style={styles.statusTitle}>System Status</Text>
        </View>
        <Text style={styles.statusText}>
          All systems are operational
        </Text>
        <Text style={styles.statusUpdate}>
          Last updated: {systemStatus.lastUpdated.toLocaleString()}
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {filteredFAQs.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            category={faq.category}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need More Help?</Text>
        <SupportTicketForm onSubmit={handleSubmitTicket} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111827',
  },
  systemStatus: {
    margin: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  statusUpdate: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#7C3AED',
  },
  categoryText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
});
