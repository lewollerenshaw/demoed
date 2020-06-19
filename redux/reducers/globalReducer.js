import initialState from './initialState';
import {
  SET_CURRENT_SCREEN,
  SET_DARK_MODE,
} from '../actions/globalActions';

export default function globalReducer(state = initialState.global, action) {
  switch (action.type) {
    case SET_CURRENT_SCREEN:
      console.log('Set Current Screen');
      return [...state];
    case SET_DARK_MODE:
      console.log('Set Dark Mode');
      return [...state];
    default:
      return state;
  }
}
