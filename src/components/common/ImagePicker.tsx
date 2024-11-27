import React from 'react';
import { View, Image, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ImagePickerProps {
  imageUrl?: string;
  onImageSelect: (file: File | null) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ imageUrl, onImageSelect }) => {
  const handleImageSelect = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          onImageSelect(file);
        }
      };
      input.click();
    }
  };

  return (
    <Pressable onPress={handleImageSelect} style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.placeholderText}>Add Photo</Text>
        </View>
      )}
      <View style={styles.editBadge}>
        <Feather name="edit-2" size={12} color="#FFFFFF" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7C3AED',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
