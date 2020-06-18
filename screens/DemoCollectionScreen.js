import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, FlatList, TouchableOpacity,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import listStyles from '../styles/list';
import appStyles from '../styles/app';

function DemoCollectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <Text style={appStyles.heading}>Collection</Text>

        <FlatList
          data={[
            { key: 'Easy Living' },
            { key: 'Moon' },
            { key: 'Sunset In The Valley' },
            { key: 'We Are On The Run' },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={listStyles.item}
              onPress={() => navigation.navigate('DemoScreen')}
            >
              <View style={listStyles.itemPrimaryColumn}>
                <Text style={listStyles.itemHeader}>{item.key}</Text>
                <Text style={listStyles.itemDate}>12/07/2020</Text>
              </View>

              <View style={listStyles.itemSecondaryColumn}>
                <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                <Text style={listStyles.itemRecordingCount}>5</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

export default DemoCollectionScreen;
