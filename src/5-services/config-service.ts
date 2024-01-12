import KeysModel from "../2-models/keys-model";
import appConfig from "../4-utils/app-config";

interface ConfigObject {
    keysData: KeysModel[];
    comport: string;
}

async function setConfig(config:ConfigObject) {
    // Run over all 6 received gpi
    for (const [index, element] of config.keysData.entries()) {
        appConfig.setGPI(index+1, element);
    }
    // Set comport
    if(config.comport.length > 0) {
        appConfig.setComPort(config.comport);
    };
    // Save to config.json
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