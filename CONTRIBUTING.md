# Contributing to NanoUI

Thank you for your interest in contributing to NanoUI! This document provides guidelines for contributions.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (ESP32 model, Arduino/PlatformIO version, etc.)
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature already exists or is planned
- Explain the use case
- Consider the impact on file size (we aim to stay under 10KB gzipped)
- Provide examples or mockups if possible

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Keep changes focused and atomic
   - Test on actual ESP32 hardware if possible

4. **Test thoroughly**
   ```bash
   npm run build
   # Test the generated files on ESP32
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: New button variant for alerts"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Code Style

#### CSS
- Use CSS variables for theming
- Keep selectors simple and flat
- Avoid deep nesting
- Group related properties
- Comment complex sections

```css
/* Button variants */
.btn-primary { background: var(--primary); }
.btn-success { background: var(--success); }
```

#### JavaScript
- Use ES6+ features
- Keep functions small and focused
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Avoid dependencies on external libraries

```javascript
/**
 * Format bytes to human-readable size
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted size
 */
function formatBytes(bytes) {
  // Implementation
}
```

#### HTML
- Use semantic HTML
- Keep structure clean
- Add appropriate ARIA attributes
- Ensure mobile responsiveness

### File Size Constraints

NanoUI's primary goal is to be lightweight. Please ensure:
- Total gzipped size stays under 10KB
- New features don't bloat the framework
- Consider making large features optional/modular
- Test minified output size

### Testing

Before submitting:

1. **Build test**
   ```bash
   npm run build
   ```

2. **Size check**
   ```bash
   ls -lh dist/nanoui.html
   ```

3. **ESP32 test**
   - Upload to actual ESP32
   - Test on mobile and desktop browsers
   - Verify dark/light themes
   - Check all interactive elements

4. **Cross-browser test**
   - Chrome/Edge
   - Firefox
   - Safari (if available)
   - Mobile browsers

### Commit Messages

Use clear, descriptive commit messages:

- `Add: New feature or component`
- `Fix: Bug fix`
- `Update: Enhancement to existing feature`
- `Refactor: Code restructuring`
- `Docs: Documentation changes`
- `Style: CSS or visual changes`

Examples:
```
Add: Ghost button variant
Fix: Theme toggle not persisting in localStorage
Update: Improve slider touch responsiveness
Docs: Add WebSocket usage examples
```

## Project Structure

```
NanoUI/
├── src/              # Source files
│   ├── nanoui.css    # Main stylesheet
│   ├── nanoui.js     # JavaScript utilities
│   └── template.html # HTML template
├── dist/             # Built files (generated)
├── examples/         # Example projects
│   └── esp32-basic/  # Basic ESP32 example
├── docs/             # Documentation
├── tools/            # Build scripts
└── package.json      # NPM configuration
```

## Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Documentation improvements
- Cross-browser compatibility
- Accessibility enhancements

### Medium Priority
- New component variants
- Additional utility classes
- Example projects
- Translations (README, docs)

### Welcome Additions
- Chart/graph components (if tiny)
- Animation utilities (minimal)
- Form validation helpers
- More ESP32 examples (sensors, actuators)

### Out of Scope
- Large dependencies (jQuery, React, etc.)
- Features that significantly increase size
- Complex animations or effects
- Non-essential components

## Component Guidelines

When adding new components:

1. **Keep it minimal** - Only essential styles
2. **Make it themeable** - Use CSS variables
3. **Ensure responsiveness** - Test on mobile
4. **Add documentation** - Update COMPONENTS.md
5. **Provide examples** - Show usage in template.html

Example component structure:

```css
/* Component name and description */
.my-component {
  /* Layout */
  display: flex;

  /* Spacing */
  padding: var(--spacing);
  margin-bottom: 1rem;

  /* Colors (use variables) */
  background: var(--surface);
  color: var(--text);

  /* Borders and effects */
  border-radius: var(--radius);
  box-shadow: 0 2px 4px var(--shadow);

  /* Transitions */
  transition: all 0.2s;
}

/* Variants */
.my-component.active { /* ... */ }

/* Responsive */
@media (max-width: 768px) {
  .my-component { /* ... */ }
}
```

## Documentation

When adding features, update:
- `README.md` - If it affects usage
- `docs/API.md` - For JavaScript APIs
- `docs/COMPONENTS.md` - For CSS components
- `examples/` - Add usage examples

## Getting Help

- Check [existing issues](https://github.com/yourusername/NanoUI/issues)
- Read the [documentation](./docs/)
- Ask questions in issues (label: question)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make NanoUI better! 🚀
