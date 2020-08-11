import initialState from './initialState';
import {
  SET_AUDIO_QUALITY,
  SET_OPTION_SAVE_RECORDING,
  SET_AUTO_SAVE_TO_DEMO,
} from '../actions/settingsActions';

export default function globalReducer(state = initialState.settings, action) {
  switch (action.type) {
    case SET_AUDIO_QUALITY:
      return { ...state, quality: action.quality };
    case SET_OPTION_SAVE_RECORDING:
      return { ...state, optionalSaveRecording: action.optionalSaveRecording };
    case SET_AUTO_SAVE_TO_DEMO:
      return { ...state, autoSaveToDemo: action.autoSaveToDemo };
    default:
      return state;
  }
}
