/**
 * storage.js — localStorage data layer for EA Tool
 * Exposes window.Storage as a global namespace (no ES modules)
 * Depends on: utils.js (window.Utils)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ea_tool_v1';
  var CURRENT_VERSION = 1;

  /** In-memory store reference */
  var _store = null;

  // ── Default structure ──────────────────────────────────────────────────────
  function _defaultStore() {
    return {
      version: CURRENT_VERSION,
      records: {},
      relations: {},
      studio: {},
      metamodel: { classes: {}, relations: [] },
      pages: {}
    };
  }

  // ── Persistence ────────────────────────────────────────────────────────────
  function _load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('[Storage] Failed to load from localStorage:', e);
      return null;
    }
  }

  function _save(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store || _store));
    } catch (e) {
      console.error('[Storage] Failed to save to localStorage:', e);
    }
  }

  // ── Migration ──────────────────────────────────────────────────────────────
  function _migrate(data) {
    // Currently a no-op — version 1 is the initial version.
    // Future migrations: if (data.version < 2) { ... data.version = 2; }
    data.version = CURRENT_VERSION;
    return data;
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    var data = _load();
    if (!data || typeof data !== 'object') {
      _store = _defaultStore();
    } else {
      // Ensure all top-level keys exist (in case store predates a new key)
      var defaults = _defaultStore();
      Object.keys(defaults).forEach(function (k) {
        if (data[k] === undefined || data[k] === null) {
          data[k] = defaults[k];
        }
      });
      _store = _migrate(data);
    }
    _save();
    return _store;
  }

  // ── Read-all / export / import ─────────────────────────────────────────────
  function getAll() {
    return _store;
  }

  function exportAll() {
    window.Utils.downloadJSON('ea-tool-export.json', _store);
  }

  function importAll(jsonStr) {
    try {
      var data = JSON.parse(jsonStr);
      if (typeof data !== 'object' || data === null) return false;
      // Basic structural validation
      var required = ['version', 'records', 'relations', 'studio'];
      for (var i = 0; i < required.length; i++) {
        if (data[required[i]] === undefined) return false;
      }
      _store = _migrate(data);
      _save();
      return true;
    } catch (e) {
      console.error('[Storage] importAll failed:', e);
      return false;
    }
  }

  // ── Records ────────────────────────────────────────────────────────────────
  function saveRecord(classId, record) {
    if (!_store.records[classId]) {
      _store.records[classId] = {};
    }
    _store.records[classId][record.id] = record;
    _save();
  }

  function getRecord(classId, id) {
    if (!_store.records[classId]) return null;
    return _store.records[classId][id] || null;
  }

  function getRecords(classId) {
    if (!_store.records[classId]) return [];
    return Object.values(_store.records[classId]);
  }

  function deleteRecord(classId, id) {
    // Remove the record itself
    if (_store.records[classId]) {
      delete _store.records[classId][id];
    }

    // Remove all relations where this record is the source
    var sourceKey = classId + '_' + id;
    delete _store.relations[sourceKey];

    // Remove all relations where this record is a target
    Object.keys(_store.relations).forEach(function (key) {
      _store.relations[key] = _store.relations[key].filter(function (rel) {
        return !(rel.targetClass === classId && rel.targetId === id);
      });
      if (_store.relations[key].length === 0) {
        delete _store.relations[key];
      }
    });

    _save();
  }

  // ── Relations ──────────────────────────────────────────────────────────────
  function saveRelation(sourceClass, sourceId, relName, targetClass, targetId) {
    var key = sourceClass + '_' + sourceId;
    if (!_store.relations[key]) {
      _store.relations[key] = [];
    }
    // Avoid duplicates
    var exists = _store.relations[key].some(function (r) {
      return r.relName === relName && r.targetClass === targetClass && r.targetId === targetId;
    });
    if (!exists) {
      _store.relations[key].push({ relName: relName, relation: relName, targetClass: targetClass, targetId: targetId });
      _save();
    }
  }

  function getRelations(sourceClass, sourceId) {
    var key = sourceClass + '_' + sourceId;
    return _store.relations[key] || [];
  }

  function deleteRelation(sourceClass, sourceId, relName, targetClass, targetId) {
    var key = sourceClass + '_' + sourceId;
    if (!_store.relations[key]) return;
    _store.relations[key] = _store.relations[key].filter(function (r) {
      return !(r.relName === relName && r.targetClass === targetClass && r.targetId === targetId);
    });
    if (_store.relations[key].length === 0) {
      delete _store.relations[key];
    }
    _save();
  }

  function deleteRelationsForRecord(sourceClass, sourceId, relName) {
    var key = sourceClass + '_' + sourceId;
    if (!_store.relations[key]) return;
    if (relName) {
      _store.relations[key] = _store.relations[key].filter(function (r) {
        return (r.relName !== relName && r.relation !== relName);
      });
    } else {
      delete _store.relations[key];
    }
    if (_store.relations[key] && _store.relations[key].length === 0) {
      delete _store.relations[key];
    }
    _save();
  }

  function getRelationsTo(targetClass, targetId) {
    var results = [];
    Object.keys(_store.relations).forEach(function (key) {
      _store.relations[key].forEach(function (rel) {
        if (rel.targetClass === targetClass && rel.targetId === targetId) {
          // Parse source from key: "<sourceClass>_<sourceId>"
          var underscoreIdx = key.indexOf('_');
          var sourceClassKey = underscoreIdx >= 0 ? key.substring(0, underscoreIdx) : key;
          var sourceIdKey = underscoreIdx >= 0 ? key.substring(underscoreIdx + 1) : '';
          results.push({
            sourceKey: key,
            sourceClass: sourceClassKey,
            sourceId: sourceIdKey,
            relName: rel.relName || rel.relation,
            targetClass: rel.targetClass,
            targetId: rel.targetId
          });
        }
      });
    });
    return results;
  }

  function getIncomingRelations(targetClass, targetId) {
    return getRelationsTo(targetClass, targetId);
  }

  // ── Metamodel (custom classes & relations) ───────────────────────────────────
  function getMetaClasses() {
    const store = _load();
    return (store.metamodel && store.metamodel.classes) || {};
  }

  function saveMetaClass(classData) {
    const store = _load();
    if (!store.metamodel) store.metamodel = { classes: {}, relations: [] };
    if (!classData.id) classData.id = `class-${Date.now()}`;
    store.metamodel.classes[classData.id] = classData;
    _save(store);
    return classData.id;
  }

  function deleteMetaClass(classId) {
    const store = _load();
    if (store.metamodel && store.metamodel.classes && store.metamodel.classes[classId]) {
      delete store.metamodel.classes[classId];
      // Also remove any relations involving this class
      store.metamodel.relations = store.metamodel.relations.filter(rel => rel.source !== classId && rel.target !== classId);
      _save(store);
    }
  }

  function getMetaRelations() {
    const store = _load();
    return (store.metamodel && store.metamodel.relations) || [];
  }

  function saveMetaRelation(relationData) {
    const store = _load();
    if (!store.metamodel) store.metamodel = { classes: {}, relations: [] };
    // If editing, find and update; otherwise, push new
    const existingIndex = store.metamodel.relations.findIndex(r => r.source === relationData.source && r.target === relationData.target && r.relation === relationData.relation);
    if (existingIndex > -1) {
      store.metamodel.relations[existingIndex] = relationData;
    } else {
      store.metamodel.relations.push(relationData);
    }
    _save(store);
  }

  function deleteMetaRelation(relationData) {
    const store = _load();
    if (store.metamodel && store.metamodel.relations) {
      store.metamodel.relations = store.metamodel.relations.filter(r => {
        return !(r.source === relationData.source && r.target === relationData.target && r.relation === relationData.relation);
      });
      _save(store);
    }
  }

  // ── Custom Pages ───────────────────────────────────────────────────────────
  function getPages() {
    const store = _load();
    return (store.pages) || {};
  }

  function savePage(pageData) {
    const store = _load();
    if (!store.pages) store.pages = {};
    if (!pageData.id) pageData.id = `page-${Date.now()}`;
    store.pages[pageData.id] = pageData;
    _save(store);
    return pageData.id;
  }

  function deletePage(pageId) {
    const store = _load();
    if (store.pages && store.pages[pageId]) {
      delete store.pages[pageId];
      _save(store);
    }
  }

  // ── Studio (custom properties) ─────────────────────────────────────────────
  function saveCustomProp(classId, prop) {
    if (!_store.studio[classId]) {
      _store.studio[classId] = {};
    }
    _store.studio[classId][prop.key] = prop;
    _save();
  }

  function getCustomProps(classId) {
    if (!_store.studio[classId]) return [];
    return Object.values(_store.studio[classId]);
  }

  function deleteCustomProp(classId, propKey) {
    if (!_store.studio[classId]) return;
    delete _store.studio[classId][propKey];
    _save();
  }

  // ── Expose ─────────────────────────────────────────────────────────────────
  window.Storage = {
    STORAGE_KEY: STORAGE_KEY,
    CURRENT_VERSION: CURRENT_VERSION,

    init: init,
    _load: _load,
    _save: _save,
    _migrate: _migrate,

    getAll: getAll,
    exportAll: exportAll,
    importAll: importAll,

    saveRecord: saveRecord,
    getRecord: getRecord,
    getRecords: getRecords,
    deleteRecord: deleteRecord,

    saveRelation: saveRelation,
    getRelations: getRelations,
    deleteRelation: deleteRelation,
    deleteRelationsForRecord: deleteRelationsForRecord,
    getRelationsTo: getRelationsTo,
    getIncomingRelations: getIncomingRelations,

    getMetaClasses: getMetaClasses,
    saveMetaClass: saveMetaClass,
    deleteMetaClass: deleteMetaClass,
    getMetaRelations: getMetaRelations,
    saveMetaRelation: saveMetaRelation,
    deleteMetaRelation: deleteMetaRelation,

    getPages: getPages,
    savePage: savePage,
    deletePage: deletePage,

    saveCustomProp: saveCustomProp,
    getCustomProps: getCustomProps,
    deleteCustomProp: deleteCustomProp,

    getCharts: function () {
      var store = _load();
      return store.charts || {};
    },

    saveChart: function (chartData) {
      var store = _load();
      if (!store.charts) store.charts = {};
      if (!chartData.id) chartData.id = `chart-${Date.now()}`;
      store.charts[chartData.id] = chartData;
      _save(store);
      return chartData.id;
    },

    deleteChart: function (chartId) {
      var store = _load();
      if (store.charts && store.charts[chartId]) {
        delete store.charts[chartId];
        _save(store);
      }
    }
  };

})();