/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import NotesList from './src/pages/NotesList';
import AddNote from './src/pages/AddNote';
import OpenNote from './src/pages/OpenNote';
import HowToUse from './src/pages/HowToUse';

const Stack = createNativeStackNavigator()

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme()

  const backgroundStyle = {
    backgroundColor: theme.colors.primary,
    flex: 1
  };

  const withoutHeader = {
    headerShown: false
  }

  const withHeader: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="NotesList" component={NotesList} options={withoutHeader} />
            <Stack.Screen name="AddNote" component={AddNote} options={withoutHeader} />
            <Stack.Screen name="OpenNote" component={OpenNote} options={withoutHeader} />
            <Stack.Screen name="HowtoUse" component={HowToUse} options={withoutHeader} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
