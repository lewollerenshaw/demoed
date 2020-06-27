import initialState from './initialState';
import {
  ADD_DEMO_TO_BIN,
  ADD_RECORDING_TO_BIN,
  DELETE_ALL,
  RESTORE,
  SET_BIN,
} from '../actions/binActions';

export default function binReducer(state = initialState.bin, action) {
  switch (action.type) {
    case SET_BIN:
      return action.bin;
    case ADD_DEMO_TO_BIN:
      state.push(action.demo);
      return [...state];
    case ADD_RECORDING_TO_BIN:
      state.push(action.recording);
      return [...state];
    case DELETE_ALL:
      return [...state];
    case RESTORE:
      return [...state];
    default:
      return state;
  }
}
