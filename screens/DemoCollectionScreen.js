import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, FlatList, TouchableWithoutFeedback, TouchableOpacity, TextInput, AsyncStorage,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import { getDemos, deleteDemo } from '../redux/actions/demoActions';
import { addDemoToBin } from '../redux/actions/binActions';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { sortListByDate, formatDate } from '../utils/helpers';
import DeletedDemo from '../models/deletedDemo';

function DemoCollectionScreen() {
  const demos = useSelector((state) => state.demos);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [list, setList] = React.useState([]);

  const STORAGE_KEY = 'demos: demo';
  const BIN_STORAGE_KEY = 'bin: binItem';

  React.useEffect(() => {
    setList(demos);
  }, [demos]);

  const fetchDataAndSetInRedux = async () => {
    const storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    if (storageData !== null && storageData.length !== 0) dispatch(getDemos(storageData));
  };

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
    } else setList(demos);
  };

  const deleteItem = async (demo) => {
    const del = new DeletedDemo(
      Date.now(),
      demo,
    );
    // Remove from async storage
    const demoStorageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    const updatedData = demoStorageData.filter((demoInStorage) => demoInStorage.id !== demo.id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Add to async storage bin
    const storageData = JSON.parse(await AsyncStorage.getItem(BIN_STORAGE_KEY));

    if (storageData !== null) {
      storageData.push(del);
      await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(storageData));
    } else await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify([del]));

    // Remove from redux
    dispatch(deleteDemo(demo));

    // Add to bin
    dispatch(addDemoToBin(del));
  };

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <View style={appStyles.headingRow}>
            <Text style={appStyles.heading}>Your collection</Text>

            {true && (
              <TouchableOpacity style={appStyles.recentlyDeleted} onPress={() => navigation.navigate('RecentlyDeletedScreen')}>
                <FontAwesomeIcon style={appStyles.recentlyDeletedIcon} size={20} icon={faTrash} />
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={searchStyles.input}
            onChangeText={(text) => updateSearchResults(text.toLowerCase())}
            placeholder="Search..."
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
