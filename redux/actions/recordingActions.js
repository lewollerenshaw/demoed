export const ADD_RECORDING = 'ADD_RECORDING';
export const DELETE_RECORDING = 'DELETE_RECORDING';
export const UPDATE_RECORDING = 'UPDATE_RECORDING';

export function addRecording(recording) {
  return { type: ADD_RECORDING, recording };
}

export function deleteRecording(recording) {
  return { type: DELETE_RECORDING, recording };
}

export function updateRecording(recording) {
  return { type: UPDATE_RECORDING, recording };
}
