# NanoUI Test Suite

Manual test files for verifying all components work correctly.

## Test Files

### charts-test.html
Tests all chart types:
- ✅ Line charts (with and without fill)
- ✅ Bar charts with labels
- ✅ Sparklines
- ✅ Multiple chart sizes
- ✅ Chart updates and refresh

**Run:** Open `charts-test.html` in browser

### tables-gauges-test.html
Tests tables, gauges, and progress bars:
- ✅ Dynamic table creation from JSON
- ✅ Table sorting (click headers)
- ✅ Circular gauges
- ✅ Gauge updates
- ✅ Progress bars (all variants)
- ✅ Progress bar animations

**Run:** Open `tables-gauges-test.html` in browser

## Running Tests

### Local Testing

```bash
# From project root
cd test

# Open in browser (Linux)
xdg-open charts-test.html
xdg-open tables-gauges-test.html

# Or use Python HTTP server
python3 -m http.server 8000

# Then open: http://localhost:8000/charts-test.html
```

### What to Check

For each test file:

1. **Visual Inspection**
   - [ ] All components render correctly
   - [ ] No layout issues
   - [ ] Colors match theme
   - [ ] Dark mode works

2. **Functionality**
   - [ ] Charts display data
   - [ ] Tables sort correctly
   - [ ] Gauges update smoothly
   - [ ] Progress bars animate
   - [ ] Buttons trigger actions

3. **Console**
   - [ ] No JavaScript errors
   - [ ] All tests pass
   - [ ] "All X tests passed" message

4. **Performance**
   - [ ] Page loads quickly
   - [ ] Animations are smooth
   - [ ] No lag when updating

## Test Results

Each test file displays results at the bottom:

```
✅ Line Chart: PASSED
✅ Bar Chart: PASSED
✅ Sparklines: PASSED
...
All 8 tests passed! ✅
```

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Automated Testing

For CI/CD, you can use headless browser testing:

```bash
# Install Puppeteer
npm install --save-dev puppeteer

# Create test script (test/automated.js):
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Test charts
  await page.goto('file://' + __dirname + '/charts-test.html');
  await page.waitForSelector('#test-results');

  const chartsResult = await page.evaluate(() => {
    return document.querySelector('#test-results').textContent;
  });

  console.log('Charts test:', chartsResult);

  // Test tables
  await page.goto('file://' + __dirname + '/tables-gauges-test.html');
  await page.waitForSelector('#test-results');

  const tablesResult = await page.evaluate(() => {
    return document.querySelector('#test-results').textContent;
  });

  console.log('Tables test:', tablesResult);

  await browser.close();
})();
```

## Troubleshooting

### Charts not appearing
- Check browser console for errors
- Verify dist/nanoui.min.js is loaded
- Check data array is valid

### Tables not sortable
- Ensure `enableSort()` is called after `create()`
- Check table has valid selector

### Gauges showing wrong values
- Verify value is between 0-100
- Check gauge was created before update

### Progress not animating
- Use `animate()` not `set()` for animations
- Check duration parameter

## Adding More Tests

To add a new test:

1. Create HTML file in `test/` directory
2. Include NanoUI CSS and JS:
   ```html
   <link rel="stylesheet" href="../dist/nanoui.min.css">
   <script src="../dist/nanoui.min.js"></script>
   ```

3. Create test functions:
   ```javascript
   function test(name, fn) {
     try {
       fn();
       results.push(`✅ ${name}: PASSED`);
     } catch (error) {
       results.push(`❌ ${name}: FAILED - ${error.message}`);
     }
   }
   ```

4. Display results in test-results div

5. Update this README

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Test NanoUI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build:all

    - name: Run tests
      run: |
        npm install -g serve
        serve -s . &
        SERVER_PID=$!
        sleep 2
        # Run Puppeteer tests here
        kill $SERVER_PID
```

## Manual Test Checklist

Before release, manually verify:

- [ ] All test files pass in Chrome
- [ ] All test files pass in Firefox
- [ ] Dark theme works correctly
- [ ] Mobile responsive (resize browser)
- [ ] No console errors
- [ ] File sizes are acceptable
- [ ] All animations smooth
- [ ] Charts update correctly
- [ ] Tables sort correctly
- [ ] Gauges animate smoothly
- [ ] Progress bars work

---

**Run these tests before every release!** ✅
