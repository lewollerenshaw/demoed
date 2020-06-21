import initialState from './initialState';
import {
  ADD_DEMO,
  GET_DEMOS,
  DELETE_DEMO,
  UPDATE_DEMO,
} from '../actions/demoActions';

export default function demoReducer(state = initialState.demos, action) {
  switch (action.type) {
    case ADD_DEMO:
      state.push(action.demo);
      return [...state];
    case GET_DEMOS:
      return [...state];
    case DELETE_DEMO:
      return [...state];
    case UPDATE_DEMO:
      return [...state];
    default:
      return state;
  }
}
