import { focusManager } from '@tanstack/react-query';
import { AppState } from 'react-native';

export function setupFocusManager() {
  let state = AppState.currentState;

  AppState.addEventListener('change', (next) => {
    if (state.match(/inactive|background/) && next === 'active') {
      focusManager.setFocused(true);
    }
    state = next;
  });
}
