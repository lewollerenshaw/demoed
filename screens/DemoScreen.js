/* eslint-disable no-mixed-operators */
import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage, UIManager, Platform, LayoutAnimation, Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faTrash, faShare, faTag, faTimes, faPlusCircle, faMinusCircle, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { addRecordingToBin } from '../redux/actions/binActions';
import { addTag } from '../redux/actions/tagActions';
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
import { STORAGE_KEY, BIN_STORAGE_KEY, TAG_STORAGE_KEY } from '../redux/storageKeys';
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
  const tags = useSelector((state) => state.tags);
  const [list, setList] = React.useState(demo.recordings);
  const [open, setOpen] = React.useState(false);
  const [currentRecordingId, setCurrentRecordingId] = React.useState();
  const [recordingToUpdate, setRecordingToUpdate] = React.useState({});
  const [tagsModal, setTagModal] = React.useState(false);
  const [createTagText, setCreateTagText] = React.useState(null);
  const dispatch = useDispatch();

  const updateSearchResults = (search) => {
    const filter = [];

    if (search) {
      list.forEach((element) => {
        const title = element.title.toLowerCase();
        const recTags = element.tags.map((tag) => tag.toLowerCase());

        if (title.includes(search) || hasSearchTextInTags(search, recTags)) filter.push(element);
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
  };

  const updateRecordingName = async (recording, newTitle) => {
    recording.title = newTitle;

    const updatedRecordings = demo.recordings.filter((item) => item.id !== recording.id);

    updatedRecordings.push(recording);
    demo.recordings = updatedRecordings;

    dispatch(updateDemo(demo));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  };

  const updateRecordingTags = async (tag) => {
    const updatedRecordings = demo.recordings.filter((item) => item.id !== recordingToUpdate.id);
    console.log('updaterecordings');
    console.log(updatedRecordings);

    recordingToUpdate.tags.includes(tag)
      ? recordingToUpdate.tags = recordingToUpdate.tags.filter((t) => t !== tag)
      : recordingToUpdate.tags.push(tag);

    updatedRecordings.push(recordingToUpdate);
    demo.recordings = updatedRecordings;

    console.log('updated demo recordings');
    console.log(demo.recordings);

    // Update demo with recording with new tags
    dispatch(updateDemo(demo));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));

    console.log('demos');
    console.log(demos);

    // Add new tag to redux/local storage
    if (!tags.includes(tag)) {
      console.log('tag not in store yet');

      dispatch(addTag(tag));

      await AsyncStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
    }
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

  const recordingContainsTag = (tag) => recordingToUpdate.tags.includes(tag);

  const triggerTagsModal = (recording) => {
    setTagModal(true);
    setRecordingToUpdate(recording);
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
                      onPress={() => triggerTagsModal(item)}
                    >
                      <FontAwesomeIcon style={{ color: Colors.$n8 }} size={20} icon={faTag} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteItem(item)}
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

      {/* MANAGE TAGS MODEL */}
      <Modal
        visible={tagsModal}
        transparent
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.heading}>Tags</Text>
              <FontAwesomeIcon style={modalStyles.headingAction} onPress={() => setTagModal(false)} size={18} icon={faTimes} />
            </View>
            <Text style={modalStyles.bodyText}>
              Select tags to add to the recording
            </Text>

            <FlatList
              data={tags}
              ListFooterComponent={(
                <View style={modalStyles.tagInputContainer}>
                  <TextInput
                    style={modalStyles.tagInput}
                    onEndEditing={(text) => setCreateTagText(text)}
                    placeholder="Create a tag..."
                  />
                  <TouchableOpacity
                    style={modalStyles.tagInputButton}
                    onPress={updateRecordingTags(createTagText)}
                  >
                    <FontAwesomeIcon style={modalStyles.tagInputButtonIcon} icon={faPlus}> </FontAwesomeIcon>
                  </TouchableOpacity>

                </View>
              )}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={listStyles.item}
                    onPress={() => updateRecordingTags(item)}
                  >
                    <View style={listStyles.itemPrimaryRow}>
                      <View style={listStyles.itemPrimaryColumn}>
                        <Text
                          style={listStyles.itemHeader}
                        >
                          {item}
                        </Text>
                      </View>

                      <View style={listStyles.itemSecondaryColumn}>
                        <FontAwesomeIcon style={listStyles.itemIcon} icon={recordingContainsTag(item) ? faMinusCircle : faPlusCircle} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(_item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default DemoScreen;
