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
      return [...state];
    case ADD_RECORDING:
      return [...state];
    case DELETE_ALL:
      return [...state];
    case RESTORE:
      return [...state];
    default:
      return state;
  }
}
