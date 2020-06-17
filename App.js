import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Button } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from './styles/colors';

const { statusBarHeight } = Constants;
const Stack = createStackNavigator();

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

function DemoCollectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Collection</Text>
        <Text style={styles.text}> Body text, testing that it looks ok</Text>
        <Button
          title="Go to DemoScreen"
          onPress={() => navigation.navigate('DemoScreen')}
        />
      </View>
    </View>
  );
}

function DemoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>Demo</Text>
        <Text style={styles.text}> Body text, testing that it looks ok</Text>
        <Button
          title="Go to DemoCollectionScreen"
          onPress={() => navigation.navigate('DemoCollectionScreen')}
        />
      </View>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DemoCollectionScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="DemoCollectionScreen" component={DemoCollectionScreen} />
        <Stack.Screen name="DemoScreen" component={DemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
