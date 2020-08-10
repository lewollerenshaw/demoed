import * as React from 'react';
import {
  Text, View, Picker, TouchableOpacity, AsyncStorage,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { isFooterVisible } from '../redux/actions/globalActions';
import { SETTINGS_STORAGE_KEY } from '../redux/storageKeys';
import { setAudioQuality } from '../redux/actions/settingsActions';
import appStyles from '../styles/app';
import settingsStyles from '../styles/settings';
import * as RootNavigation from '../services/navigation/RootNavigation';

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
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={settingsStyles.headerContainer}>
          <View style={settingsStyles.headingRow}>
            <TouchableOpacity onPress={() => RootNavigation.navigate('DemoCollectionScreen')}>
              <FontAwesomeIcon style={appStyles.backChevron} size={20} icon={faChevronLeft} />
            </TouchableOpacity>
            <Text style={appStyles.heading}>Settings</Text>
          </View>
        </View>

        <Text>Audio Recording Quality</Text>
        <Picker
          selectedValue={quality}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setQuality(itemValue)}
        >
          <Picker.Item label="High" value="HIGH" />
          <Picker.Item label="Low" value="LOW" />
        </Picker>

        <TouchableOpacity onPress={() => handleSave()}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SettingsScreen;
