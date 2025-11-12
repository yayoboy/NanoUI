# NanoUI API Documentation

Complete API reference for the NanoUI JavaScript framework.

## Table of Contents

- [Theme Management](#theme-management)
- [API Helper](#api-helper)
- [Auto Refresh](#auto-refresh)
- [UI Helpers](#ui-helpers)
- [Format Utilities](#format-utilities)
- [WebSocket](#websocket)

---

## Theme Management

### NanoUI.Theme

Handles dark/light theme switching with localStorage persistence.

#### `Theme.init()`

Initialize theme from localStorage or use default (light).

```javascript
NanoUI.Theme.init();
```

#### `Theme.toggle()`

Toggle between dark and light themes.

```javascript
NanoUI.Theme.toggle();
```

#### `Theme.set(theme)`

Set specific theme.

**Parameters:**
- `theme` (string): Either `'dark'` or `'light'`

```javascript
NanoUI.Theme.set('dark');
```

---

## API Helper

### NanoUI.API

Simplified fetch API for ESP32 communication.

#### `API.baseUrl`

Base URL for API requests. Set this to your ESP32's IP if needed.

```javascript
NanoUI.API.baseUrl = 'http://192.168.1.100';
```

#### `API.get(endpoint, onSuccess, onError)`

Perform GET request.

**Parameters:**
- `endpoint` (string): API endpoint path
- `onSuccess` (function): Callback for successful response
- `onError` (function): Callback for errors

```javascript
NanoUI.API.get('/api/status',
  (data) => {
    console.log('Status:', data);
  },
  (error) => {
    console.error('Error:', error);
  }
);
```

#### `API.post(endpoint, data, onSuccess, onError)`

Perform POST request with JSON data.

**Parameters:**
- `endpoint` (string): API endpoint path
- `data` (object): Data to send
- `onSuccess` (function): Callback for successful response
- `onError` (function): Callback for errors

```javascript
NanoUI.API.post('/api/led',
  { value: true },
  (response) => {
    console.log('LED updated');
  }
);
```

#### `API.getText(endpoint, callback)`

Simple GET request for plain text responses.

**Parameters:**
- `endpoint` (string): API endpoint path
- `callback` (function): Callback with response text

```javascript
NanoUI.API.getText('/api/version', (version) => {
  console.log('Version:', version);
});
```

---

## Auto Refresh

### NanoUI.AutoRefresh

Manage periodic data updates.

#### `AutoRefresh.start(id, callback, interval)`

Start auto-refreshing a function.

**Parameters:**
- `id` (string): Unique identifier for this refresh timer
- `callback` (function): Function to call periodically
- `interval` (number): Interval in milliseconds (default: 5000)

```javascript
function updateSensors() {
  NanoUI.API.get('/api/sensors', (data) => {
    NanoUI.UI.setText('#temp', data.temperature);
  });
}

// Update every 3 seconds
NanoUI.AutoRefresh.start('sensors', updateSensors, 3000);
```

#### `AutoRefresh.stop(id)`

Stop a specific auto-refresh timer.

**Parameters:**
- `id` (string): Identifier of timer to stop

```javascript
NanoUI.AutoRefresh.stop('sensors');
```

#### `AutoRefresh.stopAll()`

Stop all auto-refresh timers.

```javascript
NanoUI.AutoRefresh.stopAll();
```

---

## UI Helpers

### NanoUI.UI

DOM manipulation utilities.

#### `UI.showLoading(selector)`

Display loading spinner in element.

```javascript
NanoUI.UI.showLoading('#data-container');
```

#### `UI.alert(message, type, container)`

Show alert message.

**Parameters:**
- `message` (string): Alert message
- `type` (string): Alert type - `'info'`, `'success'`, `'warning'`, `'danger'`
- `container` (string): Container selector (default: `'body'`)

```javascript
NanoUI.UI.alert('Settings saved!', 'success');
NanoUI.UI.alert('Connection failed', 'danger');
```

#### `UI.setText(selector, value)`

Update element's text content.

```javascript
NanoUI.UI.setText('#temperature', '23.5°C');
```

#### `UI.setHTML(selector, html)`

Update element's HTML content.

```javascript
NanoUI.UI.setHTML('#status', '<strong>Online</strong>');
```

#### `UI.toggle(selector)`

Toggle element visibility.

```javascript
NanoUI.UI.toggle('#advanced-options');
```

#### `UI.onClick(selector, handler)`

Add click event handler.

```javascript
NanoUI.UI.onClick('#refresh-btn', () => {
  console.log('Refresh clicked');
});
```

#### `UI.onChange(selector, handler)`

Add change event handler.

```javascript
NanoUI.UI.onChange('#mode-select', (e) => {
  console.log('Selected:', e.target.value);
});
```

#### `UI.getValue(selector)`

Get input value.

**Returns:** (string) Input value

```javascript
const name = NanoUI.UI.getValue('#name-input');
```

#### `UI.setValue(selector, value)`

Set input value.

```javascript
NanoUI.UI.setValue('#brightness', 75);
```

---

## Format Utilities

### NanoUI.Format

Data formatting helpers.

#### `Format.number(num, decimals)`

Format number with fixed decimals.

**Parameters:**
- `num` (number): Number to format
- `decimals` (number): Decimal places (default: 2)

**Returns:** (string) Formatted number

```javascript
NanoUI.Format.number(23.456, 1);  // "23.5"
NanoUI.Format.number(100.1);      // "100.10"
```

#### `Format.bytes(bytes)`

Format bytes to human-readable size.

**Parameters:**
- `bytes` (number): Bytes to format

**Returns:** (string) Formatted size

```javascript
NanoUI.Format.bytes(1024);      // "1 KB"
NanoUI.Format.bytes(1048576);   // "1 MB"
NanoUI.Format.bytes(524288);    // "512 KB"
```

#### `Format.uptime(seconds)`

Format uptime from seconds.

**Parameters:**
- `seconds` (number): Uptime in seconds

**Returns:** (string) Formatted uptime

```javascript
NanoUI.Format.uptime(3661);     // "1h 1m 1s"
NanoUI.Format.uptime(86400);    // "1d 0h 0m 0s"
NanoUI.Format.uptime(125);      // "2m 5s"
```

#### `Format.time(timestamp)`

Format Unix timestamp to locale time.

**Parameters:**
- `timestamp` (number): Unix timestamp

**Returns:** (string) Formatted time

```javascript
NanoUI.Format.time(1634567890);  // "6:31:30 PM" (locale dependent)
```

---

## WebSocket

### NanoUI.WS

WebSocket communication with auto-reconnect.

#### `WS.connect(url, onMessage, onOpen)`

Connect to WebSocket server.

**Parameters:**
- `url` (string): WebSocket URL (e.g., `'ws://192.168.1.100/ws'`)
- `onMessage` (function): Message handler
- `onOpen` (function): Open handler (optional)

```javascript
NanoUI.WS.connect(
  'ws://192.168.1.100/ws',
  (data) => {
    console.log('Received:', data);
    NanoUI.UI.setText('#live-temp', data.temperature);
  },
  () => {
    console.log('WebSocket connected!');
  }
);
```

#### `WS.send(data)`

Send data through WebSocket.

**Parameters:**
- `data` (any): Data to send (objects will be JSON stringified)

```javascript
NanoUI.WS.send({ command: 'start' });
NanoUI.WS.send('PING');
```

#### `WS.close()`

Close WebSocket connection.

```javascript
NanoUI.WS.close();
```

---

## Complete Example

```javascript
// Initialize
NanoUI.Theme.init();

// Fetch and display sensor data
function updateSensors() {
  NanoUI.UI.showLoading('#sensors');

  NanoUI.API.get('/api/sensors',
    (data) => {
      NanoUI.UI.setText('#temp', NanoUI.Format.number(data.temp, 1) + '°C');
      NanoUI.UI.setText('#humidity', NanoUI.Format.number(data.humidity, 1) + '%');
    },
    (error) => {
      NanoUI.UI.alert('Failed to fetch sensors', 'danger');
    }
  );
}

// Auto-refresh every 5 seconds
NanoUI.AutoRefresh.start('sensors', updateSensors, 5000);

// Handle button clicks
NanoUI.UI.onClick('#toggle-led', () => {
  const isOn = document.querySelector('#led-switch').checked;

  NanoUI.API.post('/api/led', { value: isOn },
    () => {
      NanoUI.UI.alert('LED updated', 'success');
    }
  );
});

// WebSocket for real-time updates
NanoUI.WS.connect('ws://' + location.host + '/ws',
  (data) => {
    if (data.event === 'sensor_update') {
      NanoUI.UI.setText('#live-temp', data.temperature);
    }
  }
);
```

---

## Browser Support

NanoUI uses modern JavaScript (ES6+) and works in:

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

For older browsers, transpile the code with Babel.

---

## Performance Tips

1. **Debounce rapid updates**: Don't update UI too frequently
2. **Use AutoRefresh**: Better than manual setInterval
3. **Minimize API calls**: Batch requests when possible
4. **Cache DOM queries**: Store selectors in variables
5. **Use WebSocket**: For real-time data (more efficient than polling)

```javascript
// Good: Cache selector
const tempElement = document.querySelector('#temp');
NanoUI.AutoRefresh.start('update', () => {
  tempElement.textContent = getTemperature();
}, 1000);

// Bad: Query every time
NanoUI.AutoRefresh.start('update', () => {
  document.querySelector('#temp').textContent = getTemperature();
}, 1000);
```
