import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { SampleData } from '../data';
import { sortListByDate, formatDate } from '../utils/helpers';

function DemoCollectionScreen() {
  const navigation = useNavigation();
  const [searchText, onChangeSearchText] = React.useState('');

  const setDemoName = (item, input) => {
    console.log(item);
    console.log(input);
  };

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
          data={sortListByDate(SampleData)}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faTrash} />
                </TouchableOpacity>
              )}
              friction={2}
              rightThreshold={30}
              leftThreshold={80}
            >
              <TouchableOpacity
                style={listStyles.item}
                onPress={() => navigation.navigate('DemoScreen', { item })}
              >
                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    onChangeText={(input) => setDemoName(item, input)}
                    style={listStyles.itemHeader}
                  >
                    {item.title}
                  </TextInput>
                  <Text style={listStyles.itemDate}>{formatDate(item.dateCreated)}</Text>
                </View>

                <View style={listStyles.itemSecondaryColumn}>
                  <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                  <Text style={listStyles.itemRecordingCount}>{item.recordings.length}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default DemoCollectionScreen;
