import { windowManager } from 'node-window-manager';
import * as robot from 'robotjs';

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
const sendKeystroke = (key: string) => {
  robot.keyTap(key);
};

// Main function to execute your service logic, now with parameters
const executeService = (windowTitle: string, keyToSend: string) => {
  const window = focusWindow(windowTitle);
  if (window) {
    sendKeystroke(keyToSend);
    console.log(`Keystroke '${keyToSend}' sent to window '${windowTitle}'`);
  } else {
    console.log(`Window '${windowTitle}' not found.`);
  }
};

export default executeService;
