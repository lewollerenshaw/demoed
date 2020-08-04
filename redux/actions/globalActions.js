export const SET_DARK_MODE = 'SET_DARK_MODE';
export const SET_CURRENT_SCREEN = 'SET_CURRENT_SCREEN';
export const SET_CURRENT_DEMO_ID = 'SET_CURRENT_DEMO_ID';
export const SHOULD_NAVIGATE = 'SHOULD_NAVIGATE';
export const IS_FOOTER_VISIBLE = 'IS_FOOTER_VISIBLE';

export function setDarkMode(bool) {
  return { type: SET_DARK_MODE, bool };
}

export function setCurrentScreen(screenId) {
  return { type: SET_CURRENT_SCREEN, screenId };
}

export function setCurrentDemoId(demoId) {
  return { type: SET_CURRENT_DEMO_ID, demoId };
}

export function shouldNavigate(navigateObj) {
  return { type: SHOULD_NAVIGATE, navigateObj };
}

export function isFooterVisible(set) {
  return { type: IS_FOOTER_VISIBLE, set };
}
