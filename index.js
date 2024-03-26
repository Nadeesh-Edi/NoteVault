/**
 * @format
 */
import 'react-native-get-random-values'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import Note from './src/schemas/NoteSchema';
import { RealmProvider } from '@realm/react';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#03396c',
      secondary: '#fff',
      surface: '#03396c',
      surfaceVariant: '#A1D1FF',
      onPrimary: '#A5BBCF',
      roundness: 5
    },
  };

export default function Main() {
    return (
        <RealmProvider schema={[Note]}>
            <PaperProvider theme={theme}>
                <App />
            </PaperProvider>
        </RealmProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
