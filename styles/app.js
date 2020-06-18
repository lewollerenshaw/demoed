import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from './colors';

const { statusBarHeight } = Constants;

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.$lightShade,
    padding: 10,
  },
  body: {
    paddingTop: statusBarHeight,
    color: Colors.$primary,
  },
  heading: {
    fontSize: 32,
    color: Colors.$info,
  },
});

export default appStyles;
