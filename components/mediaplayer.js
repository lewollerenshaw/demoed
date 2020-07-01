import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',

  },
});



function mediaplayer(open) {
  const height = open.open === true ? 'auto' : 0;
  console.log(open)
  console.log(height)


  return (
    <View style={[styles.container, { height }]}>
      <Text></Text>
    </View>
  );
}

export default mediaplayer;
