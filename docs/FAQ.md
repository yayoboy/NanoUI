# Frequently Asked Questions (FAQ)

## General

### What is NanoUI?

NanoUI is a lightweight UI framework specifically designed for microcontrollers like ESP32. It provides modern, responsive web interfaces with minimal memory footprint (~5KB gzipped).

### Why not use Bootstrap or other frameworks?

Popular frameworks like Bootstrap (25KB+), Material UI (90KB+), or even Tailwind (10-50KB) are too large for microcontrollers with limited memory. NanoUI provides essential components in a fraction of the size.

### What browsers are supported?

NanoUI works on:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Modern mobile browsers

### Is NanoUI production-ready?

Yes! NanoUI is stable and tested on ESP32 hardware. However, always test thoroughly for your specific use case.

## Technical

### How much memory does NanoUI use?

- **Flash storage**: ~19KB uncompressed, ~5KB gzipped
- **RAM**: Negligible (static HTML/CSS/JS)
- **Heap**: No dynamic allocation required

### Can I use NanoUI with other microcontrollers?

Yes! NanoUI works with any microcontroller that can:
- Serve web pages (HTTP server)
- Store files (SPIFFS, LittleFS, SD card)
- Has WiFi or Ethernet capability

Tested on:
- ESP32 (all variants)
- ESP8266
- Arduino with Ethernet/WiFi shield
- Raspberry Pi Pico W

### Does NanoUI require an internet connection?

No! NanoUI is completely self-contained in a single HTML file. Once uploaded to your microcontroller, it works offline.

### Can I use NanoUI with WebSockets?

Yes! NanoUI includes WebSocket utilities:

```javascript
NanoUI.WS.connect('ws://192.168.1.100/ws',
  (data) => {
    // Handle real-time updates
  }
);
```

### How do I add authentication?

Add basic auth to your ESP32:

```cpp
// In main.cpp
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  if(!request->authenticate("admin", "password"))
    return request->requestAuthentication();

  request->send(LittleFS, "/nanoui.html", "text/html");
});
```

For better security, implement token-based authentication.

## Customization

### Can I change colors and styling?

Yes! Override CSS variables in your HTML:

```html
<style>
:root {
  --primary: #ff6b6b;
  --success: #51cf66;
  --radius: 12px;
}
</style>
```

### Can I remove unused components?

Yes! Edit `src/nanoui.css`, remove components you don't need, and rebuild:

```bash
npm run build
```

### How do I add custom components?

1. Add CSS to `src/nanoui.css`
2. Add HTML to `src/template.html`
3. Rebuild: `npm run build`
4. Upload new file to ESP32

### Can I use custom fonts?

You can, but it increases file size. Consider:
- System fonts (no extra size)
- Subset fonts (only needed characters)
- External CDN (requires internet)

System font stack (no size impact):
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
```

## ESP32 Specific

### Which ESP32 boards are supported?

All ESP32 variants:
- ESP32 (original)
- ESP32-S2
- ESP32-S3
- ESP32-C3
- ESP32-C6

### How much flash storage do I need?

Minimum:
- 4MB flash (standard)
- 1MB for LittleFS/SPIFFS partition

Recommended:
- 4MB or more
- 512KB+ for filesystem

### Can I use OTA updates?

Yes! Example:

```cpp
#include <ArduinoOTA.h>

void setup() {
  // ... existing code ...

  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();
}
```

### Why can't I connect to my ESP32?

Check:
1. **Same network**: Device and ESP32 on same WiFi
2. **Correct IP**: Use IP from serial monitor
3. **Firewall**: Temporarily disable to test
4. **mDNS**: Try `esp32.local` if configured

### How do I use multiple pages?

Serve additional pages:

```cpp
server.on("/settings", HTTP_GET, [](AsyncWebServerRequest *request){
  request->send(LittleFS, "/settings.html", "text/html");
});
```

Or use single-page app with JavaScript:

```javascript
NanoUI.UI.onClick('#settings-btn', () => {
  NanoUI.UI.toggle('#main-page');
  NanoUI.UI.toggle('#settings-page');
});
```

### Can I add SSL/HTTPS?

Yes, but requires more setup:

```cpp
#include <ESP32WebServer.h>
#include <WiFiClientSecure.h>

