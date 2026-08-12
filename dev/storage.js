/**
 * storage.js - LocalStorage Schema & Versioned Migration Engine
 * Phase 1.2: Handles local state persistence, initial schema seeding, and version checks
 */

const SCHEMA_VERSION = '5.0';

// Default workspace structure - v5.0 Polymorphic Entity Model with Competence Tracking
const DEFAULT_WORKSPACE = {
    version: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Spatial Hierarchy: Buildings with nested floors and rooms
    buildings: [],
    
    // Map Locations (geographic level)
    mapPins: [],
    
    // Contacts with polymorphic location associations
    contacts: [],
    
    // Routines/Trips with multi-stop and multi-person support
    routines: [],
    
    // Plans associated with trips/routines
    plans: [],
    
    // Calendar events (v4.0)
    calendarEvents: [],
    
    // Floor plans (legacy, now connected to buildings)
    floorPlans: [],
    
    // Alerts/Telemetry log
    alerts: [],
    
    // Maturity scores (v4.0)
    maturityScores: {
        financial: { currentScore: 0, targetScore: 70, lastEvaluated: null },
        health: { currentScore: 0, targetScore: 80, lastEvaluated: null },
        skills: { currentScore: 0, targetScore: 75, lastEvaluated: null }
    },
    
    // Competence & Consciousness Tracking (v5.0 - Phase 7)
    competenceDomains: [],
    
    // Personal Development Path (v5.0)
    developmentPath: {
        currentStage: 'sensing',
        progression: [],
        nextRecommendedAction: '',
        lastReview: null
    },
    
    // Telemetry Baselines (v5.0)
    telemetryBaselines: {
        sleep: { avgHours: 0, targetHours: 8, source: 'manual' },
        movement: { avgSteps: 0, targetSteps: 10000, source: 'manual' },
        utilitySpend: { avgMonthly: 0, targetMonthly: 0, source: 'manual' },
        stress: { avgLevel: 0, targetLevel: 3, source: 'manual' }
    },
    
    // Family Status (v5.0 - Stage 4)
    familyStatus: {
        members: []
    },
    
    // Repetition Stats (v5.0)
    repetitionStats: {
        routines: {},
        habits: {}
    },
    
    // Risk Register (v5.0)
    riskRegister: [],
    
    // User preferences
    preferences: {
        mode: 'lite', // 'lite' or 'power'
        theme: 'light',
        sidebarCollapsed: false,
        defaultView: 'dashboard',
        rightPanelCollapsed: true,
        rightPanelActiveTab: 'domains'
    }
};

/**
 * Initialize storage with default schema if empty
 */
function initStorage() {
    const existing = localStorage.getItem('pwa_workspace');
    const existingMode = localStorage.getItem('pwa_user_mode');
    
    if (!existing) {
        // First time setup - seed defaults
        const workspace = JSON.parse(JSON.stringify(DEFAULT_WORKSPACE));
        workspace.buildings = getDefaultBuildings();
        workspace.routines = getDefaultRoutines();
        workspace.floorPlans = getDefaultFloorPlans();
        workspace.contacts = getDefaultContacts();
        workspace.mapPins = getDefaultMapPins();
        workspace.plans = getDefaultPlans();
        saveWorkspaceData(workspace);
    } else {
        // Check version and migrate if needed
        const workspace = JSON.parse(existing);
        if (workspace.version && compareVersions(workspace.version, SCHEMA_VERSION) < 0) {
            migrateWorkspace(workspace);
            saveWorkspaceData(workspace);
        }
    }
    
    // Set mode from localStorage or default to lite
    if (existingMode) {
        document.body.className = existingMode === 'power' ? 'power-mode' : '';
    } else {
        localStorage.setItem('pwa_user_mode', 'lite');
    }
    
    return getWorkspaceData();
}

/**
 * Get complete workspace data
 */
function getWorkspaceData() {
    const data = localStorage.getItem('pwa_workspace');
    return data ? JSON.parse(data) : null;
}

/**
 * Save complete workspace data
 */
function saveWorkspaceData(workspace) {
    workspace.updatedAt = new Date().toISOString();
    workspace.version = SCHEMA_VERSION;
    localStorage.setItem('pwa_workspace', JSON.stringify(workspace));
}

/**
 * Get a specific routine by ID
 */
function getRoutine(id) {
    const workspace = getWorkspaceData();
    return workspace?.routines?.find(r => r.id === id) || null;
}

/**
 * Save a routine (supports polymorphic locationStops and assignedPersons)
 */
function saveRoutine(routine) {
    const workspace = getWorkspaceData();
    if (!workspace?.routines) workspace.routines = [];
    
    const existingIndex = workspace.routines.findIndex(r => r.id === routine.id);
    if (existingIndex >= 0) {
        workspace.routines[existingIndex] = { ...routine, updatedAt: new Date().toISOString() };
    } else {
        routine.createdAt = new Date().toISOString();
        workspace.routines.push(routine);
    }
    
    saveWorkspaceData(workspace);
    return routine;
}

/**
 * Delete a routine by ID (cascades to plans, handles orphaned location references)
 */
