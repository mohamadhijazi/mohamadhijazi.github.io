/**
 * utils.js — Utility helpers for EA Tool
 * Exposes window.Utils as a global namespace (no ES modules)
 */
(function () {
  'use strict';

  // ── ID generation ──────────────────────────────────────────────────────────
  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // ── HTML escaping ──────────────────────────────────────────────────────────
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── Date formatting ────────────────────────────────────────────────────────
  function formatDate(isoString) {
    if (!isoString) return '';
    var d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatDateTime(isoString) {
    if (!isoString) return '';
    var d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function formatRelativeTime(isoString) {
    if (!isoString) return '';
    var d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    var now = Date.now();
    var diffMs = now - d.getTime();
    var diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return diffSec <= 1 ? 'just now' : diffSec + ' seconds ago';
    var diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return diffMin === 1 ? '1 minute ago' : diffMin + ' minutes ago';
    var diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr === 1 ? '1 hour ago' : diffHr + ' hours ago';
    var diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return diffDay === 1 ? '1 day ago' : diffDay + ' days ago';
    var diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return diffMonth === 1 ? '1 month ago' : diffMonth + ' months ago';
    var diffYear = Math.floor(diffMonth / 12);
    return diffYear === 1 ? '1 year ago' : diffYear + ' years ago';
  }

  // ── String helpers ─────────────────────────────────────────────────────────
  function slugify(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_]/g, '')
      .replace(/[\s]+/g, '_');
  }

  function truncate(str, len) {
    if (!str) return '';
    str = String(str);
    if (str.length <= len) return str;
    return str.slice(0, len) + '\u2026';
  }

  // ── Function helpers ───────────────────────────────────────────────────────
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  // ── Object / Array helpers ─────────────────────────────────────────────────
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function groupBy(arr, key) {
    if (!Array.isArray(arr)) return {};
    var acc = {};
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (!item) continue;
      var groupKey = item[key];
      if (groupKey === undefined || groupKey === null) groupKey = 'undefined';
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
    }
    return acc;
  }

  function sortBy(arr, key, dir) {
    if (!Array.isArray(arr)) return [];
    var direction = (dir && dir.toLowerCase() === 'desc') ? -1 : 1;
    return arr.slice().sort(function (a, b) {
      var av = a[key];
      var bv = b[key];
      if (av === null || av === undefined) return 1 * direction;
      if (bv === null || bv === undefined) return -1 * direction;
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * direction;
      }
      if (av < bv) return -1 * direction;
      if (av > bv) return 1 * direction;
      return 0;
    });
  }

  // ── CSV / Download helpers ─────────────────────────────────────────────────
  function toCSV(headers, rows) {
    function escapeCell(val) {
      if (val === null || val === undefined) return '';
      val = String(val);
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    }
    var lines = [headers.map(escapeCell).join(',')];
    rows.forEach(function (row) {
      lines.push(headers.map(function (h) { return escapeCell(row[h]); }).join(','));
    });
    return lines.join('\r\n');
  }

  function downloadCSV(filename, csvStr) {
    var blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function downloadJSON(filename, obj) {
    var jsonStr = JSON.stringify(obj, null, 2);
    var blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ── Toast notifications ────────────────────────────────────────────────────
  var _toastContainer = null;

  function _getToastContainer() {
    if (!_toastContainer || !document.body.contains(_toastContainer)) {
      _toastContainer = document.createElement('div');
      _toastContainer.id = 'ea-toast-container';
      _toastContainer.style.cssText = [
        'position:fixed',
        'bottom:24px',
        'right:24px',
        'z-index:99999',
        'display:flex',
        'flex-direction:column',
        'gap:8px',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(_toastContainer);
    }
    return _toastContainer;
  }

  function showToast(message, type) {
    type = type || 'info';
    var colorMap = {
      success: '#22c55e',
      error:   '#ef4444',
      info:    '#3b82f6'
    };
    var bg = colorMap[type] || colorMap.info;

    var toast = document.createElement('div');
    toast.style.cssText = [
      'background:' + bg,
      'color:#fff',
      'padding:12px 20px',
      'border-radius:8px',
      'font-size:14px',
      'font-family:sans-serif',
      'box-shadow:0 4px 12px rgba(0,0,0,0.25)',
      'opacity:0',
      'transition:opacity 0.3s ease',
      'pointer-events:none',
      'max-width:320px',
      'word-break:break-word'
    ].join(';');
    toast.textContent = message;

    var container = _getToastContainer();
    container.appendChild(toast);

    // Fade in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.opacity = '1';
      });
    });

    // Auto-remove after 3s
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // ── Expose ─────────────────────────────────────────────────────────────────
  window.Utils = {
    generateId: generateId,
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    formatRelativeTime: formatRelativeTime,
    slugify: slugify,
    truncate: truncate,
    debounce: debounce,
    deepClone: deepClone,
    groupBy: groupBy,
    sortBy: sortBy,
    toCSV: toCSV,
    downloadCSV: downloadCSV,
    downloadJSON: downloadJSON,
    showToast: showToast
  };

})();
