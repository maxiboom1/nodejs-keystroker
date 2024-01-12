#include <SPI.h>
#include <Ethernet2.h>
#include <EEPROM.h>

const int gpi3 = 3;
const int gpi4 = 4;
const int gpi5 = 5;
const int gpi6 = 6;
const int gpi7 = 7;
const int gpi8 = 8;

String targetServer = "192.168.1.100";
String connectionMode = "serial";
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 230);
IPAddress subnet(255, 255, 255, 0);
IPAddress gateway(192, 168, 1, 1);
IPAddress dnsServer(8, 8, 8, 8);

EthernetClient client;
EthernetServer server(80);

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  targetServer = readStringFromEEPROM(0);
  if (targetServer == "") {
    targetServer = "192.168.1.230";
  }
  IPAddress defaultIP(192, 168, 1, 230);

  // Load IP from EEPROM or set to default if EEPROM is uninitialized
  ip = readIPFromEEPROM(50);
  if (ip == INADDR_NONE || ip == IPAddress(255, 255, 255, 255)) {
    ip = defaultIP;
    writeIPToEEPROM(50, ip);
  }

  //Read connection mode from EEPROM
  connectionMode = readConnModeFromEEPROM(100); // Assuming offset 100 for connection mode
  if (connectionMode != "serial" && connectionMode != "ethernet") {
    connectionMode = "serial"; // Default value
    writeConnModeToEEPROM(100, connectionMode); // Store default mode to EEPROM
  }
  
  Ethernet.begin(mac, ip, dnsServer, gateway, subnet);
  server.begin();
  Serial.println();
  Serial.print("GPIO Box IP address: ");
  Serial.println(Ethernet.localIP());
  Serial.print("Keystroker IP address: ");
  Serial.println(targetServer);
  Serial.print("Connection mode: " + connectionMode);

  pinMode(gpi3, INPUT_PULLUP);
  pinMode(gpi4, INPUT_PULLUP);
  pinMode(gpi5, INPUT_PULLUP);
  pinMode(gpi6, INPUT_PULLUP);
  pinMode(gpi7, INPUT_PULLUP);
  pinMode(gpi8, INPUT_PULLUP);
}

void loop() {

  btnClick();
  EthernetClient webClient = server.available();
  if (webClient) {
    handleClient(webClient);
    webClient.stop();
  }
}

void btnClick() {
    for (int pin = gpi3; pin <= gpi8; pin++) {
        int reading = digitalRead(pin);
        if (reading == LOW) {
            while (digitalRead(pin) == LOW) {} // wait for button release
            delay(20); // debounce delay
            
            if(connectionMode == "serial"){
              Serial.println("GPI " + String(pin-2) + " FIRED!");
            } else if(connectionMode == "ethernet"){
              String url = "/api/gpi/" + String(pin-2);
              sendHttpGetRequest(targetServer.c_str(), 4000, url.c_str());
              Serial.println("HTTP FIRED!");
            }

            break; 
        }
    }
}

void sendHttpGetRequest(const char* server, uint16_t port, const char* path) {

  if (client.connect(server, port)) {
    client.println("GET " + String(path) + " HTTP/1.1");
    client.println("Host: " + String(server));
    client.println("Connection: close");
    client.println();
    while (client.connected() || client.available()) {
      if (client.available()) {
        char c = client.read();
      }
    }
    client.stop();
  } else {
    Serial.println("Connection failed");
  }
}

void sendHtmlResponse(EthernetClient& webClient) {
  webClient.println("HTTP/1.1 200 OK");
  webClient.println("Content-Type: text/html");
  webClient.println("Connection: close"); 
  webClient.println();
  webClient.println("<!DOCTYPE HTML>");
  webClient.println("<html>");
  webClient.println("<head><title>GPIO Box</title>");
  webClient.println("<style>");
  webClient.println("form { display: flex; align-items: center; margin-bottom: 15px; }");
  webClient.println("input[type=text] { margin-right: 10px; }");
  webClient.println("input[type=submit] { width: 150px; }");
  webClient.println("select { margin-right: 10px; }");
  webClient.println("</style>");
  webClient.println("</head>");
  webClient.println("<body>");
  webClient.println("<h1>GPIO Box Config Page</h1>");
  webClient.println("<form action=\"/setHost\">");
  // GPIO Box ip
  webClient.print("GPIO Box IP Address: <input type=\"text\" name=\"ip\" value=\"");
  webClient.print(String(Ethernet.localIP()[0]));
  webClient.print(".");
  webClient.print(String(Ethernet.localIP()[1]));
  webClient.print(".");
  webClient.print(String(Ethernet.localIP()[2]));
  webClient.print(".");
  webClient.print(String(Ethernet.localIP()[3]));
  webClient.println("\">"); 
  webClient.println("<input type=\"submit\" value=\"Set GPIO Box\">");
  webClient.println("</form><br>");
  webClient.println("<form action=\"/setMode\">");
  // Keystroker ip
  webClient.print("Keystroker IP Address: <input type=\"text\" name=\"hostIp\" value=\"");
  webClient.print(targetServer);
  webClient.println("\">");  webClient.println("<input type=\"submit\" value=\"Set keystroker\">");
  webClient.println("</form>");
  webClient.println("<br>");
  webClient.println("<form action=\"/setIP\">");
  // Connection mode
  webClient.println("GPIO Box connection mode:");
  webClient.println("<select name=\"mode\" id=\"mode\">");
  webClient.print("<option value=\"serial\"");
  if (connectionMode == "serial") {webClient.print(" selected");}
  webClient.println(">SERIAL (USB)</option>");
  webClient.print("<option value=\"ethernet\"");
  if (connectionMode == "ethernet") {webClient.print(" selected");}
  webClient.println(">ETHERNET</option>");
  webClient.println("</select><br>");
  webClient.println("<input type=\"submit\" value=\"Set Mode\">");
  webClient.println("</form>");
  webClient.println("</body>");
  webClient.println("</html>");
}

