import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from './colors';

const { statusBarHeight } = Constants;

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.$lightShade,
  },
  body: {
    paddingTop: statusBarHeight,
    color: Colors.$primary,
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 32,
    color: Colors.$info,
  },
  recentlyDeleted: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  recentlyDeletedIcon: {
    color: Colors.$n8,
  },
  headerInteraction: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  headingInteractionText: {
    color: Colors.$danger,
    fontSize: 16,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.$n3,
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  noContentText: {
    color: Colors.$info,
    marginTop: '10%',
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  noContentIcon: {
    color: Colors.$darkShade,
    alignSelf: 'center',
  },
});

export default appStyles;
