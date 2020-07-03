import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {
  View, Text, TouchableWithoutFeedback, AsyncStorage,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addDemo, addRecording } from '../redux/actions/demoActions';
import { shouldNavigate } from '../redux/actions/globalActions';
import Demo from '../models/demo';
import Recording from '../models/recording';
import { idGenerator } from '../utils/helpers';

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
    setPermissions(response.granted);
  };

  const recordingCallback = (status) => {
    //console.log(status);
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
      '',
      response.durationMillis,
      [],
      URI,
      new Date(),
    );

    if (currentScreen === 'DemoCollectionScreen') {
      recording.title = 'Take 1';
      const demoId = idGenerator()
      const demo = new Demo(
        demoId,
        `Demo ${demos.length + 1}`,
        [recording],
        new Date(),
      );

      dispatch(addDemo(demo));

      let storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));

      storageData !== null ? storageData.push(demo) : storageData = [demo];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));

      dispatch(shouldNavigate({ shouldNav: true, demoId }));
    } else {
      // Set recording name
      const currentDemo = demos.filter((demo) => demo.id === currentDemoId);
      recording.title = `Take ${currentDemo[0].recordings.length + 1}`;

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
    </View>
  );
}
export default record;
