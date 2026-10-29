/**
 * sample-data.js — Seed/demo data for EA Tool
 * Depends on: utils, storage, records, metamodel
 * Exposes window.SampleData
 *
 * These are clearly-marked demo records so business users can explore the
 * workspace immediately. They are stored in localStorage just like user data,
 * but flagged with _isSample = true so they can be distinguished/cleared.
 */
(function () {
  'use strict';

  var SampleData = {};

  // ── Seed records per class ────────────────────────────────────────────
  var SEED = {
    OrgaUnit: [
      { name: 'Corporate Headquarters', description: 'Global headquarters and executive leadership.', status: 'Active' },
      { name: 'North America Region', description: 'Regional operations covering US and Canada.', status: 'Active' },
      { name: 'EMEA Region', description: 'Europe, Middle East and Africa operations.', status: 'Active' },
      { name: 'APAC Region', description: 'Asia-Pacific operations.', status: 'Active' },
      { name: 'Finance Department', description: 'Corporate finance, budgeting and accounting.', status: 'Active' },
      { name: 'Human Resources', description: 'People operations, recruitment and talent.', status: 'Active' },
      { name: 'IT Department', description: 'Information technology and infrastructure.', status: 'Active' }
    ],
    Person: [
      { name: 'Sarah Chen', description: 'Chief Executive Officer.', status: 'Active' },
      { name: 'Marcus Reed', description: 'Chief Technology Officer.', status: 'Active' },
      { name: 'Elena Vasquez', description: 'Enterprise Architect.', status: 'Active' },
      { name: 'David Kim', description: 'Head of Application Portfolio.', status: 'Active' },
      { name: 'Priya Nair', description: 'Business Process Analyst.', status: 'Active' },
      { name: 'Omar Hassan', description: 'Infrastructure Lead.', status: 'Active' }
    ],
    Domain: [
      { name: 'Customer Experience', description: 'Strategic domain focused on customer-facing capabilities.', status: 'Active' },
      { name: 'Operational Excellence', description: 'Internal process efficiency and automation.', status: 'Active' },
      { name: 'Digital Transformation', description: 'Modernizing legacy systems and digital channels.', status: 'Active' },
      { name: 'Risk & Compliance', description: 'Governance, risk management and regulatory compliance.', status: 'Active' }
    ],
    BusinessCapability: [
      { name: 'Order Management', description: 'End-to-end customer order capture and fulfillment.', status: 'Active' },
      { name: 'Customer Relationship Management', description: 'Managing customer interactions and data.', status: 'Active' },
      { name: 'Financial Planning & Analysis', description: 'Budgeting, forecasting and financial reporting.', status: 'Active' },
      { name: 'Identity & Access Management', description: 'User authentication and authorization.', status: 'Active' }
    ],
    BusinessProcess: [
      { name: 'Order to Cash', description: 'Process from customer order receipt to payment collection.', status: 'Active' },
      { name: 'Procure to Pay', description: 'Process from requisition to supplier payment.', status: 'Active' },
      { name: 'Hire to Retire', description: 'Employee lifecycle from onboarding to offboarding.', status: 'Active' },
      { name: 'Issue to Resolution', description: 'Customer support issue intake through resolution.', status: 'Draft' }
    ],
    Application: [
      { name: 'CRM Platform', description: 'Customer relationship management system.', status: 'Active' },
      { name: 'ERP Core', description: 'Enterprise resource planning and finance.', status: 'Active' },
      { name: 'HRIS', description: 'Human resources information system.', status: 'Active' },
      { name: 'E-commerce Storefront', description: 'Customer-facing online sales channel.', status: 'Active' },
      { name: 'Legacy Mainframe', description: 'Legacy transaction processing system.', status: 'Archived' }
    ],
    Technology: [
      { name: 'Amazon Web Services', description: 'Public cloud infrastructure platform.', status: 'Active' },
      { name: 'Microsoft Azure', description: 'Cloud platform and services.', status: 'Active' },
      { name: 'Oracle Database', description: 'Enterprise relational database.', status: 'Active' },
      { name: 'Kubernetes Cluster', description: 'Container orchestration platform.', status: 'Active' },
      { name: 'Cisco Network', description: 'Enterprise network infrastructure.', status: 'Active' }
    ],
    Component: [
      { name: 'Payment Gateway', description: 'Third-party payment processing integration.', status: 'Active' },
      { name: 'Identity Provider', description: 'SAML/OIDC authentication service.', status: 'Active' },
      { name: 'Reporting Engine', description: 'Analytics and report generation.', status: 'Active' }
    ],
    InformationFlow: [
      { name: 'Customer Data Sync', description: 'Synchronizes customer records between CRM and ERP.', status: 'Active' },
      { name: 'Order Fulfillment Feed', description: 'Sends orders to warehouse management system.', status: 'Active' },
      { name: 'Payroll Export', description: 'Exports payroll data to external provider.', status: 'Active' }
    ]
  };

  // ── Sample relationships (source → target) ────────────────────────────
  // Format: [sourceClass, sourceName, relName, targetClass, targetName]
  var SEED_RELATIONS = [
    ['OrgaUnit', 'North America Region', 'ResponsibleUser', 'Person', 'David Kim'],
    ['OrgaUnit', 'Finance Department', 'ResponsibleUser', 'Person', 'Marcus Reed'],
    ['OrgaUnit', 'IT Department', 'ResponsibleUser', 'Person', 'Omar Hassan'],
    ['BusinessCapability', 'Order Management', 'ResponsibleUser', 'Person', 'David Kim'],
    ['BusinessCapability', 'Identity & Access Management', 'ResponsibleUser', 'Person', 'Elena Vasquez'],
    ['BusinessProcess', 'Order to Cash', 'ResponsibleUser', 'Person', 'Priya Nair'],
    ['BusinessProcess', 'Procure to Pay', 'ResponsibleUser', 'Person', 'Priya Nair'],
    ['Application', 'CRM Platform', 'ResponsibleUser', 'Person', 'Sarah Chen'],
    ['Application', 'ERP Core', 'ResponsibleUser', 'Person', 'Marcus Reed'],
    ['Application', 'Legacy Mainframe', 'ResponsibleUser', 'Person', 'Omar Hassan'],
    ['Application', 'CRM Platform', 'InformationFlow', 'InformationFlow', 'Customer Data Sync'],
    ['Application', 'ERP Core', 'InformationFlow', 'InformationFlow', 'Customer Data Sync'],
    ['Application', 'E-commerce Storefront', 'InformationFlow', 'InformationFlow', 'Order Fulfillment Feed'],
    ['Technology', 'Amazon Web Services', 'ResponsibleUser', 'Person', 'Omar Hassan'],
    ['Component', 'Payment Gateway', 'ResponsibleUser', 'Person', 'Elena Vasquez']
  ];

  // ── Find record id by class + name ────────────────────────────────────
  function _findRecordId(classId, name) {
    var recs = Storage.getRecords(classId) || [];
    for (var i = 0; i < recs.length; i++) {
      if (recs[i].name === name) return recs[i].id;
    }
    return null;
  }

  // ── Seed ──────────────────────────────────────────────────────────────
  SampleData.seed = function () {
    // Only seed if the store is empty (no records at all)
    var anyRecords = false;
    var allClasses = MetaModel.getAllClasses();
    for (var i = 0; i < allClasses.length; i++) {
      if (Storage.getRecords(allClasses[i].id).length > 0) {
        anyRecords = true;
        break;
      }
    }
    if (anyRecords) return false; // data already present

    var createdIds = {}; // classId -> name -> id

    // Create records
    Object.keys(SEED).forEach(function (classId) {
      createdIds[classId] = {};
      SEED[classId].forEach(function (data) {
        var rec = Records.create(classId, data);
        rec._isSample = true;
        Storage.saveRecord(classId, rec);
        createdIds[classId][data.name] = rec.id;
      });
    });

    // Create relationships
    SEED_RELATIONS.forEach(function (rel) {
      var srcClass = rel[0], srcName = rel[1], relName = rel[2];
      var tgtClass = rel[3], tgtName = rel[4];
      var srcId = createdIds[srcClass] && createdIds[srcClass][srcName];
      var tgtId = createdIds[tgtClass] && createdIds[tgtClass][tgtName];
      if (srcId && tgtId) {
        Storage.saveRelation(srcClass, srcId, relName, tgtClass, tgtId);
      }
    });

    Utils.showToast('Sample data seeded. Records marked as demo.', 'info');
    return true;
  };

  // ── Clear sample data ─────────────────────────────────────────────────
  SampleData.clearSample = function () {
    var removed = 0;
    var allClasses = MetaModel.getAllClasses();
    for (var i = 0; i < allClasses.length; i++) {
      var classId = allClasses[i].id;
      var recs = Storage.getRecords(classId);
      for (var j = 0; j < recs.length; j++) {
        if (recs[j]._isSample) {
          Records['delete'](classId, recs[j].id);
          removed++;
        }
      }
    }
    Utils.showToast('Cleared ' + removed + ' sample records.', 'success');
    return removed;
  };

  window.SampleData = SampleData;

})();
