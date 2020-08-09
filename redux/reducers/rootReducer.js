import { combineReducers } from 'redux';
import bin from './binReducer';
import demos from './demoReducer';
import tags from './tagReducer';
import global from './globalReducer';
import settings from './settingsReducer';

const rootReducer = combineReducers({
  bin,
  tags,
  demos,
  global,
  settings,
});

export default rootReducer;
