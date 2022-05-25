import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './app/screens/LoginScreen';
import RecordScreen from './app/screens/RecordScreen';
import DesignedRecordScreen from './app/screens/DesignedRecordScreen';
import UploadScreen from './app/screens/UploadScreen';
import DiscoverScreen from './app/screens/DiscoverScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Order of the stack screens please don't change the order */}
          <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="Record2" options={{headerShown: false}} component={DesignedRecordScreen} initialParams={{ isNewContent: true}} />
          <Stack.Screen name="Upload" options={{headerShown: false}} component={UploadScreen} />
          <Stack.Screen name="Discover" options={{headerShown: false}} component={DiscoverScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}