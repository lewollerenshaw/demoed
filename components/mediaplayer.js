import React from 'react';
import {
  View, Text, TouchableOpacity, Slider,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { Audio } from 'expo-av';
import mediaplayerStyles from '../styles/mediaplayer';
import { Colors } from '../styles/colors';
import { millisToMinutesAndSeconds } from '../utils/helpers';

function mediaplayer({ open, rec }) {
  const [playbackInstance, setPlaybackInstance] = React.useState(null);
  const [paused, setPaused] = React.useState(true);
  const [position, setPosition] = React.useState(null);
  const [positionSecs, setPositionSecs] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(null);
  const [durationSecs, setDurationSecs] = React.useState(null);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [isSeeking, setIsSeeking] = React.useState(false);
  let soundObj;

  async function callBack(status) {
    if (status.didJustFinish) {
      await soundObj.stopAsync();
      setPaused(true);
    } else if (status.isLoaded) {
      setPosition(isSeeking ? position : status.positionMillis);
      setPositionSecs(
        millisToMinutesAndSeconds(isSeeking ? position : status.positionMillis),
      );
      setIsPlaying(isSeeking || isBuffering ? isPlaying : status.isPlaying);
      setDuration(status.durationMillis);
      setIsBuffering(status.isBuffering);
    }
  }

  async function loadPlaybackInstance() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
      playThroughEarpieceAndroid: false,
    });

    if (playbackInstance !== null) {
      await playbackInstance.unloadAsync();
      playbackInstance.setOnPlaybackStatusUpdate(null);
      setPlaybackInstance(null);
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: rec.URI },
      {
        shouldPlay: true,
        position: 0,
        duration: 1,
        progressUpdateIntervalMillis: 50,
      },
      callBack,
    );

    soundObj = sound;
    setPaused(false);
    setPlaybackInstance(sound);
  }

  const handlePause = () => {
    setPaused(true);
    playbackInstance.pauseAsync();
  };

  const handlePress = () => {
    if (playbackInstance !== null) {
      if (!isPlaying) {
        setPaused(false);
        playbackInstance.playAsync();
      } else handlePause();
    } else loadPlaybackInstance();
  };

  React.useEffect(() => {
    setPositionSecs('0:00');
    setDurationSecs(millisToMinutesAndSeconds(rec.duration));
  }, [rec]);

  async function onCompleteSliding(value) {
    if (playbackInstance !== null) {
      setIsSeeking(false);
      if (paused) {
        playbackInstance.setPositionAsync(value);
      } else if (!paused) {
        playbackInstance.playFromPositionAsync(value);
        setPaused(false);
      }
      setIsSeeking(false);
    }
  }

  async function handleValueChange(value) {
    if (playbackInstance !== null) {
      playbackInstance.pauseAsync();
      playbackInstance.setPositionAsync(value);
    }
  }

  return (
    <View style={mediaplayerStyles.container}>
      <Slider
        value={position}
        onValueChange={(val) => handleValueChange(val)}
        onSlidingComplete={(val) => onCompleteSliding(val)}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor={Colors.$primary}
        minimumTrackTintColor={Colors.$primary}
      />
      <View style={mediaplayerStyles.mediaActions}>
        <Text>
          {positionSecs && positionSecs}
        </Text>
        <TouchableOpacity onPress={() => handlePress()}>
          <FontAwesomeIcon size={22} icon={paused ? faPlay : faPause} />
        </TouchableOpacity>
        <Text>
          {durationSecs && durationSecs}
        </Text>
      </View>
    </View>
  );
}

export default mediaplayer;
