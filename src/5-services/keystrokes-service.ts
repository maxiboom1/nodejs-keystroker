import { windowManager } from 'node-window-manager';
import * as robot from 'robotjs';
import KeysModel from '../2-models/keys-model';

// Function to focus a window by its title
const focusWindow = (title: string) => {
  const windows = windowManager.getWindows();
  const targetWindow = windows.find(win => win.getTitle().includes(title));
  
  if (targetWindow) {
    targetWindow.bringToTop();
  }

  return targetWindow;
};

// Function to send a keystroke
const sendKeystroke = (keys:KeysModel["keyTap"]) => {

  // Filter out empty strings from modifiers
  const filteredModifiers = keys.modifiers.filter(modifier => modifier); 

  if (filteredModifiers.length === 0) {
    robot.keyTap(keys.key);
  } else if (filteredModifiers.length === 1) {
    robot.keyTap(keys.key, filteredModifiers[0]);
  } else {
    robot.keyTap(keys.key, filteredModifiers);
  }
};


const executeService = (keys: KeysModel) => {
  const window = focusWindow(keys.app);
  if (window) {
    sendKeystroke(keys.keyTap);
    console.log(`Keystroke '${keys.keyTap.key +' '+ keys.keyTap.modifiers}' sent to window '${keys.app}'`);
  } else {
    console.log(`Window '${keys.app}' not found.`);
  }
};

export default executeService;
