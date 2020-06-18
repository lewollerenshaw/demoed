import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, Button, FlatList,
} from 'react-native';
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
            { key: 'Devin' },
            { key: 'Dan' },
            { key: 'Dominic' },
            { key: 'Jackson' },
            { key: 'James' },
            { key: 'Joel' },
            { key: 'John' },
            { key: 'Jillian' },
            { key: 'Jimmy' },
            { key: 'Julie' },
          ]}
          renderItem={({ item }) => <Text style={listStyles.item}>{item.key}</Text>}
        />
      </View>
    </View>
  );
}

export default DemoCollectionScreen;
