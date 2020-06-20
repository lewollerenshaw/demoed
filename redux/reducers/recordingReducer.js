import initialState from './initialState';
import {
  ADD_RECORDING,
  DELETE_RECORDING,
  UPDATE_RECORDING,
} from '../actions/recordingActions';

export default function recordingReducer(state = initialState.demos, action) {
  switch (action.type) {
    case ADD_RECORDING:
      return [...state];
    case DELETE_RECORDING:
      return [...state];
    case UPDATE_RECORDING:
      return [...state];
    default:
      return state;
  }
}
