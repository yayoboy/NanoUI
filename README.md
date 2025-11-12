# NanoUI 🚀

A lightweight, modern UI framework designed specifically for microcontrollers like ESP32. Create beautiful web interfaces with minimal memory footprint.

## ✨ Features

- **Ultra Lightweight**: < 10KB gzipped (CSS + JS combined)
- **Modern Design**: Clean, responsive components with dark/light themes
- **Zero Dependencies**: Pure vanilla JavaScript
- **ESP32 Optimized**: Designed for constrained memory environments
- **Easy Integration**: Single HTML file deployment
- **Mobile Responsive**: Works perfectly on all screen sizes

## 🎯 Why NanoUI?

ESP32 and similar microcontrollers have limited memory (typically 520KB RAM, 4MB flash). Traditional UI frameworks like Bootstrap (>50KB) or Material UI are too heavy. NanoUI provides modern UI components in a fraction of the size.

## 📦 What's Included

### Components
- **Buttons**: Primary, secondary, success, danger, ghost variants
- **Cards**: Container components with headers and actions
- **Inputs**: Text, number, password with labels
- **Switches**: Toggle switches for on/off states
- **Sliders**: Range inputs with real-time value display
- **Badges**: Status indicators and labels
- **Alerts**: Info, success, warning, error messages
- **Grid System**: Responsive layout system

### Utilities
- **Theme Toggle**: Dark/light mode switcher
- **API Helper**: Easy AJAX calls to ESP32 endpoints
- **Auto-refresh**: Periodic data updates
- **Loading States**: Built-in loading indicators

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

# Build minified version
npm run build

# Watch for changes (development)
npm run watch
```

## 📖 Usage Examples

See the `examples/` directory for complete ESP32 projects:
- **Basic**: Simple status dashboard
- **Sensors**: Temperature and humidity monitor
- **Control**: LED and relay control panel
- **Advanced**: Full home automation interface

## 📊 Size Comparison

| Framework | Gzipped Size | Features |
|-----------|--------------|----------|
| **NanoUI** | ~8KB | Essential UI components |
| Bootstrap | ~25KB | Full framework |
| Material UI | ~90KB | React-based |
| Tailwind | ~10-50KB | Utility-first (varies) |

## 🛠️ Development

```bash
# Project structure
nanoui/
├── src/
│   ├── nanoui.css      # Main stylesheet
│   ├── nanoui.js       # JavaScript utilities
│   └── template.html   # HTML template
├── dist/
│   ├── nanoui.html     # All-in-one minified file
│   ├── nanoui.min.css  # Standalone CSS
│   └── nanoui.min.js   # Standalone JS
├── examples/
│   └── esp32-basic/    # ESP32 examples
└── tools/
    └── build.js        # Build scripts
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
