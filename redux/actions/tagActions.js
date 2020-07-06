export const SET_TAGS = 'SET_TAGS';
export const ADD_TAG = 'ADD_TAGS';

export function setTags(tags) {
  return { type: SET_TAGS, tags };
}

export function addTag(tag) {
  return { type: ADD_TAG, tag };
}
