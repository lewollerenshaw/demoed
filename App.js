import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from './styles/colors';

const { statusBarHeight } = Constants;

const styles = StyleSheet.create({
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

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Collection</Text>
        <Text style={styles.text}> Body text, testing that it looks ok</Text>
      </View>
    </View>
  );
}
