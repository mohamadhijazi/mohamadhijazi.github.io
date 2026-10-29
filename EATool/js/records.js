/**
 * records.js — CRUD operations for EA Tool records
 * Depends on: Utils, Storage, MetaModel (loaded before this script)
 * Exposes window.Records as a global namespace
 */
(function () {
  'use strict';

  /**
   * create(classId, data)
   * Creates a new record for the given class, assigns metadata fields, persists it.
   */
  function create(classId, data) {
    var now = new Date().toISOString();
    var record = {};
    // Merge caller data first so our system fields win
    var keys = Object.keys(data || {});
    for (var i = 0; i < keys.length; i++) {
      record[keys[i]] = data[keys[i]];
    }
    record.id         = Utils.generateId();
    record.createdAt  = now;
    record.updatedAt  = now;
    record._classId   = classId;
    Storage.saveRecord(classId, record);
    return record;
  }

  /**
   * update(classId, id, data)
   * Loads the existing record, merges new data, updates updatedAt, persists.
   */
  function update(classId, id, data) {
    var existing = Storage.getRecord(classId, id);
    if (!existing) {
      throw new Error('Record not found: ' + classId + '/' + id);
    }
    var keys = Object.keys(data || {});
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      // Protect immutable system fields
      if (k === 'id' || k === 'createdAt' || k === '_classId') continue;
      existing[k] = data[k];
    }
    existing.updatedAt = new Date().toISOString();
    Storage.saveRecord(classId, existing);
    return existing;
  }

  /**
   * deleteRecord(classId, id)
   * Removes the record from storage. Returns true on success.
   */
  function deleteRecord(classId, id) {
    Storage.deleteRecord(classId, id);
    return true;
  }

  /**
   * search(classId, query)
   * Returns records whose any string value contains the query (case-insensitive).
   */
  function search(classId, query) {
    var records = Storage.getRecords(classId);
    if (!query || !query.trim()) return records;
    var q = query.trim().toLowerCase();
    return records.filter(function (record) {
      var values = Object.values(record);
      for (var i = 0; i < values.length; i++) {
        if (typeof values[i] === 'string' && values[i].toLowerCase().indexOf(q) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  /**
   * list(classId, filters)
   * Returns records filtered and sorted by the supplied filter object.
   * filters: { status, search, sortBy, sortDir }
   * Defaults: sortBy='createdAt', sortDir='desc'
   */
  function list(classId, filters) {
    filters = filters || {};
    var records = Storage.getRecords(classId);

    // Status filter
    if (filters.status && filters.status !== 'All') {
      var statusFilter = filters.status;
      records = records.filter(function (r) { return r.status === statusFilter; });
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      var q = filters.search.trim().toLowerCase();
      records = records.filter(function (record) {
        var values = Object.values(record);
        for (var i = 0; i < values.length; i++) {
          if (typeof values[i] === 'string' && values[i].toLowerCase().indexOf(q) !== -1) {
            return true;
          }
        }
        return false;
      });
    }

    // Sort
    var sortBy  = filters.sortBy  || 'createdAt';
    var sortDir = filters.sortDir || 'desc';
    records = Utils.sortBy(records, sortBy, sortDir);

    return records;
  }

  /**
   * getWithRelations(classId, id)
   * Returns { record, relations: [{ relName, targetClass, targetId, targetRecord }] }
   */
  function getWithRelations(classId, id) {
    var record = Storage.getRecord(classId, id);
    if (!record) return null;

    var rawRelations = Storage.getRelations(classId, id) || [];
    var relations = [];

    for (var i = 0; i < rawRelations.length; i++) {
      var rel = rawRelations[i];
      var targetRecord = null;
      try {
        targetRecord = Storage.getRecord(rel.targetClass, rel.targetId);
      } catch (e) {
        // Target may have been deleted; leave as null
      }
      relations.push({
        relName:      rel.relName || rel.relation || '',
        targetClass:  rel.targetClass,
        targetId:     rel.targetId,
        targetRecord: targetRecord
      });
    }

    return { record: record, relations: relations };
  }

  /**
   * getAll(classId)
   * Returns all records for a class
   */
  function getAll(classId) {
    if (classId) {
      return Storage.getRecords(classId) || [];
    }
    var all = [];
    var classes = (MetaModel && MetaModel.getAllClasses) ? MetaModel.getAllClasses() : [];
    for (var i = 0; i < classes.length; i++) {
      var recs = Storage.getRecords(classes[i].id) || [];
      for (var j = 0; j < recs.length; j++) {
        all.push(recs[j]);
      }
    }
    return all;
  }

  // ── Expose ──────────────────────────────────────────────────────────────────
  function get(classId, id) {
    return Storage.getRecord(classId, id);
  }

  window.Records = {
    create:           create,
    update:           update,
    'delete':         deleteRecord,
    delete:           deleteRecord,
    remove:           deleteRecord,
    search:           search,
    list:             list,
    get:              get,
    getWithRelations: getWithRelations,
    getAll:           getAll
  };

})();
