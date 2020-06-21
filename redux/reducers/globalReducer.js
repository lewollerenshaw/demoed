import initialState from './initialState';
import {
  SET_CURRENT_SCREEN,
  SET_DARK_MODE,
} from '../actions/globalActions';

export default function globalReducer(state = initialState.global, action) {
  switch (action.type) {
    case SET_CURRENT_SCREEN:
      return { ...state, currentScreen: action.screenId };
    case SET_DARK_MODE:
      return { ...state };
    default:
      return state;
  }
}
