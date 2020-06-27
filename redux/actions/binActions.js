export const ADD_DEMO_TO_BIN = 'ADD_DEMO_TO_BIN';
export const ADD_RECORDING_TO_BIN = 'ADD_RECORDING_TO_BIN';
export const DELETE_ALL = 'DELETE_ALL';
export const RESTORE = 'RESTORE';
export const SET_BIN = 'SET_BIN';

export function setBin(bin) {
  return { type: SET_BIN, bin };
}

export function addDemoToBin(demo) {
  return { type: ADD_DEMO_TO_BIN, demo };
}

export function addRecordingToBin(recording) {
  return { type: ADD_RECORDING_TO_BIN, recording };
}

export function deleteAll() {
  return { type: DELETE_ALL };
}

export function restore(object) {
  return { type: RESTORE, object };
}
