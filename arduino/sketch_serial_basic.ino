const int buttonPin = 2; // the number of the pushbutton pin

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int reading = digitalRead(buttonPin);
  
  if(reading == LOW){
    Serial.println("GPI 2 FIRED!");
    
    // Wait for the button to be released
    while(digitalRead(buttonPin) == LOW) {
      // Do nothing until the button is released
    }
    delay(50);
  }
  
}
