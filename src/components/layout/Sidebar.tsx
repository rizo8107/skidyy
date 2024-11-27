import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';

interface NavItemProps {
  iconName: keyof typeof Feather.glyphMap;
  label: string;
  route: string;
  isCollapsed: boolean;
  isActive?: boolean;
  onPress: () => void;
}

const NavItem = ({ iconName, label, isCollapsed, isActive, onPress }: NavItemProps) => (
  <Pressable
    style={[styles.navItem, isActive && styles.navItemActive]}
    onPress={onPress}
  >
    <View style={[styles.navIcon, isActive && styles.navIconActive]}>
      <Feather name={iconName} size={18} color={isActive ? '#7C3AED' : '#4B5563'} />
    </View>
    {!isCollapsed && (
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    )}
  </Pressable>
);

const menuItems = [
  {
    label: 'My Courses',
    route: '/my-courses',
    icon: 'book-open',
  },
  {
    label: 'Settings',
    route: '/settings',
    icon: 'settings',
  },
  {
    label: 'Help Center',
    route: '/help',
    icon: 'help-circle',
  },
];

export const Sidebar = ({ navigation, currentRoute = '/my-courses' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const sidebarStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isCollapsed ? 64 : 240, {
        damping: 15,
        stiffness: 100,
      }),
      transform: [{
        translateX: withSpring(isMobile && isCollapsed ? -64 : 0)
      }]
    };
  }, [isCollapsed, isMobile]);

  const handleNavigation = (route: string) => {
    const screenName = route.replace('/', '').split('-').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    navigation.navigate(screenName);
  };

  return (
    <Animated.View style={[styles.sidebar, sidebarStyle]}>
      {/* Toggle Button */}
      <Pressable 
        style={styles.toggleButton} 
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <Feather 
          name={isCollapsed ? 'chevron-right' : 'chevron-left'} 
          size={20} 
          color="#4B5563" 
        />
      </Pressable>

      {/* Navigation Items */}
      <View style={styles.navItems}>
        {menuItems.map((item) => (
          <NavItem
            key={item.route}
            iconName={item.icon}
            label={item.label}
            route={item.route}
            isCollapsed={isCollapsed}
            isActive={currentRoute === item.route}
            onPress={() => handleNavigation(item.route)}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: 'white',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    boxShadow: Platform.OS === 'web' ? '2px 0 4px rgba(0, 0, 0, 0.05)' : undefined,
    elevation: Platform.OS === 'android' ? 2 : undefined,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navItems: {
    marginTop: 64,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#F5F3FF',
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    backgroundColor: '#EDE9FE',
  },
  navLabel: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  navLabelActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
});
