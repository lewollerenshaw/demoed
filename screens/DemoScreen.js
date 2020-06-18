import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import appStyles from '../styles/app';
import listStyles from '../styles/list';
import { Colors } from '../styles/colors';
import searchStyles from '../styles/search';
import { tagStringBuilder } from '../utils/helpers';

function DemoScreen(_demo) {
  const demo = _demo.route.params.item;
  const [searchText, onChangeSearchText] = React.useState('');

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <Text style={appStyles.heading}>{demo.title}</Text>

        <TextInput
          style={searchStyles.input}
          onChangeText={(text) => onChangeSearchText(text)}
          value={searchText}
          placeholder="Search by title or tags..."
          placeholderTextColor={Colors.$n6}
        />

        <FlatList
          data={demo.recordings}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={listStyles.item}
            >
              <View style={listStyles.itemPrimaryColumn}>
                <Text style={listStyles.itemHeader}>{item.title}</Text>
                <Text style={listStyles.itemTags}>{tagStringBuilder(item.tags)}</Text>
              </View>

              <View style={listStyles.itemSecondaryColumn}>
                <Text style={listStyles.itemRecordingDuration}>{item.duration}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default DemoScreen;
