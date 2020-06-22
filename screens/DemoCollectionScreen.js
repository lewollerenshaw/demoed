import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import { getDemos } from '../redux/actions/demoActions';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { SampleData } from '../data';
import { sortListByDate, formatDate } from '../utils/helpers';

function DemoCollectionScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [list, setList] = React.useState([]);
  const demos = useSelector((state) => state.demos);

  const STORAGE_KEY = 'demos: demo';

  // When recording gets added to current demo
  // Get demo from redux with newely added recordings
  React.useEffect(() => {
    setList(demos);
  }, [demos]);

  const fetchDataAndSetInRedux = async () => {
    // 1. Get current data in async storage
    const storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    // 2. If data exists, store in redux
    if (storageData !== null) await dispatch(getDemos(storageData));
  };

  // On screen load, get from local storage and store in redux
  React.useEffect(() => {
    fetchDataAndSetInRedux();
  }, []);

  const updateSearchResults = (search) => {
    const filter = [];

    if (search) {
      list.forEach((element) => {
        const title = element.title.toLowerCase();

        if (title.includes(search)) filter.push(element);
      });

      setList(filter);
    } else {
      setList(demos);
    }
  };

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <Text style={appStyles.heading}>Your collection</Text>

        <TextInput
          style={searchStyles.input}
          onChangeText={(text) => updateSearchResults(text.toLowerCase())}
          placeholder="Search..."
          placeholderTextColor={Colors.$n6}
        />

        <FlatList
          data={sortListByDate(list)}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faTrash} />
                </TouchableOpacity>
              )}
              friction={2}
              rightThreshold={30}
              leftThreshold={80}
            >
              <TouchableOpacity
                style={listStyles.item}
                onPress={() => navigation.navigate('DemoScreen', { item })}
              >
                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    style={listStyles.itemHeader}
                  >
                    {item.title}
                  </TextInput>
                  <Text style={listStyles.itemDate}>{formatDate(item.dateCreated)}</Text>
                </View>

                <View style={listStyles.itemSecondaryColumn}>
                  <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                  <Text style={listStyles.itemRecordingCount}>{item.recordings.length}</Text>
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

export default DemoCollectionScreen;
