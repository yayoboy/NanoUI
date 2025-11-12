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
    init
  };
})();

// Make available globally
window.NanoUI = NanoUI;
