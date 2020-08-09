import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {
  View, AsyncStorage, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { RectButton } from 'react-native-gesture-handler';
import { addDemo, addRecording } from '../redux/actions/demoActions';
import { shouldNavigate } from '../redux/actions/globalActions';
import Demo from '../models/demo';
import Recording from '../models/recording';
import { idGenerator } from '../utils/helpers';
import recordStyles from '../styles/record';
import * as RootNavigation from '../services/navigation/RootNavigation';
import { STORAGE_KEY } from '../redux/storageKeys';
import { Colors } from '../styles/colors';

function record() {
  const [permissions, setPermissions] = React.useState();
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingInstance, setRecordingInstance] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [interv, setInterv] = React.useState(null);
  const [time, setTime] = React.useState({ sec: 0, min: 0 });
  const currentScreen = useSelector((state) => state.global.currentScreen);
  const currentDemoId = useSelector((state) => state.global.currentDemoId);
  const demos = useSelector((state) => state.demos);
  const dispatch = useDispatch();

  const getPermissions = async () => {
    const response = await Audio.requestPermissionsAsync();
    setPermissions(response.granted);
  };

  const createRecordingInstance = () => {
    if (recordingInstance == null) {
      const newRecordingInstance = new Audio.Recording();
      newRecordingInstance.setProgressUpdateInterval(200);
      setRecordingInstance(newRecordingInstance);
    }
  };

  let s = 0;
  let m = 0;
  function run() {
    if (s === 59) {
      m++;
      s = -1;
    }
    s++;
    return setTime({ sec: s, min: m });
  }

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
      Audio.RECORDING_OPTIONS_PRESET_MAX_QUALITY,
    );

    setModalVisible(true);
    setInterv(setInterval(run, 1000));
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
      const demoId = idGenerator();
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

    setModalVisible(false);
    clearInterval(interv);
    setTime({ sec: 0, min: 0 });

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
    <View style={recordStyles.container}>
      <RectButton onPress={() => RootNavigation.navigate('SettingsScreen')}>
        <Text>Settings</Text>
      </RectButton>

      <View style={recordStyles.recordContainer}>
        <RectButton style={recordStyles.recordButtonContainer} onPress={() => handleRecordingPress()}>
          <FontAwesomeIcon style={recordStyles.recordButtonIcon} size={24} icon={isRecording ? faStop : faMicrophone} />
        </RectButton>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
        >
          <>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 22,
            }}
            >
              <View style={{
                justifyContent: 'center', height: 200, width: 200, borderRadius: 200 / 2, backgroundColor: Colors.$lightAccent,
              }}
              >
                <Text style={{ alignSelf: 'center' }}>
                  {time.min >= 10 ? time.min : `0${time.min}`}
                  :
                  {time.sec >= 10 ? time.sec : `0${time.sec}`}
                </Text>
              </View>

            </View>
            <View style={recordStyles.container}>
              <View style={recordStyles.recordContainer}>
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                  style={recordStyles.recordButtonContainer}
                  onPress={() => handleRecordingPress()}
                >
                  <FontAwesomeIcon style={recordStyles.recordButtonIcon} size={24} icon={isRecording ? faStop : faMicrophone} />
                </TouchableHighlight>
              </View>
            </View>
          </>
        </Modal>

        <View style={recordStyles.container}>
          <View style={recordStyles.recordContainer}>
            <RectButton style={recordStyles.recordButtonContainer} onPress={() => handleRecordingPress()}>
              <FontAwesomeIcon style={recordStyles.recordButtonIcon} size={24} icon={isRecording ? faStop : faMicrophone} />
            </RectButton>
          </View>
        </View>
      </View>
    </View>
  );
}
export default record;
