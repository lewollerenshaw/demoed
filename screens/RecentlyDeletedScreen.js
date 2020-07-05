import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage, Modal,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCompactDisc, faTrash, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { formatDate, sortListByDate } from '../utils/helpers';
import { BIN_STORAGE_KEY, STORAGE_KEY } from '../redux/storageKeys';
import { deleteItemFromBin, deleteAll, setBin } from '../redux/actions/binActions';
import { addDemo, addRecording } from '../redux/actions/demoActions';
import modalStyles from '../styles/modal';

function RecentlyDeletedScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const demos = useSelector((state) => state.demos);
  const [deletedItems, setDeletedItems] = React.useState(useSelector((state) => state.bin));
  const [isDeleteModalVisible, setDeleteModal] = React.useState(false);
  const [isDeleteAllModalVisible, setDeleteAllModal] = React.useState(false);
  const [isRestoreRecordingModalVisible, setRestoreRecordingModal] = React.useState(false);
  const [isRestoreDemoModalVisible, setIsRestoreDemoModalVisible] = React.useState(false);
  const [recordingToRestore, setRecordingToRestore] = React.useState({});
  const [demoToRestore, setDemoToRestore] = React.useState({});
  const [itemToDelete, setItemToDelete] = React.useState({});

  const getDemoTitle = (demoId) => {
    let title = '';

    demos.forEach((demo) => {
      if (demo.id === demoId) title = demo.title;
    });

    return title;
  };

  const removeFromAsync = async (item) => {
    if (item.associatedDemo) await FileSystem.deleteAsync(`${item.recording.URI}`);
    else {
      item.demo.recordings.forEach(async (recording) => {
        await FileSystem.deleteAsync(`${recording.URI}`);
      });
    }
  };

  const deleteItem = async (item) => {
    // Remove from local bin storage
    const updatedBin = deletedItems.filter((itemInBin) => itemInBin.id !== item.id);
    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(updatedBin));

    removeFromAsync(item);

    // Update redux
    dispatch(deleteItemFromBin(item));
    setDeletedItems(updatedBin);

    setDeleteModal(false);
    if (updatedBin.length < 1) navigation.navigate('DemoCollectionScreen');
  };

  const deleteAllItems = async () => {
    // Remove from local bin storage
    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify([]));

    deletedItems.forEach(async (item) => {
      removeFromAsync(item);
    });

    // Update redux
    dispatch(deleteAll());
    setDeletedItems([]);
    setDeleteAllModal(false);

    // Navigate back to collections
    navigation.navigate('DemoCollectionScreen');
  };

  const restoreDemo = async (restoredDemo) => {
    // Update list of recently deleted
    const updatedBinStorage = deletedItems.filter((item) => item.id !== restoredDemo.id);

    // Remove item from bin
    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(updatedBinStorage));
    dispatch(setBin(updatedBinStorage));
    setDeletedItems(updatedBinStorage);

    // Update stores list of demos
    dispatch(addDemo(restoredDemo.demo));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));

    // If nothing in bin, navigate back
    if (updatedBinStorage.length < 1) navigation.navigate('DemoCollectionScreen');
  };

  const triggerItemDeletion = (item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const triggerRestoreDemo = (item) => {
    setDemoToRestore(item);
    setIsRestoreDemoModalVisible(true);
  };

  const triggerRecordingRestoration = (item) => {
    setRestoreRecordingModal(true);
    setRecordingToRestore(item);
  };

  const restoreRecording = async (selectedDemo) => {
    dispatch(addRecording(recordingToRestore.recording, selectedDemo.id));

    const updatedBin = deletedItems.filter((item) => item.id !== recordingToRestore.id);

    setDeletedItems(updatedBin);
    dispatch(setBin(updatedBin));

    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(updatedBin));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));

    setRestoreRecordingModal(false);

    if (updatedBin.length < 1) navigation.navigate('DemoCollectionScreen');
  };

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <View style={appStyles.headingRow}>
            <Text style={appStyles.heading}>Recently deleted</Text>

            {deletedItems.length > 0 && (
              <TouchableOpacity
                style={appStyles.headerInteraction}
                onPress={() => setDeleteAllModal(true)}
              >
                <Text style={appStyles.headingInteractionText}>Delete all</Text>
              </TouchableOpacity>
            )}
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
                  onPress={() => triggerItemDeletion(item)}
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

                  <RectButton
                    style={listStyles.item}
                    onPress={() => triggerRecordingRestoration(item)}
                  >
                    <View style={listStyles.itemPrimaryRow}>
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
                    </View>
                  </RectButton>
                )}

              {/* DEMO */}
              {item.demo
                && (
                  <RectButton
                    style={listStyles.item}
                    onPress={() => triggerRestoreDemo(item)}
                  >
                    <View style={listStyles.itemPrimaryRow}>
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
                    </View>
                  </RectButton>
                )}

            </Swipeable>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>

      {/* DELETE MODAL */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.content}>
            <Text style={modalStyles.heading}>Confirm deletion</Text>
            <Text style={modalStyles.bodyText}>
              Are you sure you want to delete this? There is no going back.
            </Text>

            <View style={modalStyles.actionContainer}>
              <TouchableOpacity style={modalStyles.primaryAction} onPress={() => deleteItem(itemToDelete)}>
                <Text style={modalStyles.primaryActionText}>
                  Yes, delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.secondaryAction} onPress={() => setDeleteModal(false)}>
                <Text style={modalStyles.secondaryActionText}>
                  No
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* DELETE ALL MODAL */}
      <Modal
        visible={isDeleteAllModalVisible}
        transparent
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.content}>
            <Text style={modalStyles.heading}>Confirm deletion</Text>
            <Text style={modalStyles.bodyText}>
              Are you sure you want to delete these demos? There is no going back.
            </Text>

            <View style={modalStyles.actionContainer}>
              <TouchableOpacity style={modalStyles.primaryAction} onPress={() => deleteAllItems(false)}>
                <Text style={modalStyles.primaryActionText}>
                  Yes, delete all recordings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.secondaryAction} onPress={() => setDeleteAllModal(false)}>
                <Text style={modalStyles.secondaryActionText}>
                  No
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* RESTORE RECORDING MODEL */}
      <Modal
        visible={isRestoreRecordingModalVisible}
        transparent
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.heading}>Restore recording</Text>
              <FontAwesomeIcon style={modalStyles.headingAction} onPress={() => setRestoreRecordingModal(false)} size={18} icon={faTimes} />
            </View>
            <Text style={modalStyles.bodyText}>
              Select a demo to restore the recording to
            </Text>

            <FlatList
              data={sortListByDate(demos)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={listStyles.item}
                  onPress={() => restoreRecording(item)}
                >
                  <View style={listStyles.itemPrimaryRow}>
                    <View style={listStyles.itemPrimaryColumn}>
                      <Text
                        style={listStyles.itemHeader}
                      >
                        {item.title}
                      </Text>
                      <Text style={listStyles.itemDate}>{formatDate(item.dateCreated)}</Text>
                    </View>

                    <View style={listStyles.itemSecondaryColumn}>
                      <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                      <Text style={listStyles.itemRecordingCount}>{item.recordings.length}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(_item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* RESTORE DEMO MODAL */}
      <Modal
        visible={isRestoreDemoModalVisible}
        transparent
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.content}>
            <Text style={modalStyles.heading}>Restore demo</Text>
            <Text style={modalStyles.bodyText}>
              Do you want to restore this demo?
            </Text>

            <View style={modalStyles.actionContainer}>
              <TouchableOpacity style={modalStyles.primaryAction} onPress={() => restoreDemo(demoToRestore)}>
                <Text style={modalStyles.primaryActionText}>
                  Yes, restore
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={modalStyles.secondaryAction} onPress={() => setIsRestoreDemoModalVisible(false)}>
                <Text style={modalStyles.secondaryActionText}>
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
