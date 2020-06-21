import { combineReducers } from 'redux';
import bin from './binReducer';
import demos from './demoReducer';
import global from './globalReducer';
import recordingReducer from './recordingReducer';

const rootReducer = combineReducers({
  bin,
  demos,
  global,
  recordingReducer,
});

export default rootReducer;
