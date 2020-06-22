export const SET_DARK_MODE = 'SET_DARK_MODE';
export const SET_CURRENT_SCREEN = 'SET_CURRENT_SCREEN';
export const SET_CURRENT_DEMO_ID = 'SET_CURRENT_DEMO_ID';

export function setDarkMode(bool) {
  return { type: SET_DARK_MODE, bool };
}

export function setCurrentScreen(screenId) {
  return { type: SET_CURRENT_SCREEN, screenId };
}

export function setCurrentDemoId(demoId) {
  return { type: SET_CURRENT_DEMO_ID, demoId };
}
