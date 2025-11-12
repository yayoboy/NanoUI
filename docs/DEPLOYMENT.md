# Production Deployment Guide

Complete guide for deploying NanoUI on ESP32 in production environments.

## 📋 Pre-Deployment Checklist

### 1. Build Optimization

```bash
# Build production files
npm run build:all

# Verify file sizes
ls -lh dist/

# Test gzip compression
gzip -c dist/nanoui.html | wc -c
```

### 2. Code Review

- [ ] Remove all `console.log()` debugging statements
- [ ] Remove demo/test data
- [ ] Set appropriate API refresh intervals
- [ ] Configure proper error handling
- [ ] Test on target ESP32 hardware

### 3. Security

- [ ] Change default WiFi credentials
- [ ] Add authentication if needed
- [ ] Validate all API inputs
- [ ] Implement rate limiting
- [ ] Use HTTPS if handling sensitive data

---

## 🚀 ESP32 Deployment

### Method 1: SPIFFS/LittleFS (Recommended)

**Step 1: Prepare Files**

```bash
# Create data folder
mkdir -p data

# Copy built file
cp dist/nanoui.html data/
# or
cp dist/dashboard.html data/
```

**Step 2: Upload Filesystem**

Using PlatformIO:
```bash
pio run --target uploadfs
```

Using Arduino IDE:
- Tools → ESP32 Sketch Data Upload

**Step 3: Serve from ESP32**

```cpp
#include <LittleFS.h>
#include <ESPAsyncWebServer.h>

AsyncWebServer server(80);

void setup() {
  // Initialize filesystem
  if (!LittleFS.begin(true)) {
    Serial.println("LittleFS Mount Failed");
    return;
  }

  // Serve UI with caching
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncWebServerResponse *response = request->beginResponse(
      LittleFS, "/nanoui.html", "text/html"
    );

    // Enable caching (1 day)
    response->addHeader("Cache-Control", "public, max-age=86400");

    request->send(response);
  });

  server.begin();
}
```

### Method 2: gzip Compression

Reduce transfer size by ~70%!

**Step 1: Compress File**

```bash
gzip -9 -k dist/nanoui.html
# Creates nanoui.html.gz
```

**Step 2: Copy to Data Folder**

```bash
cp dist/nanoui.html.gz data/
```

**Step 3: Serve Compressed**

```cpp
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(
    LittleFS, "/nanoui.html.gz", "text/html"
  );

  response->addHeader("Content-Encoding", "gzip");
  response->addHeader("Cache-Control", "public, max-age=86400");

  request->send(response);
});
```

### Method 3: Embedded in Code

For very small UIs, embed directly:

```cpp
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<!-- Paste minified HTML here -->
</html>
)rawliteral";

server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  request->send_P(200, "text/html", index_html);
});
```

**Note**: This increases sketch size significantly.

---

## 🔧 ESP32 Configuration

### Filesystem Partitioning

Edit `platformio.ini`:

```ini
[env:esp32dev]
board_build.filesystem = littlefs

; Custom partition for more storage
board_build.partitions = custom_partitions.csv
```

**custom_partitions.csv:**
```csv
# Name,   Type, SubType, Offset,  Size
nvs,      data, nvs,     0x9000,  0x5000
otadata,  data, ota,     0xe000,  0x2000
app0,     app,  ota_0,   0x10000, 0x140000
app1,     app,  ota_1,   0x150000,0x140000
spiffs,   data, spiffs,  0x290000,0x160000
```

This gives you ~1.4MB for LittleFS.

### Memory Optimization

```cpp
// Use StaticJsonDocument instead of DynamicJsonDocument
StaticJsonDocument<512> doc; // Size known at compile time

// Free unused memory
doc.clear();
doc.garbageCollect();

// Monitor heap
Serial.printf("Free heap: %d bytes\n", ESP.getFreeHeap());
```

### WiFi Power Management

```cpp
// Reduce WiFi power for battery devices
WiFi.setSleep(true);

// Or disable for better performance
WiFi.setSleep(false);
```

---

## 🔒 Security Best Practices

### 1. Basic Authentication

