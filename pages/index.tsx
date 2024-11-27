import { useEffect } from 'react'
import type { NextPage } from 'next'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Import your existing screens
import CoursePlayerScreen from '../src/screens/CoursePlayerScreen'

const Stack = createNativeStackNavigator()

const Home: NextPage = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="CoursePlayer" 
          component={CoursePlayerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Home
