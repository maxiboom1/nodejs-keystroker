import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import sendKeys from './keystrokes-service';
import appConfig from '../4-utils/app-config';

function listenSerial(){
  try{
    const port = new SerialPort({ path: appConfig.serialPort, baudRate: 9600 });
    const parser = new ReadlineParser();
    port.on('error', (err) => {
      console.error('Serial Port Error:', err.message , '. Attempt again in 5 sec...');
      setTimeout(listenSerial, 5000);
    });

    port.pipe(parser);
    parser.on('data', (data)=>{ _serialMsgHandler(data)} ); 
  } catch(e){
    console.error("Serial communication failed: ", e);
  }
}

function _serialMsgHandler(data:string){
  switch (data.trim()) {
    case 'GPI 1 FIRED!':
      sendKeys(appConfig.gpi1, "gpi1", "Serial");
      break;
    case 'GPI 2 FIRED!':
      sendKeys(appConfig.gpi2, "gpi2", "Serial");
      break;
    case 'GPI 3 FIRED!':
      sendKeys(appConfig.gpi3, "gpi3", "Serial");
      break;
    case 'GPI 4 FIRED!':
      sendKeys(appConfig.gpi4, "gpi4", "Serial");
      break; 
    case 'GPI 5 FIRED!':
      sendKeys(appConfig.gpi5, "gpi5", "Serial");
      break;
    case 'GPI 6 FIRED!':
      sendKeys(appConfig.gpi6, "gpi6", "Serial");
      break;  
    case 'Connection failed': // This message from arduino about http connection fail. Can be ignored here.
      break;      
    default:
      console.log('Serial service: GPIO BOX -', data);
      break;
  }
}

export default listenSerial; 
