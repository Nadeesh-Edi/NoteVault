/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import {
  AppState,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

import NotesList from './src/pages/NotesList';
import AddNote from './src/pages/AddNote';
import OpenNote from './src/pages/OpenNote';
import HowToUse from './src/pages/HowToUse';
import { useAppSelector } from "./src/store/dispatchSelectors";

const Stack = createNativeStackNavigator()

function App(): JSX.Element {
  const appState = useRef(AppState.currentState);
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme()
  const [isEmptyTheme, setIsEmptyTheme] = useState(false)
  const { isAuthenticating } = useAppSelector(state => state.isAuthenticating)
  const isAuthenticatingRef = useRef(isAuthenticating)

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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setIsEmptyTheme(false)
      }

      appState.current = nextAppState;
    });

    const subs = AppState.addEventListener('blur', newState => {
      if (!isAuthenticatingRef.current) {
        setIsEmptyTheme(true)
      }
    })

    const subfocus = AppState.addEventListener('focus', newState => {
      setIsEmptyTheme(false)
    })
  }, [])

  useEffect(() => {
    isAuthenticatingRef.current = isAuthenticating;
  }, [isAuthenticating])

  return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {isEmptyTheme && <View style={styles.emptyBg}></View>}
        {!isEmptyTheme &&
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="NotesList" component={NotesList} options={withoutHeader} />
              <Stack.Screen name="AddNote" component={AddNote} options={withoutHeader} />
              <Stack.Screen name="OpenNote" component={OpenNote} options={withoutHeader} />
              <Stack.Screen name="HowtoUse" component={HowToUse} options={withoutHeader} />
            </Stack.Navigator>
          </NavigationContainer>}
      </SafeAreaView>
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
  emptyBg: {
    backgroundColor: '#fff'
  }
});

export default App;
