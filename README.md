# NanoUI 🚀

A lightweight, modern UI framework designed specifically for microcontrollers like ESP32. Create beautiful web interfaces with minimal memory footprint.

## ✨ Features

- **Ultra Lightweight**: ~7KB gzipped (basic) / ~8KB (dashboard with charts)
- **Modern Design**: Clean, responsive components with dark/light themes
- **Zero Dependencies**: Pure vanilla JavaScript
- **ESP32 Optimized**: Designed for constrained memory environments
- **Easy Integration**: Single HTML file deployment
- **Mobile Responsive**: Works perfectly on all screen sizes
- **Data Visualization**: Built-in charts, gauges, and tables

## 🎯 Why NanoUI?

ESP32 and similar microcontrollers have limited memory (typically 520KB RAM, 4MB flash). Traditional UI frameworks like Bootstrap (>50KB) or Material UI are too heavy. NanoUI provides modern UI components in a fraction of the size.

## 📦 What's Included

### UI Components
- **Buttons**: Primary, secondary, success, danger, ghost variants
- **Cards**: Container components with headers and actions
- **Inputs**: Text, number, password with labels
- **Switches**: Toggle switches for on/off states
- **Sliders**: Range inputs with real-time value display
- **Badges**: Status indicators and labels
- **Alerts**: Info, success, warning, error messages
- **Grid System**: Responsive layout system
- **Tables**: Responsive tables with sorting capabilities
- **Progress Bars**: Animated progress indicators
- **Stat Cards**: Metric display with change indicators
- **Timeline**: Activity log component
- **Data Lists**: Key-value formatted lists

### Data Visualization
- **Line Charts**: SVG-based line charts with fill option
- **Bar Charts**: Vertical bar charts with labels
- **Sparklines**: Inline mini charts for quick metrics
- **Circular Gauges**: Percentage visualizations
- **Progress Indicators**: Multiple styles and animations

### JavaScript Utilities
- **Theme Management**: Dark/light mode with persistence
- **API Helper**: AJAX calls with built-in error handling
- **Auto-refresh**: Periodic data updates
- **WebSocket**: Real-time communication support
- **Format Helpers**: Numbers, bytes, time, uptime formatters
- **Chart API**: Easy data visualization
- **Table API**: Dynamic table creation and sorting
- **Gauge API**: Circular progress indicators

## 🚀 Quick Start

### For ESP32 (PlatformIO)

1. Copy `dist/nanoui.html` to your ESP32 project's `data/` folder
2. Serve it using ESPAsyncWebServer:

```cpp
#include <ESPAsyncWebServer.h>

AsyncWebServer server(80);

void setup() {
  // Serve the UI
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/nanoui.html", "text/html");
  });

  // API endpoint example
  server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = "{\"temp\":23.5,\"humidity\":45}";
    request->send(200, "application/json", json);
  });

  server.begin();
}
```

### Building from Source

```bash
# Install dependencies
npm install

# Build basic template
npm run build

# Build dashboard template with charts
npm run build:dashboard

# Build component showcase (demo page)
npm run build:showcase

# Build all (basic + dashboard + showcase)
npm run build:all
```

## 🎨 Demo & Showcase

Want to see all components in action? Open `dist/showcase.html` in your browser to explore:

- **Complete Component Gallery**: All UI elements displayed with examples
- **Interactive Demos**: Live charts, gauges, tables with real-time updates
- **Color Palette**: Full theme color showcase
- **Dark/Light Mode**: Toggle between themes
- **Code Reference**: Visual examples of every component

Perfect for:
- 📖 Learning what components are available
- 🎨 Designing your interface
- 📸 Taking screenshots for documentation
- 🔍 Testing responsive behavior

Simply run `npm run build:showcase` and open `dist/showcase.html` in your web browser!

## 📖 Usage Examples

See the `examples/` directory for complete ESP32 projects:

### Basic Example (`esp32-basic/`)
- Simple status dashboard
- Sensor readings (temperature, humidity)
- LED and brightness control
- System monitoring (uptime, memory, WiFi)
- Perfect for getting started

### Advanced Dashboard (`esp32-dashboard/`)
- 📊 **Charts**: Line and bar charts for data visualization
- 📈 **Sparklines**: Inline mini charts for metrics
- 📉 **Gauges**: Circular progress indicators
- 📋 **Tables**: Sortable data tables with sensor logs
- 🎯 **Stat Cards**: Key metrics with trend indicators
- 📃 **Timeline**: Activity log
- 🔄 **Real-time Updates**: Auto-refreshing data

## 📊 Size Comparison

| Framework | Gzipped Size | Features |
|-----------|--------------|----------|
| **NanoUI Basic** | ~7KB | Essential UI + controls |
| **NanoUI Dashboard** | ~8KB | Full charts & tables |
| **NanoUI Showcase** | ~9.4KB | All components demo (for browsers, not ESP32) |
| Bootstrap | ~25KB | Full framework |
| Material UI | ~90KB | React-based |
| Tailwind | ~10-50KB | Utility-first (varies) |

## 🛠️ Development

```bash
# Project structure
nanoui/
├── src/
│   ├── nanoui.css              # Main stylesheet
│   ├── nanoui.js               # JavaScript utilities
│   ├── template.html           # Basic template
│   └── dashboard-template.html # Dashboard template
├── dist/
│   ├── nanoui.html             # Basic UI (7KB gzipped)
│   ├── dashboard.html          # Dashboard (8KB gzipped)
│   ├── nanoui.min.css          # Standalone CSS
│   └── nanoui.min.js           # Standalone JS
├── examples/
│   ├── esp32-basic/            # Basic example
│   └── esp32-dashboard/        # Advanced dashboard
├── docs/
│   ├── API.md                  # Complete API reference
│   ├── COMPONENTS.md           # Component guide
│   └── GETTING_STARTED.md      # Getting started guide
└── tools/
    └── build.js                # Build scripts
```

## 🎨 Customization

Edit `src/nanoui.css` to customize colors, spacing, and component styles. The CSS uses CSS variables for easy theming:

```css
:root {
  --primary: #007bff;
  --success: #28a745;
  --danger: #dc3545;
  /* ... */
}
```

## 📄 License

MIT License - Use freely in your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Tips

1. **Compression**: ESP32 web servers support gzip - enable it for even smaller transfers
2. **Caching**: Set proper cache headers to avoid re-downloading on every visit
3. **SPIFFS**: Store the UI file in SPIFFS or LittleFS for easy updates
4. **API Design**: Keep JSON responses small and efficient

## 🔗 Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [PlatformIO](https://platformio.org/)
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)

---

Made with ❤️ for the ESP32 community
