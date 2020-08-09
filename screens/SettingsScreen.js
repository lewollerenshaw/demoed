import * as React from 'react';
import {
  Text, View, Picker, TouchableOpacity, AsyncStorage,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isFooterVisible } from '../redux/actions/globalActions';
import { SETTINGS_STORAGE_KEY } from '../redux/storageKeys';
import { setAudioQuality } from '../redux/actions/settingsActions';

function SettingsScreen() {
  const settings = useSelector((state) => state.settings);
  const [quality, setQuality] = React.useState(settings.quality);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(isFooterVisible(false));
  }, []);

  const handleSave = async () => {
    // Set audio quality in redux so it can be fetched instantly
    dispatch(setAudioQuality(quality));

    // Set audio quality in async
    // Get
    const settingsStorage = JSON.parse(await AsyncStorage.getItem(SETTINGS_STORAGE_KEY));
    // Change
    settingsStorage.quality = quality;
    // Set
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage));
  };

  return (
    <View style={{
      flex: 1,
      paddingTop: 40,
      alignItems: 'center',
    }}
    >
      <Text>Audio Recording Quality</Text>
      <Picker
        selectedValue={quality}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setQuality(itemValue)}
      >
        <Picker.Item label="High" value="HIGH" />
        <Picker.Item label="Low" value="LOW" />
      </Picker>

      <TouchableOpacity onPress={() => handleSave()}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SettingsScreen;
