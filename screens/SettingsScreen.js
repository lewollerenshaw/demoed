import * as React from 'react';
import {
  Text, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { isFooterVisible } from '../redux/actions/globalActions';

function SettingsScreen() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(isFooterVisible(false));
  }, []);

  return (
    <View>
      <Text>Just making sure this works</Text>
    </View>
  );
}

export default SettingsScreen;
