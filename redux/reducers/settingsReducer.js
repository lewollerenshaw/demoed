import initialState from './initialState';
import {
  SET_AUDIO_QUALITY,
} from '../actions/settingsActions';

export default function globalReducer(state = initialState.settings, action) {
  switch (action.type) {
    case SET_AUDIO_QUALITY:
      return { ...state, quality: action.quality };
    default:
      return state;
  }
}
