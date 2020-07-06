import initialState from './initialState';
import {
  SET_TAGS,
  ADD_TAG,
} from '../actions/tagActions';

export default function tagReducer(state = initialState.tags, action) {
  switch (action.type) {
    case SET_TAGS:
      return action.bin;
    case ADD_TAG:
      return state.push(action.tag);
    default:
      return state;
  }
}
