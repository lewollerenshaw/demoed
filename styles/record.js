import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const recordStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.$darkShade,
    height: 50,
  },
  recordContainer: {
    backgroundColor: Colors.$lightShade,
    position: 'relative',
    bottom: 50,
    borderRadius: 50,
  },
  recordButtonContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 75,
    borderRadius: 75 / 2,
    backgroundColor: 'hsl(360, 64%, 55%)',
  },
  recordButtonIcon: { color: Colors.$lightShade },
});

export default recordStyles;
