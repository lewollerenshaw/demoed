import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage, Modal,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { formatDate } from '../utils/helpers';
import { BIN_STORAGE_KEY, STORAGE_KEY } from '../redux/storageKeys';
import { deleteItemFromBin, deleteAll, setBin } from '../redux/actions/binActions';
import { addDemo } from '../redux/actions/demoActions';

function RecentlyDeletedScreen() {
  const navigation = useNavigation();
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

    // Navigate back to collections
    navigation.navigate('DemoCollectionScreen');
  };

  const restoreDemo = async (restoredDemo) => {
    // Update list of recently deleted
    const updatedBinStorage = deletedItems.filter((item) => item.id !== restoredDemo.id);

    // Remove item from bin
    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(updatedBinStorage));
    setBin(updatedBinStorage);
    setDeletedItems(updatedBinStorage);

    // Update stores list of demos
    dispatch(addDemo(restoredDemo.demo));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));

    // If nothing in bin, navigate back
    if (updatedBinStorage.length < 1) navigation.navigate('DemoCollectionScreen');
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
                    onPress={() => restoreRecording(item)}
                  >
                    <View style={listStyles.itemPrimaryColumn}>
                      <Text
                        style={listStyles.itemHeader}
                      >
                        {item.recording.title}
                      </Text>
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
                    onPress={() => restoreDemo(item)}
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
        transparent
      >
        <View style={{
          flex: 1, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <View style={{
            backgroundColor: 'white',
            padding: 35,
            shadowColor: '#000',
            margin: 20,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          >
            <Text style={{ marginBottom: 20, fontSize: 20 }}>Confirm deletion</Text>
            <Text style={{ marginBottom: 20, fontSize: 16 }}>
              Are you sure you want to delete these demos? There is no going back
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 10, backgroundColor: Colors.$primary, padding: 10 }} onPress={() => deleteAllItems(false)}>
                <Text style={{ fontSize: 16, color: Colors.$lightShade }}>
                  Yes, delete all recordings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ padding: 10 }} onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 16, color: Colors.$primary }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

export default RecentlyDeletedScreen;
