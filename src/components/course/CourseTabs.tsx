import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Tab = 'lessons' | 'resources' | 'notes' | 'qa';

interface CourseTabsProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const CourseTabs = ({ currentTab, onTabChange }: CourseTabsProps) => {
  const tabs: { id: Tab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { id: 'lessons', label: 'Lessons', icon: 'list' },
    { id: 'resources', label: 'Resources', icon: 'folder' },
    { id: 'notes', label: 'Notes', icon: 'edit-3' },
    { id: 'qa', label: 'Q&A', icon: 'message-circle' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <Pressable
          key={tab.id}
          style={[
            styles.tab,
            currentTab === tab.id && styles.activeTab,
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Feather
            name={tab.icon}
            size={20}
            color={currentTab === tab.id ? '#7C3AED' : '#6B7280'}
          />
          <Text
            style={[
              styles.tabText,
              currentTab === tab.id && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F5F3FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#7C3AED',
  },
});