// Generate certificates first
// See: https://github.com/fhessel/esp32_https_server
```

Note: SSL increases memory usage and complexity.

## Performance

### Why is my UI slow to load?

Optimize:
1. **Enable gzip**: Reduces transfer by 70%
2. **Cache headers**: Avoid re-downloading
3. **Reduce refresh rate**: Update less frequently
4. **Minimize API calls**: Batch requests

### How do I enable gzip compression?

Pre-compress the file:
```bash
gzip -k dist/nanoui.html
```

Serve compressed version:
```cpp
server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(
    LittleFS, "/nanoui.html.gz", "text/html"
  );
  response->addHeader("Content-Encoding", "gzip");
  request->send(response);
});
```

### Can I lazy-load components?

Yes! Load heavy content only when needed:

```javascript
NanoUI.UI.onClick('#show-chart', () => {
  NanoUI.API.get('/api/chart-data', (data) => {
    // Render chart only when needed
  });
});
```

### My ESP32 runs out of memory

Solutions:
1. Reduce API response sizes
2. Use `StaticJsonDocument` not `DynamicJsonDocument`
3. Lower refresh rates
4. Close unused connections
5. Consider ESP32 with PSRAM

## Development

### How do I debug API issues?

Use browser developer tools:
1. Press F12
2. Go to Network tab
3. Trigger API call
4. Check request/response

Also monitor ESP32 serial output:
```cpp
Serial.print("API called: ");
Serial.println(request->url());
```

### Can I use TypeScript?

Yes! Create `src/nanoui.ts` and compile to JavaScript. Make sure to:
- Keep output size small
- Test minified version
- Update build script

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Where do I report bugs?

Create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Your environment
- Screenshots/code samples

## Advanced

### Can I use NanoUI with REST frameworks?

Yes! NanoUI's API helper works with any REST API:

```javascript
NanoUI.API.baseUrl = 'http://api.example.com';
NanoUI.API.get('/v1/data', (data) => {
  // Handle response
});
```

### Can I integrate with home automation?

Yes! Popular integrations:
- Home Assistant (via REST API)
- MQTT (with ESP32 MQTT client)
- Alexa/Google Home (via custom skills)

### Can I use NanoUI for commercial projects?

Yes! NanoUI is MIT licensed - use freely in commercial projects.

### How do I add charts/graphs?

Use lightweight charting libraries:
- Chart.js (with tree-shaking)
- uPlot (~45KB, minimal)
- Custom SVG charts

Keep in mind size impact on ESP32.

### Can I use React/Vue/Angular with NanoUI?

Not recommended. These frameworks are too large for ESP32. NanoUI is designed to work with vanilla JavaScript for minimal size.

### How do I handle large data sets?

Strategies:
1. **Pagination**: Load data in chunks
2. **Filtering**: Let ESP32 filter before sending
3. **Caching**: Store data in browser
4. **Compression**: Gzip API responses

Example pagination:
```javascript
let page = 0;

function loadMore() {
  NanoUI.API.get(`/api/data?page=${page}`, (data) => {
    // Append data to UI
    page++;
  });
}
```

## Troubleshooting

### Upload fails with "Timed out"

**Solution**: Hold BOOT button during upload

### "LittleFS mount failed"

**Solution**: Format on first boot:
```cpp
LittleFS.begin(true); // true = format if needed
```

### UI shows but no data updates

**Solution**: Check:
1. API endpoints return valid JSON
2. CORS headers if needed
3. Browser console for errors
4. ESP32 serial output

### Theme toggle doesn't work

**Solution**: Ensure JavaScript is enabled and check:
```javascript
// Verify theme toggle exists
console.log(document.querySelector('.theme-toggle'));
```

### Styles look broken

**Solution**:
1. Clear browser cache
2. Rebuild: `npm run build`
3. Re-upload to ESP32
4. Check file integrity

### API returns 404

**Solution**: Verify route registration:
```cpp
server.on("/api/data", HTTP_GET, handleData);
server.begin(); // Don't forget this!
```

## Still Need Help?

- Check [GitHub Issues](https://github.com/yourusername/NanoUI/issues)
- Read [Documentation](./API.md)
- Ask in [Discussions](https://github.com/yourusername/NanoUI/discussions)

---

Don't see your question? [Ask on GitHub!](https://github.com/yourusername/NanoUI/issues/new)
