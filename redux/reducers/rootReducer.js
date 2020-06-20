import { combineReducers } from 'redux';
import BinReducer from './binReducer';
import DemoReducer from './demoReducer';
import GlobalReducer from './globalReducer';
import RecordingReducer from './recordingReducer';

const rootReducer = combineReducers({
  BinReducer,
  DemoReducer,
  GlobalReducer,
  RecordingReducer,
});

export default rootReducer;
