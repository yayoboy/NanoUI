# NanoUI Quick Reference

Fast reference for NanoUI components and APIs. Perfect for development!

## 🎨 CSS Components

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success btn-sm">Small Success</button>
<button class="btn btn-ghost btn-lg">Large Ghost</button>
<button class="btn btn-danger btn-block">Block Button</button>
```

### Cards
```html
<div class="card">
  <div class="card-header">Title <span class="badge badge-success">New</span></div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>
```

### Forms
```html
<div class="form-group">
  <label>Name</label>
  <input type="text" placeholder="Enter name">
</div>

<!-- Switch -->
<label class="switch">
  <input type="checkbox" data-api="/api/toggle">
  <span class="slider"></span>
</label>

<!-- Range Slider -->
<label>Volume: <span class="range-value">50</span>%</label>
<input type="range" min="0" max="100" value="50">
```

### Tables
```html
<table class="table table-striped">
  <thead>
    <tr><th>Name</th><th>Value</th></tr>
  </thead>
  <tbody>
    <tr><td>Temp</td><td>24.5°C</td></tr>
  </tbody>
</table>
```

### Progress Bars
```html
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 75%">75%</div>
</div>

<!-- Small & Striped -->
<div class="progress progress-sm">
  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 45%"></div>
</div>
```

### Stat Cards
```html
<div class="stat-card">
  <div class="stat-card-icon">📊</div>
  <div class="stat-card-value">1,234</div>
  <div class="stat-card-label">Total Users</div>
  <div class="stat-card-change positive">↑ 12%</div>
</div>
```

### Timeline
```html
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-time">2 min ago</div>
    <div class="timeline-content">Event description</div>
  </div>
</div>
```

### Grid System
```html
<div class="row">
  <div class="col-6">Half width</div>
  <div class="col-3">Quarter</div>
  <div class="col-3">Quarter</div>
</div>
```

### Utilities
```html
<!-- Text -->
<p class="text-center text-secondary">Centered secondary text</p>

<!-- Spacing -->
<div class="mt-2 mb-3 p-2">Margins & padding</div>

<!-- Display -->
<div class="d-flex justify-between align-center gap-2">
  <span>Left</span>
  <span>Right</span>
</div>
```

---

## 📊 JavaScript API

### Charts

```javascript
// Line Chart
NanoUI.Chart.line('#chart', [20, 22, 21, 25], {
  color: '#007bff',
  fill: true,
  height: 200
});

// Bar Chart
NanoUI.Chart.bar('#chart', [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 59 }
], { color: '#28a745', showLabels: true });

// Sparkline
NanoUI.Chart.sparkline('#spark', [45, 52, 48, 55], '#007bff');
```

### Tables

```javascript
const data = [
  { name: 'Sensor 1', temp: 24.5, status: 'OK' }
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'temp', label: 'Temp', format: v => v.toFixed(1) + '°C' },
  { key: 'status', label: 'Status', format: v => `<span class="badge">${v}</span>` }
];

NanoUI.Table.create('#table', data, columns);
NanoUI.Table.enableSort('#table table');
```

### Gauges

```javascript
// Create
NanoUI.Gauge.create('#gauge', 75, {
  color: '#007bff',
  size: 120
});

// Update
NanoUI.Gauge.update('#gauge', 85);
```

### Progress Bars

```javascript
// Set value
NanoUI.Progress.set('#bar', 67);

// Animate
NanoUI.Progress.animate('#bar', 85, 1500);
```

### API Calls

```javascript
// GET
NanoUI.API.get('/api/data', (data) => {
  console.log('Success:', data);
}, (error) => {
  console.error('Error:', error);
});

// POST
NanoUI.API.post('/api/update', { value: 42 }, (response) => {
  console.log('Updated:', response);
});

// Plain text
NanoUI.API.getText('/api/version', (version) => {
  console.log('Version:', version);
});
```

### Auto-Refresh

```javascript
// Start auto-refresh
NanoUI.AutoRefresh.start('dataUpdate', updateData, 5000);

// Stop
NanoUI.AutoRefresh.stop('dataUpdate');

// Stop all
NanoUI.AutoRefresh.stopAll();
```

### UI Helpers

```javascript
// Show loading
NanoUI.UI.showLoading('#container');

// Alert
NanoUI.UI.alert('Success!', 'success');

// Text manipulation
NanoUI.UI.setText('#temp', '24.5°C');
NanoUI.UI.setHTML('#status', '<strong>Online</strong>');

// Input values
NanoUI.UI.getValue('#input');
NanoUI.UI.setValue('#input', 'value');

