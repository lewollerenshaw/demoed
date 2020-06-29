import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const modalStyles = StyleSheet.create({
  /* Shared modal styles */
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 35,
    shadowColor: '#000',
    margin: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    marginBottom: 20,
    fontSize: 20,
  },
  headingAction: {
    position: 'relative',
    top: 5,
  },
  bodyText: {
    marginBottom: 20,
    fontSize: 16,
  },

  /* Delete all specific styles */
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryAction: {
    marginRight: 10,
    backgroundColor: Colors.$primary,
    padding: 10,
  },
  primaryActionText: {
    fontSize: 16,
    color: Colors.$lightShade,
  },
  secondaryAction: {
    padding: 10,
  },
  secondaryActionText: {
    fontSize: 16,
    color: Colors.$primary,
  },
});

export default modalStyles;
