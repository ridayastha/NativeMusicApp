import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AudioProvider } from './context/AudioContext';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import AudioPlayer from './components/AudioPlayer';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AudioProvider>
      <View style={styles.rootContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: '#fff',
              tabBarInactiveTintColor: '#b3b3b3',
              tabBarStyle: {
                backgroundColor: '#121212',
                borderTopWidth: 1,
                borderTopColor: '#282828',
                paddingBottom: 6,
                height: 55,
              },
              tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
                )
              }}
            />
            <Tab.Screen 
              name="Search" 
              component={SearchScreen} 
              options={{
                tabBarLabel: 'Search',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
                )
              }}
            />
            <Tab.Screen 
              name="Library" 
              component={LibraryScreen} 
              options={{
                tabBarLabel: 'Your Library',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons name={focused ? "library" : "library-outline"} size={22} color={color} />
                )
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>

        {/* Global persistent mini-player overlay */}
        <AudioPlayer />
      </View>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#121212' },
});