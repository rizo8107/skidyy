import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Play } from 'lucide-react';

export const VideoPlayer = () => {
  return (
    <View style={styles.container}>
      {/* Video Thumbnail */}
      <View style={styles.thumbnail}>
        {/* Add video thumbnail image here */}
      </View>

      {/* Custom Play Button Overlay */}
      <Pressable style={styles.playButton}>
        <View style={styles.playIcon}>
          <Play className="w-8 h-8 text-white" />
        </View>
      </Pressable>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111827',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1F2937',
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#4B5563',
  },
  progress: {
    height: '100%',
    width: '33%',
    backgroundColor: '#7C3AED',
  },
});
