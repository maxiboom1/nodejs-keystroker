import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import executeService from './keystrokes-service';

function listenSerial(){
  try{
    const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
    const parser = new ReadlineParser();
    port.on('error', (err) => {
      console.error('Serial Port Error:', err.message , '. Attempt again in 3 sec...');
      setTimeout(listenSerial, 3000);
    });

    port.pipe(parser);
    parser.on('data', send); 
  } catch(e){
    console.error("Serial communication failed: ", e);
  }
}

function send(){
  executeService("Google Chrome","f5");
}

export default listenSerial; 
