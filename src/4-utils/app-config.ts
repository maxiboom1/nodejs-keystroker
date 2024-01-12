import * as fs from 'fs';
import path from 'path';
import KeysModel from '../2-models/keys-model';

class AppConfig {
    
    constructor() {
        // Load initial values from a file (if the file exists)
        this.loadFromFile('config.json');
    }
    public port:number = 4000; // Default Server Port:
    public serialPort:string = "COM3";  // Default serial port 
    
    public gpi1:KeysModel = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };

    public gpi2:KeysModel = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };

    public gpi3:KeysModel = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };
  
    public gpi4:KeysModel = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };

    public gpi5:KeysModel = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };

    public gpi6:KeysModel = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };


    // We loading the config.json once onload
    private loadFromFile(filename: string): void {
        try {
            const configFilePath = path.join(__dirname, '../','../','src', '1-config', filename);
            const data = fs.readFileSync(configFilePath, 'utf-8');
            const config = JSON.parse(data);
            Object.assign(this, config);
        } catch (error) {
            console.error('Error loading config file:', error.message);
        }
    }
    // Save config changes to config.json
    public saveToFile(): void {
        const configFilePath = path.join(__dirname, '../','../','src', '1-config', "config.json");
        const data = JSON.stringify(this, null, 2);
        fs.writeFileSync(configFilePath, data, 'utf-8');
    }

    public setGPI(index: number, newGPIValue: KeysModel): void{
        if (index >= 1 && index <= 6) {
            const gpiProperty = `gpi${index}`;
            this[gpiProperty] = newGPIValue;
        } else {
            console.error('Invalid GPI index. Index must be between 1 and 7.');
        }
    }

    public setComPort(comPort:string):void{
        this.serialPort = comPort;
    }

}

const appConfig = new AppConfig();

export default appConfig;
