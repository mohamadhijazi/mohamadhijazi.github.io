/**
 * metamodel.js — CSV parser + metamodel registry for EA Tool
 * Exposes window.MetaModel as a global namespace (no ES modules)
 */
(function () {
  'use strict';

  // ── Domain groupings ───────────────────────────────────────────────────────
  var DOMAINS = {
    Organization: ['OrgaUnit', 'Person', 'UserGroup', 'VirtualOrgaUnit', 'OrganizationGroup'],
    Strategy:     ['Domain', 'BusinessCapability', 'Goal', 'BusinessCapabilityMap', 'DomainGroup', 'ITStrategy'],
    Processes:    ['BusinessProcess', 'BFActivity', 'BFEvent', 'BFGateway', 'BusinessProcessModel', 'BusinessProcessGroup', 'BusinessFunction', 'BusinessService'],
    Solutions:    ['SolutionComponent', 'SolutionBusinessSupport', 'SolutionApplication', 'SolutionDomain', 'SystemBuildingBlock'],
    Applications: ['Application', 'ApplicationGroup', 'Component', 'ComponentGroup', 'FunctionalModule'],
    Integrations: ['InformationFlow', 'InterfaceSystem', 'IntegrationConnectionDetails', 'ProposedInformationFlow'],
    Technology:   ['Technology', 'TechnologyGroup', 'StandardPlatform', 'StandardPlatformCategory', 'PlatformLayer'],
    Reports:      []
  };

  // ── BOM-safe CSV parser ────────────────────────────────────────────────────
  /**
   * Parses CSV text into an array of row objects keyed by header names.
   * Handles:
   *  - UTF-8 BOM removal
   *  - \r\n and \n line endings
   *  - Quoted fields (fields wrapped in "")
   *  - Embedded commas inside quotes
   *  - Escaped quotes ("" inside quotes = literal ")
   *  - Empty lines (skipped)
   */
  function parseCSV(text) {
    // Remove UTF-8 BOM
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }

    // Normalize line endings
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    var lines = text.split('\n');
    var result = [];
    var headers = null;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.trim() === '') continue; // skip empty lines

      var fields = _parseCsvLine(line);

      if (headers === null) {
        headers = fields;
        continue;
      }

      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = fields[j] !== undefined ? fields[j] : '';
      }
      result.push(row);
    }

    return result;
  }

  /**
   * Parses a single CSV line into an array of string field values.
   * Handles quoted fields, embedded commas and escaped quotes.
   */
  function _parseCsvLine(line) {
    var fields = [];
    var i = 0;
    var len = line.length;

    while (i <= len) {
      if (i === len) {
        // End of line reached — push empty field only if we haven't started
        // (handles trailing comma case)
        if (fields.length === 0 || line[i - 1] === ',') {
          fields.push('');
        }
        break;
      }

      if (line[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        var field = '';
        while (i < len) {
          if (line[i] === '"') {
            if (i + 1 < len && line[i + 1] === '"') {
              // Escaped quote
              field += '"';
              i += 2;
            } else {
              // Closing quote
              i++;
              break;
            }
          } else {
            field += line[i];
            i++;
          }
        }
        fields.push(field);
        // Skip comma separator
        if (i < len && line[i] === ',') i++;
      } else {
        // Unquoted field — read until next comma
        var start = i;
        while (i < len && line[i] !== ',') {
          i++;
        }
        fields.push(line.slice(start, i));
        if (i < len) i++; // skip comma
      }
    }

    return fields;
  }

  // ── Built-in metamodel (derived from MetaModel.csv as inspiration) ─────────
  // The app does not depend on MetaModel.csv at runtime. This registry is the
  // authoritative in-memory catalogue of classes, captions and relations.
  var BUILTIN_CLASSES = [
    { id: 'OrgaUnit',              caption: 'Organization Unit',           domain: 'Organization' },
    { id: 'Person',                caption: 'Person',                      domain: 'Organization' },
    { id: 'UserGroup',             caption: 'User Group',                  domain: 'Organization' },
    { id: 'OrganizationGroup',     caption: 'Organization Group',          domain: 'Organization' },
    { id: 'VirtualOrgaUnit',       caption: 'Virtual Organization',        domain: 'Organization' },
    { id: 'Domain',                caption: 'Domain',                      domain: 'Strategy' },
    { id: 'BusinessCapability',    caption: 'Business Capability',         domain: 'Strategy' },
    { id: 'Goal',                  caption: 'Goal',                        domain: 'Strategy' },
    { id: 'BusinessCapabilityMap', caption: 'Capability Map',              domain: 'Strategy' },
    { id: 'ITStrategy',            caption: 'IT Strategy',                 domain: 'Strategy' },
    { id: 'BusinessProcess',       caption: 'Business Process',            domain: 'Processes' },
    { id: 'BFActivity',            caption: 'Activity',                    domain: 'Processes' },
    { id: 'BFEvent',               caption: 'Event',                       domain: 'Processes' },
    { id: 'BFGateway',             caption: 'Gateway',                     domain: 'Processes' },
    { id: 'BusinessProcessModel',  caption: 'Business Process Model',      domain: 'Processes' },
    { id: 'BusinessFunction',      caption: 'Business Function',           domain: 'Processes' },
    { id: 'BusinessService',       caption: 'Business Service',            domain: 'Processes' },
    { id: 'SolutionComponent',     caption: 'Solution Component',          domain: 'Solutions' },
    { id: 'SolutionApplication',   caption: 'Solution Application',        domain: 'Solutions' },
    { id: 'SolutionDomain',        caption: 'Solution Domain',             domain: 'Solutions' },
    { id: 'SystemBuildingBlock',   caption: 'Solution Building Block',     domain: 'Solutions' },
    { id: 'Application',           caption: 'Application',                 domain: 'Applications' },
    { id: 'ApplicationGroup',      caption: 'Application Group',           domain: 'Applications' },
    { id: 'Component',             caption: 'Component',                   domain: 'Applications' },
    { id: 'ComponentGroup',        caption: 'Component Group',             domain: 'Applications' },
    { id: 'FunctionalModule',      caption: 'Functional Module',           domain: 'Applications' },
    { id: 'InformationFlow',       caption: 'Information Flow',            domain: 'Integrations' },
    { id: 'IntegrationConnectionDetails', caption: 'Integration Connection Detail', domain: 'Integrations' },
    { id: 'ProposedInformationFlow', caption: 'Proposed Information Flow', domain: 'Integrations' },
    { id: 'Technology',            caption: 'Technology',                  domain: 'Technology' },
    { id: 'TechnologyGroup',       caption: 'Technology Group',            domain: 'Technology' },
    { id: 'StandardPlatform',      caption: 'Standard Platform',           domain: 'Technology' },
    { id: 'PlatformLayer',         caption: 'Platform Layer',              domain: 'Technology' }
  ];

  var BUILTIN_RELATIONS = [
    { source: 'OrgaUnit', target: 'Person', relation: 'ResponsibleUser', caption: 'Responsible User', cardinality: '1/N', hint: 'The user who owns the object.' },
    { source: 'OrgaUnit', target: 'UserGroup', relation: 'ResponsibleUserGroups', caption: 'Responsible User Groups', cardinality: 'N/N', hint: 'User groups with access permissions.' },
    { source: 'BusinessCapability', target: 'Person', relation: 'ResponsibleUser', caption: 'Responsible User', cardinality: '1/N', hint: 'Capability owner.' },
    { source: 'BusinessProcess', target: 'Person', relation: 'ResponsibleUser', caption: 'Responsible User', cardinality: '1/N', hint: 'Process owner.' },
    { source: 'Application', target: 'Person', relation: 'ResponsibleUser', caption: 'Responsible User', cardinality: '1/N', hint: 'Application owner.' },
    { source: 'Application', target: 'Technology', relation: 'RunsOn', caption: 'Runs On', cardinality: '1/N', hint: 'Technology the application runs on.' },
    { source: 'Application', target: 'Application', relation: 'DependsOn', caption: 'Depends On', cardinality: 'N/N', hint: 'Application-to-application dependency.' },
    { source: 'Component', target: 'Application', relation: 'BelongsTo', caption: 'Belongs To', cardinality: 'N/1', hint: 'Parent application.' },
    { source: 'InformationFlow', target: 'Application', relation: 'SourceApplication', caption: 'Source Application', cardinality: '1/N', hint: 'Application originating the flow.' },
    { source: 'InformationFlow', target: 'Application', relation: 'TargetApplication', caption: 'Target Application', cardinality: '1/N', hint: 'Application receiving the flow.' },
    { source: 'SolutionApplication', target: 'Application', relation: 'Realizes', caption: 'Realizes', cardinality: 'N/N', hint: 'Application realizing the solution.' },
    { source: 'BusinessProcess', target: 'Application', relation: 'SupportedBy', caption: 'Supported By', cardinality: 'N/N', hint: 'Application supporting the process.' },
    { source: 'Technology', target: 'TechnologyGroup', relation: 'BelongsTo', caption: 'Belongs To', cardinality: 'N/1', hint: 'Technology group.' }
  ];

  // ── MetaModel registry ─────────────────────────────────────────────────────
  var MetaModel = {
    classes: new Map(),
    relations: [],
    loaded: false,
    error: null,

    /**
     * Initializes the metamodel from the built-in catalogue.
     * MetaModel.csv is inspiration only and is NOT required at runtime.
     * @returns {Promise} resolves immediately
     */
    load: function () {
      return new Promise(function (resolve, reject) {
        try {
          const customClasses = Storage.getMetaClasses ? Storage.getMetaClasses() : {};
          const customRelations = Storage.getMetaRelations ? Storage.getMetaRelations() : [];

          const useBuiltIn = Object.keys(customClasses).length === 0;

          const classesToLoad = useBuiltIn ? BUILTIN_CLASSES : Object.values(customClasses);
          const relationsToLoad = useBuiltIn ? BUILTIN_RELATIONS : customRelations;

          MetaModel.classes = new Map();
          MetaModel.relations = [];

          for (var i = 0; i < classesToLoad.length; i++) {
            var cls = classesToLoad[i];
            if (!cls || !cls.id) continue;
            MetaModel.classes.set(cls.id, {
              id: cls.id,
              caption: cls.caption || cls.id,
              domain: cls.domain || 'Other',
              relations: []
            });
          }

          for (var j = 0; j < relationsToLoad.length; j++) {
            var rel = relationsToLoad[j];
            if (!rel) continue;
            var relObj = {
              source: rel.source,
              target: rel.target,
              relation: rel.relation,
              caption: rel.caption || rel.relation,
              cardinality: rel.cardinality || '',
              hint: rel.hint || ''
            };
            MetaModel.relations.push(relObj);
            var src = MetaModel.classes.get(rel.source);
            if (src) src.relations.push(relObj);
          }

          MetaModel.loaded = true;
          MetaModel.error = null;
          resolve(MetaModel);
        } catch (err) {
          MetaModel.error = err.message || String(err);
          reject(MetaModel.error);
        }
      });
    },

    /** Returns class entry or null */
    getClass: function (id) {
      return MetaModel.classes.get(id) || null;
    },

    /** Returns all class entries sorted by caption */
    getAllClasses: function () {
      var arr = [];
      MetaModel.classes.forEach(function (cls) { arr.push(cls); });
      return arr.sort(function (a, b) {
        return a.caption.localeCompare(b.caption);
      });
    },

    /** Returns relations array where source === classId */
    getRelationsFrom: function (classId) {
      var cls = MetaModel.classes.get(classId);
      return cls ? cls.relations : [];
    },

    /** Returns relations array where target === classId */
    getRelationsTo: function (classId) {
      return MetaModel.relations.filter(function (r) {
        return r.target === classId;
      });
    },

    /** Returns domain name for a classId, or 'Other' */
    getDomain: function (classId) {
      var keys = Object.keys(DOMAINS);
      for (var i = 0; i < keys.length; i++) {
        if (DOMAINS[keys[i]].indexOf(classId) !== -1) {
          return keys[i];
        }
      }
      return 'Other';
    },

    /** Returns array of class entries that belong to a given domain */
    getClassesForDomain: function (domainName) {
      var ids = DOMAINS[domainName];
      if (!ids) return [];
      return ids
        .map(function (id) { return MetaModel.classes.get(id) || null; })
        .filter(function (cls) { return cls !== null; });
    },

    /** Returns the DOMAINS constant object */
    getDomains: function () {
      return DOMAINS;
    },

    /** Returns human-readable caption for a class, falling back to classId */
    getCaptionForClass: function (classId) {
      var cls = MetaModel.classes.get(classId);
      return cls ? cls.caption : classId;
    }
  };

  // ── Expose ─────────────────────────────────────────────────────────────────
  window.MetaModel = MetaModel;

  // Also expose the CSV parser in case other modules need it
  window.parseCSV = parseCSV;

})();