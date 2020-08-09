import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const recordStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.$darkShade,
    height: 65,
  },
  recordContainer: {
    alignSelf: 'center',
    position: 'relative',
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: Colors.$lightShade,
    backgroundColor: Colors.$lightShade,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 50,
  },
  recordButtonContainer: {
    bottom: 40,
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
