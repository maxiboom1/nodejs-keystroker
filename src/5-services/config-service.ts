import KeysModel from "../2-models/keys-model";
import appConfig from "../4-utils/app-config";

async function setConfig(config:KeysModel[]) {
    // Run over all 7 received gpi data
    for (const [index, element] of config.entries()) {
        appConfig.setGPI(index+1, element);
    }
    appConfig.saveToFile();
}

async function setComPort(comPort:string) {
    if(comPort === "") return;
    appConfig.setComPort(comPort);
}


export default {
    setConfig, 
    setComPort
};