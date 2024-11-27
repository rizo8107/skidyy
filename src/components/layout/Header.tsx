import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Course Update',
    message: 'New lesson added to Cybersecurity Fundamentals',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Achievement Unlocked',
    message: 'Completed 5 lessons in Network Security',
    time: '1 day ago',
    read: false,
  },
];

export const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = () => {
    if (!user || !user.username) return '??';
    const names = user.username.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const notificationsRef = useRef<View>(null);
  const profileRef = useRef<View>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (notificationsRef.current && !(notificationsRef.current as any).contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !(profileRef.current as any).contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>SKiddy</Text>
          </View>

          {/* User Actions */}
          <View style={styles.actions}>
            {/* Notifications */}
            <View ref={notificationsRef}>
              <Pressable 
                style={styles.iconButton} 
                onPress={() => setShowNotifications(!showNotifications)}
              >
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
                <Feather name="bell" size={20} color="#1F2937" />
              </Pressable>

              {showNotifications && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                      <Text style={styles.dropdownSubtitle}>{unreadCount} unread</Text>
                    )}
                  </View>
                  <ScrollView style={styles.notificationsList}>
                    {notifications.map(notification => (
                      <Pressable
                        key={notification.id}
                        style={[
                          styles.notificationItem,
                          !notification.read && styles.unreadNotification,
                        ]}
                        onPress={() => markNotificationAsRead(notification.id)}
                      >
                        <View style={styles.notificationContent}>
                          <Text style={styles.notificationTitle}>
                            {notification.title}
                          </Text>
                          <Text style={styles.notificationMessage}>
                            {notification.message}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {notification.time}
                          </Text>
                        </View>
                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            <View style={styles.divider} />
            
            {/* Profile */}
            <View ref={profileRef}>
              <Pressable 
                style={styles.profile} 
                onPress={() => setShowProfile(!showProfile)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
                <Text style={styles.profileName}>{user?.username || 'User'}</Text>
                <Feather 
                  name={showProfile ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#1F2937" 
                />
              </Pressable>

              {showProfile && (
                <View style={styles.dropdown}>
                  <View style={styles.profileInfo}>
                    <View style={styles.profileHeader}>
                      <View style={styles.avatarLarge}>
                        <Text style={styles.avatarTextLarge}>{getInitials()}</Text>
                      </View>
                      <View style={styles.profileDetails}>
                        <Text style={styles.profileNameLarge}>{user?.username || 'User'}</Text>
                        <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.dropdownDivider} />
                  <Pressable style={[styles.dropdownItem, styles.logoutItem]} onPress={handleLogout}>
                    <Feather name="log-out" size={18} color="#DC2626" />
                    <Text style={[styles.dropdownItemText, styles.logoutText]}>
                      Log out
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    boxShadow: Platform.OS === 'web' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : undefined,
    elevation: Platform.OS === 'android' ? 2 : undefined,
    height: 64,
    justifyContent: 'center',
    zIndex: 50,
  },
  headerInner: {
    width: '100%',
    paddingHorizontal: 24,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
    height: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 160,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 5,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    boxShadow: Platform.OS === 'web' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : undefined,
    elevation: Platform.OS === 'android' ? 4 : undefined,
    width: 320,
    zIndex: 50,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  notificationsList: {
    maxHeight: 300,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: '#F3F4F6',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    marginLeft: 12,
  },
  profileInfo: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextLarge: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileDetails: {
    flex: 1,
  },
  profileNameLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#4B5563',
  },
  logoutItem: {
    marginTop: 4,
  },
  logoutText: {
    color: '#DC2626',
  },
});
