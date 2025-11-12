# NanoUI Components Guide

Visual guide to all available components in NanoUI.

## Buttons

### Basic Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>
```

### Button Sizes

```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-block">Block Button</button>
```

### Ghost Button

```html
<button class="btn btn-ghost">Ghost Button</button>
```

---

## Cards

### Basic Card

```html
<div class="card">
  <div class="card-header">Card Title</div>
  <div class="card-body">
    <p>Card content goes here</p>
  </div>
</div>
```

### Card with Footer

```html
<div class="card">
  <div class="card-header">
    <span>Settings</span>
    <span class="badge badge-info">New</span>
  </div>
  <div class="card-body">
    <p>Configure your device settings</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">Save</button>
  </div>
</div>
```

---

## Forms

### Text Input

```html
<div class="form-group">
  <label>Device Name</label>
  <input type="text" placeholder="Enter device name">
</div>
```

### Number Input

```html
<div class="form-group">
  <label>Port Number</label>
  <input type="number" value="8080">
</div>
```

### Select

```html
<div class="form-group">
  <label>Mode</label>
  <select>
    <option>Auto</option>
    <option>Manual</option>
    <option>Off</option>
  </select>
</div>
```

---

## Switch Toggle

```html
<div class="form-group">
  <label class="d-flex align-center justify-between">
    Enable WiFi
    <label class="switch">
      <input type="checkbox" id="wifi-toggle">
      <span class="slider"></span>
    </label>
  </label>
</div>
```

### Switch with API

```html
<label class="switch">
  <input type="checkbox" data-api="/api/led">
  <span class="slider"></span>
</label>
```

The `data-api` attribute automatically sends POST requests when toggled.

---

## Range Slider

### Basic Range

```html
<div class="form-group">
  <label>Volume: <span class="range-value">50</span>%</label>
  <input type="range" min="0" max="100" value="50">
</div>
```

The adjacent `.range-value` element will automatically update with the slider value.

### Range with Custom Step

```html
<div class="form-group">
  <label>Temperature: <span class="range-value">20</span>°C</label>
  <input type="range" min="15" max="30" value="20" step="0.5">
</div>
```

---

## Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-info">Info</span>
```

### Usage in Cards

```html
<div class="card-header">
  <span>System Status</span>
  <span class="badge badge-success">Online</span>
</div>
```

---

## Alerts

```html
<div class="alert alert-info">
  <strong>Info:</strong> This is an informational message.
</div>

<div class="alert alert-success">
  <strong>Success:</strong> Operation completed successfully!
</div>

<div class="alert alert-warning">
  <strong>Warning:</strong> Please check your configuration.
</div>

<div class="alert alert-danger">
  <strong>Error:</strong> Connection failed.
</div>
```

### Programmatic Alerts

```javascript
NanoUI.UI.alert('Settings saved!', 'success');
NanoUI.UI.alert('Connection lost', 'danger', '#container');
```

---

## Loading Spinner

### HTML

```html
<div class="spinner"></div>
```

### JavaScript

```javascript
NanoUI.UI.showLoading('#content');
```

---

## Grid System

### Basic Grid

```html
<div class="row">
  <div class="col">Column 1</div>
  <div class="col">Column 2</div>
  <div class="col">Column 3</div>
</div>
```

### Specific Widths

```html
<div class="row">
  <div class="col-6">50% width</div>
  <div class="col-3">25% width</div>
  <div class="col-3">25% width</div>
</div>
```

### Responsive Grid

```html
<div class="row">
  <div class="col-4">
    <div class="card">
      <div class="card-body">Card 1</div>
    </div>
  </div>
  <div class="col-4">
    <div class="card">
      <div class="card-body">Card 2</div>
    </div>
  </div>
  <div class="col-4">
    <div class="card">
      <div class="card-body">Card 3</div>
    </div>
  </div>
</div>
```

On mobile (< 768px), all columns become 100% width automatically.

---

## Status Indicators

```html
<div class="d-flex align-center gap-1">
  <span class="status status-online"></span>
  <span>Connected</span>
</div>

<div class="d-flex align-center gap-1">
  <span class="status status-offline"></span>
  <span>Disconnected</span>
</div>

<div class="d-flex align-center gap-1">
  <span class="status status-warning"></span>
  <span>Warning</span>
</div>
```

