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
    color: Colors.$info,
  },
  heading: {
    fontSize: 32,
  },
});

export default appStyles;
