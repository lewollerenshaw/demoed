/* eslint-disable no-mixed-operators */
import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage, UIManager, Platform, LayoutAnimation, Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faShare } from '@fortawesome/free-solid-svg-icons';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { addRecordingToBin } from '../redux/actions/binActions';
import { updateDemo } from '../redux/actions/demoActions';
import { setCurrentDemoId } from '../redux/actions/globalActions';
import appStyles from '../styles/app';
import listStyles from '../styles/list';
import { Colors } from '../styles/colors';
import searchStyles from '../styles/search';
import {
  tagStringBuilder, formatDate, sortListByDate, hasSearchTextInTags, idGenerator, millisToMinutesAndSeconds,
} from '../utils/helpers';
import DeletedRecording from '../models/deletedRecording';
import Mediaplayer from '../components/mediaplayer';
import { STORAGE_KEY, BIN_STORAGE_KEY } from '../redux/storageKeys';
import mediaplayerStyles from '../styles/mediaplayer';
import modalStyles from '../styles/modal';

if (
  Platform.OS === 'android'
  && UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function DemoScreen(_demo) {
  const navigation = useNavigation();
  const [demo, setDemo] = React.useState(_demo.route.params.item);
  const demos = useSelector((state) => state.demos);
  const [list, setList] = React.useState(demo.recordings);
  const [open, setOpen] = React.useState(false);
  const [currentRecordingId, setCurrentRecordingId] = React.useState();
  const [isDeleteModalVisible, setDeleteModal] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState({});
  const dispatch = useDispatch();

  const updateSearchResults = (search) => {
    const filter = [];

    if (search) {
      list.forEach((element) => {
        const title = element.title.toLowerCase();
        const tags = element.tags.map((tag) => tag.toLowerCase());

        if (title.includes(search) || hasSearchTextInTags(search, tags)) filter.push(element);
      });

      setList(filter);
    } else setList(list);
  };

  const deleteItem = async (recording) => {
    const del = new DeletedRecording(
      idGenerator(),
      Date.now(),
      demo.id,
      recording,
    );

    // Remove recording from demo object
    const updatedDemo = demo;
    updatedDemo.recordings = updatedDemo.recordings.filter((rec) => rec.id !== recording.id);
    setDemo(updatedDemo);

    // Update demo object in local storage
    const updatedDemoStorage = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY))
      .filter((dem) => dem.id !== demo.id);

    updatedDemoStorage.push(demo);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDemoStorage));

    // Update local bin storage
    let binStorage = JSON.parse(await AsyncStorage.getItem(BIN_STORAGE_KEY));

    binStorage !== null ? binStorage.push(del) : binStorage = [del];

    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(binStorage));

    // Update redux
    dispatch(updateDemo(demo));
    dispatch(addRecordingToBin(del));
    setList(demo.recordings);
    setDeleteModal(false);
  };

  const updateRecordingName = async (recording, newTitle) => {
    recording.title = newTitle;

    const updatedRecordings = demo.recordings.filter((item) => item.id !== recording.id);

    updatedRecordings.push(recording);
    demo.recordings = updatedRecordings;

    dispatch(updateDemo(demo));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  };

  const updateDemoName = async (newTitle) => {
    demo.title = newTitle;
    dispatch(updateDemo(demo));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  };

  const toggleMediaplayer = (id) => {
    setCurrentRecordingId(id);
    setOpen((prev) => !prev);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleShare = async (recording) => {
    if (!(await Sharing.isAvailableAsync())) {
      // eslint-disable-next-line no-alert
      alert('Uh oh, sharing isn\'t available on your platform');
      return;
    }
    Sharing.shareAsync(recording.URI);
  };

  const triggerItemDeletion = (item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  React.useEffect(() => {
    dispatch(setCurrentDemoId(demo.id));
  }, []);

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <View style={appStyles.headingRow}>
            <TextInput
              style={appStyles.heading}
              onChangeText={(value) => updateDemoName(value)}
            >
              {demo.title}
            </TextInput>
            <TouchableOpacity style={appStyles.recentlyDeleted} onPress={() => navigation.navigate('RecentlyDeletedScreen')}>
              <FontAwesomeIcon style={appStyles.recentlyDeletedIcon} size={20} icon={faTrash} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={searchStyles.input}
            onChangeText={(text) => updateSearchResults(text.toLowerCase())}
            placeholder="Search by title or tags..."
            placeholderTextColor={Colors.$n6}
          />
        </View>

        <FlatList
          data={sortListByDate(list)}
          renderItem={({ item }) => (

            <TouchableOpacity
              style={listStyles.item}
              onPress={() => toggleMediaplayer(item.id)}
            >
              <View style={listStyles.itemPrimaryRow}>
                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    style={listStyles.itemHeader}
                    onChangeText={(value) => updateRecordingName(item, value)}
                  >
                    {item.title}
                  </TextInput>
                  <Text style={listStyles.itemInfo}>
                    {formatDate(item.dateCreated)}
                    {item.tags.length > 0 && `- ${tagStringBuilder(item.tags)}`}
                  </Text>
                </View>

                {(open && currentRecordingId !== item.id || !open) ? (
                  <View style={listStyles.itemSecondaryColumn}>
                    <Text style={listStyles.itemRecordingDuration}>{millisToMinutesAndSeconds(item.duration)}</Text>
                  </View>
                ) : null}
              </View>

              {open && currentRecordingId === item.id && (
                <View style={listStyles.itemSecondaryRow}>
                  <Mediaplayer open={open} rec={item} />

                  <View style={mediaplayerStyles.itemActions}>
                    <TouchableOpacity
                      onPress={() => handleShare(item)}
                    >
                      <FontAwesomeIcon style={{ color: Colors.$n8 }} size={20} icon={faShare} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => triggerItemDeletion(item)}
                    >
                      <FontAwesomeIcon style={{ color: Colors.$n8 }} size={20} icon={faTrash} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

            </TouchableOpacity>
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
              Are you sure you want to delete this?
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
    </View>
  );
}

export default DemoScreen;
