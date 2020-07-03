import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, FlatList, TouchableOpacity, TextInput, AsyncStorage,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCompactDisc, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector, useDispatch } from 'react-redux';
import { setDemos, deleteDemo, updateDemo } from '../redux/actions/demoActions';
import { addDemoToBin, setBin } from '../redux/actions/binActions';
import listStyles from '../styles/list';
import appStyles from '../styles/app';
import searchStyles from '../styles/search';
import { Colors } from '../styles/colors';
import { sortListByDate, formatDate, idGenerator } from '../utils/helpers';
import DeletedDemo from '../models/deletedDemo';
import { STORAGE_KEY, BIN_STORAGE_KEY } from '../redux/storageKeys';

function DemoCollectionScreen() {
  const demos = useSelector((state) => state.demos);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [list, setList] = React.useState([]);

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
      idGenerator(),
      Date.now(),
      demo,
    );

    // Remove from local demo storage
    const updatedDemoStorage = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY))
      .filter((demoInStorage) => demoInStorage.id !== demo.id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDemoStorage));

    // Update local bin storage
    let binStorage = JSON.parse(await AsyncStorage.getItem(BIN_STORAGE_KEY));
    binStorage !== null ? binStorage.push(del) : binStorage = [del];

    await AsyncStorage.setItem(BIN_STORAGE_KEY, JSON.stringify(binStorage));

    // Update redux
    dispatch(addDemoToBin(del));
    dispatch(deleteDemo(demo));
  };

  const fetchDataAndSetInRedux = async () => {
    const storageDemos = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    const storageBin = JSON.parse(await AsyncStorage.getItem(BIN_STORAGE_KEY));

    if (storageDemos) dispatch(setDemos(storageDemos));
    if (storageBin) dispatch(setBin(storageBin));
  };

  const updateDemoName = async (demo, newTitle) => {
    demo.title = newTitle;
    dispatch(updateDemo(demo));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  };

  React.useEffect(() => {
    fetchDataAndSetInRedux();
  }, []);

  React.useEffect(() => (demos ? setList(demos) : setList([])), [demos]);

  return (
    <View style={appStyles.container}>
      <View style={appStyles.body}>
        <View style={appStyles.headerContainer}>
          <View style={appStyles.headingRow}>
            <Text style={appStyles.heading}>Your collection</Text>

            <TouchableOpacity style={appStyles.recentlyDeleted} onPress={() => navigation.navigate('RecentlyDeletedScreen')}>
              <FontAwesomeIcon style={appStyles.recentlyDeletedIcon} size={20} icon={faTrash} />
            </TouchableOpacity>
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
              <RectButton
                style={[listStyles.item, listStyles.collectionItem]}
                onPress={() => navigation.navigate('DemoScreen', { item })}
              >
                <View style={listStyles.itemPrimaryColumn}>
                  <TextInput
                    style={listStyles.itemHeader}
                    onChangeText={(value) => updateDemoName(item, value)}
                  >
                    {item.title}
                  </TextInput>
                  <Text style={listStyles.itemDate}>{formatDate(item.dateCreated)}</Text>
                </View>

                <View style={listStyles.itemSecondaryColumn}>
                  <FontAwesomeIcon style={listStyles.itemIcon} icon={faCompactDisc} />
                  <Text style={listStyles.itemRecordingCount}>{item.recordings.length}</Text>
                </View>
              </RectButton>
            </Swipeable>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default DemoCollectionScreen;
