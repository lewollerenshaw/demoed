export const ADD_DEMO = 'ADD_DEMO';
export const ADD_RECORDING = 'ADD_RECORDING';
export const DELETE_ALL = 'DELETE_ALL';
export const RESTORE = 'RESTORE';

export function addDemo(demo) {
  return { type: ADD_DEMO, demo };
}

export function addRecording(recording) {
  return { type: ADD_RECORDING, recording };
}

export function deleteAll() {
  return { type: DELETE_ALL };
}

export function restore(object) {
  return { type: RESTORE, object };
}
