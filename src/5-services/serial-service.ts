import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import executeService from './keystrokes-service';

function listenSerial(){
  const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); // Replace 'COM3' with your port
  const parser = new ReadlineParser();
  port.pipe(parser);
  parser.on('data', send); 
}

function send(){
  executeService("Google Chrome","f5");
}

export default listenSerial;