```cpp
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  if(!request->authenticate("admin", "strongpassword")) {
    return request->requestAuthentication();
  }

  request->send(LittleFS, "/nanoui.html", "text/html");
});
```

### 2. API Key Validation

```cpp
server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request){
  if(!request->hasHeader("X-API-Key")) {
    request->send(401, "text/plain", "Unauthorized");
    return;
  }

  String apiKey = request->header("X-API-Key");
  if(apiKey != "your-secret-api-key") {
    request->send(403, "text/plain", "Forbidden");
    return;
  }

  // Process request...
});
```

Client-side:
```javascript
NanoUI.API.baseUrl = '';

// Add API key to all requests
const originalGet = NanoUI.API.get;
NanoUI.API.get = function(endpoint, onSuccess, onError) {
  fetch(endpoint, {
    headers: { 'X-API-Key': 'your-secret-api-key' }
  })
  .then(response => response.json())
  .then(onSuccess)
  .catch(onError);
};
```

### 3. Rate Limiting

```cpp
#include <map>

std::map<String, unsigned long> lastRequest;
const unsigned long RATE_LIMIT = 1000; // 1 request per second

bool checkRateLimit(String ip) {
  unsigned long now = millis();

  if (lastRequest.find(ip) != lastRequest.end()) {
    if (now - lastRequest[ip] < RATE_LIMIT) {
      return false; // Too many requests
    }
  }

  lastRequest[ip] = now;
  return true;
}

server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request){
  String ip = request->client()->remoteIP().toString();

  if (!checkRateLimit(ip)) {
    request->send(429, "text/plain", "Too Many Requests");
    return;
  }

  // Process request...
});
```

### 4. Input Validation

```cpp
void handleUpdate(AsyncWebServerRequest *request, uint8_t *data, size_t len) {
  StaticJsonDocument<200> doc;

  DeserializationError error = deserializeJson(doc, data, len);

  if (error) {
    request->send(400, "text/plain", "Invalid JSON");
    return;
  }

  // Validate fields
  if (!doc.containsKey("value")) {
    request->send(400, "text/plain", "Missing 'value' field");
    return;
  }

  int value = doc["value"];

  // Validate range
  if (value < 0 || value > 100) {
    request->send(400, "text/plain", "Value out of range");
    return;
  }

  // Process...
  request->send(200, "application/json", "{\"success\":true}");
}
```

---

## 📊 Performance Optimization

### 1. Enable CORS (if needed)

```cpp
server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(
    200, "application/json", jsonString
  );

  response->addHeader("Access-Control-Allow-Origin", "*");
  request->send(response);
});
```

### 2. Reduce JSON Size

```cpp
// Bad: Verbose keys
{"temperature": 24.5, "humidity": 45.2, "pressure": 1013.25}

// Good: Short keys
{"t": 24.5, "h": 45.2, "p": 1013.25}

// Update client-side parsing accordingly
```

### 3. Limit Data Points

```cpp
// Bad: Send all 1000 history points
for (int i = 0; i < 1000; i++) {
  data.add(history[i]);
}

// Good: Send last 20 points
for (int i = max(0, historyIndex - 20); i < historyIndex; i++) {
  data.add(history[i]);
}
```

### 4. Use WebSocket for Real-time

More efficient than polling:

```cpp
AsyncWebSocket ws("/ws");

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
               AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    Serial.println("WebSocket client connected");
  }
}

void setup() {
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
}

void loop() {
  // Broadcast to all clients
  if (dataChanged) {
    String json = getJsonData();
    ws.textAll(json);
  }
}
```

Client:
```javascript
NanoUI.WS.connect('ws://' + location.host + '/ws', (data) => {
  updateDashboard(data);
});
```

---

## 🔍 Monitoring & Debugging

### Production Logging

```cpp
#define DEBUG_MODE false

void logDebug(const char* message) {
  #if DEBUG_MODE
    Serial.println(message);
  #endif
}

void logError(const char* message) {
  // Always log errors
  Serial.print("[ERROR] ");
  Serial.println(message);

  // Could also send to remote logging service
}
```

### Health Check Endpoint

