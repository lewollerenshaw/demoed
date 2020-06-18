import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { SampleData } from '../data';

function DemoCollectionScreen() {
  const navigation = useNavigation();
  const [searchText, onChangeSearchText] = React.useState('');

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <Text style={appStyles.heading}>Your collection</Text>

        <TextInput
          style={searchStyles.input}
          onChangeText={(text) => onChangeSearchText(text)}
          value={searchText}
          placeholder="Search..."
          placeholderTextColor={Colors.$n6}
        />

        <FlatList
          data={SampleData}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={listStyles.item}
              onPress={() => navigation.navigate('DemoScreen', { item })}
            >
              <View style={listStyles.itemPrimaryColumn}>
                <Text style={listStyles.itemHeader}>{item.title}</Text>
                <Text style={listStyles.itemDate}>{item.dateCreated}</Text>
              </View>

              <View style={listStyles.itemSecondaryColumn}>
                <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                <Text style={listStyles.itemRecordingCount}>{item.recordings.length}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default DemoCollectionScreen;
