import initialState from './initialState';
import {
  ADD_DEMO,
  ADD_RECORDING,
  DELETE_ALL,
  RESTORE,
} from '../actions/binActions';

export default function binReducer(state = initialState.bin, action) {
  switch (action.type) {
    case ADD_DEMO:
      console.log('Add Demo');
      return [...state];
    case ADD_RECORDING:
      console.log('Add Recording');
      return [...state];
    case DELETE_ALL:
      console.log('Delete All');
      return [...state];
    case RESTORE:
      console.log('Restore');
      return [...state];
    default:
      return state;
  }
}
