import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage,
} from 'react-native';
import { useDispatch } from 'react-redux';
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
  tagStringBuilder, formatDate, sortListByDate, hasSearchTextInTags,
} from '../utils/helpers';
import DeletedRecording from '../models/deletedRecording';
import { STORAGE_KEY, BIN_STORAGE_KEY } from '../redux/storageKeys';

function DemoScreen(_demo) {
  const demo = _demo.route.params.item;
  const [list, setList] = React.useState([]);
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
      Date.now(),
      demo.id,
      recording,
    );

    // Remove recording from demo object
    demo.recordings = demo.recordings.filter((rec) => rec.id !== recording.id);

    // Update demo object in local storage
    const updatedDemoStorage = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY))
      .filter((dem) => dem.id !== demo.id)
      .push(demo);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDemoStorage));

    // Update local bin storage
    let binStorage = JSON.parse(await AsyncStorage.getItem(BIN_STORAGE_KEY));

    binStorage !== null ? binStorage.push(del) : binStorage = [del];

    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(binStorage));

    // Update redux
    dispatch(updateDemo(demo));
    dispatch(addRecordingToBin(del));
  };

  React.useEffect(() => {
    dispatch(setCurrentDemoId(demo.id));
  }, []);

  React.useEffect(() => (demo.recordings ? setList(demo.recordings) : setList([])), [demo]);

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <Text style={appStyles.heading}>{demo.title}</Text>
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
              >
                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    style={listStyles.itemHeader}
                  >
                    {item.title}
                  </TextInput>
                  <Text style={listStyles.itemInfo}>{`${formatDate(item.dateCreated)} - ${tagStringBuilder(item.tags)}`}</Text>
                </View>

                <View style={listStyles.itemSecondaryColumn}>
                  <Text style={listStyles.itemRecordingDuration}>{item.duration}</Text>
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

export default DemoScreen;
