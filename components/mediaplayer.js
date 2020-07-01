import React from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import mediaplayerStyles from '../styles/mediaplayer';

function mediaplayer({ open, rec }) {
  const handleShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Uh oh, sharing isn\'t available on your platform');
      return;
    }
    Sharing.shareAsync(rec.URI);
  };

  const height = open === true ? 'auto' : 0;
  return (
    <View style={[mediaplayerStyles.container, { height }]}>
      <TouchableOpacity onPress={handleShare}>
        <FontAwesomeIcon icon={faShare} />
      </TouchableOpacity>
      <Text>{console.log(rec)}</Text>
    </View>
  );
}

export default mediaplayer;
