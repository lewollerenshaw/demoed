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
      // Big error if return state.push(action.tag) instead of this
      state.push(action.tag);
      return state;
    default:
      return state;
  }
}
