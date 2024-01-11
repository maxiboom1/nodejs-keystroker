# nodejs-keystroker 

## Main Concept

The main concept is to have a GPIO box that can be connected to GPO providers and trigger app focus and keystroke sends.
So, we have a GPIO box, and a Node.js application:


### GPIO-BOX:

In this project, I use an Arduino Nano ATMega328 with an ETH W5500 module. In the sketch, we use the Ethernet2 library.
In general, it can:

- Send GET requests to keystroker (we can change the keystroker IP in the Arduino web config page).
- Handle GPI on digital pins as a trigger to initiate GET requests.
- Serve a basic web config page to set Arduino and keystroker IP. These 2 parameters are cached in EEPROM.

![Config Image](./docs/img/GPIO_Box_config.PNG)
![Config Image](./docs/img/mockup.jpeg)


### Nodejs application:

Node.js runs on the client, listens to serial or HTTP triggers, and fires keystrokes.

It uses the robotjs library to send keys, and node-window-manager to set application focus.

It also provides a web config page to map GPIs to focus application and keystroke.

Also, for serial connection, we can set the serial port.

![Config Image](./docs/img/keystroker_config.PNG)



