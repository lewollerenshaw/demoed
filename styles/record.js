import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const recordStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.$lightShade,
  },
  recordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 75,
    borderRadius: 75 / 2,
    backgroundColor: 'hsl(360, 64%, 55%)',
    marginBottom: 10,
  },
  recordButtonIcon: { color: Colors.$lightShade },
});

export default recordStyles;
