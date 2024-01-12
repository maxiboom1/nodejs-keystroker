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


const executeService1 = (keys: KeysModel, gpi:String, provider: String) => {
  console.log(gpi)
  const window = focusWindow(keys.app);
  const key = keys.keyTap.key;
  if(!window){}
  if (window && key.length > 0) {
    sendKeystroke(keys.keyTap);
    console.log(`${provider}: ${gpi} triggered. Keystroke '${keys.keyTap.key +' '+ keys.keyTap.modifiers}' sent to window '${keys.app}'`);
  } else {
    console.log(`${provider}: ${gpi} triggered. Window '${keys.app}' not found.`);
  }
};

const executeService = (keys: KeysModel, gpi:String, provider: String) => {
  if(keys.app.length === 0){
    console.log(`${provider}: ${gpi} triggered. Must specify focus application.`);
  } else if(keys.keyTap.key.length === 0){
    console.log(`${provider}: ${gpi} triggered. Key '${keys.keyTap.key}' not allowed.`);
  } else {
    const window = focusWindow(keys.app);
    if (window) {
      sendKeystroke(keys.keyTap);
      console.log(`${provider}: ${gpi} triggered. Keystroke '${keys.keyTap.key +' '+ keys.keyTap.modifiers}' sent to window '${keys.app}'`);
    } else {
      console.log(`${provider}: ${gpi} triggered. Window '${keys.app}' not found.`);
    }
  }
};

export default executeService;
