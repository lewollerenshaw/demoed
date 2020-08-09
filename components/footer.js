import * as React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Record from './record';
import * as RootNavigation from '../services/navigation/RootNavigation';

function Footer() {
  return (
    <View>
      <TouchableOpacity onPress={() => RootNavigation.navigate('SettingsScreen')}>
        <Text>Settings</Text>
      </TouchableOpacity>
      <Record />
    </View>
  );
}

export default Footer;
