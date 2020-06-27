import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage, Modal,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash, faFolder } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { formatDate } from '../utils/helpers';
import { BIN_STORAGE_KEY } from '../redux/storageKeys';
import { deleteItemFromBin, deleteAll } from '../redux/actions/binActions';

function RecentlyDeletedScreen() {
  const [deletedItems, setDeletedItems] = React.useState(useSelector((state) => state.bin));
  const [isModalVisible, setModalVisible] = React.useState(false);
  const demos = useSelector((state) => state.demos);
  const dispatch = useDispatch();

  const getDemoTitle = (demoId) => {
    let title = '';

    demos.forEach((demo) => {
      if (demo.id === demoId) title = demo.title;
    });

    return title;
  };

  const deleteItem = async (item) => {
    // Remove from local bin storage
    const updatedBin = deletedItems.filter((itemInBin) => itemInBin.id !== item.id);
    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(updatedBin));

    // Update redux
    dispatch(deleteItemFromBin(item));
    setDeletedItems(updatedBin);
  };

  const deleteAllItems = async () => {
    // Remove from local bin storage
    const updatedBin = [];
    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(updatedBin));

    // Update redux
    dispatch(deleteAll());
    setDeletedItems([]);
    setModalVisible(false);
  };

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <View style={appStyles.headingRow}>
            <Text style={appStyles.heading}>Recently deleted</Text>
            <TouchableOpacity
              style={appStyles.headerInteraction}
              onPress={() => setModalVisible(true)}
            >
              <Text style={appStyles.headingInteractionText}>Delete all</Text>
            </TouchableOpacity>
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
                  onPress={() => deleteItem(item)}
                >
                  <FontAwesomeIcon style={listStyles.deleteButtonIcon} icon={faTrash} />
                </TouchableOpacity>
              )}
              friction={2}
              rightThreshold={80}
              leftThreshold={80}
            >
              {/* RECORDING */}
              {item.associatedDemo
                && (
                  <TouchableOpacity
                    style={listStyles.item}
                  >
                    <View style={listStyles.itemPrimaryColumn}>
                      <TextInput
                        style={listStyles.itemHeader}
                      >
                        {item.recording.title}
                      </TextInput>
                      <View style={listStyles.itemAssociatedInfo}>
                        <Text style={listStyles.itemDate}>{`${formatDate(item.recording.dateCreated)}`}</Text>
                        <Text style={listStyles.itemType}>
                          {` - from ${getDemoTitle(item.associatedDemo)}`}
                        </Text>
                      </View>
                    </View>

                    <View style={listStyles.itemSecondaryColumn}>
                      <Text style={listStyles.itemRecordingDuration}>{item.recording.duration}</Text>
                    </View>
                  </TouchableOpacity>
                )}

              {/* DEMO */}
              {item.demo
                && (
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
                )}

            </Swipeable>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>

      {/* DELETE ALL MODAL */}
      <Modal
        visible={isModalVisible}
        transparent={false}
      >
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <Text>
            Are you sure you want to delete all?
          </Text>

          <TouchableOpacity onPress={() => deleteAllItems(false)}>
            <Text>
              Confirm
            </Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
}

export default RecentlyDeletedScreen;
