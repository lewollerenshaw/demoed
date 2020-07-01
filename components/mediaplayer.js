import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
  },
});

function mediaplayer({ open, rec }) {
  const height = open === true ? 'auto' : 0;
  return (
    <View style={[styles.container, {
      height,
    }]}
    >
      <Text />
    </View>
  );
}

export default mediaplayer;
