import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
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
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: '#FFFFFF',
              tabBarInactiveTintColor: '#8E8E93', // iOS style muted gray
              tabBarStyle: styles.tabBar,
              tabBarLabelStyle: styles.tabBarLabel,
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
                tabBarLabel: 'Library',
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons name={focused ? "library" : "library-outline"} size={22} color={color} />
                )
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>

        {/* Global floating/persistent mini-player layer */}
        <AudioPlayer />
      </View>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: { 
    flex: 1, 
    backgroundColor: '#0A0A0A' // Slightly deeper pitch black for high-contrast UI
  },
  tabBar: {
    backgroundColor: '#16161A', // Elevated dark surface
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E', // Subtle high-contrast separation line
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 88 : 64,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tabBarLabel: { 
    fontSize: 11, 
    fontWeight: '600',
    marginTop: 2,
  }
});