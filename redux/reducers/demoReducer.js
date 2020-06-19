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
      console.log('Add Demo');
      return [...state];
    case GET_DEMOS:
      console.log('Get Demos from LocalStorage');
      return [...state];
    case DELETE_DEMO:
      console.log('Delete Demo');
      return [...state];
    case UPDATE_DEMO:
      console.log('Update Demo');
      return [...state];
    default:
      return state;
  }
}