function deleteRoutine(id) {
    const workspace = getWorkspaceData();
    // Also delete associated plans
    workspace.plans = workspace.plans?.filter(p => p.routineId !== id) || [];
    // Remove routine from mapPins connections
    if (workspace.mapPins) {
        workspace.mapPins.forEach(pin => {
            if (pin.connectedRoutines) {
                pin.connectedRoutines = pin.connectedRoutines.filter(rId => rId !== id);
            }
        });
    }
    workspace.routines = workspace.routines?.filter(r => r.id !== id) || [];
    saveWorkspaceData(workspace);
}

/**
 * Get all buildings with nested floors and rooms
 */
function getBuildings() {
    const workspace = getWorkspaceData();
    return workspace?.buildings || [];
}

/**
 * Save a building
 */
function saveBuilding(building) {
    const workspace = getWorkspaceData();
    if (!workspace?.buildings) workspace.buildings = [];
    
    const existingIndex = workspace.buildings.findIndex(b => b.id === building.id);
    if (existingIndex >= 0) {
        workspace.buildings[existingIndex] = { ...building, updatedAt: new Date().toISOString() };
    } else {
        building.createdAt = new Date().toISOString();
        workspace.buildings.push(building);
    }
    
    saveWorkspaceData(workspace);
    return building;
}

/**
 * Delete a building by ID
 */
function deleteBuilding(id) {
    const workspace = getWorkspaceData();
    workspace.buildings = workspace.buildings?.filter(b => b.id !== id) || [];
    // Clean up references in contacts and mapPins
    if (workspace.contacts) {
        workspace.contacts.forEach(contact => {
            if (contact.locationAssociations) {
                contact.locationAssociations = contact.locationAssociations.filter(
                    la => la.locationId !== id || la.locationType !== 'building'
                );
            }
        });
    }
    if (workspace.mapPins) {
        workspace.mapPins.forEach(pin => {
            if (pin.connectedBuilding === id) {
                pin.connectedBuilding = null;
            }
        });
    }
    saveWorkspaceData(workspace);
}

/**
 * Get a building floor by buildingId and floorId
 */
function getFloor(buildingId, floorId) {
    const workspace = getWorkspaceData();
    const building = workspace?.buildings?.find(b => b.id === buildingId);
    return building?.floors?.find(f => f.id === floorId) || null;
}

/**
 * Get a room by buildingId, floorId, and roomId
 */
function getRoom(buildingId, floorId, roomId) {
    const floor = getFloor(buildingId, floorId);
    return floor?.rooms?.find(r => r.id === roomId) || null;
}

/**
 * Get a specific floor plan by ID
 */
function getFloorPlan(id) {
    const workspace = getWorkspaceData();
    return workspace?.floorPlans?.find(f => f.id === id) || null;
}

/**
 * Save a floor plan (supports buildingId polymorphic connection)
 */
function saveFloorPlan(floorPlan) {
    const workspace = getWorkspaceData();
    if (!workspace?.floorPlans) workspace.floorPlans = [];
    
    const existingIndex = workspace.floorPlans.findIndex(f => f.id === floorPlan.id);
    if (existingIndex >= 0) {
        workspace.floorPlans[existingIndex] = { ...floorPlan, updatedAt: new Date().toISOString() };
    } else {
        floorPlan.createdAt = new Date().toISOString();
        workspace.floorPlans.push(floorPlan);
    }
    
    saveWorkspaceData(workspace);
    return floorPlan;
}

/**
 * Delete a floor plan by ID
 */
function deleteFloorPlan(id) {
    const workspace = getWorkspaceData();
    workspace.floorPlans = workspace.floorPlans?.filter(f => f.id !== id) || [];
    saveWorkspaceData(workspace);
}

/**
 * Get all plans
 */
function getPlans() {
    const workspace = getWorkspaceData();
    return workspace?.plans || [];
}

/**
 * Save a plan (linked to a routine/trip)
 */
function savePlan(plan) {
    const workspace = getWorkspaceData();
    if (!workspace?.plans) workspace.plans = [];
    
    const existingIndex = workspace.plans.findIndex(p => p.id === plan.id);
    if (existingIndex >= 0) {
        workspace.plans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
        plan.createdAt = new Date().toISOString();
        workspace.plans.push(plan);
    }
    
    saveWorkspaceData(workspace);
    return plan;
}

/**
 * Delete a plan by ID
 */
function deletePlan(id) {
    const workspace = getWorkspaceData();
    workspace.plans = workspace.plans?.filter(p => p.id !== id) || [];
    saveWorkspaceData(workspace);
}

/**
 * Get plans by routine ID
 */
function getPlansByRoutine(routineId) {
    const workspace = getWorkspaceData();
    return workspace?.plans?.filter(p => p.routineId === routineId) || [];
}

/**
 * Get a specific contact by ID
 */
function getContact(id) {
    const workspace = getWorkspaceData();
    return workspace?.contacts?.find(c => c.id === id) || null;
}

/**
 * Save a contact (supports polymorphic locationAssociations)
 */
