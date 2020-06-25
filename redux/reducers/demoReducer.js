import initialState from './initialState';
import {
  ADD_DEMO,
  GET_DEMOS,
  DELETE_DEMO,
  UPDATE_DEMO,
  ADD_RECORDING,
  DELETE_RECORDING,
  UPDATE_RECORDING,
} from '../actions/demoActions';

export default function demoReducer(state = initialState.demos, action) {
  switch (action.type) {
    case ADD_DEMO:
      state.push(action.demo);
      return [...state];
    case GET_DEMOS:
      state.push(action.demos[0]);
      return [...state];
    case DELETE_DEMO:
      state = state.filter((demo) => demo.id !== action.demo.id);
      return [...state];
    case UPDATE_DEMO:
      return [...state];
    case ADD_RECORDING:
      state.forEach((demo) => {
        if (demo.id.includes(action.currentDemoId)) demo.recordings.push(action.recording);
      });
      return [...state];
    case DELETE_RECORDING:
      let updatedDemo;

      state.forEach((demo) => {
        if (demo.id === action.demo.id) {
          updatedDemo = demo.recordings.filter((recording) => {
            recording.id !== action.recording.id;
          });
        }
      });
      for (let i = 0; i < state.length; i++) {
        if (state[i].id === action.demo.id) {
          state[i].recordings = updatedDemo;
        }
      }
      return [...state];
    case UPDATE_RECORDING:
      return [...state];
    default:
      return state;
  }
}
