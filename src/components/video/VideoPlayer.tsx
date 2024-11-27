import React, { useState } from 'react';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (time: number) => void;
  isLocked?: boolean;
  onSubscribeClick?: () => void;
}

export const VideoPlayer = ({
  videoUrl,
  onTimeUpdate,
  isLocked = false,
  onSubscribeClick,
}: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isLocked) {
    return (
      <View style={styles.lockedContainer}>
        <Feather name="lock" size={48} color="#9CA3AF" />
        <Text style={styles.lockedText}>This content is locked</Text>
        {onSubscribeClick && (
          <Pressable style={styles.subscribeButton} onPress={onSubscribeClick}>
            <Text style={styles.subscribeButtonText}>Subscribe to Access</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const VideoComponent = () => {
    if (Platform.OS === 'web') {
      return (
        <iframe
          src={videoUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'black',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // For native platforms, we'll implement native video player later
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Video player not available on this platform</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreen]}>
      <VideoComponent />
      <View style={styles.controls}>
        <Pressable
          style={styles.fullscreenButton}
          onPress={() => setIsFullscreen(!isFullscreen)}
        >
          <Feather
            name={isFullscreen ? 'minimize' : 'maximize'}
            size={24}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  fullscreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullscreenButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  lockedContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lockedText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  subscribeButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
