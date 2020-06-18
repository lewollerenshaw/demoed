import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DemoScreen from './screens/DemoScreen';
import DemoCollectionScreen from './screens/DemoCollectionScreen';

const Stack = createStackNavigator();

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
