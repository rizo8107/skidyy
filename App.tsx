import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MyCoursesScreen } from './src/screens/MyCoursesScreen';
import { CourseDetailScreen } from './src/screens/CourseDetailScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HelpScreen } from './src/screens/HelpScreen';
import { CoursePlayerScreen } from './src/screens/CoursePlayerScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { Sidebar } from './src/components/layout/Sidebar';
import { Header } from './src/components/layout/Header';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { useNavigation, NavigationState } from '@react-navigation/native';
import { linking } from './src/navigation/linking';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [currentRoute, setCurrentRoute] = useState('/home');
  const { isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e: any) => {
      if (e?.data?.state?.routes?.length > 0) {
        const routes = e.data.state.routes;
        const currentIndex = e.data.state.index;
        const currentScreen = routes[currentIndex]?.name;
        if (currentScreen) {
          setCurrentRoute('/' + currentScreen.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase());
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleNavigation = (route: string) => {
    const screenName = route.replace('/', '').split('-').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    navigation.navigate(screenName as never);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'web' ? 'none' : 'default',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <View style={styles.appContainer}>
      <Header />
      <View style={styles.mainLayout}>
        {!isMobile && (
          <Sidebar 
            navigation={{ navigate: handleNavigation }}
            currentRoute={currentRoute}
          />
        )}
        <View style={styles.content}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: Platform.OS === 'web' ? 'none' : 'default',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MyCourses" component={MyCoursesScreen} />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </Stack.Navigator>
        </View>
      </View>
    </View>
  );
};

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F9FAFB',
    },
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer theme={theme} linking={linking}>
            <AppContent />
          </NavigationContainer>
          <Toast />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
