import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const listStyles = StyleSheet.create({
  /* Shared styles */
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.$n2,
    justifyContent: 'space-between',
    backgroundColor: Colors.$lightShade,
  },
  itemHeader: {
    fontSize: 18,
    color: Colors.$info,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  itemPrimaryColumn: {
    alignSelf: 'stretch',
    paddingLeft: 10,
  },
  itemSecondaryColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  itemPrimaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemSecondaryRow: {
    padding: 0,
    paddingBottom: 10,
  },
  deleteButton: {
    width: 75,
    backgroundColor: Colors.$danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonIcon: { color: Colors.$lightShade },

  /* Demo Collection Screen Specific */
  collectionItem: {
    flexDirection: 'row',
  },
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
  itemInfo: {
    opacity: 0.6,
  },

  /* Recently Deleted Screen Specific */
  itemType: {
    opacity: 0.6,
  },
  itemAssociatedInfo: {
    flexDirection: 'row',
  },
});

export default listStyles;