function saveContact(contact) {
    const workspace = getWorkspaceData();
    if (!workspace?.contacts) workspace.contacts = [];
    
    const existingIndex = workspace.contacts.findIndex(c => c.id === contact.id);
    if (existingIndex >= 0) {
        workspace.contacts[existingIndex] = { ...contact, updatedAt: new Date().toISOString() };
    } else {
        contact.createdAt = new Date().toISOString();
        workspace.contacts.push(contact);
    }
    
    // Update reverse references in mapPins
    if (contact.locationAssociations) {
        contact.locationAssociations.forEach(la => {
            if (la.locationType === 'mapPin' && workspace.mapPins) {
                const pin = workspace.mapPins.find(p => p.id === la.locationId);
                if (pin) {
                    if (!pin.connectedContacts) pin.connectedContacts = [];
                    if (!pin.connectedContacts.includes(contact.id)) {
                        pin.connectedContacts.push(contact.id);
                    }
                }
            }
        });
    }
    
    saveWorkspaceData(workspace);
    return contact;
}

/**
 * Delete a contact by ID (cascades to location associations and routine assignments)
 */
function deleteContact(id) {
    const workspace = getWorkspaceData();
    // Remove from location associations
    workspace.contacts = workspace.contacts?.filter(c => {
        if (c.id === id) return false;
        if (c.locationAssociations) {
            c.locationAssociations = c.locationAssociations.filter(la => la.locationId !== id);
        }
        return true;
    }) || [];
    // Remove from routine assignedPersons
    if (workspace.routines) {
        workspace.routines.forEach(routine => {
            if (routine.assignedPersons) {
                routine.assignedPersons = routine.assignedPersons.filter(ap => ap.contactId !== id);
            }
        });
    }
    // Remove from mapPins connectedContacts
    if (workspace.mapPins) {
        workspace.mapPins.forEach(pin => {
            if (pin.connectedContacts) {
                pin.connectedContacts = pin.connectedContacts.filter(cId => cId !== id);
            }
        });
    }
    saveWorkspaceData(workspace);
}

/**
 * Get contacts by location (polymorphic: mapPin, building, floor, or room)
 */
function getContactsByLocation(locationId, locationType) {
    const workspace = getWorkspaceData();
    return workspace?.contacts?.filter(c => 
        c.locationAssociations?.some(la => 
            la.locationId === locationId && la.locationType === locationType
        )
    ) || [];
}

/**
 * Get locations associated with a contact
 */
function getContactLocations(contactId) {
    const contact = getContact(contactId);
    return contact?.locationAssociations || [];
}

/**
 * Get a specific map pin by ID
 */
function getMapPin(id) {
    const workspace = getWorkspaceData();
    return workspace?.mapPins?.find(p => p.id === id) || null;
}

/**
 * Save a map pin (supports polymorphic connectedContacts, connectedRoutines, connectedBuilding)
 */
function saveMapPin(pin) {
    const workspace = getWorkspaceData();
    if (!workspace?.mapPins) workspace.mapPins = [];
    
    const existingIndex = workspace.mapPins.findIndex(p => p.id === pin.id);
    if (existingIndex >= 0) {
        workspace.mapPins[existingIndex] = { ...pin, updatedAt: new Date().toISOString() };
    } else {
        pin.createdAt = new Date().toISOString();
        workspace.mapPins.push(pin);
    }
    
    saveWorkspaceData(workspace);
    return pin;
}

/**
 * Delete a map pin by ID (cascades to connectedContacts and connectedRoutines)
 */
function deleteMapPin(id) {
    const workspace = getWorkspaceData();
    workspace.mapPins = workspace.mapPins?.filter(p => p.id !== id) || [];
    // Remove from contacts' locationAssociations
    if (workspace.contacts) {
        workspace.contacts.forEach(contact => {
            if (contact.locationAssociations) {
                contact.locationAssociations = contact.locationAssociations.filter(
                    la => !(la.locationId === id && la.locationType === 'mapPin')
                );
            }
        });
    }
    // Remove from routines' locationStops
    if (workspace.routines) {
        workspace.routines.forEach(routine => {
            if (routine.locationStops) {
                routine.locationStops = routine.locationStops.filter(
                    ls => !(ls.locationId === id && ls.locationType === 'mapPin')
                );
            }
        });
    }
    saveWorkspaceData(workspace);
}

/**
 * Get map pins by category
 */
function getMapPinsByCategory(category) {
    const workspace = getWorkspaceData();
    return workspace?.mapPins?.filter(p => p.category === category) || [];
}

/**
 * Get map pins connected to a routine
 */
function getMapPinsByRoutine(routineId) {
    const workspace = getWorkspaceData();
    return workspace?.mapPins?.filter(p => p.connectedRoutines?.includes(routineId)) || [];
}

/**
 * Get map pins connected to a building
 */
function getMapPinsByBuilding(buildingId) {
    const workspace = getWorkspaceData();
    return workspace?.mapPins?.filter(p => p.connectedBuilding === buildingId) || [];
}

/**
 * Add an alert to the workspace
 */
