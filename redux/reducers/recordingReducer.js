import initialState from './initialState';
import {
  ADD_RECORDING,
  DELETE_RECORDING,
  UPDATE_RECORDING,
} from '../actions/recordingActions';

export default function recordingReducer(state = initialState.demos, action) {
  switch (action.type) {
    case ADD_RECORDING:
      console.log('Add Recording');
      return [...state];
    case DELETE_RECORDING:
      console.log('Delete Recording');
      return [...state];
    case UPDATE_RECORDING:
      console.log('Update Recording');
      return [...state];
    default:
      return state;
  }
}
