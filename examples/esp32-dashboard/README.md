# ESP32 Advanced Dashboard Example

This example demonstrates the full power of NanoUI with charts, tables, gauges, and real-time data visualization.

## Features

### Data Visualization
- **Line Charts**: Temperature trends over time
- **Bar Charts**: CPU usage histogram
- **Sparklines**: Inline mini charts for quick metrics
- **Circular Gauges**: Visual representation of percentage values
- **Progress Bars**: Storage and network speed indicators

### Data Presentation
- **Dynamic Tables**: Sortable sensor data log
- **Stat Cards**: Key metrics with change indicators
- **Data Lists**: Formatted key-value pairs
- **Timeline**: Activity log with timestamps

### Real-time Updates
- Auto-refresh data every 5 seconds
- Smooth animations for value changes
- AJAX calls to ESP32 API endpoints
- Loading states and error handling

## Quick Start

### 1. Setup

```bash
cd examples/esp32-dashboard
```

### 2. Configure WiFi

Edit `src/main.cpp`:

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### 3. Copy Dashboard File

```bash
mkdir -p data
cp ../../dist/dashboard.html data/
```

### 4. Upload Filesystem

```bash
pio run --target uploadfs
```

### 5. Upload Code

```bash
pio run --target upload
```

### 6. Access Dashboard

Open browser to the IP address shown in serial monitor.

## API Endpoints

### GET /api/stats

Returns system statistics.

**Response:**
```json
{
  "requests": 1234,
  "avgTemp": 24.5,
  "memoryUsage": 65,
  "wifiQuality": 85,
  "cpu": 45,
  "uptime": 86400
}
```

### GET /api/chart/temperature

Returns temperature data for charts.

**Response:**
```json
{
  "data": [20.1, 20.5, 21.2, 20.8, 21.5, ...]
}
```

### GET /api/chart/cpu

Returns CPU usage data for charts.

**Response:**
```json
{
  "data": [
    {"label": "0", "value": 45},
    {"label": "1", "value": 52},
    ...
  ]
}
```

### GET /api/sensors/log

Returns sensor readings log.

**Response:**
```json
{
  "data": [
    {
      "timestamp": "10:35:22",
      "sensor": "DHT22",
      "temp": 24.5,
      "humidity": 45.2,
      "status": "OK"
    },
    ...
  ]
}
```

## Customization

### Adding Real Sensors

Replace demo data with actual sensor readings:

```cpp
#include <DHT.h>

DHT dht(DHT_PIN, DHT22);

void handleStats(AsyncWebServerRequest *request) {
  StaticJsonDocument<500> doc;

  // Real sensor data
  doc["avgTemp"] = dht.readTemperature();
  doc["memoryUsage"] = (ESP.getHeapSize() - ESP.getFreeHeap()) * 100 / ESP.getHeapSize();
  doc["cpu"] = getCPUUsage(); // Implement your CPU monitor
  doc["uptime"] = millis() / 1000;

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
}
```

### Storing Historical Data

Keep data history for charts:

```cpp
#include <CircularBuffer.h>

CircularBuffer<float, 20> tempHistory;

void loop() {
  // Every minute, store temperature
  static unsigned long lastStore = 0;
  if (millis() - lastStore > 60000) {
    tempHistory.push(dht.readTemperature());
    lastStore = millis();
  }
}

void handleChartData(AsyncWebServerRequest *request) {
  StaticJsonDocument<1000> doc;
  JsonArray data = doc.createNestedArray("data");

  for (int i = 0; i < tempHistory.size(); i++) {
    data.add(tempHistory[i]);
  }

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
}
```

### Custom Charts

Modify the dashboard HTML/JS to add custom charts:

```javascript
// In dashboard.html
NanoUI.Chart.line('#my-chart', myData, {
  color: '#28a745',
  fill: true,
  height: 200
});
```

## Memory Usage

Advanced dashboard memory footprint:

- **Flash**: ~300KB (sketch) + ~36KB (dashboard)
- **RAM**: ~80KB (at runtime with data)
- **Heap**: ~200KB free (depends on data size)

## Performance Tips

### 1. Limit Data Points

Don't send too many data points:

```cpp
// Good: 20 points
for (int i = 0; i < 20; i++) {
  data.add(tempHistory[i]);
}

// Bad: 1000 points (too much)
```

### 2. Use Appropriate Intervals

Adjust refresh rate based on data change frequency:

```javascript
// Fast changing data: 2 seconds
NanoUI.AutoRefresh.start('fastData', updateFast, 2000);

// Slow changing data: 30 seconds
NanoUI.AutoRefresh.start('slowData', updateSlow, 30000);
```

### 3. Compress Responses

Enable gzip on ESP32:

```cpp
server.on("/api/stats", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncResponseStream *response = request->beginResponseStream("application/json");
  response->addHeader("Content-Encoding", "gzip");
  // ... send gzipped data
  request->send(response);
});
```

### 4. Cache Static Data

Cache data that doesn't change often:

```javascript
// Cache system info (doesn't change)
let systemInfo = null;

function loadSystemInfo() {
  if (!systemInfo) {
    NanoUI.API.get('/api/system', (data) => {
      systemInfo = data;
      updateSystemInfo(data);
    });
  }
}
```

## Troubleshooting

### Dashboard loads but charts don't appear

**Solution:** Check browser console for errors. Ensure API endpoints return valid JSON arrays/objects.

### Memory allocation failed

**Solution:** Reduce data point count, use `StaticJsonDocument` with appropriate size, simplify API responses.

### Charts show but data doesn't update

**Solution:** Verify auto-refresh is working, check API endpoint URLs, ensure CORS is not blocking requests.

### Table sorting doesn't work

**Solution:** Ensure NanoUI.Table.enableSort() is called after table creation.

## Advanced Features

### WebSocket Real-time Updates

For true real-time data (recommended for high-frequency updates):

```cpp
// ESP32 WebSocket server
AsyncWebSocket ws("/ws");

void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                      AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    Serial.println("WebSocket client connected");
  }
}

void setup() {
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);
}

void loop() {
  // Broadcast data to all clients
  String json = "{\"temp\": " + String(temp) + "}";
  ws.textAll(json);
  delay(1000);
}
```

```javascript
// Client-side
NanoUI.WS.connect('ws://' + location.host + '/ws',
  (data) => {
    NanoUI.Chart.line('#temp-chart', data.history, { color: '#dc3545' });
    NanoUI.Gauge.update('#temp-gauge', data.temp);
  }
);
```

### Data Export

Allow users to export table data:

```javascript
function exportTableCSV() {
  const table = document.querySelector('#sensor-table table');
  let csv = '';

  // Headers
  table.querySelectorAll('th').forEach((th, i) => {
    csv += (i > 0 ? ',' : '') + th.textContent;
  });
  csv += '\n';

  // Rows
  table.querySelectorAll('tbody tr').forEach(tr => {
    tr.querySelectorAll('td').forEach((td, i) => {
      csv += (i > 0 ? ',' : '') + td.textContent;
    });
    csv += '\n';
  });

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sensor-data.csv';
  a.click();
}
```

## Next Steps

- Add authentication
- Implement data persistence (SD card, EEPROM)
- Create alerts/notifications
- Add email/Telegram notifications
- Implement OTA updates
- Add multi-language support

## Resources

- [ESP32 WebSocket Guide](https://randomnerdtutorials.com/esp32-websocket-server-arduino/)
- [ArduinoJson Best Practices](https://arduinojson.org/v6/how-to/reduce-memory-usage/)
- [NanoUI Chart API](../../docs/API.md#chart-utilities)

---

Happy monitoring! 📊
