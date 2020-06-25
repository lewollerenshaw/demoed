import * as React from 'react';
import {
  Text, View, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { addRecording } from '../redux/actions/binActions';
import { deleteRecording } from '../redux/actions/demoActions';
import { setCurrentDemoId } from '../redux/actions/globalActions';
import appStyles from '../styles/app';
import listStyles from '../styles/list';
import { Colors } from '../styles/colors';
import searchStyles from '../styles/search';
import {
  tagStringBuilder, formatDate, sortListByDate, hasSearchTextInTags,
} from '../utils/helpers';
import DeletedRecording from '../models/deletedRecording';

function DemoScreen(_demo) {
  const demo = _demo.route.params.item;
  const [list, setList] = React.useState([]);
  const demos = useSelector((state) => state.demos);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentDemoId(demo.id));
  }, []);

  // When recording gets added to current demo
  // Get demo from redux with newely added recordings
  React.useEffect(() => {
    setList(demos[0].recordings);
  }, [demos]);

  const updateSearchResults = (search) => {
    const filter = [];

    if (search) {
      list.forEach((element) => {
        const title = element.title.toLowerCase();
        const tags = element.tags.map((tag) => tag.toLowerCase());

        if (title.includes(search) || hasSearchTextInTags(search, tags)) filter.push(element);
      });

      setList(filter);
    } else setList(demos);
  };

  const deleteItem = (recording) => {
    const filteredRecordings = demo.recordings.filter((item) => item.id !== recording.id);
    demo.recordings = filteredRecordings;

    const del = new DeletedRecording(
      Date.now(),
      demo.id,
      recording,
    );

    dispatch(deleteRecording(demo));
    dispatch(addRecording(del));

    console.log(demos)
    console.log(useSelector((state) => state.bin));
  };

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
