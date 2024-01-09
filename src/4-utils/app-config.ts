import * as fs from 'fs';
import path from 'path';

class AppConfig {
    
    constructor() {
        // Load initial values from a file (if the file exists)
        this.loadFromFile('config.json');
    }
    public port = 4000; // Default Server Port:
    public serialPort = "COM3";  // Default serial port ['tab', 'control', 'shift']
    
    public gpi1 = {
        app: "Google Chrome", 
        keyTap: {
            key:"tab",
            modifiers:['control', 'shift']
        }
    };

    public gpi2 = {
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
    private saveToFile(filename: string): void {
        const configFilePath = path.join(__dirname, '../','../','src', '1-config', filename);
        const data = JSON.stringify(this, null, 2);
        fs.writeFileSync(configFilePath, data, 'utf-8');
    }

}

const appConfig = new AppConfig();

export default appConfig;
