import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RecipesScreen from './screens/RecipesScreen';
import ProgressScreen from './screens/ProgressScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { colors } from './theme/colors';
import { UserRole, User } from './types';
import { MOCK_USER } from './constants';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);

  const handleLogin = (role: UserRole, user?: User) => {
    setUserRole(role);
    if (user) setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(UserRole.GUEST);
    setCurrentUser(MOCK_USER);
  };

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <LoginScreen onLogin={handleLogin} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.surface, elevation: 0, shadowOpacity: 0 },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDisabled,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = 'home';
            if (route.name === 'Reja') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Retseptlar') iconName = focused ? 'restaurant' : 'restaurant-outline';
            else if (route.name === 'Progress') iconName = focused ? 'trending-up' : 'trending-up-outline';
            else if (route.name === 'Mashqlar') iconName = focused ? 'barbell' : 'barbell-outline';
            else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName as any} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Reja" options={{ title: "Kunlik Reja" }}>
          {() => <HomeScreen user={currentUser} />}
        </Tab.Screen>
        <Tab.Screen name="Retseptlar" options={{ title: "Retseptlar" }}>
          {() => <RecipesScreen />}
        </Tab.Screen>
        <Tab.Screen name="Progress" options={{ title: "Progress" }}>
          {() => <ProgressScreen user={currentUser} />}
        </Tab.Screen>
        <Tab.Screen name="Mashqlar" options={{ title: "Mashqlar" }}>
          {() => <WorkoutsScreen />}
        </Tab.Screen>
        <Tab.Screen name="Profil" options={{ title: "Profil" }}>
          {() => <ProfileScreen user={currentUser} onLogout={handleLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
