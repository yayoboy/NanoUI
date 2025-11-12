# Getting Started with NanoUI

Quick start guide to get NanoUI running on your ESP32 in minutes.

## Prerequisites

### Software
- [Node.js](https://nodejs.org/) (for building)
- [PlatformIO](https://platformio.org/) or Arduino IDE
- Code editor (VS Code recommended)

### Hardware
- ESP32 development board
- USB cable
- Computer with WiFi

## Installation

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/NanoUI.git
cd NanoUI
```

### 2. Build the Framework

```bash
# Install dependencies
npm install

# Build NanoUI
npm run build
```

This creates the minified files in the `dist/` folder:
- `nanoui.html` - Complete UI (ready to upload to ESP32)
- `nanoui.min.css` - Standalone CSS
- `nanoui.min.js` - Standalone JavaScript

## ESP32 Setup

### Method 1: PlatformIO (Recommended)

#### Step 1: Copy Example Project

```bash
cd examples/esp32-basic
```

#### Step 2: Configure WiFi

Edit `src/main.cpp`:

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
```

#### Step 3: Prepare Filesystem

```bash
# Create data folder if it doesn't exist
mkdir -p data

# Copy built UI file
cp ../../dist/nanoui.html data/
```

#### Step 4: Upload Filesystem

```bash
pio run --target uploadfs
```

Wait for upload to complete.

#### Step 5: Upload Code

```bash
pio run --target upload
```

#### Step 6: Monitor Serial Output

```bash
pio device monitor
```

Look for the IP address in the output:

```
WiFi connected!
IP Address: 192.168.1.100
```

#### Step 7: Access the UI

Open your browser and go to the IP address shown (e.g., `http://192.168.1.100`).

### Method 2: Arduino IDE

#### Step 1: Install ESP32 Board Support

1. Open Arduino IDE
2. Go to **File → Preferences**
3. Add to "Additional Board Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools → Board → Board Manager**
5. Search for "esp32" and install

#### Step 2: Install Required Libraries

Go to **Sketch → Include Library → Manage Libraries** and install:
- ESPAsyncWebServer
- AsyncTCP
- ArduinoJson

#### Step 3: Setup Filesystem Upload Tool

1. Download [ESP32 Sketch Data Upload](https://github.com/me-no-dev/arduino-esp32fs-plugin/releases)
2. Extract to `Arduino/tools/` folder
3. Restart Arduino IDE

#### Step 4: Prepare Project

1. Copy `examples/esp32-basic/src/main.cpp` content
2. Create new Arduino sketch
3. Paste the code
4. Update WiFi credentials
5. Save the sketch

#### Step 5: Create Data Folder

In your sketch folder, create a `data/` subfolder and copy `nanoui.html` into it.

#### Step 6: Upload Filesystem

1. Go to **Tools → ESP32 Sketch Data Upload**
2. Wait for upload to complete

#### Step 7: Upload Code

Click the Upload button or press **Ctrl+U**.

#### Step 8: Open Serial Monitor

**Tools → Serial Monitor** (set baud rate to 115200)

Get the IP address from the output.

#### Step 9: Access the UI

Open browser to the displayed IP address.

## First Steps

### Understanding the Dashboard

When you open the UI, you'll see:

1. **Theme Toggle** (top-right): Switch between light/dark mode
2. **System Status Card**: Shows uptime, memory, WiFi signal
3. **Sensor Readings**: Temperature and humidity (simulated)
4. **Controls**: LED toggle and brightness slider

### Testing the Interface

#### Toggle LED
Click the switch next to "LED Control" - the built-in LED on your ESP32 should turn on/off.

#### Adjust Brightness
Move the brightness slider and watch the serial monitor for output.

#### Auto-Refresh
The dashboard automatically updates every 5 seconds. Check the serial monitor to see API calls.

#### Theme Toggle
Click the moon/sun icon to switch themes. The preference is saved in browser localStorage.

## Customization

### Adding Real Sensors

Replace simulated data in `main.cpp`:

#### Example: DHT22 Temperature/Humidity Sensor

```cpp
#include <DHT.h>

#define DHT_PIN 4
DHT dht(DHT_PIN, DHT22);

void setup() {
  // ... existing code ...
  dht.begin();
}

void handleSensors(AsyncWebServerRequest *request) {
  StaticJsonDocument<200> doc;

  doc["temperature"] = dht.readTemperature();
  doc["humidity"] = dht.readHumidity();

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
}
```

#### Example: BME280 Sensor

```cpp
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setup() {
  // ... existing code ...
  if (!bme.begin(0x76)) {
    Serial.println("Could not find BME280 sensor!");
  }
}

void handleSensors(AsyncWebServerRequest *request) {
  StaticJsonDocument<200> doc;

  doc["temperature"] = bme.readTemperature();
  doc["humidity"] = bme.readHumidity();
  doc["pressure"] = bme.readPressure() / 100.0F; // hPa

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
}
```

### Modifying the UI

#### Edit Source Files

1. Open `src/template.html`
2. Make changes (add components, modify layout)
3. Rebuild: `npm run build`
4. Copy new `dist/nanoui.html` to ESP32's `data/` folder
5. Re-upload filesystem

#### Example: Add New Control

Add to `template.html`:

```html
<div class="form-group">
  <label class="d-flex justify-between align-center">
    Fan Control
    <label class="switch">
      <input type="checkbox" id="fan" data-api="/api/fan">
      <span class="slider"></span>
    </label>
  </label>
</div>
```

Add to `main.cpp`:

```cpp
void handleFan(AsyncWebServerRequest *request, uint8_t *data, size_t len) {
  StaticJsonDocument<100> doc;
  deserializeJson(doc, data, len);

  bool fanState = doc["value"];
  digitalWrite(FAN_PIN, fanState ? HIGH : LOW);

  request->send(200, "application/json", "{\"success\":true}");
}

// In setup():
server.on("/api/fan", HTTP_POST,
  [](AsyncWebServerRequest *request){},
  NULL,
  handleFan
);
```

## Performance Optimization

### Enable gzip Compression

Reduce transfer size by ~70%:

```cpp
#include <AsyncWebServer.h>

server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(
    LittleFS, "/nanoui.html", "text/html"
  );
  response->addHeader("Content-Encoding", "gzip");
  request->send(response);
});
```

First, gzip your file:
```bash
gzip -k dist/nanoui.html  # Creates nanoui.html.gz
```

### Set Cache Headers

Avoid re-downloading on every visit:

```cpp
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(
    LittleFS, "/nanoui.html", "text/html"
  );
  response->addHeader("Cache-Control", "max-age=86400"); // 24 hours
  request->send(response);
});
```

### Reduce Refresh Rate

If you don't need real-time updates:

```javascript
// Change from 5 seconds to 30 seconds
NanoUI.AutoRefresh.start('status', refreshData, 30000);
```

## Troubleshooting

### Can't Upload Filesystem

**Error: "A fatal error occurred: Timed out waiting for packet header"**

**Solution:**
1. Hold down the BOOT button on ESP32
2. Click Upload Filesystem
3. Release BOOT when upload starts

### Can't Connect to WiFi

**Error: WiFi connection fails**

**Solution:**
1. Double-check SSID and password
2. Ensure you're using 2.4GHz WiFi (not 5GHz)
3. Check router has free DHCP addresses
4. Try moving ESP32 closer to router

### UI Shows but No Data

**Problem:** Dashboard displays but shows "--" for all values

**Solution:**
1. Open browser developer console (F12)
2. Check for API errors
3. Verify API endpoints return valid JSON
4. Check serial monitor for ESP32 errors

### Out of Memory

**Error: "Guru Meditation Error: Core 1 panic'ed (LoadProhibited)"**

**Solution:**
1. Reduce refresh rate
2. Simplify API responses
3. Use `StaticJsonDocument` instead of `DynamicJsonDocument`
4. Reduce string buffer sizes

### Filesystem Upload Failed

**Error: "SPIFFS Not Formatted"**

**Solution:**
```cpp
// In setup():
if (!LittleFS.begin(true)) {  // 'true' formats if needed
  Serial.println("LittleFS Mount Failed");
}
```

## Next Steps

### Learn More
- [API Documentation](./API.md) - Complete API reference
- [Components Guide](./COMPONENTS.md) - All available UI components
- [Examples](../examples/) - More complex projects

### Add Features
- Implement WebSocket for real-time updates
- Add authentication for security
- Create charts with Chart.js (tiny version)
- Add OTA updates

### Optimize
- Reduce CSS by removing unused components
- Create custom minimal build
- Use compression (gzip)
- Implement lazy loading

## Support

Having issues?
1. Check [GitHub Issues](https://github.com/yourusername/NanoUI/issues)
2. Read the [FAQ](./FAQ.md)
3. Join our [Discord](https://discord.gg/example)

## Resources

- [ESP32 Official Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [PlatformIO Docs](https://docs.platformio.org/)
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [ArduinoJson](https://arduinojson.org/)

---

Happy building! 🚀
