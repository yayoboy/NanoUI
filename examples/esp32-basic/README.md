# ESP32 Basic Example - NanoUI

This example demonstrates how to use NanoUI framework with ESP32 to create a modern web interface.

## Hardware Requirements

- ESP32 development board
- USB cable for programming
- (Optional) LED and resistor for testing

## Software Requirements

- [PlatformIO](https://platformio.org/) (recommended)
- Or [Arduino IDE](https://www.arduino.cc/en/software) with ESP32 support

## Quick Start

### 1. Configure WiFi

Edit `src/main.cpp` and update your WiFi credentials:

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### 2. Upload NanoUI File

First, build the NanoUI framework:

```bash
cd ../../
npm install
npm run build
```

Then copy the built file to the data folder:

```bash
mkdir -p examples/esp32-basic/data
cp dist/nanoui.html examples/esp32-basic/data/
```

### 3. Upload Filesystem

Using PlatformIO:

```bash
cd examples/esp32-basic
pio run --target uploadfs
```

### 4. Upload Code

Using PlatformIO:

```bash
pio run --target upload
```

### 5. Open Serial Monitor

```bash
pio device monitor
```

You should see the ESP32's IP address printed in the serial monitor.

### 6. Access the UI

Open your web browser and navigate to the IP address shown in the serial monitor (e.g., `http://192.168.1.100`).

## Features Demonstrated

### System Monitoring
- **Uptime**: Shows how long the ESP32 has been running
- **Free Memory**: Displays available heap memory
- **WiFi RSSI**: Shows WiFi signal strength

### Sensor Readings
- **Temperature**: Simulated temperature sensor (replace with real sensor)
- **Humidity**: Simulated humidity sensor (replace with real sensor)

### Controls
- **LED Toggle**: Turn built-in LED on/off
- **Brightness Slider**: Adjust brightness (ready for PWM LED)
- **Auto-refresh**: Data updates every 5 seconds automatically

## API Endpoints

All endpoints return JSON responses.

### GET /api/status

Returns system status information.

**Response:**
```json
{
  "uptime": 1234,
  "freeMemory": 123456,
  "rssi": -67
}
```

### GET /api/sensors

Returns sensor readings.

**Response:**
```json
{
  "temperature": 23.5,
  "humidity": 45.2
}
```

### POST /api/led

Control the LED state.

**Request:**
```json
{
  "value": true
}
```

**Response:**
```json
{
  "success": true
}
```

### POST /api/brightness

Set brightness level (0-100).

**Request:**
```json
{
  "value": 75
}
```

**Response:**
```json
{
  "success": true
}
```

## Customization

### Adding Real Sensors

Replace the simulated sensor values in `main.cpp`:

```cpp
// Example with DHT22 sensor
#include <DHT.h>
DHT dht(DHT_PIN, DHT22);

void handleSensors(AsyncWebServerRequest *request) {
  StaticJsonDocument<200> doc;

  doc["temperature"] = dht.readTemperature();
  doc["humidity"] = dht.readHumidity();

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
}
```

### Adding More Controls

1. Add HTML in NanoUI template (`src/template.html`)
2. Add corresponding API endpoint in `main.cpp`
3. Rebuild and upload

### Enabling gzip Compression

For smaller transfers, enable gzip in your web server:

```cpp
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(LittleFS, "/nanoui.html", "text/html");
  response->addHeader("Content-Encoding", "gzip");
  request->send(response);
});
```

Then compress your HTML file before uploading to LittleFS.

## Troubleshooting

### ESP32 won't connect to WiFi
- Double-check SSID and password
- Make sure you're using 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Check if your router has MAC filtering enabled

### Can't access web interface
- Make sure you're on the same WiFi network as the ESP32
- Check the IP address in the serial monitor
- Try disabling your device's firewall temporarily

### "LittleFS mount failed"
- Make sure you uploaded the filesystem (`pio run --target uploadfs`)
- Try formatting: `LittleFS.begin(true)` (already enabled in code)

### Out of memory errors
- NanoUI is designed to be lightweight (~8KB gzipped)
- Close unused resources in your code
- Consider using PSRAM if your board supports it

## Memory Usage

Typical memory usage with this example:

- **Flash**: ~300KB (sketch) + ~10KB (LittleFS data)
- **RAM**: ~50KB (at runtime)
- **Heap**: ~250KB free (available for your application)

## Next Steps

- Add real sensors (DHT22, BME280, etc.)
- Implement WebSocket for real-time updates
- Add authentication for security
- Create custom UI components
- Add OTA (Over-The-Air) updates

## Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [ArduinoJson](https://arduinojson.org/)
- [PlatformIO Docs](https://docs.platformio.org/)
