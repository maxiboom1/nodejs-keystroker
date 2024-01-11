#include <SPI.h>
#include <Ethernet2.h>
#include <EEPROM.h>

const int btnPin = 3;
String targetServer = "192.168.1.100";  // Store server address as a String
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 230);
IPAddress subnet(255, 255, 255, 0);
IPAddress gateway(192, 168, 1, 1);
IPAddress dnsServer(8, 8, 8, 8); 

EthernetClient client;
EthernetServer server(80);


void setup() {
  Serial.begin(9600);
  while (!Serial) {;}
  Ethernet.begin(mac, ip, dnsServer, gateway, subnet);
  server.begin();
  Serial.print("My static IP address: ");
  Serial.println(Ethernet.localIP());
  pinMode(btnPin, INPUT_PULLUP);
  targetServer = readStringFromEEPROM(0); // Read IP from EEPROM
  if (targetServer == "") {
    targetServer = "192.168.1.230"; // Default IP if nothing is stored
  }
    Serial.print("Target server IP address: ");
    Serial.println(targetServer);

}

void loop() {
  if (btnClick()) {
    sendHttpGetRequest(targetServer.c_str(), 4000, "/api/refresh");  // Convert String to C-string
  }

  EthernetClient webClient = server.available();
  if (webClient) {
    handleClient(webClient);
    webClient.stop();
  }
}

bool btnClick() {
  int reading = digitalRead(btnPin);
  if (reading == LOW) {
    while (digitalRead(btnPin) == LOW) {} // wait for button release
    delay(20); // debounce delay
    return true;
  }
  return false;
}

void sendHttpGetRequest(const char* server, uint16_t port, const char* path) {
  if (client.connect(server, port)) {
    Serial.println("Connected to server");
    client.println("GET " + String(path) + " HTTP/1.1");
    client.println("Host: " + String(server));
    client.println("Connection: close");
    client.println();
    while (client.connected() || client.available()) {
      if (client.available()) {
        char c = client.read();
        //Serial.write(c); // Here we got the response
      }
    }
    client.stop();
    Serial.println("\nDisconnected from server");
  } else {
    Serial.println("Connection failed");
  }
}

void sendHtmlResponse(EthernetClient webClient) {
  webClient.println("HTTP/1.1 200 OK");
  webClient.println("Content-Type: text/html");
  webClient.println("Connection: close"); 
  webClient.println();
  webClient.println("<!DOCTYPE HTML>");
  webClient.println("<html>");
  webClient.println("<head><title>Config Page</title></head>");
  webClient.println("<body>");
  webClient.println("<h1>Config Page</h1>");
  webClient.println("<form action=\"/setHost\">");
  webClient.println("Set Host IP Addr: <input type=\"text\" name=\"hostIp\">");
  webClient.println("<input type=\"submit\" value=\"Set\">");
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
      //Serial.write(c);

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
