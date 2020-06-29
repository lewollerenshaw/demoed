import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {
  View, Text, TouchableWithoutFeedback, AsyncStorage,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addDemo, addRecording } from '../redux/actions/demoActions';
import Demo from '../models/demo';
import Recording from '../models/recording';
import { idGenerator } from '../utils/helpers';
import { BIN_STORAGE_KEY } from '../redux/storageKeys';

function record() {
  const [permissions, setPermissions] = React.useState();
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingInstance, setRecordingInstance] = React.useState(null);
  const currentScreen = useSelector((state) => state.global.currentScreen);
  const currentDemoId = useSelector((state) => state.global.currentDemoId);
  const bin = useSelector((state) => state.bin);
  const demos = useSelector((state) => state.demos);
  const dispatch = useDispatch();

  const STORAGE_KEY = 'demos: demo';

  const getPermissions = async () => {
    const response = await Audio.requestPermissionsAsync();
    setPermissions(response.granted);
  };

  const recordingCallback = (status) => {
    console.log(status);
  };

  const createRecordingInstance = () => {
    if (recordingInstance == null) {
      const newRecordingInstance = new Audio.Recording();
      newRecordingInstance.setOnRecordingStatusUpdate(recordingCallback);
      newRecordingInstance.setProgressUpdateInterval(200);
      setRecordingInstance(newRecordingInstance);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);

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
  };

  const moveRecordingToNewFolder = async () => {
    const folder = `${FileSystem.documentDirectory}recordings/`;
    const URI = await recordingInstance.getURI();
    const recordingName = URI.substring(URI.lastIndexOf('/') + 1);

    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

    await FileSystem.moveAsync({
      from: URI,
      to: folder + recordingName,
    });

    return folder + recordingName;
  };

  const storeRecording = async (URI, response) => {
    const recording = new Recording(
      idGenerator(),
      'Recording Title',
      response.durationMillis,
      ['Tag1, Tag2'],
      URI,
      new Date(),
    );

    if (currentScreen === 'DemoCollectionScreen') {
      const demo = new Demo(
        idGenerator(),
        'Demo Title',
        [recording],
        new Date(),
      );

      dispatch(addDemo(demo));

      const storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));

      if (storageData !== null) {
        storageData.push(demo);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } else await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([demo]));
    } else {
      dispatch(addRecording(recording, currentDemoId));

      const storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));

      storageData.forEach((demo) => {
        if (demo.id.includes(currentDemoId)) demo.recordings.push(recording);
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    }
  };

  const stopRecording = async () => {
    const response = await recordingInstance.stopAndUnloadAsync();
    setIsRecording(false);
    setRecordingInstance(null);

    const URI = await moveRecordingToNewFolder();
    await storeRecording(URI, response);
  };

  const handleRecordingPress = () => {
    if (permissions) if (isRecording) stopRecording(); else createRecordingInstance();
  };

  React.useEffect(() => {
    getPermissions();
  }, []);

  React.useEffect(() => {
    if (recordingInstance !== null && !isRecording) startRecording();
  }, [recordingInstance]);

  React.useEffect(() => {
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

  async function checkBinInLocalStorage() {
    console.log(JSON.parse(await AsyncStorage.getItem(BIN_STORAGE_KEY)));
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
        <TouchableWithoutFeedback onPress={() => console.log(bin)}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check bin in directory
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
        <TouchableWithoutFeedback onPress={() => checkBinInLocalStorage()}>
          <Text style={{
            alignSelf: 'center',
          }}
          >
            Check bin in local storage
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