function addAlert(alert) {
    const workspace = getWorkspaceData();
    if (!workspace?.alerts) workspace.alerts = [];
    
    alert.timestamp = new Date().toISOString();
    workspace.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (workspace.alerts.length > 100) {
        workspace.alerts = workspace.alerts.slice(0, 100);
    }
    
    saveWorkspaceData(workspace);
    return alert;
}

/**
 * Get all alerts
 */
function getAlerts() {
    const workspace = getWorkspaceData();
    return workspace?.alerts || [];
}

/**
 * Clear all alerts
 */
function clearAlerts() {
    const workspace = getWorkspaceData();
    workspace.alerts = [];
    saveWorkspaceData(workspace);
}

/**
 * Update user preferences
 */
function updatePreferences(prefs) {
    const workspace = getWorkspaceData();
    workspace.preferences = { ...workspace.preferences, ...prefs };
    saveWorkspaceData(workspace);
}

/**
 * Get user preferences
 */
function getPreferences() {
    const workspace = getWorkspaceData();
    return workspace?.preferences || DEFAULT_WORKSPACE.preferences;
}

// ============================================
// Calendar Event Management (v5.0)
// ============================================

/**
 * Get all calendar events
 */
function getCalendarEvents() {
    const workspace = getWorkspaceData();
    return workspace?.calendarEvents || [];
}

/**
 * Get a calendar event by ID
 */
function getCalendarEvent(id) {
    const workspace = getWorkspaceData();
    return workspace?.calendarEvents?.find(e => e.id === id) || null;
}

/**
 * Save a calendar event
 */
function saveCalendarEvent(event) {
    const workspace = getWorkspaceData();
    if (!workspace?.calendarEvents) {
        workspace.calendarEvents = [];
    }
    
    const existingIndex = workspace.calendarEvents.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
        workspace.calendarEvents[existingIndex] = { ...event, updatedAt: new Date().toISOString() };
    } else {
        event.createdAt = new Date().toISOString();
        workspace.calendarEvents.push(event);
    }
    
    saveWorkspaceData(workspace);
    return event;
}

/**
 * Delete a calendar event by ID
 */
function deleteCalendarEvent(id) {
    const workspace = getWorkspaceData();
    workspace.calendarEvents = workspace?.calendarEvents?.filter(e => e.id !== id) || [];
    saveWorkspaceData(workspace);
}

/**
 * Get calendar events by type
 */
function getCalendarEventsByType(type) {
    const workspace = getWorkspaceData();
    return workspace?.calendarEvents?.filter(e => e.type === type) || [];
}

/**
 * Get calendar events by date range
 */
function getCalendarEventsByDateRange(startDate, endDate) {
    const workspace = getWorkspaceData();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return (workspace?.calendarEvents || []).filter(e => {
        const stackState = new Date(e.start).getTime();
        const eventEnd = e.endDate ? new Date(e.end).getTime() : eventStart;
        return eventStart <= end && eventEnd >= start;
    });
}

/**
 * Get calendar events by category/tags
 */
function getCalendarEventsByTag(tag) {
    const workspace = getWorkspaceData();
    return (workspace?.calendarEvents || []).filter(e => 
        e.tags && e.tags.includes(tag)
    );
}

/**
 * Clear all calendar events
 */
function clearCalendarEvents() {
    const workspace = getWorkspaceData();
    workspace.calendarEvents = [];
    saveWorkspaceData(workspace);
}

/**
 * Version comparison utility
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
function compareVersions(a, b) {
    const aParts = a.toString().split('.').map(Number);
    const bParts = b.toString().split('.').map(Number);
    const maxLen = Math.max(aParts.length, bParts.length);
    
    for (let i = 0; i < maxLen; i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart < bPart) return -1;
        if (aPart > bPart) return 1;
    }
    return 0;
}

/**
 * Migration function for version upgrades
 */
