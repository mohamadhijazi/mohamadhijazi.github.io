/**
 * Impact360 Command Center - Mock Data Generator & State Manager
 * Generates initial dataset according to specifications:
 * - 50 Employees, 20 Objectives, 30 Projects, 40 External Events, 25 Innovations, 100 Recognitions
 * - Geo Locations, Buildings, Floors, and Rooms Hierarchy with MetaModel Integration
 * Provides full CRUD operations and localStorage persistence.
 */

const ImpactData = (function () {
  const STORAGE_KEY = 'impact360_state_v2';

  const METAMODEL_DICTIONARY = {
    Economic: ['#oil_price', '#budget', '#inflation', '#interest_rate', '#stock_market', '#currency'],
    International: ['#UN', '#WHO', '#IMF', '#WorldBank', '#G20', '#GCC'],
    Weather: ['#rain', '#storm', '#sandstorm', '#flood', '#heatwave', '#earthquake'],
    Transportation: ['#airport', '#flight_delay', '#shipping', '#ports', '#supply_chain'],
    Cyber: ['#cyberattack', '#outage', '#ransomware', '#databreach'],
    Geopolitical: ['#conflict', '#war', '#sanctions', '#trade_restrictions', '#security'],
    Infrastructure: ['#datacenter', '#smart_facility', '#power_grid', '#clean_energy', '#critical_infrastructure']
  };

  const ALL_METAMODEL_TAGS = Object.values(METAMODEL_DICTIONARY).flat();

  const DEPARTMENTS = [
    'Digital Transformation',
    'Infrastructure & Transit',
    'Healthcare & Wellbeing',
    'Economic Growth & Energy',
    'Citizen Experience & Public Safety',
    'Environmental Strategy'
  ];

  const BADGES = [
    'Citizen Champion',
    'Innovator',
    'Team Builder',
    'Change Leader',
    'Execution Expert',
    'Collaboration Hero'
  ];

  const GAMIFICATION_LEVELS = [
    'Contributor',
    'Owner',
    'Leader',
    'Champion',
    'Government Innovator'
  ];

  const REGIONS = [
    { name: 'Central', centerLat: 24.7136, centerLng: 46.6753, radius: 180000, defaultRisk: 34 },
    { name: 'Eastern', centerLat: 26.4207, centerLng: 50.0888, radius: 160000, defaultRisk: 58 },
    { name: 'Western', centerLat: 21.5433, centerLng: 39.1728, radius: 170000, defaultRisk: 76 },
    { name: 'Northern', centerLat: 28.3835, centerLng: 36.5662, radius: 190000, defaultRisk: 42 },
    { name: 'Southern', centerLat: 18.2164, centerLng: 42.5053, radius: 150000, defaultRisk: 29 }
  ];

  // Helper random generator
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 1. Generate 50 Employees
  function generateEmployees() {
    const firstNames = ['Ahmed', 'Fatima', 'Mohammed', 'Sara', 'Tariq', 'Noura', 'Khalid', 'Laila', 'Omar', 'Hana', 'Youssef', 'Reem', 'Zaid', 'Mona', 'Fahad', 'Amal', 'Sultan', 'Yasmine', 'Bandar', 'Salma'];
    const lastNames = ['Al-Mansoor', 'Al-Zahrani', 'Al-Shehri', 'Al-Otaibi', 'Al-Ghamdi', 'Al-Dossari', 'Al-Harbi', 'Al-Qahtani', 'Al-Nasser', 'Al-Kahlani'];

    const employees = [];
    for (let i = 1; i <= 50; i++) {
      const fn = firstNames[(i - 1) % firstNames.length];
      const ln = lastNames[(i - 1) % lastNames.length];
      const name = `${fn} ${ln}`;
      employees.push({
        id: `EMP${String(i).padStart(3, '0')}`,
        name: name,
        title: i <= 6 ? 'Department Director' : (i <= 18 ? 'Senior Project Lead' : 'Strategy Consultant'),
        department: DEPARTMENTS[(i - 1) % DEPARTMENTS.length],
        ownershipScore: randomInt(75, 98),
        collaborationScore: randomInt(70, 96),
        innovationScore: randomInt(68, 95),
        citizenImpactScore: randomInt(72, 99),
        level: GAMIFICATION_LEVELS[i % GAMIFICATION_LEVELS.length],
        badges: [
          BADGES[i % BADGES.length],
          BADGES[(i + 2) % BADGES.length]
        ],
        avatar: `${fn[0]}${ln[0]}`
      });
    }
    return employees;
  }

  // 2. Generate 40 External Events
  function generateEvents() {
    const categories = [
      { cat: 'Economic', source: 'Central Bank', tags: ['#oil_price', '#budget', '#inflation'], icon: '💰' },
      { cat: 'OPEC', source: 'OPEC Sec.', tags: ['#oil_price', '#budget'], icon: '🛢️' },
      { cat: 'UN', source: 'UN Council', tags: ['#UN', '#security'], icon: '🌐' },
      { cat: 'WHO', source: 'WHO Advisory', tags: ['#WHO', '#health'], icon: '🏥' },
      { cat: 'Market', source: 'Global Markets', tags: ['#interest_rate', '#currency'], icon: '📈' },
      { cat: 'Weather', source: 'Meteorology Bureau', tags: ['#sandstorm', '#storm', '#heatwave'], icon: '🌪️' },
      { cat: 'Cyber', source: 'Cybersecurity Authority', tags: ['#cyberattack', '#outage', '#ransomware'], icon: '🛡️' },
      { cat: 'Transportation', source: 'Port & Rail Admin', tags: ['#flight_delay', '#ports', '#supply_chain'], icon: '🚢' },
      { cat: 'Geopolitical', source: 'Foreign Affairs', tags: ['#sanctions', '#trade_restrictions'], icon: '⚖️' },
      { cat: 'Government Policy', source: 'Cabinet Ministry', tags: ['#budget', '#policy'], icon: '📜' }
    ];

    const events = [];
    const eventTitles = [
      'Global Crude Oil Production Adjustment',
      'Severe Sandstorm Alert - Western Corridor',
      'Critical Infrastructure Ransomware Wave',
      'Port Logistics & Container Stagnation',
      'Interest Rate Hike Announcement',
      'Regional Heatwave Energy Grid Strain',
      'International Maritime Route Advisory',
      'WHO Emergency Health Directive Update',
      'Cross-Border Transit Tariff Shift',
      'National Cloud Infrastructure Outage Risk'
    ];

    for (let i = 1; i <= 40; i++) {
      const meta = categories[(i - 1) % categories.length];
      const region = REGIONS[(i - 1) % REGIONS.length];
      const lat = parseFloat((region.centerLat + (Math.random() * 1.2 - 0.6)).toFixed(4));
      const lng = parseFloat((region.centerLng + (Math.random() * 1.2 - 0.6)).toFixed(4));

      events.push({
        id: `EV${String(i).padStart(3, '0')}`,
        title: `${eventTitles[(i - 1) % eventTitles.length]} #${i}`,
        category: meta.cat,
        source: meta.source,
        severity: randomInt(2, 5),
        probability: parseFloat((Math.random() * 0.5 + 0.4).toFixed(2)),
        status: i % 7 === 0 ? 'Resolved' : 'Active',
        tags: [...meta.tags],
        region: region.name,
        lat: lat,
        lng: lng,
        icon: meta.icon
      });
    }
    return events;
  }

  // 3. Generate 30 Projects
  function generateProjects(employees, events) {
    const projectNames = [
      'Smart Permit Automation System',
      'Unified Citizen Healthcare Portal',
      'Corridor Transit Decarbonization',
      'Grid Energy Resilience Upgrade',
      'Autonomous Traffic Light Sync',
      'Municipal Waste-to-Energy Plant',
      'Public School Digital Classrooms',
      'Water Supply Desalination Expansion',
      'Port Customs AI Inspection Gate',
      'Emergency Response Drone Network'
    ];

    const projects = [];
    for (let i = 1; i <= 30; i++) {
      const owner = employees[(i - 1) % employees.length];
      const region = REGIONS[(i - 1) % REGIONS.length];
      const relatedEventIds = [
        events[(i - 1) % events.length].id,
        events[(i + 5) % events.length].id
      ];

      const lat = parseFloat((region.centerLat + (Math.random() * 0.8 - 0.4)).toFixed(4));
      const lng = parseFloat((region.centerLng + (Math.random() * 0.8 - 0.4)).toFixed(4));

      projects.push({
        id: `PRJ${String(i).padStart(3, '0')}`,
        name: `${projectNames[(i - 1) % projectNames.length]} (Phase ${Math.ceil(i / 10)})`,
        owner: owner.name,
        department: owner.department,
        progress: randomInt(20, 95),
        internalRisk: randomInt(10, 45),
        externalRisk: 0,
        plannedEndDate: `2027-12-${String(10 + (i % 20)).padStart(2, '0')}`,
        recommendedEndDate: null,
        relatedEvents: relatedEventIds,
        budgetUsdM: (randomInt(5, 50) * 1.5).toFixed(1),
        region: region.name,
        lat: lat,
        lng: lng
      });
    }
    return projects;
  }

  // 4. Generate 20 Objectives
  function generateObjectives(employees, events) {
    const objTitles = [
      'Reduce Public Service Wait Times by 40%',
      'Achieve 100% Renewable Power for Public Facilities',
      'Digitalize 90% of Commercial Permits',
      'Expand Emergency Healthcare Response Under 8 Mins',
      'Increase Citizen Satisfaction Index above 90%',
      'Strengthen Government Cyber Threat Defenses'
    ];

    const statuses = ['Green', 'Amber', 'Red'];

    const objectives = [];
    for (let i = 1; i <= 20; i++) {
      const owner = employees[(i + 3) % employees.length];
      objectives.push({
        id: `OBJ${String(i).padStart(3, '0')}`,
        title: `${objTitles[(i - 1) % objTitles.length]} (Q${(i % 4) + 1})`,
        owner: owner.name,
        department: owner.department,
        progress: randomInt(35, 90),
        targetDate: `2027-11-${String(5 + (i % 22)).padStart(2, '0')}`,
        status: statuses[i % 3],
        relatedEvents: [events[(i * 2) % events.length].id]
      });
    }
    return objectives;
  }

  // 5. Generate 25 Innovations
  function generateInnovations(employees) {
    const statuses = ['Submitted', 'Review', 'Pilot', 'Approved', 'Implemented'];
    const categories = ['Digital Automation', 'Process Optimization', 'Citizen Engagement', 'Green Energy', 'Cost Savings'];
    
    const titles = [
      'AI Document Classifier for Municipal Approvals',
      'Solar-Powered Smart Bus Shelters',
      'VR Public Consultation Center',
      'Blockchain Supply Chain Tracker for Vaccines',
      'Predictive Maintenance for Water Pipes'
    ];

    const innovations = [];
    for (let i = 1; i <= 25; i++) {
      const owner = employees[(i + 7) % employees.length];
      innovations.push({
        id: `INO${String(i).padStart(3, '0')}`,
        title: `${titles[(i - 1) % titles.length]} #${i}`,
        description: 'Automates legacy manual verification steps, reducing processing latency and improving auditing visibility.',
        expectedImpact: `${randomInt(15, 40)}% Efficiency Increase`,
        costSaving: `$${randomInt(100, 850)}K / Year`,
        category: categories[(i - 1) % categories.length],
        owner: owner.name,
        status: statuses[i % statuses.length],
        votes: randomInt(12, 140)
      });
    }
    return innovations;
  }

  // 6. Generate 100 Recognitions
  function generateRecognitions(employees) {
    const recognitions = [];
    const messages = [
      'Exemplary leadership in navigating supply chain hurdles during the port transit crisis.',
      'Outstanding innovation standard introduced to citizen permit automation module.',
      'Exceptional collaboration across departments during regional emergency weather events.',
      'Delivered strategic objective ahead of deadline with zero compliance issues.',
      'Pioneered citizen outcome metrics that boosted regional satisfaction scores.'
    ];

    for (let i = 1; i <= 100; i++) {
      const sender = employees[(i - 1) % employees.length];
      const receiver = employees[(i + 5) % employees.length];
      recognitions.push({
        id: `REC${String(i).padStart(3, '0')}`,
        senderId: sender.id,
        senderName: sender.name,
        receiverId: receiver.id,
        receiverName: receiver.name,
        badge: BADGES[i % BADGES.length],
        message: messages[(i - 1) % messages.length],
        date: `2026-08-${String((i % 20) + 1).padStart(2, '0')}`
      });
    }
    return recognitions;
  }

  // 7. Generate Geo Locations, Buildings, Floors, and Rooms (Spatial MetaModel)
  function generateSpatialAssets() {
    const locations = [
      {
        id: 'LOC001',
        name: 'Riyadh Digital Command Campus',
        code: 'RUH-HQ',
        region: 'Central',
        type: 'Command HQ & Data Center',
        address: 'King Fahd Road, Digital City, Riyadh',
        lat: 24.7136,
        lng: 46.6753,
        status: 'Operational',
        metamodelTags: ['#datacenter', '#security', '#critical_infrastructure', '#cyberattack', '#power_grid'],
        description: 'Primary national government command headquarters and tier-IV cloud hosting center.'
      },
      {
        id: 'LOC002',
        name: 'Jeddah Red Sea Maritime & Customs Complex',
        code: 'JED-PORT',
        region: 'Western',
        type: 'Logistics & Transit Port',
        address: 'King Abdulaziz Port Corridor, Jeddah',
        lat: 21.4858,
        lng: 39.1925,
        status: 'Operational',
        metamodelTags: ['#ports', '#supply_chain', '#shipping', '#flood', '#trade_restrictions'],
        description: 'Major maritime cargo entry point, automated customs inspection, and logistics hub.'
      },
      {
        id: 'LOC003',
        name: 'Dammam Energy & Infrastructure Hub',
        code: 'DMM-ENG',
        region: 'Eastern',
        type: 'Energy & Utility Node',
        address: 'Eastern Industrial Zone, Dammam',
        lat: 26.4207,
        lng: 50.0888,
        status: 'Operational',
        metamodelTags: ['#oil_price', '#power_grid', '#clean_energy', '#critical_infrastructure', '#budget'],
        description: 'Regional utility control center, smart grid battery storage, and energy monitoring.'
      },
      {
        id: 'LOC004',
        name: 'Tabuk NEOM Strategic Tech Pavilion',
        code: 'TBK-INNOV',
        region: 'Northern',
        type: 'Innovation Center',
        address: 'Future Valley, Tabuk NEOM Sector',
        lat: 28.3835,
        lng: 36.5662,
        status: 'Operational',
        metamodelTags: ['#clean_energy', '#smart_facility', '#cyberattack', '#sandstorm'],
        description: 'Autonomous municipal systems research, solar energy grid, and AI innovation laboratory.'
      },
      {
        id: 'LOC005',
        name: 'Asir Regional Public Service Center',
        code: 'ASR-GOV',
        region: 'Southern',
        type: 'Citizen Service Center',
        address: 'Civic Boulevard, Abha, Asir',
        lat: 18.2164,
        lng: 42.5053,
        status: 'Operational',
        metamodelTags: ['#rain', '#flood', '#budget', '#smart_facility'],
        description: 'Southern region citizen interaction hub, digital permit terminal, and healthcare coordination.'
      }
    ];

    const buildings = [
      // LOC001 Buildings
      {
        id: 'BLD001',
        locationId: 'LOC001',
        name: 'Tower Alpha - National Command Center',
        code: 'TWR-A',
        floorsCount: 4,
        grossAreaSqm: 18500,
        occupancyCapacity: 850,
        status: 'Operational',
        contactLead: 'Ahmed Al-Mansoor',
        metamodelTags: ['#security', '#critical_infrastructure', '#cyberattack', '#power_grid']
      },
      {
        id: 'BLD002',
        locationId: 'LOC001',
        name: 'Cloud Data Center Tier-IV',
        code: 'CDC-01',
        floorsCount: 2,
        grossAreaSqm: 12000,
        occupancyCapacity: 120,
        status: 'Operational',
        contactLead: 'Mohammed Al-Shehri',
        metamodelTags: ['#datacenter', '#outage', '#cyberattack', '#ransomware', '#power_grid']
      },
      {
        id: 'BLD003',
        locationId: 'LOC001',
        name: 'Public Sector Innovation Hub',
        code: 'INN-01',
        floorsCount: 3,
        grossAreaSqm: 9500,
        occupancyCapacity: 450,
        status: 'Operational',
        contactLead: 'Sara Al-Otaibi',
        metamodelTags: ['#smart_facility', '#budget', '#clean_energy']
      },

      // LOC002 Buildings
      {
        id: 'BLD004',
        locationId: 'LOC002',
        name: 'Maritime Customs Clearance Gate',
        code: 'CUS-01',
        floorsCount: 2,
        grossAreaSqm: 14000,
        occupancyCapacity: 300,
        status: 'Operational',
        contactLead: 'Tariq Al-Zahrani',
        metamodelTags: ['#ports', '#supply_chain', '#shipping', '#trade_restrictions']
      },
      {
        id: 'BLD005',
        locationId: 'LOC002',
        name: 'Container Logistics Command Center',
        code: 'LOG-01',
        floorsCount: 3,
        grossAreaSqm: 11000,
        occupancyCapacity: 250,
        status: 'Operational',
        contactLead: 'Khalid Al-Ghamdi',
        metamodelTags: ['#supply_chain', '#ports', '#flood', '#flight_delay']
      },

      // LOC003 Buildings
      {
        id: 'BLD006',
        locationId: 'LOC003',
        name: 'Eastern Grid Smart Telemetry Station',
        code: 'GRD-01',
        floorsCount: 2,
        grossAreaSqm: 8000,
        occupancyCapacity: 180,
        status: 'Operational',
        contactLead: 'Omar Al-Harbi',
        metamodelTags: ['#power_grid', '#oil_price', '#clean_energy', '#critical_infrastructure']
      },
      {
        id: 'BLD007',
        locationId: 'LOC003',
        name: 'Regional Operations & Desalination Facility',
        code: 'OPS-02',
        floorsCount: 2,
        grossAreaSqm: 16000,
        occupancyCapacity: 220,
        status: 'Operational',
        contactLead: 'Hana Al-Qahtani',
        metamodelTags: ['#critical_infrastructure', '#budget', '#power_grid']
      },

      // LOC004 Buildings
      {
        id: 'BLD008',
        locationId: 'LOC004',
        name: 'Future Autonomous Mobility Lab',
        code: 'MOB-01',
        floorsCount: 2,
        grossAreaSqm: 10500,
        occupancyCapacity: 280,
        status: 'Operational',
        contactLead: 'Fahad Al-Nasser',
        metamodelTags: ['#smart_facility', '#cyberattack', '#sandstorm']
      },

      // LOC005 Buildings
      {
        id: 'BLD009',
        locationId: 'LOC005',
        name: 'Civic Service Grand Pavilion',
        code: 'CIV-01',
        floorsCount: 3,
        grossAreaSqm: 13500,
        occupancyCapacity: 600,
        status: 'Operational',
        contactLead: 'Amal Al-Kahlani',
        metamodelTags: ['#rain', '#flood', '#budget', '#smart_facility']
      }
    ];

    const floors = [
      // BLD001 (Tower Alpha)
      { id: 'FLR001', buildingId: 'BLD001', floorNumber: 'G', name: 'Ground Floor - Main Security & Reception Concourse', areaSqm: 4500, roomsCount: 4, status: 'Operational', metamodelTags: ['#security', '#smart_facility'] },
      { id: 'FLR002', buildingId: 'BLD001', floorNumber: '1', name: 'Level 1 - National Operations & Emergency NOC', areaSqm: 4600, roomsCount: 5, status: 'Operational', metamodelTags: ['#critical_infrastructure', '#cyberattack', '#outage', '#security'] },
      { id: 'FLR003', buildingId: 'BLD001', floorNumber: '2', name: 'Level 2 - Strategic Planning & Citizen Outcomes Suite', areaSqm: 4700, roomsCount: 4, status: 'Operational', metamodelTags: ['#budget', '#policy', '#smart_facility'] },
      { id: 'FLR004', buildingId: 'BLD001', floorNumber: '3', name: 'Level 3 - Executive Command & Ministerial Council', areaSqm: 4700, roomsCount: 3, status: 'Operational', metamodelTags: ['#security', '#policy', '#critical_infrastructure'] },

      // BLD002 (Cloud Data Center)
      { id: 'FLR005', buildingId: 'BLD002', floorNumber: 'G', name: 'Ground Level - Power Inverters & Battery Vault', areaSqm: 6000, roomsCount: 3, status: 'Operational', metamodelTags: ['#power_grid', '#critical_infrastructure', '#outage'] },
      { id: 'FLR006', buildingId: 'BLD002', floorNumber: '1', name: 'Level 1 - High-Density Sovereign Server Halls', areaSqm: 6000, roomsCount: 4, status: 'Operational', metamodelTags: ['#datacenter', '#cyberattack', '#ransomware', '#databreach'] },

      // BLD003 (Innovation Hub)
      { id: 'FLR007', buildingId: 'BLD003', floorNumber: 'G', name: 'Ground Floor - Public Collaboration Gallery', areaSqm: 3200, roomsCount: 3, status: 'Operational', metamodelTags: ['#smart_facility'] },
      { id: 'FLR008', buildingId: 'BLD003', floorNumber: '1', name: 'Level 1 - Rapid Prototyping & AI Hackspace', areaSqm: 3100, roomsCount: 3, status: 'Operational', metamodelTags: ['#clean_energy', '#smart_facility'] },

      // BLD004 (Customs Clearance)
      { id: 'FLR009', buildingId: 'BLD004', floorNumber: 'G', name: 'Ground Level - Automated Inspection Bays', areaSqm: 7000, roomsCount: 4, status: 'Operational', metamodelTags: ['#ports', '#supply_chain', '#shipping'] },
      { id: 'FLR010', buildingId: 'BLD004', floorNumber: '1', name: 'Level 1 - Port Tariff & Clearance Office', areaSqm: 7000, roomsCount: 3, status: 'Operational', metamodelTags: ['#trade_restrictions', '#supply_chain'] },

      // BLD006 (Grid Station)
      { id: 'FLR011', buildingId: 'BLD006', floorNumber: 'G', name: 'Substation Control Floor', areaSqm: 4000, roomsCount: 3, status: 'Operational', metamodelTags: ['#power_grid', '#oil_price'] },

      // BLD009 (Civic Center)
      { id: 'FLR012', buildingId: 'BLD009', floorNumber: 'G', name: 'Citizen Service Express Hall', areaSqm: 4500, roomsCount: 4, status: 'Operational', metamodelTags: ['#smart_facility', '#budget'] }
    ];

    const rooms = [
      // Rooms on FLR002 (Tower Alpha NOC Level)
      {
        id: 'RM001',
        floorId: 'FLR002',
        roomNumber: 'NOC-201',
        name: 'National Incident Response Room',
        type: 'Command Center',
        capacity: 45,
        occupancy: 28,
        status: 'Normal',
        leadOwner: 'Ahmed Al-Mansoor',
        temperatureC: 21.5,
        powerStatus: 'Normal Grid + UPS Active',
        metamodelTags: ['#critical_infrastructure', '#cyberattack', '#security', '#outage'],
        linkedProjects: ['PRJ001', 'PRJ010'],
        linkedEvents: ['EV003', 'EV010']
      },
      {
        id: 'RM002',
        floorId: 'FLR002',
        roomNumber: 'CYB-202',
        name: 'Cybersecurity Threat Defense Chamber',
        type: 'Server / Operations',
        capacity: 30,
        occupancy: 22,
        status: 'Normal',
        leadOwner: 'Tariq Al-Mansoor',
        temperatureC: 20.0,
        powerStatus: 'Secure Line Active',
        metamodelTags: ['#cyberattack', '#ransomware', '#databreach', '#security'],
        linkedProjects: ['PRJ006'],
        linkedEvents: ['EV003']
      },
      {
        id: 'RM003',
        floorId: 'FLR002',
        roomNumber: 'SIT-203',
        name: 'Macro Weather & Emergency Situation Lab',
        type: 'Command Center',
        capacity: 25,
        occupancy: 15,
        status: 'Normal',
        leadOwner: 'Fatima Al-Zahrani',
        temperatureC: 22.0,
        powerStatus: 'Normal Grid',
        metamodelTags: ['#sandstorm', '#storm', '#flood', '#heatwave'],
        linkedProjects: ['PRJ010'],
        linkedEvents: ['EV002', 'EV006']
      },
      {
        id: 'RM004',
        floorId: 'FLR002',
        roomNumber: 'TEL-204',
        name: 'Satellite & Telecom Gateway Room',
        type: 'Server Room',
        capacity: 10,
        occupancy: 4,
        status: 'Normal',
        leadOwner: 'Mohammed Al-Shehri',
        temperatureC: 19.5,
        powerStatus: 'Dual Feed Redundant',
        metamodelTags: ['#outage', '#critical_infrastructure'],
        linkedProjects: ['PRJ001'],
        linkedEvents: ['EV010']
      },

      // Rooms on FLR004 (Tower Alpha Executive Level)
      {
        id: 'RM005',
        floorId: 'FLR004',
        roomNumber: 'EXEC-301',
        name: 'Ministerial Strategic Council Chamber',
        type: 'Meeting Hall',
        capacity: 35,
        occupancy: 12,
        status: 'Normal',
        leadOwner: 'Sara Al-Otaibi',
        temperatureC: 22.5,
        powerStatus: 'Normal',
        metamodelTags: ['#policy', '#budget', '#security', '#oil_price'],
        linkedProjects: ['PRJ002', 'PRJ003'],
        linkedEvents: ['EV001']
      },
      {
        id: 'RM006',
        floorId: 'FLR004',
        roomNumber: 'EXEC-302',
        name: 'Public Sector KPI Real-time War Room',
        type: 'Command Center',
        capacity: 20,
        occupancy: 8,
        status: 'Normal',
        leadOwner: 'Khalid Al-Ghamdi',
        temperatureC: 22.0,
        powerStatus: 'Normal',
        metamodelTags: ['#budget', '#policy', '#smart_facility'],
        linkedProjects: ['PRJ001', 'PRJ004'],
        linkedEvents: []
      },

      // Rooms on FLR006 (Cloud Data Center Level 1)
      {
        id: 'RM007',
        floorId: 'FLR006',
        roomNumber: 'DC-101',
        name: 'Primary Sovereign Cloud Pod A',
        type: 'Server Room',
        capacity: 8,
        occupancy: 2,
        status: 'Normal',
        leadOwner: 'Mohammed Al-Shehri',
        temperatureC: 18.2,
        powerStatus: 'Dual UPS Active 99.99%',
        metamodelTags: ['#datacenter', '#cyberattack', '#outage', '#critical_infrastructure'],
        linkedProjects: ['PRJ001', 'PRJ002'],
        linkedEvents: ['EV003', 'EV010']
      },
      {
        id: 'RM008',
        floorId: 'FLR006',
        roomNumber: 'DC-102',
        name: 'Disaster Recovery Cold Storage Vault',
        type: 'Server Room',
        capacity: 6,
        occupancy: 1,
        status: 'Normal',
        leadOwner: 'Tariq Al-Mansoor',
        temperatureC: 18.0,
        powerStatus: 'Active',
        metamodelTags: ['#datacenter', '#ransomware', '#databreach'],
        linkedProjects: ['PRJ006'],
        linkedEvents: []
      },

      // Rooms on FLR009 (Maritime Customs Clearance)
      {
        id: 'RM009',
        floorId: 'FLR009',
        roomNumber: 'PRT-G01',
        name: 'Automated AI Container Scanning Bay 1',
        type: 'Lab / Inspection',
        capacity: 20,
        occupancy: 14,
        status: 'Normal',
        leadOwner: 'Tariq Al-Zahrani',
        temperatureC: 24.0,
        powerStatus: 'High Load Industrial',
        metamodelTags: ['#ports', '#supply_chain', '#shipping'],
        linkedProjects: ['PRJ009'],
        linkedEvents: ['EV004', 'EV007']
      },
      {
        id: 'RM010',
        floorId: 'FLR009',
        roomNumber: 'PRT-G02',
        name: 'Live Cargo Manifest Verification Desk',
        type: 'Office',
        capacity: 35,
        occupancy: 28,
        status: 'Normal',
        leadOwner: 'Khalid Al-Ghamdi',
        temperatureC: 23.0,
        powerStatus: 'Normal',
        metamodelTags: ['#supply_chain', '#trade_restrictions', '#ports'],
        linkedProjects: ['PRJ009'],
        linkedEvents: ['EV004']
      },

      // Rooms on FLR011 (Dammam Grid Station)
      {
        id: 'RM011',
        floorId: 'FLR011',
        roomNumber: 'ENG-G01',
        name: 'Smart Grid Battery Dispatch Center',
        type: 'Operations',
        capacity: 15,
        occupancy: 7,
        status: 'Normal',
        leadOwner: 'Omar Al-Harbi',
        temperatureC: 20.5,
        powerStatus: 'Direct 380kV Substation',
        metamodelTags: ['#power_grid', '#clean_energy', '#critical_infrastructure', '#oil_price'],
        linkedProjects: ['PRJ004', 'PRJ006'],
        linkedEvents: ['EV001', 'EV006']
      },

      // Rooms on FLR012 (Civic Center)
      {
        id: 'RM012',
        floorId: 'FLR012',
        roomNumber: 'CIV-G01',
        name: 'Digital Citizen Fast-Track Pavilion',
        type: 'Citizen Service',
        capacity: 80,
        occupancy: 54,
        status: 'Normal',
        leadOwner: 'Amal Al-Kahlani',
        temperatureC: 22.0,
        powerStatus: 'Solar Rooftop Fed',
        metamodelTags: ['#smart_facility', '#budget', '#clean_energy'],
        linkedProjects: ['PRJ001', 'PRJ007'],
        linkedEvents: []
      }
    ];

    // 5. Generate Routines & Recurring Operations
    const defaultRoutines = [
      {
        id: 'ROU001',
        title: 'Daily Data Center Power & Climate Walkthrough Trip',
        category: 'Trips & Field Visits',
        frequency: 'Daily',
        scheduleTime: 'Daily at 08:30 AM',
        assignedTo: 'Mohammed Al-Shehri',
        locationId: 'LOC001',
        buildingId: 'BLD002',
        priority: 'High',
        status: 'In Progress',
        streak: 14,
        items: [
          { id: 'it_1', text: 'Inspect UPS battery banks in ground level inverter room', completed: true, quantity: '6 banks' },
          { id: 'it_2', text: 'Verify server hall chilled water ambient temperature <= 20°C', completed: true, quantity: 'Halls A-D' },
          { id: 'it_3', text: 'Check satellite redundant uplinks in room TEL-204', completed: false, quantity: '2 feeds' },
          { id: 'it_4', text: 'Log environmental metrics into central command dashboard', completed: false, quantity: 'Daily log' }
        ],
        metamodelTags: ['#power_grid', '#datacenter', '#critical_infrastructure', '#outage']
      },
      {
        id: 'ROU002',
        title: 'Weekly IT Hardware & Emergency Supplies Shopping List',
        category: 'Shopping & Procurement',
        frequency: 'Weekly',
        scheduleTime: 'Every Tuesday morning',
        assignedTo: 'Sara Al-Otaibi',
        locationId: 'LOC001',
        buildingId: 'BLD001',
        priority: 'Medium',
        status: 'In Progress',
        streak: 6,
        items: [
          { id: 'it_5', text: '100G Optical Transceivers for Core Switch Replacements', completed: true, quantity: '10 units' },
          { id: 'it_6', text: 'Cat6A Shielded High-Speed Patch Cables (3m)', completed: true, quantity: '25 cables' },
          { id: 'it_7', text: 'Industrial Emergency First Aid Restock Packs', completed: false, quantity: '5 packs' },
          { id: 'it_8', text: 'Encrypted NFC Security Access Badges for Onboarding', completed: false, quantity: '50 badges' },
          { id: 'it_9', text: 'Portable Thermal Laser IR Inspection Thermometers', completed: false, quantity: '2 units' }
        ],
        metamodelTags: ['#supply_chain', '#budget', '#smart_facility', '#security']
      },
      {
        id: 'ROU003',
        title: 'Weekly Port Customs Inspection & Logistics Audit Trip',
        category: 'Trips & Field Visits',
        frequency: 'Weekly',
        scheduleTime: 'Every Thursday at 10:00 AM',
        assignedTo: 'Tariq Al-Zahrani',
        locationId: 'LOC002',
        buildingId: 'BLD004',
        priority: 'High',
        status: 'In Progress',
        streak: 8,
        items: [
          { id: 'it_10', text: 'Field visit to Automated Container Scanning Bay 1 (PRT-G01)', completed: true, quantity: 'Bay 1' },
          { id: 'it_11', text: 'Audit container dwell-time log with Port Authority officials', completed: true, quantity: 'Weekly report' },
          { id: 'it_12', text: 'Inspect customs scanning AI calibration and radiation sensors', completed: false, quantity: '4 scanners' },
          { id: 'it_13', text: 'Confirm cold-chain vaccine shipping container integrity (#ports)', completed: false, quantity: '12 containers' }
        ],
        metamodelTags: ['#ports', '#supply_chain', '#shipping', '#trade_restrictions']
      },
      {
        id: 'ROU004',
        title: 'Daily Citizen Service Center Opening & Queue Routine',
        category: 'Operations & Audits',
        frequency: 'Daily',
        scheduleTime: 'Daily at 07:45 AM',
        assignedTo: 'Amal Al-Kahlani',
        locationId: 'LOC005',
        buildingId: 'BLD009',
        priority: 'High',
        status: 'Completed',
        streak: 21,
        items: [
          { id: 'it_14', text: 'Boot up digital biometric permit terminals', completed: true, quantity: '8 counters' },
          { id: 'it_15', text: 'Verify citizen ticket dispenser paper rolls and thermal printer', completed: true, quantity: '4 kiosks' },
          { id: 'it_16', text: 'Review priority accessibility counters for elderly & special needs', completed: true, quantity: '2 stations' },
          { id: 'it_17', text: 'Sync local permit submission cache with central government cloud', completed: true, quantity: 'All queues' }
        ],
        metamodelTags: ['#smart_facility', '#budget']
      },
      {
        id: 'ROU005',
        title: 'Monthly Emergency Fuel & Infrastructure Supply Shopping List',
        category: 'Shopping & Procurement',
        frequency: 'Monthly',
        scheduleTime: '1st of every month',
        assignedTo: 'Omar Al-Harbi',
        locationId: 'LOC003',
        buildingId: 'BLD006',
        priority: 'High',
        status: 'Pending',
        streak: 4,
        items: [
          { id: 'it_18', text: 'Ultra-Low Sulfur Diesel for Backup Turbine Generators', completed: false, quantity: '5,000 Liters' },
          { id: 'it_19', text: 'High-Voltage Circuit Breaker Preventive Maintenance Kits', completed: false, quantity: '12 kits' },
          { id: 'it_20', text: 'Industrial Desalination Reverse Osmosis Filter Cartridges', completed: false, quantity: '50 units' },
          { id: 'it_21', text: 'Chemical Neutralizer Drums for Substation Battery Banks', completed: false, quantity: '20 drums' }
        ],
        metamodelTags: ['#power_grid', '#oil_price', '#clean_energy', '#critical_infrastructure']
      },
      {
        id: 'ROU006',
        title: 'Monthly National Cybersecurity Protocol & Ransomware Drill',
        category: 'Operations & Audits',
        frequency: 'Monthly',
        scheduleTime: 'Last Wednesday of month',
        assignedTo: 'Ahmed Al-Mansoor',
        locationId: 'LOC001',
        buildingId: 'BLD001',
        priority: 'High',
        status: 'In Progress',
        streak: 7,
        items: [
          { id: 'it_22', text: 'Execute simulated phishing and credential challenge test', completed: true, quantity: 'Workforce wide' },
          { id: 'it_23', text: 'Verify air-gapped immutable backup snapshot integrity (#datacenter)', completed: false, quantity: 'Vault DC-102' },
          { id: 'it_24', text: 'Inspect firewall policy exceptions and revoked admin tokens', completed: false, quantity: 'All gateways' },
          { id: 'it_25', text: 'Conduct live disaster recovery switchover rehearsal', completed: false, quantity: 'Full drill' }
        ],
        metamodelTags: ['#cyberattack', '#ransomware', '#security', '#outage']
      }
    ];

    // 6. Generate Financial Ledger across the MetaModel (Income, Spendings, Assets, Liabilities)
    const defaultFinancials = [
      // 💵 Income Streams
      {
        id: 'FIN001',
        title: 'National Port Customs & Maritime Tariffs',
        type: 'Income',
        amountUsdM: 320.0,
        frequency: 'Annual',
        department: 'Public Finance & Treasury',
        owner: 'Sara Al-Otaibi',
        locationId: 'LOC002',
        projectId: 'PRJ009',
        status: 'Realized',
        riskSensitivity: 'Medium',
        description: 'Automated container clearance customs tariffs and vessel berth fees collected at Western ports.',
        metamodelTags: ['#ports', '#supply_chain', '#budget', '#trade_restrictions']
      },
      {
        id: 'FIN002',
        title: 'Digital Permit & Civic Transaction Licensing Fees',
        type: 'Income',
        amountUsdM: 145.0,
        frequency: 'Annual',
        department: 'Digital Transformation',
        owner: 'Amal Al-Kahlani',
        locationId: 'LOC005',
        projectId: 'PRJ001',
        status: 'Realized',
        riskSensitivity: 'Low',
        description: 'Sovereign digital identity, commercial license issuances, and fast-track municipal service fees.',
        metamodelTags: ['#smart_facility', '#budget']
      },
      {
        id: 'FIN003',
        title: 'Smart Grid Clean Energy Feed-In Export Revenue',
        type: 'Income',
        amountUsdM: 85.5,
        frequency: 'Annual',
        department: 'Energy & Sustainability',
        owner: 'Omar Al-Harbi',
        locationId: 'LOC003',
        projectId: 'PRJ004',
        status: 'Projected',
        riskSensitivity: 'High',
        description: 'Inter-regional electricity grid sales and solar energy feed-in tariffs from Dammam Hub.',
        metamodelTags: ['#clean_energy', '#power_grid', '#oil_price', '#budget']
      },
      {
        id: 'FIN004',
        title: 'Sovereign Innovation Fund Direct Grant',
        type: 'Income',
        amountUsdM: 200.0,
        frequency: 'One-Time Asset',
        department: 'Public Sector Command',
        owner: 'Khalid Al-Ghamdi',
        locationId: 'LOC001',
        projectId: 'PRJ002',
        status: 'Realized',
        riskSensitivity: 'Low',
        description: 'Special ministerial strategic allocation for national AI and cybersecurity capability enhancement.',
        metamodelTags: ['#budget', '#policy', '#security']
      },

      // 💳 Spendings (CapEx & OpEx)
      {
        id: 'FIN005',
        title: 'Cloud Sovereign Data Center Tier-IV CapEx Expansion',
        type: 'Spending',
        amountUsdM: 95.0,
        frequency: 'Annual',
        department: 'Digital Transformation',
        owner: 'Mohammed Al-Shehri',
        locationId: 'LOC001',
        projectId: 'PRJ002',
        status: 'Active',
        riskSensitivity: 'Medium',
        description: 'Procurement of sovereign server racks, high-density cooling towers, and multi-cloud backbones.',
        metamodelTags: ['#datacenter', '#cyberattack', '#budget', '#critical_infrastructure']
      },
      {
        id: 'FIN006',
        title: 'Maritime Port AI Container Scanner Infrastructure CapEx',
        type: 'Spending',
        amountUsdM: 42.0,
        frequency: 'One-Time Asset',
        department: 'Public Finance & Treasury',
        owner: 'Tariq Al-Zahrani',
        locationId: 'LOC002',
        projectId: 'PRJ009',
        status: 'Active',
        riskSensitivity: 'High',
        description: 'Installation of automated X-ray container inspection gantries and AI computer vision pipeline.',
        metamodelTags: ['#ports', '#supply_chain', '#trade_restrictions']
      },
      {
        id: 'FIN007',
        title: 'Public Grid Substation Preventive Maintenance OpEx',
        type: 'Spending',
        amountUsdM: 28.5,
        frequency: 'Annual',
        department: 'Energy & Sustainability',
        owner: 'Omar Al-Harbi',
        locationId: 'LOC003',
        projectId: 'PRJ004',
        status: 'Active',
        riskSensitivity: 'Low',
        description: 'Continuous lubrication, transformer oil testing, and line surge protector replacements.',
        metamodelTags: ['#power_grid', '#clean_energy', '#outage']
      },
      {
        id: 'FIN008',
        title: 'Cyber Defense & Threat Mitigation Operational Reserve',
        type: 'Spending',
        amountUsdM: 18.0,
        frequency: 'Annual',
        department: 'Digital Transformation',
        owner: 'Ahmed Al-Mansoor',
        locationId: 'LOC001',
        projectId: 'PRJ001',
        status: 'Active',
        riskSensitivity: 'High',
        description: '24/7 Red Team penetration testing, managed SOC monitoring, and zero-day threat response insurance.',
        metamodelTags: ['#cyberattack', '#ransomware', '#security']
      },

      // 🏛️ Capital Assets
      {
        id: 'FIN009',
        title: 'Primary Sovereign Cloud Data Center Hardware & Land',
        type: 'Asset',
        amountUsdM: 450.0,
        frequency: 'One-Time Asset',
        department: 'Digital Transformation',
        owner: 'Mohammed Al-Shehri',
        locationId: 'LOC001',
        projectId: 'PRJ002',
        status: 'Realized',
        riskSensitivity: 'Low',
        description: 'Tier-IV certified data center physical land, building shell, optical fiber rings, and server assets.',
        metamodelTags: ['#datacenter', '#critical_infrastructure', '#smart_facility']
      },
      {
        id: 'FIN010',
        title: 'Dammam 380kV Smart Substation & Industrial Battery Reserve',
        type: 'Asset',
        amountUsdM: 310.0,
        frequency: 'One-Time Asset',
        department: 'Energy & Sustainability',
        owner: 'Omar Al-Harbi',
        locationId: 'LOC003',
        projectId: 'PRJ004',
        status: 'Realized',
        riskSensitivity: 'Medium',
        description: 'Industrial megawatt battery storage banks, GIS switchgear, and sovereign power routing hardware.',
        metamodelTags: ['#power_grid', '#clean_energy', '#critical_infrastructure']
      },
      {
        id: 'FIN011',
        title: 'Automated Port Cargo Inspection Cranes & Terminals',
        type: 'Asset',
        amountUsdM: 275.0,
        frequency: 'One-Time Asset',
        department: 'Public Finance & Treasury',
        owner: 'Tariq Al-Zahrani',
        locationId: 'LOC002',
        projectId: 'PRJ009',
        status: 'Realized',
        riskSensitivity: 'Medium',
        description: 'Super Post-Panamax container cranes, automated guided vehicles (AGVs), and customs scanning gates.',
        metamodelTags: ['#ports', '#supply_chain', '#shipping']
      },
      {
        id: 'FIN012',
        title: 'National Biometric Civic Kiosks & Sovereign Software IP',
        type: 'Asset',
        amountUsdM: 160.0,
        frequency: 'One-Time Asset',
        department: 'Digital Transformation',
        owner: 'Amal Al-Kahlani',
        locationId: 'LOC005',
        projectId: 'PRJ001',
        status: 'Realized',
        riskSensitivity: 'Low',
        description: '500+ nationwide biometric enrollment kiosks and proprietary municipal transaction routing software IP.',
        metamodelTags: ['#smart_facility', '#security', '#budget']
      },

      // ⚖️ Liabilities & Commitments
      {
        id: 'FIN013',
        title: 'Sovereign Green Energy Transition Bond 2030',
        type: 'Liability',
        amountUsdM: 180.0,
        frequency: 'Long-Term Liability',
        department: 'Public Finance & Treasury',
        owner: 'Sara Al-Otaibi',
        locationId: 'LOC003',
        projectId: 'PRJ004',
        status: 'Active',
        riskSensitivity: 'High',
        description: '10-year fixed coupon green bond for financing regional wind and solar megawatt plants.',
        metamodelTags: ['#clean_energy', '#interest_rates', '#budget']
      },
      {
        id: 'FIN014',
        title: 'Inter-Ministry Infrastructure Modernization Loan',
        type: 'Liability',
        amountUsdM: 120.0,
        frequency: 'Long-Term Liability',
        department: 'Public Sector Command',
        owner: 'Khalid Al-Ghamdi',
        locationId: 'LOC001',
        projectId: 'PRJ003',
        status: 'Active',
        riskSensitivity: 'Medium',
        description: 'Concessionary development loan for upgrading government administration IT networks.',
        metamodelTags: ['#interest_rates', '#inflation', '#budget']
      },
      {
        id: 'FIN015',
        title: 'Tier-1 Cloud Hardware Vendor Long-Term Payables',
        type: 'Liability',
        amountUsdM: 45.0,
        frequency: 'Monthly',
        department: 'Digital Transformation',
        owner: 'Mohammed Al-Shehri',
        locationId: 'LOC001',
        projectId: 'PRJ002',
        status: 'Active',
        riskSensitivity: 'Low',
        description: 'Quarterly milestone supplier payments for optical transceivers and enterprise storage expansion.',
        metamodelTags: ['#datacenter', '#supply_chain']
      }
    ];

    return { locations, buildings, floors, rooms, routines: defaultRoutines, financials: defaultFinancials };
  }

  // State Container
  let state = {
    employees: [],
    events: [],
    projects: [],
    objectives: [],
    innovations: [],
    recognitions: [],
    locations: [],
    buildings: [],
    floors: [],
    rooms: [],
    routines: [],
    financials: []
  };

  const changeListeners = [];

  function notifyChange() {
    saveToStorage();
    changeListeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error('Listener error:', e); }
    });
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0 && Array.isArray(parsed.locations) && parsed.locations.length > 0) {
          state = parsed;
          if (!Array.isArray(state.routines) || state.routines.length === 0) {
            const spatial = generateSpatialAssets();
            state.routines = spatial.routines;
          }
          if (!Array.isArray(state.financials) || state.financials.length === 0) {
            const spatial = generateSpatialAssets();
            state.financials = spatial.financials;
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('Error reading localStorage state:', e);
    }
    return false;
  }

  function init(forceReset = false) {
    if (!forceReset && loadFromStorage()) {
      return;
    }
    state.employees = generateEmployees();
    state.events = generateEvents();
    state.projects = generateProjects(state.employees, state.events);
    state.objectives = generateObjectives(state.employees, state.events);
    state.innovations = generateInnovations(state.employees);
    state.recognitions = generateRecognitions(state.employees);

    const spatial = generateSpatialAssets();
    state.locations = spatial.locations;
    state.buildings = spatial.buildings;
    state.floors = spatial.floors;
    state.rooms = spatial.rooms;
    state.routines = spatial.routines;
    state.financials = spatial.financials;

    saveToStorage();
  }

  init();

  return {
    STORAGE_KEY: STORAGE_KEY,
    REGIONS: REGIONS,
    DEPARTMENTS: DEPARTMENTS,
    BADGES: BADGES,
    GAMIFICATION_LEVELS: GAMIFICATION_LEVELS,
    METAMODEL_DICTIONARY: METAMODEL_DICTIONARY,
    ALL_METAMODEL_TAGS: ALL_METAMODEL_TAGS,

    getState: () => state,
    getEmployees: () => state.employees,
    getEvents: () => state.events,
    getProjects: () => state.projects,
    getObjectives: () => state.objectives,
    getInnovations: () => state.innovations,
    getRecognitions: () => state.recognitions,
    getLocations: () => state.locations,
    getBuildings: () => state.buildings,
    getFloors: () => state.floors,
    getRooms: () => state.rooms,
    getRoutines: () => state.routines || [],
    getRegions: () => REGIONS,

    onStateChange: (listener) => {
      changeListeners.push(listener);
    },

    // --- PROJECTS CRUD ---
    getProjectById: (id) => state.projects.find(p => p.id === id),
    createProject: (projectData) => {
      const nextNum = state.projects.length + 1;
      const newProject = {
        id: projectData.id || `PRJ${String(nextNum).padStart(3, '0')}`,
        name: projectData.name || 'Untitled Initiative',
        owner: projectData.owner || 'Lead Director',
        department: projectData.department || DEPARTMENTS[0],
        progress: parseInt(projectData.progress, 10) || 0,
        internalRisk: parseInt(projectData.internalRisk, 10) || 20,
        externalRisk: 0,
        plannedEndDate: projectData.plannedEndDate || '2027-12-31',
        recommendedEndDate: null,
        relatedEvents: Array.isArray(projectData.relatedEvents) ? projectData.relatedEvents : [],
        budgetUsdM: parseFloat(projectData.budgetUsdM || 10).toFixed(1),
        region: projectData.region || 'Central',
        lat: parseFloat(projectData.lat) || 24.7136,
        lng: parseFloat(projectData.lng) || 46.6753
      };
      state.projects.unshift(newProject);
      notifyChange();
      return newProject;
    },
    updateProject: (id, updatedData) => {
      const index = state.projects.findIndex(p => p.id === id);
      if (index === -1) return null;
      state.projects[index] = {
        ...state.projects[index],
        ...updatedData,
        progress: parseInt(updatedData.progress ?? state.projects[index].progress, 10),
        internalRisk: parseInt(updatedData.internalRisk ?? state.projects[index].internalRisk, 10),
        lat: parseFloat(updatedData.lat ?? state.projects[index].lat),
        lng: parseFloat(updatedData.lng ?? state.projects[index].lng)
      };
      notifyChange();
      return state.projects[index];
    },
    deleteProject: (id) => {
      const initialLen = state.projects.length;
      state.projects = state.projects.filter(p => p.id !== id);
      if (state.projects.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- OBJECTIVES CRUD ---
    getObjectiveById: (id) => state.objectives.find(o => o.id === id),
    createObjective: (objData) => {
      const nextNum = state.objectives.length + 1;
      const newObj = {
        id: objData.id || `OBJ${String(nextNum).padStart(3, '0')}`,
        title: objData.title || 'New Strategic Target',
        owner: objData.owner || 'Ministry Lead',
        department: objData.department || DEPARTMENTS[0],
        progress: parseInt(objData.progress, 10) || 0,
        targetDate: objData.targetDate || '2027-12-31',
        status: objData.status || 'Green',
        relatedEvents: Array.isArray(objData.relatedEvents) ? objData.relatedEvents : []
      };
      state.objectives.unshift(newObj);
      notifyChange();
      return newObj;
    },
    updateObjective: (id, updatedData) => {
      const index = state.objectives.findIndex(o => o.id === id);
      if (index === -1) return null;
      state.objectives[index] = {
        ...state.objectives[index],
        ...updatedData,
        progress: parseInt(updatedData.progress ?? state.objectives[index].progress, 10)
      };
      notifyChange();
      return state.objectives[index];
    },
    deleteObjective: (id) => {
      const initialLen = state.objectives.length;
      state.objectives = state.objectives.filter(o => o.id !== id);
      if (state.objectives.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- EXTERNAL EVENTS CRUD ---
    getEventById: (id) => state.events.find(e => e.id === id),
    createEvent: (eventData) => {
      const nextNum = state.events.length + 1;
      const region = REGIONS.find(r => r.name === eventData.region) || REGIONS[0];
      const newEvent = {
        id: eventData.id || `EV${String(nextNum).padStart(3, '0')}`,
        title: eventData.title || 'External Event Disruption',
        category: eventData.category || 'Economic',
        source: eventData.source || 'Intelligence Feed',
        severity: parseInt(eventData.severity, 10) || 3,
        probability: parseFloat(eventData.probability || 0.6),
        status: eventData.status || 'Active',
        tags: Array.isArray(eventData.tags) ? eventData.tags : ['#event'],
        region: eventData.region || region.name,
        lat: parseFloat(eventData.lat) || region.centerLat,
        lng: parseFloat(eventData.lng) || region.centerLng,
        icon: eventData.icon || '⚠️'
      };
      state.events.unshift(newEvent);
      notifyChange();
      return newEvent;
    },
    updateEvent: (id, updatedData) => {
      const index = state.events.findIndex(e => e.id === id);
      if (index === -1) return null;
      state.events[index] = {
        ...state.events[index],
        ...updatedData,
        severity: parseInt(updatedData.severity ?? state.events[index].severity, 10),
        probability: parseFloat(updatedData.probability ?? state.events[index].probability),
        lat: parseFloat(updatedData.lat ?? state.events[index].lat),
        lng: parseFloat(updatedData.lng ?? state.events[index].lng)
      };
      notifyChange();
      return state.events[index];
    },
    deleteEvent: (id) => {
      const initialLen = state.events.length;
      state.events = state.events.filter(e => e.id !== id);
      state.projects.forEach(p => {
        if (p.relatedEvents) {
          p.relatedEvents = p.relatedEvents.filter(evId => evId !== id);
        }
      });
      state.objectives.forEach(o => {
        if (o.relatedEvents) {
          o.relatedEvents = o.relatedEvents.filter(evId => evId !== id);
        }
      });
      if (state.events.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- INNOVATIONS CRUD ---
    getInnovationById: (id) => state.innovations.find(i => i.id === id),
    createInnovation: (ideaData) => {
      const nextNum = state.innovations.length + 1;
      const newIdea = {
        id: ideaData.id || `INO${String(nextNum).padStart(3, '0')}`,
        title: ideaData.title || 'Untitled Proposal',
        description: ideaData.description || '',
        expectedImpact: ideaData.expectedImpact || 'High Impact Efficiency',
        costSaving: ideaData.costSaving || '$150K / Year',
        category: ideaData.category || 'Digital Automation',
        owner: ideaData.owner || 'Current User',
        status: ideaData.status || 'Submitted',
        votes: parseInt(ideaData.votes, 10) || 1
      };
      state.innovations.unshift(newIdea);
      notifyChange();
      return newIdea;
    },
    updateInnovation: (id, updatedData) => {
      const index = state.innovations.findIndex(i => i.id === id);
      if (index === -1) return null;
      state.innovations[index] = {
        ...state.innovations[index],
        ...updatedData,
        votes: parseInt(updatedData.votes ?? state.innovations[index].votes, 10)
      };
      notifyChange();
      return state.innovations[index];
    },
    deleteInnovation: (id) => {
      const initialLen = state.innovations.length;
      state.innovations = state.innovations.filter(i => i.id !== id);
      if (state.innovations.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- EMPLOYEES CRUD ---
    getEmployeeById: (id) => state.employees.find(e => e.id === id),
    createEmployee: (empData) => {
      const nextNum = state.employees.length + 1;
      const initials = (empData.name || 'User Lead').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
      const newEmp = {
        id: empData.id || `EMP${String(nextNum).padStart(3, '0')}`,
        name: empData.name || 'New Staff Member',
        title: empData.title || 'Senior Consultant',
        department: empData.department || DEPARTMENTS[0],
        ownershipScore: parseInt(empData.ownershipScore, 10) || 85,
        collaborationScore: parseInt(empData.collaborationScore, 10) || 85,
        innovationScore: parseInt(empData.innovationScore, 10) || 80,
        citizenImpactScore: parseInt(empData.citizenImpactScore, 10) || 85,
        level: empData.level || 'Contributor',
        badges: Array.isArray(empData.badges) ? empData.badges : [BADGES[0]],
        avatar: initials || 'EX'
      };
      state.employees.unshift(newEmp);
      notifyChange();
      return newEmp;
    },
    updateEmployee: (id, updatedData) => {
      const index = state.employees.findIndex(e => e.id === id);
      if (index === -1) return null;
      state.employees[index] = {
        ...state.employees[index],
        ...updatedData
      };
      notifyChange();
      return state.employees[index];
    },
    deleteEmployee: (id) => {
      const initialLen = state.employees.length;
      state.employees = state.employees.filter(e => e.id !== id);
      if (state.employees.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- RECOGNITIONS CRUD ---
    createRecognition: (recData) => {
      const nextNum = state.recognitions.length + 1;
      const newRec = {
        id: recData.id || `REC${String(nextNum).padStart(3, '0')}`,
        senderId: recData.senderId || 'EMP001',
        senderName: recData.senderName || 'Leadership Council',
        receiverId: recData.receiverId || 'EMP002',
        receiverName: recData.receiverName || 'Recipient',
        badge: recData.badge || BADGES[0],
        message: recData.message || 'Great effort in driving positive citizen outcomes.',
        date: recData.date || new Date().toISOString().split('T')[0]
      };
      state.recognitions.unshift(newRec);
      notifyChange();
      return newRec;
    },
    deleteRecognition: (id) => {
      const initialLen = state.recognitions.length;
      state.recognitions = state.recognitions.filter(r => r.id !== id);
      if (state.recognitions.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- SPATIAL META-MODEL HIERARCHY CRUD (Locations, Buildings, Floors, Rooms) ---

    // 1. Locations
    getLocationById: (id) => state.locations.find(l => l.id === id),
    createLocation: (locData) => {
      const nextNum = state.locations.length + 1;
      const newLoc = {
        id: locData.id || `LOC${String(nextNum).padStart(3, '0')}`,
        name: locData.name || 'New Facility Campus',
        code: locData.code || `LOC-${nextNum}`,
        region: locData.region || 'Central',
        type: locData.type || 'Command HQ',
        address: locData.address || 'Capital Sector',
        lat: parseFloat(locData.lat) || 24.7136,
        lng: parseFloat(locData.lng) || 46.6753,
        status: locData.status || 'Operational',
        metamodelTags: Array.isArray(locData.metamodelTags) ? locData.metamodelTags : ['#critical_infrastructure'],
        description: locData.description || ''
      };
      state.locations.unshift(newLoc);
      notifyChange();
      return newLoc;
    },
    updateLocation: (id, updatedData) => {
      const idx = state.locations.findIndex(l => l.id === id);
      if (idx === -1) return null;
      state.locations[idx] = {
        ...state.locations[idx],
        ...updatedData,
        lat: parseFloat(updatedData.lat ?? state.locations[idx].lat),
        lng: parseFloat(updatedData.lng ?? state.locations[idx].lng)
      };
      notifyChange();
      return state.locations[idx];
    },
    deleteLocation: (id) => {
      const initialLen = state.locations.length;
      state.locations = state.locations.filter(l => l.id !== id);
      
      // Cascading cleanup of buildings, floors, rooms
      const bldIdsToDelete = state.buildings.filter(b => b.locationId === id).map(b => b.id);
      state.buildings = state.buildings.filter(b => b.locationId !== id);
      
      const flrIdsToDelete = state.floors.filter(f => bldIdsToDelete.includes(f.buildingId)).map(f => f.id);
      state.floors = state.floors.filter(f => !bldIdsToDelete.includes(f.buildingId));
      state.rooms = state.rooms.filter(r => !flrIdsToDelete.includes(r.floorId));

      if (state.locations.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // 2. Buildings
    getBuildingById: (id) => state.buildings.find(b => b.id === id),
    getBuildingsByLocation: (locId) => state.buildings.filter(b => b.locationId === locId),
    createBuilding: (bldData) => {
      const nextNum = state.buildings.length + 1;
      const newBld = {
        id: bldData.id || `BLD${String(nextNum).padStart(3, '0')}`,
        locationId: bldData.locationId,
        name: bldData.name || 'New Facility Building',
        code: bldData.code || `BLD-${nextNum}`,
        floorsCount: parseInt(bldData.floorsCount, 10) || 1,
        grossAreaSqm: parseInt(bldData.grossAreaSqm, 10) || 5000,
        occupancyCapacity: parseInt(bldData.occupancyCapacity, 10) || 200,
        status: bldData.status || 'Operational',
        contactLead: bldData.contactLead || 'Lead Facility Director',
        metamodelTags: Array.isArray(bldData.metamodelTags) ? bldData.metamodelTags : ['#smart_facility']
      };
      state.buildings.push(newBld);

      // Auto-generate default ground floor
      ImpactData.createFloor({
        buildingId: newBld.id,
        floorNumber: 'G',
        name: 'Ground Floor & Concourse',
        areaSqm: Math.round(newBld.grossAreaSqm / newBld.floorsCount),
        roomsCount: 2,
        status: 'Operational',
        metamodelTags: newBld.metamodelTags
      });

      notifyChange();
      return newBld;
    },
    updateBuilding: (id, updatedData) => {
      const idx = state.buildings.findIndex(b => b.id === id);
      if (idx === -1) return null;
      state.buildings[idx] = {
        ...state.buildings[idx],
        ...updatedData,
        floorsCount: parseInt(updatedData.floorsCount ?? state.buildings[idx].floorsCount, 10),
        grossAreaSqm: parseInt(updatedData.grossAreaSqm ?? state.buildings[idx].grossAreaSqm, 10),
        occupancyCapacity: parseInt(updatedData.occupancyCapacity ?? state.buildings[idx].occupancyCapacity, 10)
      };
      notifyChange();
      return state.buildings[idx];
    },
    deleteBuilding: (id) => {
      const initialLen = state.buildings.length;
      state.buildings = state.buildings.filter(b => b.id !== id);
      
      const flrIdsToDelete = state.floors.filter(f => f.buildingId === id).map(f => f.id);
      state.floors = state.floors.filter(f => f.buildingId !== id);
      state.rooms = state.rooms.filter(r => !flrIdsToDelete.includes(r.floorId));

      if (state.buildings.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // 3. Floors
    getFloorById: (id) => state.floors.find(f => f.id === id),
    getFloorsByBuilding: (bldId) => state.floors.filter(f => f.buildingId === bldId),
    createFloor: (flrData) => {
      const nextNum = state.floors.length + 1;
      const newFlr = {
        id: flrData.id || `FLR${String(nextNum).padStart(3, '0')}`,
        buildingId: flrData.buildingId,
        floorNumber: flrData.floorNumber || '1',
        name: flrData.name || `Level ${flrData.floorNumber || '1'} Operations`,
        areaSqm: parseInt(flrData.areaSqm, 10) || 3000,
        roomsCount: parseInt(flrData.roomsCount, 10) || 0,
        status: flrData.status || 'Operational',
        metamodelTags: Array.isArray(flrData.metamodelTags) ? flrData.metamodelTags : ['#smart_facility']
      };
      state.floors.push(newFlr);
      notifyChange();
      return newFlr;
    },
    updateFloor: (id, updatedData) => {
      const idx = state.floors.findIndex(f => f.id === id);
      if (idx === -1) return null;
      state.floors[idx] = {
        ...state.floors[idx],
        ...updatedData
      };
      notifyChange();
      return state.floors[idx];
    },
    deleteFloor: (id) => {
      const initialLen = state.floors.length;
      state.floors = state.floors.filter(f => f.id !== id);
      state.rooms = state.rooms.filter(r => r.floorId !== id);
      if (state.floors.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // 4. Rooms / Zones
    getRoomById: (id) => state.rooms.find(r => r.id === id),
    getRoomsByFloor: (floorId) => state.rooms.filter(r => r.floorId === floorId),
    createRoom: (roomData) => {
      const nextNum = state.rooms.length + 1;
      const newRoom = {
        id: roomData.id || `RM${String(nextNum).padStart(3, '0')}`,
        floorId: roomData.floorId,
        roomNumber: roomData.roomNumber || `R-${nextNum}`,
        name: roomData.name || 'Operational Zone',
        type: roomData.type || 'Office',
        capacity: parseInt(roomData.capacity, 10) || 20,
        occupancy: parseInt(roomData.occupancy, 10) || 0,
        status: roomData.status || 'Normal',
        leadOwner: roomData.leadOwner || 'Facility Lead',
        temperatureC: parseFloat(roomData.temperatureC || 22.0),
        powerStatus: roomData.powerStatus || 'Normal Grid Active',
        metamodelTags: Array.isArray(roomData.metamodelTags) ? roomData.metamodelTags : ['#smart_facility'],
        linkedProjects: Array.isArray(roomData.linkedProjects) ? roomData.linkedProjects : [],
        linkedEvents: Array.isArray(roomData.linkedEvents) ? roomData.linkedEvents : []
      };
      state.rooms.push(newRoom);

      // Update parent floor room count
      const parentFlr = state.floors.find(f => f.id === newRoom.floorId);
      if (parentFlr) {
        parentFlr.roomsCount = state.rooms.filter(r => r.floorId === parentFlr.id).length;
      }

      notifyChange();
      return newRoom;
    },
    updateRoom: (id, updatedData) => {
      const idx = state.rooms.findIndex(r => r.id === id);
      if (idx === -1) return null;
      state.rooms[idx] = {
        ...state.rooms[idx],
        ...updatedData,
        capacity: parseInt(updatedData.capacity ?? state.rooms[idx].capacity, 10),
        occupancy: parseInt(updatedData.occupancy ?? state.rooms[idx].occupancy, 10),
        temperatureC: parseFloat(updatedData.temperatureC ?? state.rooms[idx].temperatureC)
      };
      notifyChange();
      return state.rooms[idx];
    },
    deleteRoom: (id) => {
      const initialLen = state.rooms.length;
      const targetRoom = state.rooms.find(r => r.id === id);
      state.rooms = state.rooms.filter(r => r.id !== id);

      if (targetRoom) {
        const parentFlr = state.floors.find(f => f.id === targetRoom.floorId);
        if (parentFlr) {
          parentFlr.roomsCount = state.rooms.filter(r => r.floorId === parentFlr.id).length;
        }
      }

      if (state.rooms.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },

    // --- 5. ROUTINES & RECURRING OPERATIONS (Daily, Weekly, Monthly, Shopping Lists, Trips) ---
    getRoutineById: (id) => (state.routines || []).find(r => r.id === id),
    createRoutine: (routineData) => {
      if (!Array.isArray(state.routines)) state.routines = [];
      const nextNum = state.routines.length + 1;
      const newRoutine = {
        id: routineData.id || `ROU${String(nextNum).padStart(3, '0')}`,
        title: routineData.title || 'New Operational Routine',
        category: routineData.category || 'Operations & Audits',
        frequency: routineData.frequency || 'Daily',
        scheduleTime: routineData.scheduleTime || 'Daily at 09:00 AM',
        assignedTo: routineData.assignedTo || 'Lead Director',
        locationId: routineData.locationId || null,
        buildingId: routineData.buildingId || null,
        priority: routineData.priority || 'Medium',
        status: routineData.status || 'In Progress',
        streak: parseInt(routineData.streak, 10) || 0,
        items: Array.isArray(routineData.items) ? routineData.items : [],
        metamodelTags: Array.isArray(routineData.metamodelTags) ? routineData.metamodelTags : ['#smart_facility']
      };
      state.routines.unshift(newRoutine);
      notifyChange();
      return newRoutine;
    },
    updateRoutine: (id, updatedData) => {
      if (!Array.isArray(state.routines)) return null;
      const idx = state.routines.findIndex(r => r.id === id);
      if (idx === -1) return null;
      state.routines[idx] = {
        ...state.routines[idx],
        ...updatedData
      };
      notifyChange();
      return state.routines[idx];
    },
    deleteRoutine: (id) => {
      if (!Array.isArray(state.routines)) return false;
      const initialLen = state.routines.length;
      state.routines = state.routines.filter(r => r.id !== id);
      if (state.routines.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },
    toggleRoutineItem: (routineId, itemId) => {
      const routine = ImpactData.getRoutineById(routineId);
      if (!routine || !Array.isArray(routine.items)) return null;
      const item = routine.items.find(i => i.id === itemId);
      if (item) {
        item.completed = !item.completed;
        const allCompleted = routine.items.every(i => i.completed);
        routine.status = allCompleted ? 'Completed' : 'In Progress';
        notifyChange();
        return { item, routine };
      }
      return null;
    },
    completeRoutine: (routineId) => {
      const routine = ImpactData.getRoutineById(routineId);
      if (!routine) return null;
      routine.items.forEach(i => i.completed = true);
      routine.status = 'Completed';
      routine.streak = (routine.streak || 0) + 1;
      notifyChange();
      return routine;
    },

    // --- 6. UNIFIED FINANCIAL MANAGEMENT ACROSS METAMODEL (Income, Spendings, Assets, Liabilities) ---
    getFinancials: () => state.financials || [],
    getFinancialRecordById: (id) => (state.financials || []).find(f => f.id === id),
    createFinancialRecord: (finData) => {
      if (!Array.isArray(state.financials)) state.financials = [];
      const nextNum = state.financials.length + 1;
      const newRec = {
        id: finData.id || `FIN${String(nextNum).padStart(3, '0')}`,
        title: finData.title || 'New Financial Entry',
        type: finData.type || 'Income', // 'Income', 'Spending', 'Asset', 'Liability'
        amountUsdM: parseFloat(finData.amountUsdM || 10.0),
        frequency: finData.frequency || 'Annual',
        department: finData.department || DEPARTMENTS[0],
        owner: finData.owner || 'Financial Director',
        locationId: finData.locationId || null,
        projectId: finData.projectId || null,
        status: finData.status || 'Active',
        riskSensitivity: finData.riskSensitivity || 'Medium',
        description: finData.description || '',
        metamodelTags: Array.isArray(finData.metamodelTags) ? finData.metamodelTags : ['#budget']
      };
      state.financials.unshift(newRec);
      notifyChange();
      return newRec;
    },
    updateFinancialRecord: (id, updatedData) => {
      if (!Array.isArray(state.financials)) return null;
      const idx = state.financials.findIndex(f => f.id === id);
      if (idx === -1) return null;
      state.financials[idx] = {
        ...state.financials[idx],
        ...updatedData,
        amountUsdM: parseFloat(updatedData.amountUsdM ?? state.financials[idx].amountUsdM)
      };
      notifyChange();
      return state.financials[idx];
    },
    deleteFinancialRecord: (id) => {
      if (!Array.isArray(state.financials)) return false;
      const initialLen = state.financials.length;
      state.financials = state.financials.filter(f => f.id !== id);
      if (state.financials.length !== initialLen) {
        notifyChange();
        return true;
      }
      return false;
    },
    getFinancialSummary: () => {
      const records = state.financials || [];
      let totalIncome = 0;
      let totalSpendings = 0;
      let totalAssets = 0;
      let totalLiabilities = 0;

      records.forEach(r => {
        const val = parseFloat(r.amountUsdM || 0);
        if (r.type === 'Income') totalIncome += val;
        else if (r.type === 'Spending') totalSpendings += val;
        else if (r.type === 'Asset') totalAssets += val;
        else if (r.type === 'Liability') totalLiabilities += val;
      });

      return {
        totalIncome: Math.round(totalIncome * 10) / 10,
        totalSpendings: Math.round(totalSpendings * 10) / 10,
        totalAssets: Math.round(totalAssets * 10) / 10,
        totalLiabilities: Math.round(totalLiabilities * 10) / 10,
        netWorth: Math.round((totalAssets - totalLiabilities) * 10) / 10,
        netFiscalMargin: Math.round((totalIncome - totalSpendings) * 10) / 10,
        totalRecords: records.length
      };
    },

    // MetaModel Query Helpers
    getRoomsByMetaModelTag: (tag) => {
      if (!tag || tag === 'ALL') return state.rooms;
      return state.rooms.filter(r => r.metamodelTags && r.metamodelTags.includes(tag));
    },

    // System reset
    resetToDemoData: () => {
      localStorage.removeItem(STORAGE_KEY);
      init(true);
      notifyChange();
    }
  };
})();
