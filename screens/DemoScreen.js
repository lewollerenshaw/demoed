import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, Button,
} from 'react-native';
import appStyles from '../styles/app';

function DemoScreen() {
  const navigation = useNavigation();

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <Text style={appStyles.heading}>Demo</Text>
        <Text style={appStyles.text}> Body text, testing that it looks ok</Text>
        <Button
          title="Go to DemoCollectionScreen"
          onPress={() => navigation.navigate('DemoCollectionScreen')}
        />
      </View>
    </View>
  );
}

export default DemoScreen;