function migrateWorkspace(workspace) {
    const currentVersion = workspace.version || '1.0';
    
    // Migrate from 1.x to 2.0: Add default templates for Lite Mode
    if (compareVersions(currentVersion, '2.0') < 0) {
        console.log('Migrating workspace from version', currentVersion, 'to 2.0');
        
        if (!workspace.routines || workspace.routines.length === 0) {
            workspace.routines = getDefaultRoutines();
        }
        
        if (!workspace.floorPlans || workspace.floorPlans.length === 0) {
            workspace.floorPlans = getDefaultFloorPlans();
        }
        
        if (!workspace.contacts || workspace.contacts.length === 0) {
            workspace.contacts = getDefaultContacts();
        }
        
        if (!workspace.mapPins || workspace.mapPins.length === 0) {
            workspace.mapPins = getDefaultMapPins();
        }
        
        if (!workspace.alerts) {
            workspace.alerts = [];
        }
        
        if (!workspace.preferences) {
            workspace.preferences = {
                mode: 'lite',
                theme: 'light',
                sidebarCollapsed: false
            };
        }
    }
    
    // Migrate from 2.x to 3.0: Add polymorphic entity model
    if (currentVersion === '2.0' && compareVersions(currentVersion, '3.0') < 0) {
        console.log('Migrating workspace from version 2.0 to 3.0 (Polymorphic Entity Model)');
        
        // Add buildings array with spatial hierarchy
        if (!workspace.buildings) {
            workspace.buildings = [];
        }
        
        // Add plans array for trip plans
        if (!workspace.plans) {
            workspace.plans = [];
        }
        
        // Migrate contacts to add locationAssociations
        if (workspace.contacts && workspace.mapPins) {
            workspace.contacts.forEach(contact => {
                if (!contact.locationAssociations) {
                    contact.locationAssociations = [];
                    // Try to infer location from tags
                    if (contact.tags?.includes('family')) {
                        const homePin = workspace.mapPins.find(p => p.category === 'residential');
                        if (homePin) {
                            contact.locationAssociations.push({
                                locationId: homePin.id,
                                locationType: 'mapPin',
                                associationType: 'home',
                                assignedAt: new Date().toISOString()
                            });
                        }
                    } else if (contact.tags?.includes('corporate')) {
                        const workPin = workspace.mapPins.find(p => p.category === 'work');
                        if (workPin) {
                            contact.locationAssociations.push({
                                locationId: workPin.id,
                                locationType: 'mapPin',
                                associationType: 'work',
                                assignedAt: new Date().toISOString()
                            });
                        }
                    }
                }
            });
        }
        
        // Add polymorphic fields to mapPins
        if (workspace.mapPins) {
            workspace.mapPins.forEach(pin => {
                if (!pin.connectedContacts) pin.connectedContacts = [];
                if (!pin.connectedRoutines) pin.connectedRoutines = [];
                if (!pin.connectedBuilding) pin.connectedBuilding = null;
            });
        }
        
        // Enhance routines with trip-specific fields
        if (workspace.routines) {
            workspace.routines.forEach(routine => {
                if (!routine.totalDuration) routine.totalDuration = 0;
                if (!routine.startDate) routine.startDate = routine.createdAt;
                if (!routine.endDate) routine.endDate = routine.updatedAt || routine.createdAt;
                if (!routine.isRecurring) routine.isRecurring = false;
                if (!routine.recurrencePattern) routine.recurrencePattern = 'daily';
                if (!routine.locationStops) routine.locationStops = [];
                if (!routine.assignedPersons) routine.assignedPersons = [];
                if (!routine.status) routine.status = 'active';
            });
        }
        
        // Add buildingId to floorPlans
        if (workspace.floorPlans) {
            workspace.floorPlans.forEach(fp => {
                if (!fp.buildingId) fp.buildingId = null;
            });
        }
        
        // Update version
        workspace.version = '3.0';
    }

    // Migrate from 3.x to 4.0: Add calendar events, cost model, maturity scores
    if (currentVersion === '3.0' && compareVersions(currentVersion, '4.0') < 0) {
        console.log('Migrating workspace from version 3.0 to 4.0 (Cost Model & Calendar)');

        // Add calendar events array
        if (!workspace.calendarEvents) {
            workspace.calendarEvents = [];
        }

        // Add maturity scores
        if (!workspace.maturityScores) {
            workspace.maturityScores = {
                financial: { currentScore: 0, targetScore: 70, lastEvaluated: null },
                health: { currentScore: 0, targetScore: 80, lastEvaluated: null },
                skills: { currentScore: 0, targetScore: 75, lastEvaluated: null }
            };
        }

        // Add cost data to existing entities
        if (workspace.routines) {
            workspace.routines.forEach(routine => {
                if (!routine.cost) {
                    routine.cost = {
                        currency: 'USD',
                        budget: 0,
                        actual: 0,
                        categories: [],
                        income: [],
                        assets: [],
                        liabilities: []
                    };
                }
            });
        }

        if (workspace.contacts) {
            workspace.contacts.forEach(contact => {
                if (!contact.cost) {
                    contact.cost = {
                        currency: 'USD',
                        budget: 0,
                        actual: 0,
                        categories: [],
                        income: [],
                        assets: [],
                        liabilities: []
                    };
                }
            });
        }

        // Update version
        workspace.version = '4.0';
    }

    // Migrate from 4.x to 5.0: Add competence tracking, development path, telemetry
    if (currentVersion === '4.0' && compareVersions(currentVersion, '5.0') < 0) {
        console.log('Migrating workspace from version 4.0 to 5.0 (UX Touchpoint Matrix - Personal Digital Twin)');

        // Add competence domains
        if (!workspace.competenceDomains) {
            workspace.competenceDomains = [];
        }

        // Add development path
        if (!workspace.developmentPath) {
            workspace.developmentPath = {
                currentStage: 'sensing',
                progression: [],
                nextRecommendedAction: '',
                lastReview: null
            };
        }

        // Add telemetry baselines
        if (!workspace.telemetryBaselines) {
            workspace.telemetryBaselines = {
                sleep: { avgHours: 0, targetHours: 8, source: 'manual' },
                movement: { avgSteps: 0, targetSteps: 10000, source: 'manual' },
                utilitySpend: { avgMonthly: 0, targetMonthly: 0, source: 'manual' },
                stress: { avgLevel: 0, targetLevel: 3, source: 'manual' }
            };
        }

        // Add family status
        if (!workspace.familyStatus) {
            workspace.familyStatus = { members: [] };
        }

        // Add repetition stats
        if (!workspace.repetitionStats) {
            workspace.repetitionStats = { routines: {}, habits: {} };
        }

        // Add risk register
        if (!workspace.riskRegister) {
            workspace.riskRegister = [];
        }

        // Update preferences
        if (!workspace.preferences.rightPanelCollapsed) {
            workspace.preferences.rightPanelCollapsed = true;
            workspace.preferences.rightPanelActiveTab = 'domains';
            workspace.preferences.defaultView = 'dashboard';
        }

        // Update version
        workspace.version = '5.0';
    }
}

