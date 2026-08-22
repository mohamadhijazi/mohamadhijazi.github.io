/**
 * app.js - Main Application Controller
 * Phase 4.2: Tag-Based Visual Alert Dispatcher
 * v3.0: Polymorphic alert propagation - alerts cascade through entity connections
 * Main navigation, view rendering, and telemetry event handling
 */

const App = {
    currentView: 'dashboard',

    /**
     * Initialize the application
     */
    init() {
        // Initialize storage
        initStorage();

        // Setup mode toggle
        this.setupModeToggle();

        // Setup sidebar navigation
        this.setupNavigation();

        // Setup menu toggle
        this.setupMenuToggle();

        // Setup import/export buttons
        this.setupImportExport();

        // Setup telemetry event listener (Phase 4.2)
        this.setupTelemetryListener();

        // Setup modal close button
        document.getElementById('modalClose').addEventListener('click', () => {
            document.getElementById('modalOverlay').style.display = 'none';
        });

        // Setup right panel toggle
        this.setupRightPanelToggle();

        // Load initial view
        this.showDashboard();

        // Update alert count
        this.updateAlertCount();

        // Update stage indicator
        this.updateStageIndicator();
    },

    /**
     * Setup right panel toggle button
     */
    setupRightPanelToggle() {
        const toggleBtn = document.getElementById('rightPanelToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                if (typeof RightPanel !== 'undefined') {
                    RightPanel.toggle();
                }
            });
        }
    },

    /**
     * Update stage indicator in header
     */
    updateStageIndicator() {
        const indicator = document.getElementById('stageIndicator');
        if (!indicator) return;

        try {
            const workspace = getWorkspaceData();
            const competenceDomains = workspace?.competenceDomains || [];
            
            if (competenceDomains.length === 0) {
                indicator.style.display = 'none';
                return;
            }

            // Calculate dominant stage
            const stageCounts = { sensing: 0, diagnostics: 0, orchestration: 0, automated: 0 };
            competenceDomains.forEach(d => {
                stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1;
            });

            const dominantStage = Object.entries(stageCounts)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'sensing';

            // Update indicator
            indicator.className = `stage-indicator ${dominantStage}`;
            indicator.style.display = 'inline-flex';
            const textEl = indicator.querySelector('.stage-text');
            if (textEl) {
                textEl.textContent = dominantStage.charAt(0).toUpperCase() + dominantStage.slice(1);
            }
        } catch (e) {
            console.warn('Failed to update stage indicator:', e);
            indicator.style.display = 'none';
        }
    },

    /**
     * Setup mode toggle (Lite vs Power)
     */
    setupModeToggle() {
        const toggle = document.getElementById('modeToggle');
        const storedMode = localStorage.getItem('pwa_user_mode') || 'lite';

        // Set initial state
        toggle.checked = storedMode === 'power';
        if (storedMode === 'power') {
            document.body.classList.add('power-mode');
        }

        toggle.addEventListener('change', () => {
            const mode = toggle.checked ? 'power' : 'lite';
            document.body.className = mode === 'power' ? 'power-mode' : '';
            localStorage.setItem('pwa_user_mode', mode);
            updatePreferences({ mode: mode });
            this.showToast(`Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`);
        });
    },

    /**
     * Setup sidebar navigation
     */
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                
                // Update active state
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Navigate to view
                this.navigateTo(view);

                // Collapse sidebar on mobile
                if (window.innerWidth <= 768) {
                    document.getElementById('sideNav').classList.add('collapsed');
                }
            });
        });
    },

    /**
     * Setup menu toggle for mobile
     */
    setupMenuToggle() {
        const menuToggle = document.getElementById('menuToggle');
        const sideNav = document.getElementById('sideNav');

        menuToggle.addEventListener('click', () => {
            sideNav.classList.toggle('collapsed');
        });
    },

    /**
     * Setup import/export buttons
     */
    setupImportExport() {
        document.getElementById('exportBtn').addEventListener('click', () => {
            Portability.exportWorkspace();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            Portability.importWorkspace(e);
        });
    },

    /**
     * Setup telemetry event listener (Phase 4.2)
     */
    setupTelemetryListener() {
        window.addEventListener('telemetry-event', (e) => {
            const payload = e.detail;
            this.handleTelemetryEvent(payload);
        });
    },

    /**
     * Handle incoming telemetry event
     * Phase 4.2: Tag-Based Visual Alert Dispatcher
     * v3.0: Polymorphic alert propagation through entity connections
     */
    handleTelemetryEvent(payload) {
        // Add alert to storage
        addAlert({
            eventId: payload.eventId,
            category: payload.category,
            message: payload.message,
            severity: payload.severity || 'info',
            tags: payload.tags || []
        });

        // Check for tag matches with active items and apply alert classes (polymorphic)
        this.checkAlertMatches(payload);

        // Propagate alerts through polymorphic entity connections
        this.propagateAlertsPolymorphic(payload);

        // Update alert count badge
        this.updateAlertCount();

        // Flash the alerts nav item
        const alertsNav = document.querySelector('.nav-item[data-view="alerts"]');
        if (alertsNav) {
            alertsNav.style.animation = 'pulse-critical 0.5s ease 3';
            setTimeout(() => {
                alertsNav.style.animation = '';
            }, 1500);
        }
    },

    /**
     * Propagate alerts through polymorphic entity connections (v3.0)
     * When an alert matches an entity, it propagates to connected entities
     */
    propagateAlertsPolymorphic(payload) {
        const tags = payload.tags || [];
        const severity = payload.severity || 'info';
        const workspace = getWorkspaceData();

        // 1. Contact → Location associations propagation
        const contacts = workspace?.contacts || [];
        contacts.forEach(contact => {
            if (this.tagsMatch(tags, contact.tags || [])) {
                // Contact matched, propagate to its location associations
                const locationAssociations = contact.locationAssociations || [];
                locationAssociations.forEach(assoc => {
                    if (assoc.locationType === 'mapPin') {
                        const pin = (workspace?.mapPins || []).find(p => p.id === assoc.locationId);
                        if (pin) {
                            this.highlightEntity('mapPin', pin.id, severity);
                            // Propagate to connected building
                            if (pin.connectedBuilding) {
                                const building = (workspace?.buildings || []).find(b => b.id === pin.connectedBuilding);
                                if (building) {
                                    this.highlightEntity('building', building.id, severity);
                                    // Propagate to rooms in building
                                    this.propagateToBuildingRooms(building, severity);
                                }
                            }
                        }
                    } else if (assoc.locationType === 'building') {
                        const building = (workspace?.buildings || []).find(b => b.id === assoc.locationId);
                        if (building) {
                            this.highlightEntity('building', building.id, severity);
                            this.propagateToBuildingRooms(building, severity);
                        }
                    }
                });
            }
        });

        // 2. Routine → Location stops propagation
        const routines = workspace?.routines || [];
        routines.forEach(routine => {
            if (this.tagsMatch(tags, routine.tags || [])) {
                // Routine matched, propagate to its location stops
                const locationStops = routine.locationStops || [];
                locationStops.forEach(stop => {
                    if (stop.locationId) {
                        const pin = (workspace?.mapPins || []).find(p => p.id === stop.locationId);
                        if (pin) {
                            this.highlightEntity('mapPin', pin.id, severity);
                            // Propagate to connected building
                            if (pin.connectedBuilding) {
                                const building = (workspace?.buildings || []).find(b => b.id === pin.connectedBuilding);
                                if (building) {
                                    this.highlightEntity('building', building.id, severity);
                                    this.propagateToBuildingRooms(building, severity);
                                }
                            }
                        }
                    }
                });

                // Propagate to assigned persons
                const assignedPersons = routine.assignedPersons || [];
                assignedPersons.forEach(ap => {
                    const contact = contacts.find(c => c.id === ap.contactId);
                    if (contact) {
                        this.highlightEntity('contact', contact.id, severity);
                    }
                });
            }
        });

        // 3. MapPin → Contacts and Routines propagation
        const pins = workspace?.mapPins || [];
        pins.forEach(pin => {
            if (this.tagsMatch(tags, pin.tags || [])) {
                this.highlightEntity('mapPin', pin.id, severity);
                // Propagate to connected contacts
                (pin.connectedContacts || []).forEach(contactId => {
                    const contact = contacts.find(c => c.id === contactId);
                    if (contact) {
                        this.highlightEntity('contact', contact.id, severity);
                    }
                });
                // Propagate to connected routines
                (pin.connectedRoutines || []).forEach(routineId => {
                    const routine = routines.find(r => r.id === routineId);
                    if (routine) {
                        this.highlightEntity('routine', routine.id, severity);
                    }
                });
                // Propagate to connected building
                if (pin.connectedBuilding) {
                    const building = (workspace?.buildings || []).find(b => b.id === pin.connectedBuilding);
                    if (building) {
                        this.highlightEntity('building', building.id, severity);
                        this.propagateToBuildingRooms(building, severity);
                    }
                }
            }
        });

        // 4. Building → Rooms propagation
        const buildings = workspace?.buildings || [];
        buildings.forEach(building => {
            if (this.tagsMatch(tags, building.tags || [])) {
                this.highlightEntity('building', building.id, severity);
                this.propagateToBuildingRooms(building, severity);
            }
        });
    },

    /**
     * Propagate alert to all rooms in a building
     */
    propagateToBuildingRooms(building, severity) {
        if (building.floors) {
            building.floors.forEach(floor => {
                if (floor.rooms) {
                    floor.rooms.forEach(room => {
                        this.highlightEntity('room', room.id, severity);
                    });
                }
            });
        }
    },

    /**
     * Check if telemetry tags match active items (original method)
     */
    checkAlertMatches(payload) {
        const tags = payload.tags || [];
        const severity = payload.severity || 'info';
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const routines = workspace?.routines || [];

        // Check routine cards
        document.querySelectorAll('.routine-card').forEach(card => {
            const routineId = card.dataset.routineId;
            const routine = getRoutine(routineId);
            if (routine) {
                const routineTags = routine.tags || [];
                const stepTags = routine.steps?.flatMap(s => s.tags || []) || [];
                const allItemTags = [...routineTags, ...stepTags];
                
                if (this.tagsMatch(tags, allItemTags)) {
                    card.classList.add('alert-active');
                    this.addAlertBadge(card, severity);
                    setTimeout(() => card.classList.remove('alert-active'), 5000);
                }
            }
        });

        // Check contact cards
        document.querySelectorAll('.contact-card').forEach(card => {
            const contactId = card.dataset.contactId;
            const contact = getContact(contactId);
            if (contact) {
                const contactTags = contact.tags || [];
                if (this.tagsMatch(tags, contactTags)) {
                    card.classList.add('alert-active');
                    this.addAlertBadge(card, severity);
                    setTimeout(() => card.classList.remove('alert-active'), 5000);
                }
            }
        });

        // Check room cards
        document.querySelectorAll('.room-card').forEach(card => {
            const roomId = card.dataset.roomId;
            let matchedRoom = null;
            
            // Search in floorPlans
            const floorPlans = workspace?.floorPlans || [];
            floorPlans.forEach(plan => {
                const room = plan.rooms?.find(r => r.id === roomId);
                if (room) {
                    matchedRoom = room;
                }
            });

            // Also search in buildings
            const buildings = workspace?.buildings || [];
            if (!matchedRoom) {
                buildings.forEach(building => {
                    if (building.floors) {
                        building.floors.forEach(floor => {
                            if (floor.rooms) {
                                const room = floor.rooms.find(r => r.id === roomId);
                                if (room) matchedRoom = room;
                            }
                        });
                    }
                });
            }

            if (matchedRoom) {
                const roomTags = matchedRoom.tags || [];
                if (this.tagsMatch(tags, roomTags)) {
                    card.classList.add('alert-active');
                    this.addAlertBadge(card, severity);
                    setTimeout(() => card.classList.remove('alert-active'), 5000);
                }
            }
        });
    },

    /**
     * Highlight an entity by type and ID (polymorphic v3.0)
     */
    highlightEntity(type, entityId, severity) {
        let element = null;

        switch (type) {
            case 'contact':
                element = document.querySelector(`.contact-card[data-contact-id="${entityId}"]`);
                break;
            case 'routine':
                element = document.querySelector(`.routine-card[data-routine-id="${entityId}"]`);
                break;
            case 'room':
                element = document.querySelector(`.room-card[data-room-id="${entityId}"]`);
                break;
            // Map pins and buildings are highlighted via their respective views
        }

        if (element) {
            element.classList.add('alert-active');
            this.addAlertBadge(element, severity);
            setTimeout(() => element.classList.remove('alert-active'), 5000);
        }
    },

    /**
     * Check if any tags match between array a and b
     */
    tagsMatch(a, b) {
        return a.some(tag => b.some(bTag => 
            tag.toLowerCase() === bTag.toLowerCase()
        ));
    },

    /**
     * Add a pulsing alert badge to a card
     */
    addAlertBadge(card, severity) {
        // Remove existing badge
        const existing = card.querySelector('.alert-badge');
        if (existing) existing.remove();

        const badge = document.createElement('div');
        badge.className = `alert-badge ${severity === 'critical' ? 'critical' : 'warning'}`;
        card.style.position = 'relative';
        card.appendChild(badge);

        // Remove badge after animation
        setTimeout(() => badge.remove(), 10000);
    },

    /**
     * Update alert count badge
     */
    updateAlertCount() {
        const alerts = getAlerts();
        const count = alerts.filter(a => {
            const alertTime = new Date(a.timestamp).getTime();
            return (Date.now() - alertTime) < 3600000; // Last hour
        }).length;

        const badge = document.getElementById('alertCount');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    },

    /**
     * Navigate to a view
     */
    navigateTo(view) {
        this.currentView = view;
        switch (view) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'calendar':
                this.showCalendar();
                break;
            case 'routines':
                this.showRoutines();
                break;
            case 'floorplans':
                this.showFloorPlans();
                break;
            case 'contacts':
                this.showContacts();
                break;
            case 'map':
                this.showMap();
                break;
            case 'costs':
                this.showCostPlanning();
                break;
            case 'maturity':
                this.showMaturityRadar();
                break;
            case 'alerts':
                this.showAlerts();
                break;
        }
    },

    /**
     * Refresh the current view
     */
    refreshCurrentView() {
        this.navigateTo(this.currentView);
    },

    /**
     * Show dashboard view
     */
    showDashboard() {
        const workspace = getWorkspaceData();
        const routineCount = workspace?.routines?.length || 0;
        const floorPlanCount = workspace?.floorPlans?.length || 0;
        const contactCount = workspace?.contacts?.length || 0;
        const pinCount = workspace?.mapPins?.length || 0;
        const buildingCount = workspace?.buildings?.length || 0;
        const eventCount = (workspace?.calendarEvents || []).length;
        const alertCount = (workspace?.alerts || []).length;

        const container = document.getElementById('workspace-container');
        container.innerHTML = `
            <h1 style="margin-bottom: 8px;">Dashboard</h1>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">Welcome to your multi-mode workspace</p>
            
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">📅</div>
                    <div class="dashboard-card-title">Calendar</div>
                    <div class="dashboard-card-desc">${eventCount} event(s) scheduled</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('calendar')">View Calendar</button>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">📋</div>
                    <div class="dashboard-card-title">Routines</div>
                    <div class="dashboard-card-desc">${routineCount} routine(s) configured</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('routines')">View Routines</button>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">🏠</div>
                    <div class="dashboard-card-title">Floor Plans</div>
                    <div class="dashboard-card-desc">${floorPlanCount} plan(s) configured</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('floorplans')">View Plans</button>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">👥</div>
                    <div class="dashboard-card-title">Contacts</div>
                    <div class="dashboard-card-desc">${contactCount} contact(s) in directory</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('contacts')">View Contacts</button>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">📍</div>
                    <div class="dashboard-card-title">Locations</div>
                    <div class="dashboard-card-desc">${pinCount} pin(s) on map</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('map')">View Map</button>
                </div>

                <div class="dashboard-card">
                    <div class="dashboard-card-icon">🏢</div>
                    <div class="dashboard-card-title">Buildings</div>
                    <div class="dashboard-card-desc">${buildingCount} building(s) configured</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('floorplans')">View Buildings</button>
                </div>

                <div class="dashboard-card">
                    <div class="dashboard-card-icon">💰</div>
                    <div class="dashboard-card-title">Cost Planning</div>
                    <div class="dashboard-card-desc">Track income, expenses, assets & liabilities</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('costs')">View Costs</button>
                </div>

                <div class="dashboard-card">
                    <div class="dashboard-card-icon">📈</div>
                    <div class="dashboard-card-title">Maturity Radar</div>
                    <div class="dashboard-card-desc">Track financial, health & skills maturity</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('maturity')">View Radar</button>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">🔔</div>
                    <div class="dashboard-card-title">Alerts</div>
                    <div class="dashboard-card-desc">${alertCount} total alert(s) logged</div>
                    <button class="dashboard-card-action" onclick="App.navigateTo('alerts')">View Alerts</button>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">⚙️</div>
                    <div class="dashboard-card-title">Settings</div>
                    <div class="dashboard-card-desc">Manage your workspace preferences</div>
                    <button class="dashboard-card-action" onclick="App.exportWorkspace()">Export Data</button>
                </div>
            </div>
        `;
    },

    /**
     * Show routines view
     */
    showRoutines() {
        const container = document.getElementById('workspace-container');
        container.innerHTML = RoutineView.render();
    },

    /**
     * Show floor plans view
     */
    showFloorPlans() {
        const container = document.getElementById('workspace-container');
        container.innerHTML = SpatialView.render();
    },

    /**
     * Show contacts view
     */
    showContacts() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];

        let html = `
            <div class="contacts-header">
                <h2>Contacts Directory</h2>
                <button class="btn-primary" onclick="ContactWizard.openEdit()">+ Add Contact</button>
            </div>
            <div class="contacts-list">
        `;

        if (contacts.length === 0) {
            html += `
                <div class="text-center" style="padding: 60px 20px; grid-column: 1/-1;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">👥</div>
                    <h2 style="color: var(--text-secondary); margin-bottom: 8px;">No Contacts Yet</h2>
                    <p style="color: var(--text-muted); margin-bottom: 24px;">Add your first contact to get started</p>
                    <button class="btn-primary" onclick="ContactWizard.openEdit()">+ Add Contact</button>
                </div>
            `;
        } else {
            contacts.forEach(contact => {
                const reportsToName = contact.reportsTo ? (() => {
                    const parent = getContact(contact.reportsTo);
                    return parent ? parent.name : 'Unknown';
                })() : 'None (Top Level)';

                // Get location associations count
                const locationCount = (contact.locationAssociations || []).length;

                html += `
                    <div class="contact-card" data-contact-id="${contact.id}">
                        <div class="contact-card-name">${contact.name}</div>
                        <div class="contact-card-role">${contact.role}</div>
                        <div class="contact-card-tags">
                            ${contact.tags ? contact.tags.map(t => `<span class="room-tag">${t}</span>`).join('') : ''}
                        </div>
                        ${contact.skillTags ? `
                            <div class="contact-card-tags" style="margin-bottom: 8px;">
                                ${contact.skillTags.map(s => `<span class="room-tag" style="background: var(--primary-color); color: white;">${s}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${locationCount > 0 ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">📍 ${locationCount} location(s) associated</div>` : ''}
                        <div class="contact-card-reports">Reports to: ${reportsToName}</div>
                        <div style="margin-top: 12px; display: flex; gap: 8px;">
                            <button class="btn-secondary" style="flex: 1; font-size: 0.8rem;" 
                                    onclick="ContactWizard.openEdit(getContact('${contact.id}'))">
                                Edit
                            </button>
                            <button class="btn-remove-row" onclick="App.deleteContact('${contact.id}')" style="padding: 4px 8px;">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        document.getElementById('workspace-container').innerHTML = html;
    },

    /**
     * Show map view
     */
    showMap() {
        const container = document.getElementById('workspace-container');
        container.innerHTML = MapView.render();

        // Initialize map after DOM update
        setTimeout(() => {
            MapView.init();
        }, 100);

        // Setup add pin button
        setTimeout(() => {
            const btn = document.getElementById('addPinBtn');
            if (btn) {
                btn.addEventListener('click', () => MapView.addPinFromSearch());
            }
        }, 200);
    },

    /**
     * Show calendar view
     */
    showCalendar() {
        const container = document.getElementById('workspace-container');
        container.innerHTML = CalendarView.render();
        setTimeout(() => CalendarView.init(), 100);
    },

    /**
     * Show cost planning view
     */
    showCostPlanning() {
        const container = document.getElementById('workspace-container');
        container.innerHTML = CostView.render();
        setTimeout(() => CostView.init(), 100);
    },

    /**
     * Show maturity radar view
     */
    showMaturityRadar() {
        const container = document.getElementById('workspace-container');
        container.innerHTML = MaturityView.render();
        setTimeout(() => MaturityView.init(), 100);
    },

    /**
     * Show alerts view
     */
    showAlerts() {
        const alerts = getAlerts();
        const container = document.getElementById('workspace-container');

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Alert Log</h2>
                ${alerts.length > 0 ? `<button class="btn-secondary" onclick="App.clearAlerts()">Clear All</button>` : ''}
            </div>
            <div class="alerts-list">
        `;

        if (alerts.length === 0) {
            html += `
                <div class="alert-empty">
                    <div class="alert-empty-icon">🔔</div>
                    <p>No alerts yet. Telemetry events will appear here.</p>
                </div>
            `;
        } else {
            alerts.forEach(alert => {
                const icon = alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '🟡' : '🔵';
                const time = new Date(alert.timestamp).toLocaleString();
                
                html += `
                    <div class="alert-item">
                        <div class="alert-icon ${alert.severity}">${icon}</div>
                        <div class="alert-content">
                            <div class="alert-message">${alert.message}</div>
                            <div class="alert-time">
                                ${time} · ${alert.category}
                                ${alert.tags ? alert.tags.map(t => `<span style="margin-left: 8px; padding: 2px 6px; background: var(--bg-tertiary); border-radius: 4px; font-size: 0.7rem;">${t}</span>`).join('') : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Delete a contact
     */
    deleteContact(contactId) {
        if (confirm('Are you sure you want to delete this contact?')) {
            deleteContact(contactId);
            this.showContacts();
            this.showToast('Contact deleted');
        }
    },

    /**
     * Clear all alerts
     */
    clearAlerts() {
        if (confirm('Clear all alerts?')) {
            clearAlerts();
            this.showAlerts();
            this.updateAlertCount();
            this.showToast('Alerts cleared');
        }
    },

    /**
     * Show a toast notification
     */
    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.app-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            font-size: 0.9rem;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Export workspace (alias to Portability)
     */
    exportWorkspace() {
        Portability.exportWorkspace();
    },

    /**
     * Open modal with title and content
     */
    openModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    /**
     * Close modal
     */
    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}