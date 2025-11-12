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
unsigned long requestCount = 0;

// Simulated data storage (replace with real sensors/data)
float tempHistory[20];
int tempHistoryIndex = 0;

struct SensorReading {
  String timestamp;
  float temp;
  float humidity;
};

SensorReading sensorLog[10];
int sensorLogIndex = 0;

// Helper: Get current time string
String getTimeString() {
  unsigned long secs = millis() / 1000;
  int hours = (secs / 3600) % 24;
  int mins = (secs / 60) % 60;
  int sec = secs % 60;

  char buffer[10];
  sprintf(buffer, "%02d:%02d:%02d", hours, mins, sec);
  return String(buffer);
}

// Helper: Simulate CPU usage
int getCPUUsage() {
  return 30 + (millis() % 40);
}

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

// Initialize simulated data
void initData() {
  // Initialize temperature history
  for (int i = 0; i < 20; i++) {
    tempHistory[i] = 20.0 + random(-30, 80) / 10.0;
  }

  // Initialize sensor log
  for (int i = 0; i < 10; i++) {
    sensorLog[i].timestamp = getTimeString();
    sensorLog[i].temp = 23.0 + random(-20, 30) / 10.0;
    sensorLog[i].humidity = 43.0 + random(-50, 50) / 10.0;
  }
}

// API: System statistics
void handleStats(AsyncWebServerRequest *request) {
  requestCount++;

  StaticJsonDocument<512> doc;

  doc["requests"] = requestCount;
  doc["avgTemp"] = 24.5 + random(-20, 20) / 10.0;
  doc["memoryUsage"] = (ESP.getHeapSize() - ESP.getFreeHeap()) * 100 / ESP.getHeapSize();
  doc["wifiQuality"] = constrain(map(WiFi.RSSI(), -90, -30, 0, 100), 0, 100);
  doc["cpu"] = getCPUUsage();
  doc["uptime"] = (millis() - startTime) / 1000;

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

// API: Temperature chart data
void handleTempChart(AsyncWebServerRequest *request) {
  StaticJsonDocument<1024> doc;
  JsonArray data = doc.createNestedArray("data");

  // Update one data point (simulate real-time)
  tempHistory[tempHistoryIndex] = 20.0 + random(-30, 80) / 10.0;
  tempHistoryIndex = (tempHistoryIndex + 1) % 20;

  for (int i = 0; i < 20; i++) {
    data.add(tempHistory[i]);
  }

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

// API: CPU chart data
void handleCPUChart(AsyncWebServerRequest *request) {
  StaticJsonDocument<1024> doc;
  JsonArray data = doc.createNestedArray("data");

  for (int i = 0; i < 10; i++) {
    JsonObject point = data.createNestedObject();
    point["label"] = String(i);
    point["value"] = 20 + random(0, 80);
  }

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

// API: Sensor log
void handleSensorLog(AsyncWebServerRequest *request) {
  // Add new reading
  sensorLog[sensorLogIndex].timestamp = getTimeString();
  sensorLog[sensorLogIndex].temp = 23.0 + random(-20, 30) / 10.0;
  sensorLog[sensorLogIndex].humidity = 43.0 + random(-50, 50) / 10.0;
  sensorLogIndex = (sensorLogIndex + 1) % 10;

  StaticJsonDocument<2048> doc;
  JsonArray data = doc.createNestedArray("data");

  for (int i = 0; i < 10; i++) {
    JsonObject reading = data.createNestedObject();
    reading["timestamp"] = sensorLog[i].timestamp;
    reading["sensor"] = (i % 2 == 0) ? "DHT22" : "BMP280";
    reading["temp"] = sensorLog[i].temp;
    reading["humidity"] = sensorLog[i].humidity;
    reading["status"] = (sensorLog[i].temp > 25) ? "Warning" : "OK";
  }

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

// API: Sparkline data
void handleSparklineData(AsyncWebServerRequest *request) {
  String type = request->pathArg(0);

  StaticJsonDocument<512> doc;
  JsonArray data = doc.createNestedArray("data");

  if (type == "cpu") {
    for (int i = 0; i < 7; i++) {
      data.add(30 + random(0, 40));
    }
  } else if (type == "mem") {
    for (int i = 0; i < 7; i++) {
      data.add(180 + random(0, 50));
    }
  } else if (type == "power") {
    for (int i = 0; i < 7; i++) {
      data.add(3.0 + random(0, 5) / 10.0);
    }
  }

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n");
  Serial.println("╔════════════════════════════════════╗");
  Serial.println("║  NanoUI ESP32 Dashboard Server    ║");
  Serial.println("╚════════════════════════════════════╝");
  Serial.println();

  // Initialize filesystem
  initFS();

  // Connect to WiFi
  initWiFi();

  // Initialize data
  initData();

  // Record start time
  startTime = millis();

  // ========================================
  // Configure Web Server Routes
  // ========================================

  // Serve the dashboard
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    requestCount++;
    request->send(LittleFS, "/dashboard.html", "text/html");
  });

  // API Routes
  server.on("/api/stats", HTTP_GET, handleStats);
  server.on("/api/chart/temperature", HTTP_GET, handleTempChart);
  server.on("/api/chart/cpu", HTTP_GET, handleCPUChart);
  server.on("/api/sensors/log", HTTP_GET, handleSensorLog);
  server.on("/api/sparkline/*", HTTP_GET, handleSparklineData);

  // Handle 404
  server.onNotFound([](AsyncWebServerRequest *request){
    request->send(404, "text/plain", "Not found");
  });

  // Start server
  server.begin();
  Serial.println("✅ HTTP server started");
  Serial.println();
  Serial.println("📊 Open your browser and go to:");
  Serial.print("   http://");
  Serial.println(WiFi.localIP());
  Serial.println();
  Serial.println("📡 API Endpoints:");
  Serial.println("   GET  /api/stats              - System statistics");
  Serial.println("   GET  /api/chart/temperature  - Temperature chart data");
  Serial.println("   GET  /api/chart/cpu          - CPU chart data");
  Serial.println("   GET  /api/sensors/log        - Sensor readings log");
  Serial.println("   GET  /api/sparkline/*        - Sparkline data");
  Serial.println();
}

void loop() {
  // Your main loop code here
  // The web server runs asynchronously in the background

  // Optional: Update data periodically
  static unsigned long lastUpdate = 0;
  if (millis() - lastUpdate > 10000) {
    // Update data every 10 seconds
    initData();
    lastUpdate = millis();

    Serial.print("📊 Total requests: ");
    Serial.print(requestCount);
    Serial.print(" | Free heap: ");
    Serial.print(ESP.getFreeHeap());
    Serial.print(" | WiFi RSSI: ");
    Serial.println(WiFi.RSSI());
  }

  delay(10);
}
