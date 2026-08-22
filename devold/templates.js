/**
 * templates.js - Pre-Packaged Starter Templates (v3.0 Polymorphic Entity Model)
 * Phase 2.1: Contains structured JSON presets with polymorphic entity connections
 */

const Templates = {
    // ==========================================
    // Routine Templates (BPMN Process Models with multi-stop and multi-person support)
    // ==========================================
    routines: {
        'template-morning-reset': {
            id: 'template-morning-reset',
            name: 'Morning Reset',
            category: 'Daily',
            description: 'Start your day right with this energizing morning routine',
            status: 'active',
            totalDuration: 60,
            isRecurring: true,
            recurrencePattern: 'daily',
            locationStops: [],
            assignedPersons: [],
            bpmn: {
                definitionId: 'bpmn-morning-reset-v1',
                name: 'Morning Reset Routine',
                version: '1.0',
                startEvent: { id: 'start', name: 'Wake Up' },
                tasks: [],
                endEvent: { id: 'end', name: 'Ready for Day' }
            },
            steps: [
                { id: 'step-1', name: 'Wake up & stretch', type: 'Action', order: 1, tags: ['health'], repeatCount: 1 },
                { id: 'step-2', name: 'Hydrate & vitamins', type: 'Action', order: 2, tags: ['health'], repeatCount: 1 },
                { id: 'step-3', name: 'Prepare breakfast', type: 'Action', order: 3, tags: ['food'], repeatCount: 1 },
                { id: 'step-4', name: 'Review daily goals', type: 'Check', order: 4, tags: ['planning'], repeatCount: 1 },
                { id: 'step-5', name: 'Get dressed', type: 'Action', order: 5, tags: ['personal'], repeatCount: 1 },
                { id: 'step-6', name: 'Leave for work/activity', type: 'Action', order: 6, tags: ['transition'], repeatCount: 1 }
            ],
            tags: ['morning', 'daily', 'routine', 'health'],
            createdAt: new Date().toISOString()
        },
        'template-evening-winddown': {
            id: 'template-evening-winddown',
            name: 'Evening Wind Down',
            category: 'Daily',
            description: 'Relaxing evening routine to prepare for restful sleep',
            status: 'active',
            totalDuration: 90,
            isRecurring: true,
            recurrencePattern: 'daily',
            locationStops: [],
            assignedPersons: [],
            bpmn: {
                definitionId: 'bpmn-evening-winddown-v1',
                name: 'Evening Wind Down Routine',
                version: '1.0',
                startEvent: { id: 'start', name: 'Dinner Time' },
                tasks: [],
                endEvent: { id: 'end', name: 'Sleep Time' }
            },
            steps: [
                { id: 'step-1', name: 'Prepare/light dinner', type: 'Action', order: 1, tags: ['food'], repeatCount: 1 },
                { id: 'step-2', name: 'Clean kitchen', type: 'Action', order: 2, tags: ['chores'], repeatCount: 1 },
                { id: 'step-3', name: 'Relax & unwind', type: 'Action', order: 3, tags: ['leisure'], repeatCount: 1 },
                { id: 'step-4', name: 'Skincare & hygiene', type: 'Action', order: 4, tags: ['personal'], repeatCount: 1 },
                { id: 'step-5', name: 'Read or meditate', type: 'Action', order: 5, tags: ['wellness'], repeatCount: 1 },
                { id: 'step-6', name: 'Lights out', type: 'Action', order: 6, tags: ['transition'], repeatCount: 1 }
            ],
            tags: ['evening', 'daily', 'sleep', 'relaxation'],
            createdAt: new Date().toISOString()
        },
        'template-work-start': {
            id: 'template-work-start',
            name: 'Work Day Kickoff',
            category: 'Work',
            description: 'Productive start to your workday',
            status: 'active',
            totalDuration: 55,
            isRecurring: true,
            recurrencePattern: 'daily',
            locationStops: [],
            assignedPersons: [],
            bpmn: {
                definitionId: 'bpmn-work-start-v1',
                name: 'Work Day Kickoff',
                version: '1.0',
                startEvent: { id: 'start', name: 'Open Laptop' },
                tasks: [],
                endEvent: { id: 'end', name: 'Ready to Work' }
            },
            steps: [
                { id: 'step-1', name: 'Check emails', type: 'Action', order: 1, tags: ['communication'], repeatCount: 1 },
                { id: 'step-2', name: 'Review task list', type: 'Check', order: 2, tags: ['planning'], repeatCount: 1 },
                { id: 'step-3', name: 'Prioritize tasks', type: 'Check', order: 3, tags: ['planning'], repeatCount: 1 },
                { id: 'step-4', name: 'Set daily targets', type: 'Action', order: 4, tags: ['planning'], repeatCount: 1 },
                { id: 'step-5', name: 'Team standup meeting', type: 'Action', order: 5, tags: ['meeting'], repeatCount: 1 }
            ],
            tags: ['work', 'morning', 'productivity'],
            createdAt: new Date().toISOString()
        },
        'template-weekend-family-trip': {
            id: 'template-weekend-family-trip',
            name: 'Weekend Family Trip',
            category: 'Family',
            description: 'Weekend family outing with multiple stops and planned activities',
            status: 'active',
            totalDuration: 480,
            isRecurring: false,
            recurrencePattern: 'weekly',
            locationStops: [
                {
                    id: 'stop-home-depart',
                    order: 1,
                    stopName: 'Home - Departure',
                    locationId: 'pin-home-001',
                    locationType: 'mapPin',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 15,
                    description: 'Family departs from home',
                    tags: ['home', 'departure']
                },
                {
                    id: 'stop-park',
                    order: 2,
                    stopName: 'City Park',
                    locationId: '',
                    locationType: 'custom',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 120,
                    description: 'Family time at the park',
                    tags: ['outdoor', 'recreation']
                },
                {
                    id: 'stop-restaurant',
                    order: 3,
                    stopName: 'Family Restaurant',
                    locationId: '',
                    locationType: 'custom',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 60,
                    description: 'Lunch break',
                    tags: ['food', 'dining']
                },
                {
                    id: 'stop-home-return',
                    order: 4,
                    stopName: 'Home - Return',
                    locationId: 'pin-home-001',
                    locationType: 'mapPin',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 30,
                    description: 'Return home',
                    tags: ['home', 'arrival']
                }
            ],
            assignedPersons: [
                { contactId: 'contact-father-001', role: 'organizer', confirmed: true },
                { contactId: 'contact-mother-002', role: 'participant', confirmed: true },
                { contactId: 'contact-kid1-003', role: 'participant', confirmed: true },
                { contactId: 'contact-kid2-004', role: 'participant', confirmed: true }
            ],
            steps: [],
            tags: ['family', 'weekend', 'trip', 'outdoor'],
            createdAt: new Date().toISOString()
        }
    },

    // ==========================================
    // Floor Plan Templates (v3.0 with building connections)
    // ==========================================
    floorPlans: {
        'template-studio-apartment': {
            id: 'template-studio-apartment',
            name: 'Studio Apartment',
            description: 'Compact studio apartment layout',
            status: 'active',
            buildingId: null,
            rooms: [
                { id: 'room-1', name: 'Living/Sleeping Area', tags: ['common', 'living'], status: 'Good', area: '25m2', equipment: [] },
                { id: 'room-2', name: 'Kitchenette', tags: ['cooking', 'kitchen'], status: 'Good', area: '8m2', equipment: [] },
                { id: 'room-3', name: 'Bathroom', tags: ['bathroom'], status: 'Good', area: '5m2', equipment: [] },
                { id: 'room-4', name: 'Entryway', tags: ['entry', 'storage'], status: 'Good', area: '4m2', equipment: [] }
            ],
            tags: ['apartment', 'studio', 'compact'],
            createdAt: new Date().toISOString()
        },
        'template-3br-house': {
            id: 'template-3br-house',
            name: '3BR Family House',
            description: 'Spacious 3-bedroom family home',
            status: 'active',
            buildingId: null,
            rooms: [
                { id: 'room-1', name: 'Grand Living Room', tags: ['common', 'entertainment'], status: 'Good', area: '40m2', equipment: [] },
                { id: 'room-2', name: 'Master Suite', tags: ['bedroom', 'private'], status: 'Good', area: '22m2', equipment: [] },
                { id: 'room-3', name: 'Kids Bedroom', tags: ['bedroom', 'private'], status: 'Good', area: '16m2', equipment: [] },
                { id: 'room-4', name: 'Guest Bedroom', tags: ['bedroom', 'guest'], status: 'Good', area: '14m2', equipment: [] },
                { id: 'room-5', name: 'Gourmet Kitchen', tags: ['cooking', 'common'], status: 'Good', area: '18m2', equipment: [] },
                { id: 'room-6', name: 'Dining Room', tags: ['dining', 'common'], status: 'Good', area: '15m2', equipment: [] },
                { id: 'room-7', name: 'Main Bathroom', tags: ['bathroom', 'common'], status: 'Good', area: '10m2', equipment: [] },
                { id: 'room-8', name: 'Ensuite Bathroom', tags: ['bathroom', 'private'], status: 'Good', area: '8m2', equipment: [] },
                { id: 'room-9', name: 'Garage', tags: ['parking', 'storage'], status: 'Good', area: '30m2', equipment: [] }
            ],
            tags: ['house', 'family', 'residential'],
            createdAt: new Date().toISOString()
        },
        'template-open-office': {
            id: 'template-open-office',
            name: 'Startup Office Layout',
            description: 'Modern open-plan startup office',
            status: 'active',
            buildingId: null,
            rooms: [
                { id: 'room-1', name: 'Reception', tags: ['entry', 'common'], status: 'Good', area: '20m2', equipment: [] },
                { id: 'room-2', name: 'Open Workspace', tags: ['work', 'open-plan'], status: 'Good', area: '150m2', equipment: [] },
                { id: 'room-3', name: 'Focus Rooms', tags: ['focus', 'private'], status: 'Good', area: '20m2', equipment: [] },
                { id: 'room-4', name: 'Meeting Room', tags: ['meeting', 'collaboration'], status: 'Good', area: '25m2', equipment: [] },
                { id: 'room-5', name: 'Kitchen & Lounge', tags: ['kitchen', 'relaxation'], status: 'Good', area: '30m2', equipment: [] },
                { id: 'room-6', name: 'Server Closet', tags: ['IT', 'secure'], status: 'Good', area: '12m2', equipment: [] }
            ],
            tags: ['office', 'startup', 'commercial'],
            createdAt: new Date().toISOString()
        }
    },

    // ==========================================
    // Building Templates (v3.0 spatial hierarchy)
    // ==========================================
    buildings: {
        'template-family-home': {
            id: 'template-family-home',
            name: 'Family Home',
            description: 'Two-story family residence with 4 rooms',
            address: '',
            coordinates: { lat: 0, lng: 0 },
            tags: ['residential', 'family'],
            floors: [
                {
                    id: 'floor-1',
                    name: 'Ground Floor',
                    number: 1,
                    rooms: [
                        {
                            id: 'room-g1',
                            name: 'Living Room',
                            type: 'common',
                            capacity: 6,
                            tags: ['relaxation', 'common'],
                            assignedContacts: [],
                            equipment: ['TV', 'Sofa', 'AC']
                        },
                        {
                            id: 'room-g2',
                            name: 'Kitchen',
                            type: 'utility',
                            capacity: 3,
                            tags: ['cooking', 'utility'],
                            assignedContacts: [],
                            equipment: ['Refrigerator', 'Oven', 'Microwave']
                        },
                        {
                            id: 'room-g3',
                            name: 'Guest Bathroom',
                            type: 'utility',
                            capacity: 2,
                            tags: ['bathroom', 'common'],
                            assignedContacts: [],
                            equipment: ['Shower', 'Toilet']
                        }
                    ]
                },
                {
                    id: 'floor-2',
                    name: 'Upper Floor',
                    number: 2,
                    rooms: [
                        {
                            id: 'room-2-1',
                            name: 'Master Bedroom',
                            type: 'bedroom',
                            capacity: 2,
                            tags: ['bedroom', 'private'],
                            assignedContacts: [],
                            equipment: ['King Bed', 'Wardrobe']
                        },
                        {
                            id: 'room-2-2',
                            name: 'Children Bedroom',
                            type: 'bedroom',
                            capacity: 2,
                            tags: ['bedroom', 'private'],
                            assignedContacts: [],
                            equipment: ['Bunk Bed', 'Desk']
                        },
                        {
                            id: 'room-2-3',
                            name: 'Study Room',
                            type: 'office',
                            capacity: 2,
                            tags: ['office', 'study'],
                            assignedContacts: [],
                            equipment: ['Desk', 'Bookshelf', 'Computer']
                        }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        },
        'template-office-building': {
            id: 'template-office-building',
            name: 'Office Building',
            description: 'Multi-floor commercial office building',
            address: '',
            coordinates: { lat: 0, lng: 0 },
            tags: ['commercial', 'office'],
            floors: [
                {
                    id: 'floor-office-1',
                    name: 'Ground Floor',
                    number: 0,
                    rooms: [
                        {
                            id: 'room-reception',
                            name: 'Reception',
                            type: 'common',
                            capacity: 10,
                            tags: ['entry', 'common'],
                            assignedContacts: [],
                            equipment: ['Reception Desk', 'Waiting Chairs']
                        },
                        {
                            id: 'room-conference',
                            name: 'Main Conference Room',
                            type: 'meeting',
                            capacity: 20,
                            tags: ['meeting', 'collaboration'],
                            assignedContacts: [],
                            equipment: ['Projector', 'Conference Table', 'Whiteboard']
                        }
                    ]
                },
                {
                    id: 'floor-office-2',
                    name: 'Work Floor',
                    number: 1,
                    rooms: [
                        {
                            id: 'room-open-area',
                            name: 'Open Workspace',
                            type: 'work',
                            capacity: 30,
                            tags: ['work', 'open-plan'],
                            assignedContacts: [],
                            equipment: ['Desks', 'Computers']
                        },
                        {
                            id: 'room-break',
                            name: 'Break Room',
                            type: 'utility',
                            capacity: 10,
                            tags: ['break', 'relaxation'],
                            assignedContacts: [],
                            equipment: ['Kitchenette', 'Sofa', 'TV']
                        }
                    ]
                }
            ],
            createdAt: new Date().toISOString()
        }
    },

    // ==========================================
    // Contact/Org Templates (v3.0 with location associations)
    // ==========================================
    contacts: {
        'template-small-family': {
            id: 'template-small-family',
            name: 'Small Family (4 members)',
            description: '2 Parents + 2 Kids family structure with location associations',
            status: 'active',
            members: [
                {
                    id: 'contact-father',
                    name: 'Father',
                    role: 'Parent',
                    tags: ['family', 'parent'],
                    reportsTo: null,
                    skillTags: ['provider', 'support'],
                    category: 'family',
                    locationAssociations: [
                        { locationId: 'pin-home', locationType: 'mapPin', associationType: 'home', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-mother',
                    name: 'Mother',
                    role: 'Parent',
                    tags: ['family', 'parent'],
                    reportsTo: null,
                    skillTags: ['caregiver', 'educator'],
                    category: 'family',
                    locationAssociations: [
                        { locationId: 'pin-home', locationType: 'mapPin', associationType: 'home', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'child-1',
                    name: 'Child 1',
                    role: 'Son/Daughter',
                    tags: ['family', 'child'],
                    reportsTo: 'contact-father',
                    skillTags: ['student', 'learner'],
                    category: 'family',
                    locationAssociations: [
                        { locationId: 'pin-home', locationType: 'mapPin', associationType: 'home', assignedAt: new Date().toISOString() },
                        { locationId: 'pin-school', locationType: 'mapPin', associationType: 'frequent', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'child-2',
                    name: 'Child 2',
                    role: 'Son/Daughter',
                    tags: ['family', 'child'],
                    reportsTo: 'contact-father',
                    skillTags: ['student', 'learner'],
                    category: 'family',
                    locationAssociations: [
                        { locationId: 'pin-home', locationType: 'mapPin', associationType: 'home', assignedAt: new Date().toISOString() },
                        { locationId: 'pin-school', locationType: 'mapPin', associationType: 'frequent', assignedAt: new Date().toISOString() }
                    ]
                }
            ],
            tags: ['family', 'kinship'],
            createdAt: new Date().toISOString()
        },
        'template-startup-team': {
            id: 'template-startup-team',
            name: 'Startup Team (8 members)',
            description: 'Typical early-stage startup org structure with office location',
            status: 'active',
            members: [
                {
                    id: 'contact-ceo',
                    name: 'CEO',
                    role: 'Chief Executive Officer',
                    tags: ['executive', 'leadership'],
                    reportsTo: null,
                    skillTags: ['strategy', 'vision'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-cto',
                    name: 'CTO',
                    role: 'Chief Technology Officer',
                    tags: ['executive', 'technology'],
                    reportsTo: 'contact-ceo',
                    skillTags: ['engineering', 'architecture'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-cpo',
                    name: 'CPO',
                    role: 'Chief Product Officer',
                    tags: ['executive', 'product'],
                    reportsTo: 'contact-ceo',
                    skillTags: ['product', 'design'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-lead-dev',
                    name: 'Lead Developer',
                    role: 'Senior Engineer',
                    tags: ['engineering', 'development'],
                    reportsTo: 'contact-cto',
                    skillTags: ['coding', 'mentoring'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-designer',
                    name: 'UX Designer',
                    role: 'Design Lead',
                    tags: ['design', 'ux'],
                    reportsTo: 'contact-cpo',
                    skillTags: ['ui', 'ux', 'research'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-marketer',
                    name: 'Growth Marketer',
                    role: 'Marketing Specialist',
                    tags: ['marketing', 'growth'],
                    reportsTo: 'contact-ceo',
                    skillTags: ['digital', 'analytics'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-jr-dev',
                    name: 'Junior Developer',
                    role: 'Developer',
                    tags: ['engineering', 'development'],
                    reportsTo: 'contact-lead-dev',
                    skillTags: ['learning', 'coding'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-intern',
                    name: 'Design Intern',
                    role: 'Intern',
                    tags: ['design', 'intern'],
                    reportsTo: 'contact-designer',
                    skillTags: ['learning', 'support'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                }
            ],
            tags: ['startup', 'corporate', 'team'],
            createdAt: new Date().toISOString()
        },
        'template-corporate-dept': {
            id: 'template-corporate-dept',
            name: 'Corporate Department (5 units)',
            description: 'Standard 5-department corporate structure with office assignments',
            status: 'active',
            members: [
                {
                    id: 'contact-vp',
                    name: 'VP',
                    role: 'Vice President',
                    tags: ['executive', 'management'],
                    reportsTo: null,
                    skillTags: ['leadership', 'strategy'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-ops-mgr',
                    name: 'Operations Manager',
                    role: 'Operations',
                    tags: ['operations', 'management'],
                    reportsTo: 'contact-vp',
                    skillTags: ['operations', 'process'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-fin-mgr',
                    name: 'Finance Manager',
                    role: 'Finance',
                    tags: ['finance', 'management'],
                    reportsTo: 'contact-vp',
                    skillTags: ['finance', 'reporting'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-hr-mgr',
                    name: 'HR Manager',
                    role: 'Human Resources',
                    tags: ['hr', 'management'],
                    reportsTo: 'contact-vp',
                    skillTags: ['recruitment', 'culture'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-sales-mgr',
                    name: 'Sales Manager',
                    role: 'Sales',
                    tags: ['sales', 'management'],
                    reportsTo: 'contact-vp',
                    skillTags: ['business', 'clients'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                },
                {
                    id: 'contact-supervisor',
                    name: 'Team Supervisor',
                    role: 'Supervisor',
                    tags: ['operations', 'supervision'],
                    reportsTo: 'contact-ops-mgr',
                    skillTags: ['coordination', 'execution'],
                    category: 'corporate',
                    locationAssociations: [
                        { locationId: 'pin-work', locationType: 'mapPin', associationType: 'work', assignedAt: new Date().toISOString() }
                    ]
                }
            ],
            tags: ['corporate', 'department'],
            createdAt: new Date().toISOString()
        }
    },

    // ==========================================
    // Map Pin Templates (v3.0 with polymorphic connections)
    // ==========================================
    mapPins: {
        'template-essential-locations': {
            id: 'template-essential-locations',
            name: 'Essential Locations',
            description: 'Common essential location presets with polymorphic connections',
            status: 'active',
            pins: [
                {
                    id: 'pin-home',
                    name: 'Home',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    category: 'residential',
                    tags: ['home', 'primary', 'essential'],
                    connectedContacts: [],
                    connectedRoutines: [],
                    connectedBuilding: null
                },
                {
                    id: 'pin-work',
                    name: 'Work',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    category: 'work',
                    tags: ['work', 'office', 'essential'],
                    connectedContacts: [],
                    connectedRoutines: [],
                    connectedBuilding: null
                },
                {
                    id: 'pin-school',
                    name: 'School',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    category: 'education',
                    tags: ['school', 'education', 'essential'],
                    connectedContacts: [],
                    connectedRoutines: [],
                    connectedBuilding: null
                },
                {
                    id: 'pin-hospital',
                    name: 'Hospital',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    category: 'healthcare',
                    tags: ['health', 'emergency', 'essential'],
                    connectedContacts: [],
                    connectedRoutines: [],
                    connectedBuilding: null
                },
                {
                    id: 'pin-grocery',
                    name: 'Grocery Store',
                    address: '',
                    latitude: 0,
                    longitude: 0,
                    category: 'shopping',
                    tags: ['shopping', 'food', 'essential'],
                    connectedContacts: [],
                    connectedRoutines: [],
                    connectedBuilding: null
                }
            ],
            tags: ['locations', 'essentials'],
            createdAt: new Date().toISOString()
        }
    },

    // ==========================================
    // Plan Templates (v3.0 trip plans)
    // ==========================================
    plans: {
        'template-business-trip': {
            id: 'template-business-trip',
            name: 'Business Trip Plan',
            description: 'Multi-day business trip with meetings and travel',
            type: 'travel',
            tags: ['business', 'travel', 'meetings'],
            documents: [],
            createdAt: new Date().toISOString()
        },
        'template-vacation-plan': {
            id: 'template-vacation-plan',
            name: 'Vacation Plan',
            description: 'Family vacation with daily activities and locations',
            type: 'travel',
            tags: ['vacation', 'family', 'recreation'],
            documents: [],
            createdAt: new Date().toISOString()
        }
    },

    // ==========================================
    // Utility Methods
    // ==========================================

    /**
     * Get a template by category and ID
     */
    get(category, id) {
        if (this[category] && this[category][id]) {
            return JSON.parse(JSON.stringify(this[category][id]));
        }
        return null;
    },

    /**
     * List all template IDs for a category
     */
    list(category) {
        if (this[category]) {
            return Object.keys(this[category]);
        }
        return [];
    },

    /**
     * Convert a template to a workspace item (removes 'template-' prefix from ID, adds new timestamps)
     */
    toWorkspaceItem(category, id) {
        const template = this.get(category, id);
        if (!template) return null;

        const item = JSON.parse(JSON.stringify(template));
        // Remove template prefix from ID
        item.id = item.id.replace('template-', '');
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();

        return item;
    },

    /**
     * Get all templates across categories
     */
    getAll() {
        const all = {};
        Object.keys(this).forEach(key => {
            if (key !== 'get' && key !== 'list' && key !== 'toWorkspaceItem' && key !== 'getAll') {
                all[key] = this[key];
            }
        });
        return all;
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Templates = Templates;
}