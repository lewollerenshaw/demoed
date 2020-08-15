export const SET_AUDIO_QUALITY = 'SET_AUDIO_QUALITY';

export function setAudioQuality(quality) {
  return { type: SET_AUDIO_QUALITY, quality };
}
