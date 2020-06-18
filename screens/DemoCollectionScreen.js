import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, Button, FlatList,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import listStyles from '../styles/list';
import appStyles from '../styles/app';

function DemoCollectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <Text style={appStyles.heading}>Collection</Text>
        <Text style={appStyles.text}> Body text, testing that it looks ok</Text>
        <Button
          title="Go to DemoScreen"
          onPress={() => navigation.navigate('DemoScreen')}
        />
        <FlatList
          data={[
            { key: 'Easy Living' },
            { key: 'Moon' },
            { key: 'Sunset In The Valley' },
            { key: 'We Are On The Run' },
          ]}
          renderItem={({ item }) => (
            <View style={listStyles.item}>
              <Text>{item.key}</Text>
              <Text>12/07/2020</Text>
              <FontAwesomeIcon icon={faCoffee} />
              <Text>5</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

export default DemoCollectionScreen;
