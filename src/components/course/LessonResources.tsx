import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface Resource {
  id: number;
  documentId: string;
  FileUrl: string;
  ResourceTitle: string;
  ResourceDescription: string;
  ResourceType: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface LessonResourcesProps {
  resources: Resource[];
  onResourceSelect?: (resource: Resource) => void;
  selectedResourceId?: number;
  isEditing?: boolean;
}

const getResourceIcon = (resourceType: string) => {
  const type = resourceType.toLowerCase();
  if (type.includes('document')) return 'description';
  if (type.includes('video')) return 'play-circle-outline';
  if (type.includes('link')) return 'link';
  if (type.includes('pdf')) return 'picture-as-pdf';
  if (type.includes('image')) return 'image';
  return 'attachment';
};

const getResourceColor = (resourceType: string, colors: any) => {
  const type = resourceType.toLowerCase();
  if (type.includes('document')) return '#4285F4'; // Google Docs blue
  if (type.includes('video')) return '#FF0000'; // YouTube red
  if (type.includes('link')) return '#2196F3'; // Material blue
  if (type.includes('pdf')) return '#FF5722'; // PDF orange
  if (type.includes('image')) return '#4CAF50'; // Green
  return colors.primary;
};

export const LessonResources: React.FC<LessonResourcesProps> = ({
  resources,
  onResourceSelect,
  selectedResourceId,
  isEditing = false,
}) => {
  const { colors } = useTheme();

  const handleResourcePress = async (resource: Resource) => {
    if (isEditing && onResourceSelect) {
      onResourceSelect(resource);
    } else {
      try {
        const supported = await Linking.canOpenURL(resource.FileUrl);
        if (supported) {
          await Linking.openURL(resource.FileUrl);
        } else {
          console.error("Don't know how to open URI: " + resource.FileUrl);
        }
      } catch (error) {
        console.error("Error opening resource URL:", error);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerIcon: {
      marginRight: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    resourceItem: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    selectedResource: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    resourceIcon: {
      marginRight: 16,
      width: 40,
      alignItems: 'center',
    },
    resourceContent: {
      flex: 1,
    },
    resourceTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    resourceDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
      marginBottom: 8,
    },
    resourceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resourceType: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.6,
      backgroundColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    noResourcesContainer: {
      alignItems: 'center',
      padding: 24,
    },
    noResourcesIcon: {
      marginBottom: 12,
    },
    noResourcesText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      textAlign: 'center',
    },
    resourceArrow: {
      marginLeft: 8,
    },
  });

  if (!resources || resources.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <MaterialIcons 
            name="folder-open" 
            size={24} 
            color={colors.text} 
            style={styles.headerIcon} 
          />
          <Text style={styles.title}>Resources</Text>
        </View>
        <View style={styles.noResourcesContainer}>
          <MaterialIcons
            name="source"
            size={48}
            color={colors.text}
            style={styles.noResourcesIcon}
            opacity={0.5}
          />
          <Text style={styles.noResourcesText}>No resources available for this lesson</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons 
          name="folder-open" 
          size={24} 
          color={colors.text} 
          style={styles.headerIcon} 
        />
        <Text style={styles.title}>Resources</Text>
      </View>
      <ScrollView>
        {resources.map((resource) => {
          const iconName = getResourceIcon(resource.ResourceType);
          const iconColor = getResourceColor(resource.ResourceType, colors);
          
          return (
            <TouchableOpacity
              key={resource.id}
              style={[
                styles.resourceItem,
                selectedResourceId === resource.id && styles.selectedResource,
              ]}
              onPress={() => handleResourcePress(resource)}
            >
              <View style={styles.resourceIcon}>
                <MaterialIcons name={iconName} size={24} color={iconColor} />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.ResourceTitle}</Text>
                <Text style={styles.resourceDescription}>
                  {resource.ResourceDescription}
                </Text>
                <View style={styles.resourceMeta}>
                  <Text style={styles.resourceType}>{resource.ResourceType}</Text>
                </View>
              </View>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color={colors.text} 
                style={styles.resourceArrow}
                opacity={0.3}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default LessonResources;
