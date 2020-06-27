import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector } from 'react-redux';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { formatDate } from '../utils/helpers';

function RecentlyDeletedScreen() {
  const deletedItems = useSelector((state) => state.bin);

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <View style={appStyles.headingRow}>
            <Text style={appStyles.heading}>Recently deleted</Text>
          </View>

          <TextInput
            style={searchStyles.input}
            placeholder="Search..."
            placeholderTextColor={Colors.$n6}
          />
        </View>

        <FlatList
          data={deletedItems}
          renderItem={({ item }) => (

            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  style={listStyles.deleteButton}
                >
                  <FontAwesomeIcon style={listStyles.deleteButtonIcon} icon={faTrash} />
                </TouchableOpacity>
              )}
              friction={2}
              rightThreshold={80}
              leftThreshold={80}
            >
              <TouchableOpacity
                style={listStyles.item}
              >
                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    style={listStyles.itemHeader}
                  >
                    {item.demo.title}
                  </TextInput>
                  <Text style={listStyles.itemDate}>{formatDate(item.demo.dateCreated)}</Text>
                </View>

                <View style={listStyles.itemSecondaryColumn}>
                  <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                  <Text style={listStyles.itemRecordingCount}>{item.demo.recordings.length}</Text>
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

export default RecentlyDeletedScreen;
