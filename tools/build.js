/**
 * Build script for NanoUI
 * Minifies CSS and JS and creates single HTML file
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

async function build(templateName = 'template.html', outputName = 'nanoui.html') {
  console.log(`🚀 Building NanoUI${templateName !== 'template.html' ? ' (' + templateName + ')' : ''}...\n`);

  try {
    // Read source files
    console.log('📖 Reading source files...');
    const cssContent = fs.readFileSync(path.join(SRC_DIR, 'nanoui.css'), 'utf8');
    const jsContent = fs.readFileSync(path.join(SRC_DIR, 'nanoui.js'), 'utf8');
    const htmlTemplate = fs.readFileSync(path.join(SRC_DIR, templateName), 'utf8');

    // Minify CSS
    console.log('🎨 Minifying CSS...');
    const minifiedCSS = new CleanCSS({
      level: 2,
      format: {
        breaks: false
      }
    }).minify(cssContent);

    if (minifiedCSS.errors.length > 0) {
      console.error('CSS minification errors:', minifiedCSS.errors);
      process.exit(1);
    }

    const cssSize = Buffer.byteLength(minifiedCSS.styles, 'utf8');
    console.log(`   Original CSS: ${Buffer.byteLength(cssContent, 'utf8')} bytes`);
    console.log(`   Minified CSS: ${cssSize} bytes`);
    console.log(`   Saved: ${Math.round((1 - cssSize / Buffer.byteLength(cssContent, 'utf8')) * 100)}%\n`);

    // Minify JavaScript
    console.log('⚡ Minifying JavaScript...');
    const minifiedJS = await minify(jsContent, {
      compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        keep_fargs: false,
        passes: 2
      },
      mangle: {
        toplevel: false,
        reserved: ['NanoUI']
      },
      format: {
        comments: false
      }
    });

    if (minifiedJS.error) {
      console.error('JS minification error:', minifiedJS.error);
      process.exit(1);
    }

    const jsSize = Buffer.byteLength(minifiedJS.code, 'utf8');
    console.log(`   Original JS: ${Buffer.byteLength(jsContent, 'utf8')} bytes`);
    console.log(`   Minified JS: ${jsSize} bytes`);
    console.log(`   Saved: ${Math.round((1 - jsSize / Buffer.byteLength(jsContent, 'utf8')) * 100)}%\n`);

    // Create standalone files
    console.log('💾 Writing standalone files...');
    fs.writeFileSync(path.join(DIST_DIR, 'nanoui.min.css'), minifiedCSS.styles);
    fs.writeFileSync(path.join(DIST_DIR, 'nanoui.min.js'), minifiedJS.code);
    console.log('   ✅ nanoui.min.css');
    console.log('   ✅ nanoui.min.js\n');

    // Create combined HTML file
    console.log('📦 Creating combined HTML...');
    const finalHTML = htmlTemplate
      .replace('/* CSS_PLACEHOLDER */', minifiedCSS.styles)
      .replace('/* JS_PLACEHOLDER */', minifiedJS.code);

    fs.writeFileSync(path.join(DIST_DIR, outputName), finalHTML);

    const htmlSize = Buffer.byteLength(finalHTML, 'utf8');
    console.log(`   ✅ ${outputName} (${htmlSize} bytes)\n`);

    // Calculate gzipped size (approximate)
    const zlib = require('zlib');
    const gzipped = zlib.gzipSync(finalHTML);
    const gzipSize = gzipped.length;

    console.log('📊 Summary:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total size:    ${htmlSize} bytes`);
    console.log(`   Gzipped:       ${gzipSize} bytes (~${Math.round(gzipSize / 1024 * 10) / 10} KB)`);
    console.log(`   Compression:   ${Math.round((1 - gzipSize / htmlSize) * 100)}%`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Build complete!\n');

    // Performance tips
    console.log('💡 Tips for ESP32:');
    console.log('   • Enable gzip compression on your web server');
    console.log('   • Set cache headers for static files');
    console.log('   • Store nanoui.html in SPIFFS/LittleFS');
    console.log('   • Use async web server (ESPAsyncWebServer)\n');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
const args = process.argv.slice(2);
if (args.includes('--dashboard')) {
  build('dashboard-template.html', 'dashboard.html');
} else {
  build();
}
