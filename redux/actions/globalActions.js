export const SET_CURRENT_SCREEN = 'SET_CURRENT_SCREEN';
export const SET_DARK_MODE = 'SET_DARK_MODE';

export function setCurrentScreen(screenId) {
  return { type: SET_CURRENT_SCREEN, screenId };
}

export function setDarkMode(bool) {
  return { type: SET_DARK_MODE, bool };
}
