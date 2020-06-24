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
import { sortListByDate, formatDate } from '../utils/helpers';

function DemoCollectionScreen() {
  const demos = useSelector((state) => state.demos);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [list, setList] = React.useState([]);

  const STORAGE_KEY = 'demos: demo';

  React.useEffect(() => {
    setList(demos);
  }, [demos]);

  const fetchDataAndSetInRedux = async () => {
    const storageData = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
    if (storageData !== null) dispatch(getDemos(storageData));
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
