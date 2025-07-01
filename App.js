import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import WorkoutLoggerScreen from './src/screens/WorkoutLoggerScreen';
import WeightLoggerScreen from './src/screens/WeightLoggerScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import BoxingTimerScreen from './src/screens/BoxingTimerScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/styles/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Home and related screens
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="WorkoutLogger" component={WorkoutLoggerScreen} />
      <Stack.Screen name="WeightLogger" component={WeightLoggerScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tertiary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 34,
          paddingTop: 8,
          height: 90,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.border,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={BoxingTimerScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}