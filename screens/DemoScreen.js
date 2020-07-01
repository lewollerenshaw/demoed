import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { addRecordingToBin } from '../redux/actions/binActions';
import { updateDemo } from '../redux/actions/demoActions';
import { setCurrentDemoId } from '../redux/actions/globalActions';
import appStyles from '../styles/app';
import listStyles from '../styles/list';
import { Colors } from '../styles/colors';
import searchStyles from '../styles/search';
import {
  tagStringBuilder, formatDate, sortListByDate, hasSearchTextInTags, idGenerator,
} from '../utils/helpers';
import DeletedRecording from '../models/deletedRecording';
import Mediaplayer from '../components/mediaplayer';
import { STORAGE_KEY, BIN_STORAGE_KEY } from '../redux/storageKeys';

function DemoScreen(_demo) {
  const [demo, setDemo] = React.useState(_demo.route.params.item);
  const demos = useSelector((state) => state.demos);
  const [list, setList] = React.useState(demo.recordings);
  const [open, setOpen] = React.useState(false);
  const [currentRecordingId, setCurrentRecordingId] = React.useState();
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
  };

  React.useEffect(() => {
    dispatch(setCurrentDemoId(demo.id));
  }, []);

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <TextInput
            style={appStyles.heading}
            onChangeText={(value) => updateDemoName(value)}
          >
            {demo.title}
          </TextInput>
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
              <TouchableOpacity
                style={listStyles.item}
                onPress={() => toggleMediaplayer(item.id)}
              >

                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    style={listStyles.itemHeader}
                    onChangeText={(value) => updateRecordingName(item, value)}
                  >
                    {item.title}
                  </TextInput>
                  <Text style={listStyles.itemInfo}>
                    {`${formatDate(item.dateCreated)}`}
                    {item.tags.length > 0 && `- ${tagStringBuilder(item.tags)}`}
                  </Text>
                </View>

                <View style={listStyles.itemSecondaryColumn}>
                  <Text style={listStyles.itemRecordingDuration}>{item.duration}</Text>
                </View>

              </TouchableOpacity>
              {currentRecordingId === item.id && (<Mediaplayer open={open} />)}
            </Swipeable>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default DemoScreen;
