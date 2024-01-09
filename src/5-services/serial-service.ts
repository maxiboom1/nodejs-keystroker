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
      console.log('GPI 1 FIRED!');
      //sendKeys(appConfig.gpi1.app, appConfig.gpi1.keyTap);
      break;
    case 'GPI 2 FIRED!':
      console.log('GPI 2 FIRED!');
      sendKeys(appConfig.gpi2);
      break;
    default:
      console.log('Unrecognized data:', data);
      break;
  }
}

export default listenSerial; 
