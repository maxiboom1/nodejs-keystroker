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

  // Load IP from EEPROM
  IPAddress eepromIP = readEEPROMIP();
  if (eepromIP[0] != 255) { // Check if EEPROM IP is valid
    ip = eepromIP;
  }

  Ethernet.begin(mac, ip, dnsServer, gateway, subnet);
  server.begin();

  // Rest of your setup code...
}

void loop() {
  // Your existing loop code...

  EthernetClient client = server.available();
  if (client) {
    // Existing code to handle client...
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (currentLine.length() == 0) {
            // send a standard http response header
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            // Web page content
            client.println("<!DOCTYPE html><html>");
            client.println("<body><h1>Arduino IP Configuration</h1>");
            client.println("<form action=\"/submitNewIP\" method=\"GET\">");
            client.println("IP Address: <input type=\"text\" name=\"ip\"><br>");
            client.println("<input type=\"submit\" value=\"Submit\">");
            client.println("</form></body></html>");

            // The HTTP response ends with another blank line
            client.println();
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }

        if (currentLine.endsWith("GET /submitNewIP")) {
          int idx = currentLine.indexOf("ip=");
          if (idx != -1) {
            String newIPStr = currentLine.substring(idx + 3);
            newIPStr = newIPStr.substring(0, newIPStr.indexOf(' ')); // Get IP string
            IPAddress newIP;
            if (newIP.fromString(newIPStr)) {
              writeEEPROMIP(newIP);
              Ethernet.begin(mac, newIP, dnsServer, gateway, subnet);
              Serial.println("IP Updated: " + newIPStr);
            }
          }
        }
      }
    }
    client.stop();
  }
}

IPAddress readEEPROMIP() {
  byte ip[4];
  for (int i = 0; i < 4; ++i) {
    ip[i] = EEPROM.read(i);
  }
  return IPAddress(ip[0], ip[1], ip[2], ip[3]);
}

void writeEEPROMIP(IPAddress ip) {
  for (int i = 0; i < 4; ++i) {
    EEPROM.write(i, ip[i]);
  }
}
