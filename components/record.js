import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {
  View, Text, TouchableWithoutFeedback, AsyncStorage,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addDemo } from '../redux/actions/demoActions';
import Demo from '../models/demo';
import Recording from '../models/recording';

function record() {
  const [permissions, setPermissions] = React.useState();
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingInstance, setRecordingInstance] = React.useState(null);
  const currentScreen = useSelector((state) => state.global.currentScreen);
  const currentDemoId = useSelector((state) => state.global.currentDemoId);
  const demos = useSelector((state) => state.demos);
  const dispatch = useDispatch();

  const STORAGE_KEY = 'demos: demo';

  const getPermissions = async () => {
    const response = await Audio.requestPermissionsAsync();
    console.log(response);
    setPermissions(response.granted);
  };

  const recordingCallback = (status) => {
    console.log(status);
    //durationMillis, isRecording, isDoneRecording;
  };

  const createRecordingInstance = () => {
    if (recordingInstance == null) {
      console.log('Creating recording instance...');
      const newRecordingInstance = new Audio.Recording();
      newRecordingInstance.setOnRecordingStatusUpdate(recordingCallback);
      newRecordingInstance.setProgressUpdateInterval(200);
      setRecordingInstance(newRecordingInstance);
    }
  };

  const startRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    await recordingInstance.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
    );

    await recordingInstance.startAsync();

    console.log('Recording...');
    setIsRecording(true);
  };

  const moveRecordingToNewFolder = async () => {
    const folder = await `${FileSystem.documentDirectory}recordings/`;
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

    const URI = await recordingInstance.getURI();
    const recordingName = URI.substring(URI.lastIndexOf('/') + 1);
    await FileSystem.moveAsync({
      from: URI,
      to: folder + recordingName,
    });

    console.log('Folder:', folder);
    const res = await FileSystem.readDirectoryAsync(folder);
    console.log(res);

    return folder + recordingName;
  };

  const storeRecording = async (URI, response) => {
    const recording = new Recording('Recording Title', response.durationMillis, ['Tag1, Tag2'], URI, new Date(2013, 3, 25, 10, 33, 30));

    // If currently on Your Collection screen
    if (currentScreen === 'DemoCollectionScreen') {
      const demo = new Demo('123', 'Demo Title', [recording], new Date(2013, 3, 25, 10, 33, 30));

      // Store in redux
      await dispatch(addDemo(demo));

      // Store in async storage
      // Check if async storage is not empty
      const storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
      if (storageData !== null) await AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify(demo));
      else await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    } else {
      // If on Demo Screen
      console.log('On demo screen');
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    const response = await recordingInstance.stopAndUnloadAsync();
    setIsRecording(false);
    const URI = await moveRecordingToNewFolder();

    await storeRecording(URI, response);

    setRecordingInstance(null);
  };

  const handleRecordingPress = () => {
    console.log('Handling recording press...');
    if (permissions) if (isRecording) stopRecording(); else createRecordingInstance();
  };

  React.useEffect(() => {
    if (recordingInstance !== null && !isRecording) startRecording();
  }, [recordingInstance]);

  React.useEffect(() => {
    getPermissions();
  }, []);

  React.useEffect(() => {
    console.log("currentDemoId:", currentDemoId);
  }, [currentDemoId]);

  // Debug functions
  async function checkDemosInStorage() {
    const response = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(response);
  }

  async function checkRecordingsInDirectory() {
    const directory = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}recordings/`);
    console.log(directory);
  }

  async function removeDemosFromStorage() {
    await AsyncStorage.clear();
  }

  async function removeRecordingsFromDir() {
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}recordings/`);
  }

  return (
    <View>
      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => handleRecordingPress()}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => console.log(isRecording)}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check is recording
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => console.log(recordingInstance)}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check recording instance
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => console.log(demos)}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check demos in redux
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => checkDemosInStorage()}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check demos in async storage
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => checkRecordingsInDirectory()}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check recordings in directory
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => removeDemosFromStorage()}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Remove demos in local storage
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{
        width: '100%',
        height: 40,
        border: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
      >
        <TouchableWithoutFeedback onPress={() => removeRecordingsFromDir()}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Remove recordings from directory
          </Text>
        </TouchableWithoutFeedback>
      </View>

    </View>
  );
}
export default record;
