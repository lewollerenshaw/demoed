export const ADD_DEMO = 'ADD_DEMO';
export const GET_DEMOS = 'GET_DEMOS';
export const DELETE_DEMO = 'DELETE_DEMO';
export const UPDATE_DEMO = 'UPDATE_DEMO';
export const ADD_RECORDING = 'ADD_RECORDING';
export const DELETE_RECORDING = 'DELETE_RECORDING';
export const UPDATE_RECORDING = 'UPDATE_RECORDING';

export function addDemo(demo) {
  return { type: ADD_DEMO, demo };
}

export function getDemos(demos) {
  return { type: GET_DEMOS, demos };
}

export function deleteDemo(demo) {
  return { type: DELETE_DEMO, demo };
}

export function updateDemo(demo) {
  return { type: UPDATE_DEMO, demo };
}

export function addRecording(recording, currentDemoId) {
  return { type: ADD_RECORDING, recording, currentDemoId };
}

export function deleteRecording(recording) {
  return { type: DELETE_RECORDING, recording };
}

export function updateRecording(recording) {
  return { type: UPDATE_RECORDING, recording };
}
