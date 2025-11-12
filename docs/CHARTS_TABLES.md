# Charts & Tables Quick Reference

Complete guide to using charts, tables, and data visualization components in NanoUI.

## Table of Contents

- [Charts](#charts)
- [Tables](#tables)
- [Gauges](#gauges)
- [Progress Bars](#progress-bars)
- [Stat Cards](#stat-cards)
- [Complete Examples](#complete-examples)

---

## Charts

NanoUI includes lightweight SVG-based charting without external dependencies.

### Line Chart

Create a line chart from an array of numbers.

```javascript
const data = [20, 22, 21, 25, 23, 27, 26];

NanoUI.Chart.line('#chart-container', data, {
  color: '#007bff',    // Line color
  fill: true,          // Fill area under line
  height: 200,         // Chart height
  padding: 20          // Padding around chart
});
```

**HTML:**
```html
<div class="card">
  <div class="card-header">Temperature Trend</div>
  <div class="card-body">
    <div id="chart-container" class="chart-container"></div>
  </div>
</div>
```

### Bar Chart

Create a bar chart from labeled data.

```javascript
const data = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 59 },
  { label: 'Wed', value: 80 },
  { label: 'Thu', value: 81 },
  { label: 'Fri', value: 56 }
];

NanoUI.Chart.bar('#bar-chart', data, {
  color: '#28a745',
  showLabels: true,
  height: 200
});
```

### Sparkline

Tiny inline charts for quick metrics.

```javascript
const data = [45, 52, 48, 55, 50, 58, 45];

NanoUI.Chart.sparkline('#cpu-sparkline', data, '#007bff');
```

**HTML:**
```html
<div class="metric">
  <div class="metric-icon">💻</div>
  <div class="metric-content">
    <div class="metric-label">CPU Usage</div>
    <div class="metric-value">45%</div>
  </div>
  <div id="cpu-sparkline"></div>
</div>
```

### Updating Charts

Re-call the chart function with new data to update:

```javascript
function updateChart() {
  NanoUI.API.get('/api/chart-data', (response) => {
    NanoUI.Chart.line('#chart-container', response.data, {
      color: '#dc3545',
      fill: true
    });
  });
}

// Auto-update every 5 seconds
NanoUI.AutoRefresh.start('chart', updateChart, 5000);
```

---

## Tables

Create dynamic, sortable tables from data.

### Basic Table

```javascript
const data = [
  { name: 'Sensor 1', temp: 24.5, humidity: 45.2, status: 'OK' },
  { name: 'Sensor 2', temp: 25.1, humidity: 43.8, status: 'Warning' },
  { name: 'Sensor 3', temp: 23.9, humidity: 46.5, status: 'OK' }
];

const columns = [
  { key: 'name', label: 'Sensor Name' },
  {
    key: 'temp',
    label: 'Temperature',
    format: (val) => val.toFixed(1) + '°C'
  },
  {
    key: 'humidity',
    label: 'Humidity',
    format: (val) => val.toFixed(1) + '%'
  },
  {
    key: 'status',
    label: 'Status',
    format: (val) => `<span class="badge badge-${val === 'OK' ? 'success' : 'warning'}">${val}</span>`
  }
];

NanoUI.Table.create('#table-container', data, columns);
```

**HTML:**
```html
<div class="card">
  <div class="card-header">Sensor Readings</div>
  <div class="card-body">
    <div class="table-responsive" id="table-container"></div>
  </div>
</div>
```

### Sortable Table

Enable sorting by clicking column headers:

```javascript
NanoUI.Table.create('#table-container', data, columns);
NanoUI.Table.enableSort('#table-container table');
```

### Static HTML Table

You can also create tables with pure HTML:

```html
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Value</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Temperature</td>
      <td>24.5°C</td>
      <td><span class="badge badge-success">OK</span></td>
    </tr>
    <tr>
      <td>Humidity</td>
      <td>45.2%</td>
      <td><span class="badge badge-success">OK</span></td>
    </tr>
  </tbody>
</table>
```

### Table Variants

```html
<!-- Small table -->
<table class="table table-sm">...</table>

<!-- Striped rows -->
<table class="table table-striped">...</table>

<!-- Responsive wrapper -->
<div class="table-responsive">
  <table class="table">...</table>
</div>
```

---

## Gauges

Circular progress indicators.

### Create Gauge

```javascript
NanoUI.Gauge.create('#gauge-container', 75, {
  color: '#007bff',
  size: 120,
  strokeWidth: 10
});
```

**HTML:**
```html
<div id="gauge-container"></div>
```

### Update Gauge

```javascript
NanoUI.Gauge.update('#gauge-container', 85);
```

### Complete Example

```javascript
function updateCPUGauge() {
  NanoUI.API.get('/api/cpu', (data) => {
    NanoUI.Gauge.update('#cpu-gauge', data.usage);
  });
}

// Initialize
NanoUI.Gauge.create('#cpu-gauge', 0, { color: '#007bff' });

// Auto-update
NanoUI.AutoRefresh.start('cpu', updateCPUGauge, 2000);
```

---

## Progress Bars

Linear progress indicators.

### Basic Progress Bar

```html
<div class="form-group">
  <label>Storage Usage</label>
  <div class="progress">
    <div class="progress-bar" id="storage-bar" style="width: 0%">0%</div>
  </div>
</div>
```

### Set Progress

```javascript
NanoUI.Progress.set('#storage-bar', 67);
```

### Animate Progress

```javascript
NanoUI.Progress.animate('#storage-bar', 67, 1500); // 1.5 seconds
```

### Progress Variants

```html
<!-- Colored progress bars -->
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 80%">80%</div>
</div>

<div class="progress">
  <div class="progress-bar progress-bar-danger" style="width: 90%">90%</div>
</div>

<!-- Small progress bar -->
<div class="progress progress-sm">
  <div class="progress-bar" style="width: 50%"></div>
</div>

<!-- Striped & animated -->
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 45%">45%</div>
</div>
```

---

## Stat Cards

Display key metrics with style.

### Basic Stat Card

```html
<div class="stat-card">
  <div class="stat-card-icon">📊</div>
  <div class="stat-card-value" id="stat-value">1,234</div>
  <div class="stat-card-label">Total Requests</div>
  <div class="stat-card-change positive">↑ 12%</div>
</div>
```

### Update Stat Card

```javascript
NanoUI.UI.setText('#stat-value', '1,567');
```

### Stat Card in Grid

```html
<div class="row">
  <div class="col-3">
    <div class="stat-card">
      <div class="stat-card-icon">🌡️</div>
      <div class="stat-card-value">24.5°C</div>
      <div class="stat-card-label">Temperature</div>
    </div>
  </div>
  <div class="col-3">
    <div class="stat-card">
      <div class="stat-card-icon">💾</div>
      <div class="stat-card-value">65%</div>
      <div class="stat-card-label">Memory</div>
    </div>
  </div>
  <!-- More cards... -->
</div>
```

---

## Complete Examples

### Real-time Dashboard

```javascript
// Initialize all components
function initDashboard() {
  // Create gauge
  NanoUI.Gauge.create('#cpu-gauge', 0, { color: '#007bff' });

  // Initialize progress bars
  NanoUI.Progress.animate('#storage-bar', 67, 1000);

  // Load initial data
  loadChartData();
  loadTableData();
}

// Load chart data
function loadChartData() {
  NanoUI.API.get('/api/chart/temperature', (response) => {
    NanoUI.Chart.line('#temp-chart', response.data, {
      color: '#dc3545',
      fill: true
    });
  });
}

// Load table data
function loadTableData() {
  NanoUI.API.get('/api/sensors', (response) => {
    const columns = [
      { key: 'timestamp', label: 'Time' },
      {
        key: 'temp',
        label: 'Temp',
        format: (v) => v.toFixed(1) + '°C'
      },
      {
        key: 'status',
        label: 'Status',
        format: (v) => `<span class="badge badge-${v === 'OK' ? 'success' : 'danger'}">${v}</span>`
      }
    ];

    NanoUI.Table.create('#sensor-table', response.data, columns);
    NanoUI.Table.enableSort('#sensor-table table');
  });
}

// Update live metrics
function updateMetrics() {
  NanoUI.API.get('/api/stats', (data) => {
    // Update gauge
    NanoUI.Gauge.update('#cpu-gauge', data.cpu);

    // Update stat cards
    NanoUI.UI.setText('#total-requests', data.requests);
    NanoUI.UI.setText('#avg-temp', data.avgTemp.toFixed(1) + '°C');

    // Update progress
    NanoUI.Progress.set('#memory-bar', data.memoryUsage);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();

  // Auto-refresh data
  NanoUI.AutoRefresh.start('metrics', updateMetrics, 5000);
  NanoUI.AutoRefresh.start('charts', loadChartData, 10000);
  NanoUI.AutoRefresh.start('table', loadTableData, 15000);
});
```

### ESP32 API Endpoints

```cpp
// Temperature chart data
server.on("/api/chart/temperature", HTTP_GET, [](AsyncWebServerRequest *request){
  StaticJsonDocument<1024> doc;
  JsonArray data = doc.createNestedArray("data");

  for (int i = 0; i < 20; i++) {
    data.add(tempHistory[i]);
  }

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
});

// Sensor table data
server.on("/api/sensors", HTTP_GET, [](AsyncWebServerRequest *request){
  StaticJsonDocument<2048> doc;
  JsonArray data = doc.createNestedArray("data");

  for (int i = 0; i < 10; i++) {
    JsonObject sensor = data.createNestedObject();
    sensor["timestamp"] = getTimeString();
    sensor["temp"] = sensorData[i].temp;
    sensor["humidity"] = sensorData[i].humidity;
    sensor["status"] = (sensorData[i].temp < 30) ? "OK" : "Warning";
  }

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
});

// Live stats
server.on("/api/stats", HTTP_GET, [](AsyncWebServerRequest *request){
  StaticJsonDocument<512> doc;

  doc["requests"] = requestCount;
  doc["avgTemp"] = getAverageTemperature();
  doc["memoryUsage"] = getMemoryUsagePercent();
  doc["cpu"] = getCPUUsage();

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
});
```

---

## Performance Tips

### 1. Limit Data Points

Keep chart data arrays under 50 points for smooth performance:

```javascript
// Good
const data = temperatureHistory.slice(-20); // Last 20 points

// Bad
const data = temperatureHistory; // 1000+ points
```

### 2. Debounce Updates

Don't update charts too frequently:

```javascript
let updateTimer;
function debouncedChartUpdate(data) {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    NanoUI.Chart.line('#chart', data);
  }, 100);
}
```

### 3. Reuse Chart Containers

Update existing charts instead of recreating:

```javascript
// Update data without recreating SVG
function updateChart(newData) {
  NanoUI.Chart.line('#chart', newData, { color: '#007bff' });
}
```

### 4. Use Sparklines for Small Data

Sparklines are lighter than full charts:

```javascript
// Lightweight inline chart
NanoUI.Chart.sparkline('#inline-chart', [1,2,3,4,5], '#28a745');
```

---

## Browser Compatibility

All chart and table features work in:

- ✅ Chrome/Edge 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

SVG is well-supported across all modern browsers.

---

## Troubleshooting

### Charts not displaying

**Check:**
1. Container has valid ID
2. Data is array of numbers (line/sparkline) or objects (bar)
3. Container is visible (`display: none` will cause issues)

### Tables not sorting

**Ensure:**
1. `enableSort()` is called AFTER `create()`
2. Table has valid selector

### Gauges not updating

**Verify:**
1. Gauge was created first with `create()`
2. Value is between 0-100
3. Selector is correct

---

For more examples, see:
- [API Documentation](./API.md)
- [Components Guide](./COMPONENTS.md)
- [ESP32 Dashboard Example](../examples/esp32-dashboard/)
