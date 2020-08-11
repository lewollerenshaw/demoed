export const SET_AUDIO_QUALITY = 'SET_AUDIO_QUALITY';
export const SET_OPTION_SAVE_RECORDING = 'SET_OPTION_SAVE_RECORDING';
export const SET_AUTO_SAVE_TO_DEMO = 'SET_AUTO_SAVE_TO_DEMO';

export function setAudioQuality(quality) {
  return { type: SET_AUDIO_QUALITY, quality };
}

export function setOptionSaveRecording(optionalSaveRecording) {
  return { type: SET_OPTION_SAVE_RECORDING, optionalSaveRecording };
}

export function setAutoSaveToDemoInRedux(autoSaveToDemo) {
  return { type: SET_AUTO_SAVE_TO_DEMO, autoSaveToDemo };
}