/**
 * Get default routines for fresh installation (v3.0 with multi-stop and multi-person support)
 */
function getDefaultRoutines() {
    return [
        {
            id: 'routine-morning-reset',
            name: 'Morning Reset',
            category: 'Daily',
            description: 'Start your day right with this morning routine',
            status: 'active',
            totalDuration: 45,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            isRecurring: true,
            recurrencePattern: 'daily',
            locationStops: [],
            assignedPersons: [],
            steps: [
                { id: 'step-1', name: 'Wake up & stretch', type: 'Action', order: 1, tags: ['health'], repeatCount: 1 },
                { id: 'step-2', name: 'Prepare breakfast', type: 'Action', order: 2, tags: ['food'], repeatCount: 1 },
                { id: 'step-3', name: 'Review daily goals', type: 'Check', order: 3, tags: ['planning'], repeatCount: 1 },
                { id: 'step-4', name: 'Get dressed', type: 'Action', order: 4, tags: ['personal'], repeatCount: 1 },
                { id: 'step-5', name: 'Leave for work/activity', type: 'Action', order: 5, tags: ['transition'], repeatCount: 1 }
            ],
            completedSteps: [],
            tags: ['morning', 'daily', 'routine'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'routine-daily-commute',
            name: 'Daily Commute Trip',
            category: 'Transport',
            description: 'Daily commute with multiple stops',
            status: 'active',
            totalDuration: 60,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            isRecurring: true,
            recurrencePattern: 'daily',
            locationStops: [
                {
                    id: 'stop-1',
                    order: 1,
                    stopName: 'Home',
                    locationId: 'pin-home-001',
                    locationType: 'mapPin',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 5,
                    description: 'Depart from home',
                    tags: ['home', 'departure']
                },
                {
                    id: 'stop-2',
                    order: 2,
                    stopName: 'Coffee Stop',
                    locationId: '',
                    locationType: 'custom',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 15,
                    description: 'Grab coffee',
                    tags: ['coffee', 'break']
                },
                {
                    id: 'stop-3',
                    order: 3,
                    stopName: 'Office',
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: 480,
                    description: 'Arrive at office',
                    tags: ['work', 'arrival']
                }
            ],
            assignedPersons: [
                { contactId: 'contact-father-001', role: 'organizer', confirmed: true }
            ],
            steps: [],
            completedSteps: [],
            tags: ['commute', 'daily', 'transport'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

/**
 * Get default floor plans for fresh installation (v3.0 with building connections)
 */
function getDefaultFloorPlans() {
    return [
        {
            id: 'floorplan-2br-apartment',
            name: '2BR Apartment',
            description: 'A standard 2-bedroom apartment layout',
            status: 'active',
            buildingId: null,
            rooms: [
                { id: 'room-1', name: 'Living Room', tags: ['common', 'relaxation'], status: 'Good', area: '30m2', equipment: [] },
                { id: 'room-2', name: 'Master Bedroom', tags: ['bedroom', 'private'], status: 'Good', area: '18m2', equipment: [] },
                { id: 'room-3', name: 'Second Bedroom', tags: ['bedroom', 'private'], status: 'Good', area: '14m2', equipment: [] },
                { id: 'room-4', name: 'Kitchen', tags: ['cooking', 'common'], status: 'Good', area: '12m2', equipment: [] },
                { id: 'room-5', name: 'Bathroom', tags: ['bathroom', 'common'], status: 'Good', area: '8m2', equipment: [] },
                { id: 'room-6', name: 'Balcony', tags: ['outdoor', 'relaxation'], status: 'Good', area: '10m2', equipment: [] }
            ],
            tags: ['apartment', 'residential'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'floorplan-corporate-office',
            name: 'Corporate Office Floor',
            description: 'Open plan office layout for ~50 employees',
            status: 'active',
            buildingId: null,
            rooms: [
                { id: 'room-1', name: 'Reception Area', tags: ['common', 'entry'], status: 'Good', area: '40m2', equipment: [] },
                { id: 'room-2', name: 'Open Workspace', tags: ['work', 'open-plan'], status: 'Good', area: '200m2', equipment: [] },
                { id: 'room-3', name: 'Meeting Room A', tags: ['meeting', 'private'], status: 'Good', area: '25m2', equipment: [] },
                { id: 'room-4', name: 'Meeting Room B', tags: ['meeting', 'private'], status: 'Good', area: '25m2', equipment: [] },
                { id: 'room-5', name: 'Kitchen/Break Room', tags: ['kitchen', 'common'], status: 'Good', area: '30m2', equipment: [] },
                { id: 'room-6', name: 'Manager Office', tags: ['office', 'private'], status: 'Good', area: '15m2', equipment: [] },
                { id: 'room-7', name: 'Server Room', tags: ['IT', 'secure'], status: 'Good', area: '20m2', equipment: [] }
            ],
            tags: ['office', 'commercial'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

/**
 * Get default buildings for fresh installation (v3.0 spatial hierarchy)
 */
function getDefaultBuildings() {
    return [
        {
            id: 'building-residential-001',
            name: 'Family Residence',
            address: '123 Main Street, Residential District',
            coordinates: { lat: 24.7136, lng: 46.6753 },
            tags: ['residential', 'family'],
            floors: [
                {
                    id: 'floor-1',
                    name: 'First Floor',
                    number: 1,
                    rooms: [
                        {
                            id: 'room-g1',
                            name: 'Living Room',
                            type: 'common',
                            capacity: 6,
                            tags: ['relaxation', 'common'],
                            assignedContacts: ['contact-father-001', 'contact-mother-002'],
                            equipment: ['TV', 'Sofa', 'AC']
                        },
                        {
                            id: 'room-g2',
                            name: 'Kitchen',
                            type: 'utility',
                            capacity: 2,
                            tags: ['cooking', 'utility'],
                            assignedContacts: ['contact-mother-002'],
                            equipment: ['Refrigerator', 'Oven', 'Microwave']
                        },
                        {
                            id: 'room-g3',
                            name: 'Balcony',
                            type: 'outdoor',
                            capacity: 4,
                            tags: ['outdoor', 'relaxation'],
                            assignedContacts: [],
                            equipment: ['Planters', 'Chairs']
                        }
                    ]
                },
                {
                    id: 'floor-2',
                    name: 'Second Floor',
                    number: 2,
                    rooms: [
                        {
                            id: 'room-2-1',
                            name: 'Master Bedroom',
                            type: 'bedroom',
                            capacity: 2,
                            tags: ['bedroom', 'private'],
                            assignedContacts: ['contact-father-001', 'contact-mother-002'],
                            equipment: ['King Bed', 'Wardrobe', 'AC']
                        },
                        {
                            id: 'room-2-2',
                            name: 'Child 1 Bedroom',
                            type: 'bedroom',
                            capacity: 1,
                            tags: ['bedroom', 'private'],
                            assignedContacts: ['contact-kid1-003'],
                            equipment: ['Single Bed', 'Desk', 'AC']
                        },
                        {
                            id: 'room-2-3',
                            name: 'Child 2 Bedroom',
                            type: 'bedroom',
                            capacity: 1,
                            tags: ['bedroom', 'private'],
                            assignedContacts: ['contact-kid2-004'],
                            equipment: ['Single Bed', 'Desk', 'AC']
                        },
                        {
                            id: 'room-2-4',
                            name: 'Bathroom',
                            type: 'utility',
                            capacity: 2,
                            tags: ['bathroom', 'common'],
                            assignedContacts: [],
                            equipment: ['Shower', 'Washing Machine']
                        }
                    ]
                }
            ]
        },
        {
            id: 'building-corporate-001',
            name: 'Corporate Office Tower',
            address: 'Business District, Block A',
            coordinates: { lat: 24.7431, lng: 46.6792 },
            tags: ['corporate', 'office'],
            floors: [
                {
                    id: 'floor-office-1',
                    name: 'Ground Floor',
                    number: 0,
                    rooms: [
                        {
                            id: 'room-reception',
                            name: 'Reception Area',
                            type: 'common',
                            capacity: 10,
                            tags: ['entry', 'common'],
                            assignedContacts: [],
                            equipment: ['Reception Desk', 'Waiting Chairs']
                        },
                        {
                            id: 'room-server',
                            name: 'Server Room',
                            type: 'secure',
                            capacity: 2,
                            tags: ['IT', 'secure'],
                            assignedContacts: ['contact-cto-103'],
                            equipment: ['Server Racks', 'AC', 'Fire Suppression']
                        }
                    ]
                },
                {
                    id: 'floor-office-2',
                    name: 'First Floor',
                    number: 1,
                    rooms: [
                        {
                            id: 'room-open-workspace',
                            name: 'Open Workspace',
                            type: 'work',
                            capacity: 50,
                            tags: ['work', 'open-plan'],
                            assignedContacts: ['contact-coo-101', 'contact-cfo-102', 'contact-cmo-104', 'contact-chro-105'],
                            equipment: ['Desks', 'Computers', 'Monitors']
                        },
                        {
                            id: 'room-meeting-a',
                            name: 'Meeting Room A',
                            type: 'meeting',
                            capacity: 12,
                            tags: ['meeting', 'collaboration'],
                            assignedContacts: [],
                            equipment: ['Projector', 'Whiteboard', 'Conference Table']
                        },
                        {
                            id: 'room-meeting-b',
                            name: 'Meeting Room B',
                            type: 'meeting',
                            capacity: 8,
                            tags: ['meeting', 'collaboration'],
                            assignedContacts: [],
                            equipment: ['TV Screen', 'Whiteboard', 'Conference Table']
                        }
                    ]
                }
            ]
        }
    ];
}

/**
 * Get default plans for fresh installation
 */
function getDefaultPlans() {
    return [
        {
            id: 'plan-trip-001',
            name: 'Morning Commute Plan',
            routineId: 'routine-daily-commute',
            type: 'travel',
            description: 'Detailed plan for the daily commute trip with coffee stop',
            documents: [],
            tags: ['commute', 'morning', 'travel'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

/**
 * Get default contacts for fresh installation
 */
function getDefaultContacts() {
    return [
        // Family of 4 (Kinship tree)
        {
            id: 'contact-father-001',
            name: 'John Doe',
            role: 'Father / Head of Household',
            tags: ['family', 'provider'],
            reportsTo: null,
            skillTags: ['management', 'provider'],
            locationAssociations: [
                {
                    locationId: 'pin-home-001',
                    locationType: 'mapPin',
                    associationType: 'home',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-mother-002',
            name: 'Jane Doe',
            role: 'Mother / Co-Head of Household',
            tags: ['family', 'caregiver'],
            reportsTo: null,
            skillTags: ['education', 'caregiving'],
            locationAssociations: [
                {
                    locationId: 'pin-home-001',
                    locationType: 'mapPin',
                    associationType: 'home',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-kid1-003',
            name: 'Child Doe 1',
            role: 'Son',
            tags: ['family', 'student'],
            reportsTo: 'contact-father-001',
            skillTags: ['learning'],
            locationAssociations: [
                {
                    locationId: 'pin-school-003',
                    locationType: 'mapPin',
                    associationType: 'frequent',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-kid2-004',
            name: 'Child Doe 2',
            role: 'Daughter',
            tags: ['family', 'student'],
            reportsTo: 'contact-father-001',
            skillTags: ['learning', 'arts'],
            locationAssociations: [
                {
                    locationId: 'pin-school-003',
                    locationType: 'mapPin',
                    associationType: 'frequent',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // Corporate org structure (5 departments)
        {
            id: 'contact-ceo-100',
            name: 'CEO Name',
            role: 'Chief Executive Officer',
            tags: ['corporate', 'executive'],
            reportsTo: null,
            skillTags: ['leadership', 'strategy'],
            locationAssociations: [
                {
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    associationType: 'work',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-coo-101',
            name: 'COO Name',
            role: 'Operations Director',
            tags: ['corporate', 'operations'],
            reportsTo: 'contact-ceo-100',
            skillTags: ['operations', 'management'],
            locationAssociations: [
                {
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    associationType: 'work',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-cfo-102',
            name: 'CFO Name',
            role: 'Finance Director',
            tags: ['corporate', 'finance'],
            reportsTo: 'contact-ceo-100',
            skillTags: ['finance', 'accounting'],
            locationAssociations: [
                {
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    associationType: 'work',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-cto-103',
            name: 'CTO Name',
            role: 'Technology Director',
            tags: ['corporate', 'technology'],
            reportsTo: 'contact-ceo-100',
            skillTags: ['technology', 'engineering'],
            locationAssociations: [
                {
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    associationType: 'work',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-cmo-104',
            name: 'CMO Name',
            role: 'Marketing Director',
            tags: ['corporate', 'marketing'],
            reportsTo: 'contact-ceo-100',
            skillTags: ['marketing', 'communications'],
            locationAssociations: [
                {
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    associationType: 'work',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'contact-chro-105',
            name: 'CHRO Name',
            role: 'HR Director',
            tags: ['corporate', 'human-resources'],
            reportsTo: 'contact-ceo-100',
            skillTags: ['HR', 'recruitment'],
            locationAssociations: [
                {
                    locationId: 'pin-work-002',
                    locationType: 'mapPin',
                    associationType: 'work',
                    assignedAt: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

/**
 * Get default map pins for fresh installation
 */
function getDefaultMapPins() {
    return [
        {
            id: 'pin-home-001',
            name: 'Home',
            address: '123 Main Street',
            latitude: 24.7136,
            longitude: 46.6753,
            category: 'residential',
            tags: ['home', 'primary'],
            connectedContacts: ['contact-father-001', 'contact-mother-002'],
            connectedRoutines: ['routine-daily-commute'],
            connectedBuilding: 'building-residential-001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'pin-work-002',
            name: 'Office',
            address: 'Business District, Block A',
            latitude: 24.7431,
            longitude: 46.6792,
            category: 'work',
            tags: ['work', 'office'],
            connectedContacts: ['contact-ceo-100', 'contact-coo-101', 'contact-cfo-102', 'contact-cto-103', 'contact-cmo-104', 'contact-chro-105'],
            connectedRoutines: [],
            connectedBuilding: 'building-corporate-001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'pin-school-003',
            name: 'School',
            address: 'Education City, Al-Noor St',
            latitude: 24.6877,
            longitude: 46.7218,
            category: 'education',
            tags: ['school', 'education'],
            connectedContacts: ['contact-kid1-003', 'contact-kid2-004'],
            connectedRoutines: [],
            connectedBuilding: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

// Initialize storage on module load
if (typeof localStorage !== 'undefined') {
    initStorage();
}
