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
      if (action.optionalSaveRecording === 'true') {
        return { ...state, optionalSaveRecording: true };
      }
      return { ...state, optionalSaveRecording: false };
    case SET_AUTO_SAVE_TO_DEMO:
      if (action.autoSaveToDemo === 'true') {
        return { ...state, optionalSaveRecording: true };
      }
      return { ...state, autoSaveToDemo: false };
    default:
      return state;
  }
}
