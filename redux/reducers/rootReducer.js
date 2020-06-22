import { combineReducers } from 'redux';
import bin from './binReducer';
import demos from './demoReducer';
import global from './globalReducer';

const rootReducer = combineReducers({
  bin,
  demos,
  global,
});

export default rootReducer;