void handleClient(EthernetClient& webClient) {
  boolean currentLineIsBlank = true;
  String currentLine = "";

  while (webClient.connected()) {
    if (webClient.available()) {
      char c = webClient.read();

      if (c == '\n' && currentLineIsBlank) {
        sendHtmlResponse(webClient);
        break;
      }

      if (c == '\n') {
        if (currentLine.startsWith("GET /setHost?hostIp=")) {
          int startPos = currentLine.indexOf('=') + 1;
          int endPos = currentLine.indexOf(' ', startPos);
          targetServer = currentLine.substring(startPos, endPos);
          Serial.print("New target server set: ");
          Serial.println(targetServer);
          writeStringToEEPROM(0, targetServer); // Store new IP to EEPROM
        } else if (currentLine.startsWith("GET /setIP?ip=")) {
          int startPos = currentLine.indexOf('=') + 1;
          int endPos = currentLine.indexOf(' ', startPos);
          String newIPStr = currentLine.substring(startPos, endPos);
          IPAddress newIP;
          if (newIP.fromString(newIPStr)) {
            writeIPToEEPROM(50, newIP);
            Ethernet.begin(mac, newIP, dnsServer, gateway, subnet);
            Serial.print("New GPIO Box IP set: ");
            Serial.println(newIP);
          }
        }else if (currentLine.startsWith("GET /setMode?mode=")) {
          int startPos = currentLine.indexOf('=') + 1;
          int endPos = currentLine.indexOf(' ', startPos);
          connectionMode = currentLine.substring(startPos, endPos);
          Serial.print("New connection mode set: ");
          Serial.println(connectionMode);
          writeConnModeToEEPROM(100, connectionMode);
        }
        currentLine = "";
        currentLineIsBlank = true;
      } else if (c != '\r') {
        currentLineIsBlank = false;
        currentLine += c;
      }
    }
  }
}

void writeStringToEEPROM(int addrOffset, const String &strToWrite) {
  byte len = strToWrite.length();
  EEPROM.write(addrOffset, len);
  for (int i = 0; i < len; i++) {
    EEPROM.write(addrOffset + 1 + i, strToWrite[i]);
  }
}

String readStringFromEEPROM(int addrOffset) {
  int newStrLen = EEPROM.read(addrOffset);
  char data[newStrLen + 1];
  for (int i = 0; i < newStrLen; i++) {
    data[i] = EEPROM.read(addrOffset + 1 + i);
  }
  data[newStrLen] = '\0'; // Null terminator
  return String(data);
}

void writeIPToEEPROM(int addrOffset, IPAddress ip) {
  for (int i = 0; i < 4; ++i) {
    EEPROM.write(addrOffset + i, ip[i]);
  }
}

IPAddress readIPFromEEPROM(int addrOffset) {
  byte ipBytes[4];
  for (int i = 0; i < 4; ++i) {
    ipBytes[i] = EEPROM.read(addrOffset + i);
  }
  return IPAddress(ipBytes[0], ipBytes[1], ipBytes[2], ipBytes[3]);
}

void writeConnModeToEEPROM(int addrOffset, const String &strToWrite) {
    byte len = strToWrite.length();
    EEPROM.update(addrOffset, len);
    for (int i = 0; i < len; i++) {
        EEPROM.update(addrOffset + 1 + i, strToWrite[i]);
    }
}

String readConnModeFromEEPROM(int addrOffset) {
    int len = EEPROM.read(addrOffset); // Read length of string
    char data[len + 1]; // Create a buffer to hold the string
    for (int i = 0; i < len; i++) {
        data[i] = EEPROM.read(addrOffset + 1 + i); // Read characters of string
    }
    data[len] = '\0'; // Null-terminate the string
    return String(data); // Convert char array to String and return
}
