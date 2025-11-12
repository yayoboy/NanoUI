/**
 * NanoUI - Lightweight JavaScript utilities for ESP32
 * @version 1.0.0
 */

const NanoUI = (function() {
  'use strict';

  // Theme management
  const Theme = {
    init() {
      const saved = localStorage.getItem('theme') || 'light';
      this.set(saved);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      this.set(next);
    },

    set(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  };

  // API Helper for ESP32 communication
  const API = {
    baseUrl: '',

    /**
     * GET request to ESP32
     * @param {string} endpoint - API endpoint
     * @param {function} onSuccess - Success callback
     * @param {function} onError - Error callback
     */
    get(endpoint, onSuccess, onError) {
      fetch(this.baseUrl + endpoint)
        .then(response => {
          if (!response.ok) throw new Error('Network error');
          return response.json();
        })
        .then(data => onSuccess && onSuccess(data))
        .catch(err => onError && onError(err));
    },

    /**
     * POST request to ESP32
     * @param {string} endpoint - API endpoint
     * @param {object} data - Data to send
     * @param {function} onSuccess - Success callback
     * @param {function} onError - Error callback
     */
    post(endpoint, data, onSuccess, onError) {
      fetch(this.baseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) throw new Error('Network error');
          return response.json();
        })
        .then(data => onSuccess && onSuccess(data))
        .catch(err => onError && onError(err));
    },

    /**
     * Simple GET for plain text responses
     * @param {string} endpoint - API endpoint
     * @param {function} callback - Callback with response text
     */
    getText(endpoint, callback) {
      fetch(this.baseUrl + endpoint)
        .then(response => response.text())
        .then(text => callback && callback(text))
        .catch(err => console.error('Error:', err));
    }
  };

  // Auto-refresh utility
  const AutoRefresh = {
    intervals: {},

    /**
     * Start auto-refreshing an endpoint
     * @param {string} id - Unique identifier
     * @param {function} callback - Function to call
     * @param {number} interval - Interval in milliseconds
     */
    start(id, callback, interval = 5000) {
      this.stop(id); // Clear existing
      callback(); // Run immediately
      this.intervals[id] = setInterval(callback, interval);
    },

    /**
     * Stop auto-refresh
     * @param {string} id - Unique identifier
     */
    stop(id) {
      if (this.intervals[id]) {
        clearInterval(this.intervals[id]);
        delete this.intervals[id];
      }
    },

    /**
     * Stop all auto-refresh timers
     */
    stopAll() {
      Object.keys(this.intervals).forEach(id => this.stop(id));
    }
  };

  // UI Helpers
  const UI = {
    /**
     * Show loading state on element
     * @param {string} selector - CSS selector
     */
    showLoading(selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.innerHTML = '<div class="spinner"></div>';
      }
    },

    /**
     * Show alert message
     * @param {string} message - Alert message
     * @param {string} type - Alert type (info, success, warning, danger)
     * @param {string} container - Container selector
     */
    alert(message, type = 'info', container = 'body') {
      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      alert.textContent = message;

      const parent = document.querySelector(container);
      if (parent) {
        parent.insertBefore(alert, parent.firstChild);
        setTimeout(() => alert.remove(), 5000);
      }
    },

    /**
     * Update element text
     * @param {string} selector - CSS selector
     * @param {string} value - New value
     */
    setText(selector, value) {
      const el = document.querySelector(selector);
      if (el) el.textContent = value;
    },

    /**
     * Update element HTML
     * @param {string} selector - CSS selector
     * @param {string} html - New HTML
     */
    setHTML(selector, html) {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = html;
    },

    /**
     * Toggle element visibility
     * @param {string} selector - CSS selector
     */
    toggle(selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.style.display = el.style.display === 'none' ? '' : 'none';
      }
    },

    /**
     * Add click handler
     * @param {string} selector - CSS selector
     * @param {function} handler - Click handler
     */
    onClick(selector, handler) {
      const el = document.querySelector(selector);
      if (el) el.addEventListener('click', handler);
    },

    /**
     * Add change handler
     * @param {string} selector - CSS selector
     * @param {function} handler - Change handler
     */
    onChange(selector, handler) {
      const el = document.querySelector(selector);
      if (el) el.addEventListener('change', handler);
    },

    /**
     * Get input value
     * @param {string} selector - CSS selector
     * @returns {string} Input value
     */
    getValue(selector) {
      const el = document.querySelector(selector);
      return el ? el.value : '';
    },

    /**
     * Set input value
     * @param {string} selector - CSS selector
     * @param {string} value - New value
     */
    setValue(selector, value) {
      const el = document.querySelector(selector);
      if (el) el.value = value;
    }
  };

  // Format helpers
  const Format = {
    /**
     * Format number with decimals
     * @param {number} num - Number to format
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted number
     */
    number(num, decimals = 2) {
      return Number(num).toFixed(decimals);
    },

    /**
     * Format bytes to human readable
     * @param {number} bytes - Bytes
     * @returns {string} Formatted size
     */
    bytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Format uptime from seconds
     * @param {number} seconds - Uptime in seconds
     * @returns {string} Formatted uptime
     */
    uptime(seconds) {
      const d = Math.floor(seconds / 86400);
      const h = Math.floor((seconds % 86400) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);

      let result = '';
      if (d > 0) result += d + 'd ';
      if (h > 0) result += h + 'h ';
      if (m > 0) result += m + 'm ';
      result += s + 's';

      return result;
    },

    /**
     * Format timestamp to locale time
     * @param {number} timestamp - Unix timestamp
     * @returns {string} Formatted time
     */
    time(timestamp) {
      return new Date(timestamp * 1000).toLocaleTimeString();
    }
  };

  // WebSocket helper for real-time updates
  const WS = {
    socket: null,
    reconnectInterval: 5000,
    reconnectTimer: null,

    /**
     * Connect to WebSocket
     * @param {string} url - WebSocket URL
     * @param {function} onMessage - Message handler
     * @param {function} onOpen - Open handler
     */
    connect(url, onMessage, onOpen) {
      if (this.socket) this.socket.close();

      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        if (onOpen) onOpen();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (e) {
          if (onMessage) onMessage(event.data);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        this.reconnectTimer = setTimeout(() => {
          this.connect(url, onMessage, onOpen);
        }, this.reconnectInterval);
      };
    },

    /**
     * Send data through WebSocket
     * @param {*} data - Data to send (will be JSON stringified if object)
     */
    send(data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const message = typeof data === 'object' ? JSON.stringify(data) : data;
        this.socket.send(message);
      }
    },

    /**
     * Close WebSocket connection
     */
    close() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  };

  // Chart utilities
  const Chart = {
    /**
     * Create a line chart (SVG)
     * @param {string} selector - Container selector
     * @param {array} data - Array of numbers
     * @param {object} options - Chart options
     */
    line(selector, data, options = {}) {
      const container = document.querySelector(selector);
      if (!container) return;

      const width = options.width || container.clientWidth;
      const height = options.height || 150;
      const padding = options.padding || 20;
      const color = options.color || '#007bff';
      const fill = options.fill || false;

      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;

      const points = data.map((val, i) => {
        const x = padding + (i * (width - padding * 2) / (data.length - 1));
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      }).join(' ');

      let svg = `<svg class="chart" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

      if (fill) {
        const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
        svg += `<polygon points="${fillPoints}" fill="${color}" opacity="0.2"/>`;
      }

      svg += `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>`;

      // Add dots
      data.forEach((val, i) => {
        const x = padding + (i * (width - padding * 2) / (data.length - 1));
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
      });

      svg += '</svg>';
      container.innerHTML = svg;
    },

    /**
     * Create a bar chart (SVG)
     * @param {string} selector - Container selector
     * @param {array} data - Array of {label, value}
     * @param {object} options - Chart options
     */
    bar(selector, data, options = {}) {
      const container = document.querySelector(selector);
      if (!container) return;

      const width = options.width || container.clientWidth;
      const height = options.height || 150;
      const padding = options.padding || 20;
      const color = options.color || '#007bff';

      const max = Math.max(...data.map(d => d.value));
      const barWidth = (width - padding * 2) / data.length - 5;

      let svg = `<svg class="chart" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

      data.forEach((item, i) => {
        const barHeight = (item.value / max) * (height - padding * 2);
        const x = padding + i * (barWidth + 5);
        const y = height - padding - barHeight;

        svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="2"/>`;

        if (options.showLabels) {
          svg += `<text x="${x + barWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="10" fill="currentColor">${item.label}</text>`;
        }
      });

      svg += '</svg>';
      container.innerHTML = svg;
    },

    /**
     * Create a sparkline (small line chart)
     * @param {string} selector - Container selector
     * @param {array} data - Array of numbers
     * @param {string} color - Line color
     */
    sparkline(selector, data, color = '#007bff') {
      const container = document.querySelector(selector);
      if (!container) return;

      const width = container.clientWidth || 200;
      const height = 40;

      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;

      const points = data.map((val, i) => {
        const x = (i * width / (data.length - 1));
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
      }).join(' ');

      const svg = `<svg class="sparkline" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>
      </svg>`;

      container.innerHTML = svg;
    }
  };

  // Gauge utilities
  const Gauge = {
    /**
     * Create or update a circular gauge
     * @param {string} selector - Container selector
     * @param {number} value - Value (0-100)
     * @param {object} options - Gauge options
     */
    create(selector, value, options = {}) {
      const container = document.querySelector(selector);
      if (!container) return;

      const color = options.color || '#007bff';
      const size = options.size || 120;
      const strokeWidth = options.strokeWidth || 10;

      const radius = (size - strokeWidth) / 2;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (value / 100) * circumference;

      const html = `
        <div class="gauge" style="width: ${size}px; height: ${size}px;">
          <svg width="${size}" height="${size}">
            <circle class="gauge-bg" cx="${size/2}" cy="${size/2}" r="${radius}"/>
            <circle class="gauge-fill" cx="${size/2}" cy="${size/2}" r="${radius}"
                    style="stroke: ${color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"/>
          </svg>
          <div class="gauge-text">${value}%</div>
        </div>
      `;

      container.innerHTML = html;
    },

    /**
     * Update existing gauge value
     * @param {string} selector - Container selector
     * @param {number} value - New value (0-100)
     */
    update(selector, value) {
      const container = document.querySelector(selector);
      if (!container) return;

      const circle = container.querySelector('.gauge-fill');
      const text = container.querySelector('.gauge-text');

      if (circle && text) {
        const radius = parseFloat(circle.getAttribute('r'));
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (value / 100) * circumference;

        circle.style.strokeDashoffset = offset;
        text.textContent = value + '%';
      }
    }
  };

  // Table utilities
  const Table = {
    /**
     * Create a dynamic table from data
     * @param {string} selector - Container selector
     * @param {array} data - Array of objects
     * @param {array} columns - Column definitions
     */
    create(selector, data, columns) {
      const container = document.querySelector(selector);
      if (!container) return;

      let html = '<table class="table"><thead><tr>';

      columns.forEach(col => {
        html += `<th>${col.label}</th>`;
      });

      html += '</tr></thead><tbody>';

      data.forEach(row => {
        html += '<tr>';
        columns.forEach(col => {
          const value = col.format ? col.format(row[col.key]) : row[col.key];
          html += `<td>${value}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table>';
      container.innerHTML = html;
    },

    /**
     * Add sorting to table headers
     * @param {string} selector - Table selector
     */
    enableSort(selector) {
      const table = document.querySelector(selector);
      if (!table) return;

      const headers = table.querySelectorAll('th');
      headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));

          const isAscending = header.classList.contains('sort-asc');

          rows.sort((a, b) => {
            const aValue = a.cells[index].textContent;
            const bValue = b.cells[index].textContent;

            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);

            if (!isNaN(aNum) && !isNaN(bNum)) {
              return isAscending ? bNum - aNum : aNum - bNum;
            }

            return isAscending ?
              bValue.localeCompare(aValue) :
              aValue.localeCompare(bValue);
          });

          rows.forEach(row => tbody.appendChild(row));

          headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
          header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
        });
      });
    }
  };

  // Progress bar utilities
  const Progress = {
    /**
     * Set progress bar value
     * @param {string} selector - Progress bar selector
     * @param {number} value - Value (0-100)
     */
    set(selector, value) {
      const bar = document.querySelector(selector);
      if (bar) {
        bar.style.width = value + '%';
        bar.textContent = value + '%';
      }
    },

    /**
     * Animate progress bar
     * @param {string} selector - Progress bar selector
     * @param {number} target - Target value (0-100)
     * @param {number} duration - Animation duration in ms
     */
    animate(selector, target, duration = 1000) {
      const bar = document.querySelector(selector);
      if (!bar) return;

      const start = parseFloat(bar.style.width) || 0;
      const startTime = Date.now();

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = start + (target - start) * progress;

        this.set(selector, Math.round(value));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  };

  // Initialize on DOM ready
  function init() {
    Theme.init();

    // Auto-setup theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => Theme.toggle());
    }

    // Auto-setup switches to send API calls
    document.querySelectorAll('.switch input').forEach(input => {
      input.addEventListener('change', (e) => {
        const endpoint = e.target.dataset.api;
        if (endpoint) {
          API.post(endpoint, { value: e.target.checked });
        }
      });
    });

    // Auto-setup range sliders with value display
    document.querySelectorAll('input[type="range"]').forEach(input => {
      const updateValue = () => {
        const display = input.nextElementSibling;
        if (display && display.classList.contains('range-value')) {
          display.textContent = input.value;
        }
      };

      input.addEventListener('input', updateValue);
      updateValue(); // Initial
    });
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    Theme,
    API,
    AutoRefresh,
    UI,
    Format,
    WS,
    Chart,
    Gauge,
    Table,
    Progress,
    init
  };
})();

// Make available globally
window.NanoUI = NanoUI;
