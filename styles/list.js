import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const listStyles = StyleSheet.create({
  /* Shared styles */
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.$n2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemHeader: {
    fontSize: 18,
    color: Colors.$info,
    marginBottom: 5,
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
    opacity: 0.6,
  },
  itemRecordingCount: {
    opacity: 0.6,
  },

  /* Demo Screen Specific */
  itemRecordingDuration: {
    opacity: 0.6,
  },
  itemTags: {
    opacity: 0.6,
  },
});

export default listStyles;
