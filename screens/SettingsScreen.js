import * as React from 'react';
import {
  Text, View, Picker, TouchableOpacity, AsyncStorage,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { isFooterVisible } from '../redux/actions/globalActions';
import { SETTINGS_STORAGE_KEY } from '../redux/storageKeys';
import { setAudioQuality, setOptionSaveRecording, setAutoSaveToDemoInRedux } from '../redux/actions/settingsActions';
import appStyles from '../styles/app';
import settingsStyles from '../styles/settings';
import * as RootNavigation from '../services/navigation/RootNavigation';

function SettingsScreen() {
  const settings = useSelector((state) => state.settings);
  const [quality, setQuality] = React.useState(settings.quality);
  const [optionalSaveRecording, setOptionalSaveRecording] = React.useState();
  const [autoSaveToDemo, setAutoSaveToDemo] = React.useState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(isFooterVisible(false));
    // Convert from bool to string for picker
    if (settings.optionalSaveRecording === true) {
      setOptionalSaveRecording('true');
    } else {
      setAutoSaveToDemo('false');
    }

    if (settings.autoSaveToDemo === true) {
      setOptionalSaveRecording('true');
    } else {
      setAutoSaveToDemo('false');
    }
  }, []);

  const changeSettingsInStorage = async () => {
    // Get
    let settingsStorage = JSON.parse(await AsyncStorage.getItem(SETTINGS_STORAGE_KEY));
    // Change
    settingsStorage = {
      quality,
      optionalSaveRecording,
      autoSaveToDemo,
    };
    // Set
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage));
  };

  const handleSave = () => {
    // Set audio quality in redux so it can be fetched instantly
    dispatch(setAudioQuality(quality));

    // Set auto save in redux so it can be fetched instantly
    dispatch(setOptionSaveRecording(optionalSaveRecording));

    // Set auto save in redux so it can be fetched instantly
    dispatch(setAutoSaveToDemoInRedux(autoSaveToDemo));

    // Set in async
    changeSettingsInStorage();
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

        <Text>Auto Save Recordings</Text>
        <Picker
          selectedValue={optionalSaveRecording}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setOptionalSaveRecording(itemValue)}
        >
          <Picker.Item label="Auto Save Recordings" value="true" />
          <Picker.Item label="Option To Cancel Recording Before Saving" value="false" />
        </Picker>

        <Text>Create New Demo On Finish Recording</Text>
        <Picker
          selectedValue={autoSaveToDemo}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setAutoSaveToDemo(itemValue)}
        >
          <Picker.Item label="Create New Demo" value="true" />
          <Picker.Item label="Select Demo" value="false" />
        </Picker>

        <TouchableOpacity onPress={() => handleSave()}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SettingsScreen;
