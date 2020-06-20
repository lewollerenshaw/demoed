export const ADD_DEMO = 'ADD_DEMO';
export const GET_DEMOS = 'GET_DEMOS';
export const DELETE_DEMO = 'DELETE_DEMO';
export const UPDATE_DEMO = 'UPDATE_DEMO';

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
