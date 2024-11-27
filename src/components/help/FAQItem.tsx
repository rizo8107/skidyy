import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FAQItemProps {
  question: string;
  answer: string;
  category: string;
}

export const FAQItem = ({ question, answer, category }: FAQItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.questionContainer, isExpanded && styles.expanded]} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.header}>
          <View style={styles.questionContent}>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>
          <Feather 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6B7280"
          />
        </View>
      </Pressable>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questionContainer: {
    padding: 16,
  },
  expanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionContent: {
    flex: 1,
    marginRight: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  answerContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  answer: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
});
