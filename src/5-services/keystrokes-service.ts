import { windowManager } from 'node-window-manager';
import * as robot from 'robotjs';
import KeysModel from '../2-models/keys-model';

// Function to focus a window by its title
const focusWindow = (title: string) => {
  if(title.length<1){ 
    return false;
  }
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

const executeService = (keys: KeysModel, gpi:String, provider: String) => {
  
  // Not provided app and key
  if(keys.app.length === 0 && keys.keyTap.key.length === 0){
    console.log(`${provider}: ${gpi.toUpperCase()} triggered. Empty gpi data.`);
    return;
  }
 
  // provided only app
  if(keys.keyTap.key.length === 0 && keys.app.length > 0){
    const result = focusWindow(keys.app);
    if(result) {
      console.log(`${provider}: ${gpi.toUpperCase()} triggered. Set focus on ${keys.app} app.`);
    } else {
      console.log(`${provider}: ${gpi.toUpperCase()} triggered. App named ${keys.app} not found.`);
    }
    return;
  }

  // provided only key, or keys
  if(keys.keyTap.key.length > 0 && keys.app.length === 0){
    console.log(`${provider}: ${gpi.toUpperCase()} triggered. Sending ${keys.keyTap.key} (No application specified).`);
    sendKeystroke(keys.keyTap);
    return;
  }


  const window = focusWindow(keys.app);
  if (window) {
    sendKeystroke(keys.keyTap);
    console.log(`${provider}: ${gpi.toUpperCase()} triggered. Keystroke '${keys.keyTap.key +' '+ keys.keyTap.modifiers}' sent to window '${keys.app}'`);
  } else {
    console.log(`${provider}: ${gpi.toUpperCase()} triggered. Window '${keys.app}' not found.`);
  }
  
};
export default executeService;
