import { combineReducers } from 'redux';
import bin from './binReducer';
import demos from './demoReducer';
import tags from './tagReducer';
import global from './globalReducer';

const rootReducer = combineReducers({
  bin,
  tags,
  demos,
  global,
});

export default rootReducer;
