#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include <ArduinoJson.h>

// WiFi credentials - CHANGE THESE!
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// System stats
unsigned long startTime = 0;

// Simulated sensor values (replace with real sensors)
float temperature = 23.5;
float humidity = 45.2;
bool ledState = false;
int brightness = 50;

// Initialize WiFi
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("RSSI: ");
  Serial.println(WiFi.RSSI());
}

// Initialize LittleFS
void initFS() {
  if (!LittleFS.begin(true)) {
    Serial.println("An error occurred while mounting LittleFS");
    return;
  }
  Serial.println("LittleFS mounted successfully");
}

// API endpoint: System status
void handleStatus(AsyncWebServerRequest *request) {
  StaticJsonDocument<200> doc;

  doc["uptime"] = (millis() - startTime) / 1000;
  doc["freeMemory"] = ESP.getFreeHeap();
  doc["rssi"] = WiFi.RSSI();

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

// API endpoint: Sensor readings
void handleSensors(AsyncWebServerRequest *request) {
  StaticJsonDocument<200> doc;

  // Simulate sensor changes
  temperature += random(-10, 10) / 10.0;
  humidity += random(-10, 10) / 10.0;

  doc["temperature"] = temperature;
  doc["humidity"] = humidity;

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

// API endpoint: LED control
void handleLED(AsyncWebServerRequest *request, uint8_t *data, size_t len) {
  StaticJsonDocument<100> doc;
  deserializeJson(doc, data, len);

  ledState = doc["value"];
  digitalWrite(LED_BUILTIN, ledState ? HIGH : LOW);

  Serial.print("LED turned ");
  Serial.println(ledState ? "ON" : "OFF");

  request->send(200, "application/json", "{\"success\":true}");
}

// API endpoint: Brightness control
void handleBrightness(AsyncWebServerRequest *request, uint8_t *data, size_t len) {
  StaticJsonDocument<100> doc;
  deserializeJson(doc, data, len);

  brightness = doc["value"];

  // If you have a PWM LED, use: analogWrite(LED_PIN, map(brightness, 0, 100, 0, 255));

  Serial.print("Brightness set to: ");
  Serial.println(brightness);

  request->send(200, "application/json", "{\"success\":true}");
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n");
  Serial.println("╔════════════════════════════════╗");
  Serial.println("║   NanoUI ESP32 Demo Server    ║");
  Serial.println("╚════════════════════════════════╝");
  Serial.println();

  // Initialize LED
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Initialize filesystem
  initFS();

  // Connect to WiFi
  initWiFi();

  // Record start time
  startTime = millis();

  // ========================================
  // Configure Web Server Routes
  // ========================================

  // Serve the main UI (NanoUI)
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/nanoui.html", "text/html");
  });

  // API Routes
  server.on("/api/status", HTTP_GET, handleStatus);
  server.on("/api/sensors", HTTP_GET, handleSensors);

  // POST routes with JSON body
  server.on("/api/led", HTTP_POST,
    [](AsyncWebServerRequest *request){},
    NULL,
    handleLED
  );

  server.on("/api/brightness", HTTP_POST,
    [](AsyncWebServerRequest *request){},
    NULL,
    handleBrightness
  );

  // Handle 404
  server.onNotFound([](AsyncWebServerRequest *request){
    request->send(404, "text/plain", "Not found");
  });

  // Start server
  server.begin();
  Serial.println("✅ HTTP server started");
  Serial.println();
  Serial.println("📱 Open your browser and go to:");
  Serial.print("   http://");
  Serial.println(WiFi.localIP());
  Serial.println();
  Serial.println("🔧 API Endpoints:");
  Serial.println("   GET  /api/status   - System status");
  Serial.println("   GET  /api/sensors  - Sensor readings");
  Serial.println("   POST /api/led      - LED control");
  Serial.println("   POST /api/brightness - Brightness");
  Serial.println();
}

void loop() {
  // Your main loop code here
  // The web server runs asynchronously in the background

  delay(10);
}
