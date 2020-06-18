import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const listStyles = StyleSheet.create({
  /* Shared styles */
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemHeader: {
    fontSize: 18,
    color: Colors.$info,
  },
  itemPrimaryColumn: {
    alignSelf: 'stretch',
  },
  itemSecondaryColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  /* Demo Collection Screen Specific */
  itemDate: {
    opacity: 0.6,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemRecordingCount: {
  },

  /* Demo Screen Specific */
});

export default listStyles;
