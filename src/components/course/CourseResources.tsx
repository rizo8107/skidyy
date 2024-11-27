import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'code' | 'link' | 'slides';
  url: string;
  size?: string;
  preview?: string;
  description?: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  resources: Resource[];
}

interface CourseResourcesProps {
  categories: ResourceCategory[];
  onDownload: (resource: Resource) => void;
  onDownloadAll: () => void;
}

export const CourseResources = ({
  categories,
  onDownload,
  onDownloadAll,
}: CourseResourcesProps) => {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return 'file-text';
      case 'image':
        return 'image';
      case 'code':
        return 'code';
      case 'link':
        return 'link';
      case 'slides':
        return 'monitor';
      default:
        return 'file';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Course Resources</Text>
        <Pressable style={styles.downloadAllButton} onPress={onDownloadAll}>
          <Feather name="download-cloud" size={20} color="#7C3AED" />
          <Text style={styles.downloadAllText}>Download All</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map(category => (
          <View key={category.id} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.resourcesList}>
              {category.resources.map(resource => (
                <Pressable
                  key={resource.id}
                  style={styles.resourceItem}
                  onPress={() => onDownload(resource)}
                >
                  <View style={styles.resourcePreview}>
                    {resource.preview ? (
                      <Image
                        source={{ uri: resource.preview }}
                        style={styles.previewImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.iconContainer}>
                        <Feather
                          name={getResourceIcon(resource.type)}
                          size={24}
                          color="#6B7280"
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    {resource.description && (
                      <Text style={styles.resourceDescription} numberOfLines={2}>
                        {resource.description}
                      </Text>
                    )}
                    {resource.size && (
                      <Text style={styles.resourceSize}>{resource.size}</Text>
                    )}
                  </View>
                  <Feather name="download" size={20} color="#6B7280" />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  downloadAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
  },
  downloadAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C3AED',
  },
  content: {
    flex: 1,
  },
  category: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 12,
  },
  resourcePreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceInfo: {
    flex: 1,
    gap: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  resourceDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  resourceSize: {
    fontSize: 12,
    color: '#6B7280',
  },
});
