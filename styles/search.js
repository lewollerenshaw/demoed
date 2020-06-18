import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const searchStyles = StyleSheet.create({
  input: {
    backgroundColor: Colors.$n2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    color: Colors.$info,
  },
});

export default searchStyles;