// Events
NanoUI.UI.onClick('#btn', () => console.log('Clicked'));
NanoUI.UI.onChange('#select', (e) => console.log(e.target.value));

// Toggle visibility
NanoUI.UI.toggle('#panel');
```

### Format Helpers

```javascript
// Numbers
NanoUI.Format.number(23.456, 1); // "23.5"

// Bytes
NanoUI.Format.bytes(1048576); // "1 MB"

// Uptime
NanoUI.Format.uptime(3661); // "1h 1m 1s"

// Time
NanoUI.Format.time(1634567890); // "6:31:30 PM"
```

### WebSocket

```javascript
// Connect
NanoUI.WS.connect('ws://192.168.1.100/ws',
  (data) => console.log('Received:', data),
  () => console.log('Connected')
);

// Send
NanoUI.WS.send({ command: 'start' });

// Close
NanoUI.WS.close();
```

### Theme

```javascript
// Initialize
NanoUI.Theme.init();

// Toggle
NanoUI.Theme.toggle();

// Set specific
NanoUI.Theme.set('dark');
```

---

## 🔧 ESP32 Examples

### Basic Web Server

```cpp
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>

AsyncWebServer server(80);

void setup() {
  LittleFS.begin(true);
  WiFi.begin(ssid, password);

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/nanoui.html", "text/html");
  });

  server.begin();
}
```

### API Endpoint

```cpp
server.on("/api/data", HTTP_GET, [](AsyncWebServerRequest *request){
  StaticJsonDocument<200> doc;
  doc["temp"] = 24.5;
  doc["humidity"] = 45.2;

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
});
```

### POST Handler

```cpp
server.on("/api/led", HTTP_POST,
  [](AsyncWebServerRequest *request){},
  NULL,
  [](AsyncWebServerRequest *request, uint8_t *data, size_t len){
    StaticJsonDocument<100> doc;
    deserializeJson(doc, data, len);

    bool state = doc["value"];
    digitalWrite(LED_PIN, state ? HIGH : LOW);

    request->send(200, "application/json", "{\"success\":true}");
  }
);
```

---

## 📋 Common Patterns

### Dashboard Update Loop

```javascript
function updateDashboard() {
  NanoUI.API.get('/api/stats', (data) => {
    // Update stats
    NanoUI.UI.setText('#temp', data.temp + '°C');
    NanoUI.Gauge.update('#cpu', data.cpu);
    NanoUI.Progress.set('#memory', data.memory);

    // Update chart
    NanoUI.Chart.line('#chart', data.history);
  });
}

// Auto-refresh every 5 seconds
NanoUI.AutoRefresh.start('dashboard', updateDashboard, 5000);
```

### Table with Live Data

```javascript
function loadSensorTable() {
  NanoUI.API.get('/api/sensors', (response) => {
    const columns = [
      { key: 'time', label: 'Time' },
      { key: 'sensor', label: 'Sensor' },
      { key: 'value', label: 'Value', format: v => v.toFixed(2) }
    ];

    NanoUI.Table.create('#table', response.data, columns);
    NanoUI.Table.enableSort('#table table');
  });
}

setInterval(loadSensorTable, 10000);
```

### Chart with History

```javascript
let history = [];

function addDataPoint(value) {
  history.push(value);
  if (history.length > 20) history.shift();

  NanoUI.Chart.line('#chart', history, {
    color: '#dc3545',
    fill: true
  });
}

// Fetch and update
setInterval(() => {
  NanoUI.API.get('/api/temp', (data) => {
    addDataPoint(data.temperature);
  });
}, 5000);
```

---

## 🎯 CSS Variables

Customize theme colors:

```css
:root {
  --primary: #007bff;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;

  --bg: #ffffff;
  --surface: #f8f9fa;
  --text: #212529;
  --border: #dee2e6;

  --radius: 8px;
  --spacing: 1rem;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --surface: #2d2d2d;
  --text: #e0e0e0;
  --border: #404040;
}
```

---

## 📏 Size Reference

| Component | CSS | JS | Total |
|-----------|-----|----|----|
| Basic UI | 17KB | 8KB | ~7KB gzipped |
| + Charts | 17KB | 8KB | ~8KB gzipped |

---

## 🔗 Links

- [Full API Docs](./API.md)
- [Components Guide](./COMPONENTS.md)
- [Charts & Tables](./CHARTS_TABLES.md)
- [Getting Started](./GETTING_STARTED.md)
- [FAQ](./FAQ.md)

---

**Print this for quick reference during development!** 📄
