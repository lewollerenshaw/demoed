import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Demo from '../models/demo';

function record() {
  const [permissions, setPermissions] = React.useState();
  const [isRecording, setIsRecording] = React.useState(false);
  const [durationMillis, setDurationMillis] = React.useState();
  const [isDoneRecording, setIsDoneRecording] = React.useState();
  const [recordingInstance, setRecordingInstance] = React.useState(null);
  const globalState = useSelector((state) => state.global.currentScreen);

  const getPermissions = async () => {
    const response = await Audio.requestPermissionsAsync();
    console.log(response);
    setPermissions(response.granted);
  };

  const recordingCallback = (status) => {
    console.log(status);
    { durationMillis, isRecording, isDoneRecording; }
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
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  const moveRecordingToNewFolder = async () => {
    const folder = await `${FileSystem.documentDirectory} recordings/`;
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

    const URI = await recordingInstance.getURI();
    const recordingName = URI.substring(URI.lastIndexOf('/') + 1);
    await FileSystem.moveAsync({
      from: URI,
      to: folder + recordingName,
    });

    const res = await FileSystem.readDirectoryAsync(folder);
    console.log(res);
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      const response = await recordingInstance.stopAndUnloadAsync();
      setIsRecording(false);
      setDurationMillis(response.durationMillis);
      moveRecordingToNewFolder();

      const demo = new Demo('123', 'Title', ['1', '2'], 'Date');
      console.log(demo);

      setRecordingInstance(null);
    } catch (error) {
      console.log(error);
    }
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


    </View>
  );
}
export default record;