---

## Theme Toggle

```html
<button class="theme-toggle" aria-label="Toggle theme">🌙</button>
```

The theme toggle is automatically positioned in the top-right corner. Click handling is automatic.

---

## Typography

```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>

<p>Regular paragraph text</p>
<p class="text-secondary">Secondary text color</p>
```

---

## Utility Classes

### Text Alignment

```html
<div class="text-left">Left aligned</div>
<div class="text-center">Center aligned</div>
<div class="text-right">Right aligned</div>
```

### Spacing

```html
<div class="mt-1">Margin top 0.5rem</div>
<div class="mt-2">Margin top 1rem</div>
<div class="mt-3">Margin top 1.5rem</div>

<div class="mb-1">Margin bottom 0.5rem</div>
<div class="mb-2">Margin bottom 1rem</div>
<div class="mb-3">Margin bottom 1.5rem</div>

<div class="p-1">Padding 0.5rem</div>
<div class="p-2">Padding 1rem</div>
<div class="p-3">Padding 1.5rem</div>
```

### Display

```html
<div class="d-none">Hidden</div>
<div class="d-block">Block display</div>
<div class="d-flex">Flex display</div>
```

### Flexbox

```html
<div class="d-flex justify-between align-center">
  <span>Left</span>
  <span>Right</span>
</div>

<div class="d-flex justify-center align-center">
  <span>Centered</span>
</div>

<div class="d-flex gap-2">
  <button class="btn btn-primary">Button 1</button>
  <button class="btn btn-secondary">Button 2</button>
</div>
```

---

## Complete Dashboard Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ESP32 Dashboard</title>
  <link rel="stylesheet" href="nanoui.min.css">
</head>
<body>
  <button class="theme-toggle">🌙</button>

  <div class="container">
    <h1 class="text-center">ESP32 Control Panel</h1>

    <!-- Status Row -->
    <div class="row">
      <div class="col-4">
        <div class="card">
          <div class="card-body text-center">
            <label>Temperature</label>
            <h2 id="temp">--°C</h2>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card">
          <div class="card-body text-center">
            <label>Humidity</label>
            <h2 id="humidity">--%</h2>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card">
          <div class="card-body text-center">
            <label>Uptime</label>
            <h2 id="uptime">--</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="card">
      <div class="card-header">
        <span>Controls</span>
        <span class="badge badge-success">Active</span>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="d-flex justify-between align-center">
            Main LED
            <label class="switch">
              <input type="checkbox" data-api="/api/led">
              <span class="slider"></span>
            </label>
          </label>
        </div>

        <div class="form-group">
          <label>Brightness: <span class="range-value">50</span>%</label>
          <input type="range" id="brightness" min="0" max="100" value="50">
        </div>

        <button class="btn btn-primary btn-block" onclick="refreshData()">
          Refresh All
        </button>
      </div>
    </div>
  </div>

  <script src="nanoui.min.js"></script>
  <script>
    function refreshData() {
      NanoUI.API.get('/api/sensors', (data) => {
        NanoUI.UI.setText('#temp', data.temperature + '°C');
        NanoUI.UI.setText('#humidity', data.humidity + '%');
      });
    }

    NanoUI.AutoRefresh.start('data', refreshData, 5000);
  </script>
</body>
</html>
```

---

## Customization

### CSS Variables

Override default colors by setting CSS variables:

```css
:root {
  --primary: #ff6b6b;      /* Custom primary color */
  --success: #51cf66;      /* Custom success color */
  --radius: 12px;          /* Larger border radius */
  --spacing: 1.5rem;       /* More spacing */
}
```

### Dark Theme Colors

```css
[data-theme="dark"] {
  --primary: #4dabf7;      /* Lighter primary for dark mode */
  --bg: #0d1117;           /* Darker background */
  --surface: #161b22;      /* Card background */
}
```

---

## Size Reference

| Component | Size (minified) |
|-----------|----------------|
| Full Framework | ~8KB (gzipped) |
| CSS Only | ~3KB (gzipped) |
| JS Only | ~2KB (gzipped) |
| Single Component | ~100-300 bytes |

NanoUI is optimized for ESP32's limited memory!