```cpp
server.on("/health", HTTP_GET, [](AsyncWebServerRequest *request){
  StaticJsonDocument<200> doc;

  doc["status"] = "ok";
  doc["uptime"] = millis() / 1000;
  doc["freeHeap"] = ESP.getFreeHeap();
  doc["wifiRSSI"] = WiFi.RSSI();

  String response;
  serializeJson(doc, response);

  request->send(200, "application/json", response);
});
```

### Watchdog Timer

```cpp
#include <esp_task_wdt.h>

void setup() {
  // Enable watchdog (10 seconds)
  esp_task_wdt_init(10, true);
  esp_task_wdt_add(NULL);
}

void loop() {
  // Reset watchdog
  esp_task_wdt_reset();

  // Your code...
}
```

---

## 🔄 OTA Updates

Enable over-the-air updates:

```cpp
#include <ArduinoOTA.h>

void setup() {
  ArduinoOTA.setHostname("esp32-device");
  ArduinoOTA.setPassword("admin");

  ArduinoOTA.onStart([]() {
    String type = ArduinoOTA.getCommand() == U_FLASH ? "sketch" : "filesystem";
    Serial.println("Start updating " + type);
  });

  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });

  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });

  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
  });

  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();
}
```

---

## 📱 Progressive Web App (PWA)

Make NanoUI installable on mobile:

**manifest.json:**
```json
{
  "name": "ESP32 Dashboard",
  "short_name": "ESP32",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Add to HTML:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#007bff">
<meta name="apple-mobile-web-app-capable" content="yes">
```

Serve from ESP32:
```cpp
server.on("/manifest.json", HTTP_GET, [](AsyncWebServerRequest *request){
  request->send(LittleFS, "/manifest.json", "application/json");
});
```

---

## ✅ Testing Checklist

Before deployment:

- [ ] Test on actual ESP32 hardware
- [ ] Test with poor WiFi signal
- [ ] Test with multiple simultaneous connections
- [ ] Test all API endpoints
- [ ] Test error handling (disconnect WiFi, wrong inputs)
- [ ] Monitor memory usage over 24 hours
- [ ] Test OTA updates
- [ ] Test on mobile devices
- [ ] Verify gzip compression works
- [ ] Check security (authentication, validation)

---

## 🐛 Troubleshooting Production Issues

### ESP32 Crashes/Reboots

```cpp
// Add more detailed error info
void setup() {
  Serial.begin(115200);

  // Print reset reason
  esp_reset_reason_t reason = esp_reset_reason();
  Serial.print("Reset reason: ");
  Serial.println(reason);

  // Enable core dump
  esp_core_dump_init();
}
```

### High Memory Usage

```cpp
// Monitor heap fragmentation
void printHeapStats() {
  multi_heap_info_t info;
  heap_caps_get_info(&info, MALLOC_CAP_INTERNAL);

  Serial.printf("Free heap: %d\n", info.total_free_bytes);
  Serial.printf("Largest block: %d\n", info.largest_free_block);
  Serial.printf("Minimum free: %d\n", info.minimum_free_bytes);
}
```

### Slow Response Times

- Check WiFi signal strength
- Reduce JSON response sizes
- Enable caching headers
- Use WebSocket instead of polling
- Limit concurrent connections

---

## 📚 Production Best Practices Summary

1. **Always use gzip compression** - 70% size reduction
2. **Enable caching** - Reduces load on ESP32
3. **Implement authentication** - Even on local network
4. **Validate all inputs** - Prevent crashes
5. **Monitor memory** - Set alerts for low heap
6. **Use watchdog timer** - Auto-recover from crashes
7. **Log errors** - Help debugging production issues
8. **Test thoroughly** - On real hardware under real conditions
9. **Plan for updates** - Implement OTA from day one
10. **Document API** - For future maintenance

---

## 🔗 Additional Resources

- [ESP32 Best Practices](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [ArduinoJson Memory Guide](https://arduinojson.org/v6/how-to/reduce-memory-usage/)
- [ESPAsyncWebServer Docs](https://github.com/me-no-dev/ESPAsyncWebServer)

---

**Ready for production deployment!** 🚀
