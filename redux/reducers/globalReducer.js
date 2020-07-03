import initialState from './initialState';
import {
  SET_DARK_MODE,
  SET_CURRENT_SCREEN,
  SET_CURRENT_DEMO_ID,
  SHOULD_NAVIGATE,
} from '../actions/globalActions';

export default function globalReducer(state = initialState.global, action) {
  switch (action.type) {
    case SET_DARK_MODE:
      return { ...state };
    case SET_CURRENT_SCREEN:
      return { ...state, currentScreen: action.screenId };
    case SET_CURRENT_DEMO_ID:
      return { ...state, currentDemoId: action.demoId };
    case SHOULD_NAVIGATE:
      return {
        ...state,
        navigate: {
          shouldNav: action.navigateObj.shouldNav,
          demoId: action.navigateObj.demoId,
        },
      };
    default:
      return state;
  }
}
