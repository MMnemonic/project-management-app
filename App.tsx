import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import { ProjectListScreen } from './src/screens/ProjectListScreen';
import { ProjectFormScreen } from './src/screens/ProjectFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="ProjectList">
          <Stack.Screen 
            name="ProjectList" 
            component={ProjectListScreen} 
            options={{ 
              title: 'Projects',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="ProjectForm" 
            component={ProjectFormScreen} 
            options={{ 
              title: 'New Project',
              headerBackTitle: 'Back',
            }} 
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
