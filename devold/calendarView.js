/**
 * calendarView.js - FullCalendar.js Integration
 * v4.0: Calendar view as main landing visual
 * Supports: routines, external events, activities, international events,
 *           economic events, political events, technology events
 */

const CalendarView = {
    calendar: null,
    eventSource: null,

    /**
     * Render calendar view HTML
     */
    render() {
        return `
            <div class="calendar-header">
                <h2>📅 Calendar</h2>
                <div class="calendar-controls">
                    <div class="calendar-filters">
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="routine"> Routines
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="activity"> Activities
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="technology"> Technology
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="economic"> Economic
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="political"> Political
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="international"> International
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" checked data-filter="external"> External
                        </label>
                    </div>
                    <button class="btn-primary" onclick="CalendarView.openEventModal()">+ New Event</button>
                </div>
            </div>
            <div id="calendar"></div>
        `;
    },

    /**
     * Initialize FullCalendar
     */
    init() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        // Get calendar data from localStorage
        const calendarEvents = getCalendarEvents();
        console.log('[CalendarView] init() - calendarEvents from localStorage:', calendarEvents.length);
        
        const routines = getWorkspaceData()?.routines || [];
        const contacts = getWorkspaceData()?.contacts || [];

        // Convert routines to calendar events
        const routineEvents = this.routinesToEvents(routines);

        // Combine all events from localStorage
        const allEvents = [...calendarEvents, ...routineEvents];
        
        console.log('[CalendarView] init() - total events to load:', allEvents.length);

        // Initialize FullCalendar
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            events: allEvents,
            editable: true,
            droppable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventColor: '#4a90d9',
            eventClick: (info) => this.handleEventClick(info),
            select: (info) => this.handleSelect(info),
            eventDrop: (info) => this.handleEventDrop(info),
            viewDidMount: (view) => this.onViewLoad(view)
        });

        this.calendar.render();

        // Setup filters
        this.setupFilters();

        // Store events for reference
        this.currentEvents = allEvents;
    },

    /**
     * Convert routines to calendar events
     */
    routinesToEvents(routines) {
        return routines.map(routine => ({
            id: routine.id,
            title: routine.name,
            start: routine.startDate,
            end: routine.endDate,
            type: 'routine',
            color: routine.color || '#4CAF50',
            extendedProps: {
                routineId: routine.id,
                category: routine.category,
                description: routine.description,
                assignedPersons: routine.assignedPersons || [],
                locationStops: routine.locationStops || [],
                cost: routine.cost || null,
                isRecurring: routine.isRecurring,
                recurrencePattern: routine.recurrencePattern
            }
        }));
    },

    /**
     * Setup event type filters
     */
    setupFilters() {
        const checkboxes = document.querySelectorAll('.filter-checkbox input');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    },

    /**
     * Apply event type filters
     */
    applyFilters() {
        if (!this.calendar) return;

        const activeFilters = new Set();
        document.querySelectorAll('.filter-checkbox input:checked').forEach(cb => {
            activeFilters.add(cb.dataset.filter);
        });

        // Update event visibility
        const events = this.calendar.getEvents();
        events.forEach(event => {
            const eventType = event.extendedProps.type || 'external';
            event.setVisible(activeFilters.has(eventType) || activeFilters.has('external'));
        });
    },

    /**
     * Handle event click
     */
    handleEventClick(info) {
        const props = info.event.extendedProps;
        // Determine event type - check extendedProps first, then use event color/type
        let eventType = props.type || 'external';
        
        // For routines, the type is in extendedProps
        if (props.routineId || props.category !== undefined) {
            eventType = 'routine';
        }
        
        let html = `
            <div class="event-detail-modal">
                <h3>${info.event.title}</h3>
                <div class="event-detail-grid">
                    <div class="event-detail-item">
                        <strong>Type:</strong> ${this.getEventTypeLabel(eventType)}
                    </div>
                    <div class="event-detail-item">
                        <strong>Date:</strong> ${new Date(info.event.start).toLocaleDateString()}
                    </div>
        `;

        if (info.event.end) {
            html += `
                    <div class="event-detail-item">
                        <strong>End Date:</strong> ${new Date(info.event.end).toLocaleDateString()}
                    </div>
            `;
        }

        if (props.category) {
            html += `
                    <div class="event-detail-item">
                        <strong>Category:</strong> ${props.category}
                    </div>
            `;
        }

        if (props.description) {
            html += `
                    <div class="event-detail-item">
                        <strong>Description:</strong> ${props.description}
                    </div>
            `;
        }

        if (props.cost) {
            html += `
                    <div class="event-detail-item">
                        <strong>Cost:</strong> ${props.cost.currency || 'USD'} ${props.cost.budget || props.cost.actual || 0}
                    </div>
            `;
        }

        if (props.assignedPersons && props.assignedPersons.length > 0) {
            const workspace = getWorkspaceData();
            const contacts = workspace?.contacts || [];
            const personNames = props.assignedPersons.map(ap => {
                const contact = contacts.find(c => c.id === ap.contactId);
                return contact ? `${contact.name} (${ap.role})` : `Unknown (${ap.role})`;
            }).join(', ');
            html += `
                    <div class="event-detail-item">
                        <strong>Persons:</strong> ${personNames}
                    </div>
            `;
        }

        if (props.isRecurring) {
            html += `
                    <div class="event-detail-item">
                        <strong>Recurrence:</strong> ${this.getEventTypeLabel(props.recurrencePattern || 'daily')}
                    </div>
            `;
        }

        html += `
                </div>
                <div class="event-detail-actions" style="margin-top: 16px; display: flex; gap: 8px;">
                    <button class="btn-secondary" onclick="CalendarView.editEvent('${info.event.id}', '${eventType}')">Edit</button>
                    <button class="btn-remove" onclick="CalendarView.deleteEvent('${info.event.id}', '${eventType}')">Delete</button>
                </div>
            </div>
        `;

        this.openModal('Event Details', html);
    },

    /**
     * Handle calendar selection (new event)
     */
    handleSelect(info) {
        this.openEventModal(info.start, info.end);
        this.calendar.unselect();
    },

    /**
     * Handle event drop (reschedule)
     */
    handleEventDrop(info) {
        const props = info.event.extendedProps;
        
        if (props.routineId) {
            // Update routine dates in localStorage
            const workspace = getWorkspaceData();
            const routines = workspace.routines || [];
            const routine = routines.find(r => r.id === props.routineId);
            if (routine) {
                routine.startDate = info.event.start.toISOString();
                if (info.event.end) {
                    routine.endDate = info.event.end.toISOString();
                }
                saveWorkspaceData(workspace);
            }
        } else {
            // Update calendar event in localStorage
            const event = getCalendarEvent(info.event.id);
            if (event) {
                event.start = info.event.start.toISOString();
                if (info.event.end) {
                    event.end = info.event.end.toISOString();
                }
                saveCalendarEvent(event);
            }
        }

        App.showToast('Event updated');
    },

    /**
     * Open event creation/edit modal
     */
    openEventModal(start, end) {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        
        const contactOptions = contacts.map(c => 
            `<option value="${c.id}">${c.name} (${c.role})</option>`
        ).join('');

        const html = `
            <div class="event-form">
                <div class="form-group">
                    <label>Event Title *</label>
                    <input type="text" id="eventTitle" placeholder="Enter event title" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Event Type *</label>
                    <select id="eventType" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="routine">Routine</option>
                        <option value="activity">Activity</option>
                        <option value="technology">Technology</option>
                        <option value="economic">Economic</option>
                        <option value="political">Political</option>
                        <option value="international">International</option>
                        <option value="external">External</option>
                    </select>
                </div>
                <div class="form-group" id="techSourceGroup" style="display: none;">
                    <label>Technology Source</label>
                    <select id="eventSource" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="">Select Source</option>
                        <option value="apple">Apple</option>
                        <option value="microsoft">Microsoft</option>
                        <option value="ibm">IBM</option>
                        <option value="nvidia">NVIDIA</option>
                        <option value="openai">OpenAI</option>
                        <option value="tesla">Tesla</option>
                        <option value="gartner">Gartner</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Start Date & Time *</label>
                    <input type="datetime-local" id="eventStart" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>End Date & Time</label>
                    <input type="datetime-local" id="eventEnd" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="eventPriority" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="eventDescription" rows="3" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"></textarea>
                </div>
                <div class="form-group">
                    <label>External URL</label>
                    <input type="url" id="eventUrl" placeholder="https://" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Attendees</label>
                    <select id="eventAttendees" multiple style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; min-height: 80px;">
                        ${contactOptions}
                    </select>
                    <small>Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div class="form-group">
                    <label>Budget (USD)</label>
                    <input type="number" id="eventBudget" placeholder="0.00" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Recurring</label>
                    <select id="eventRecurring" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="none">Not Recurring</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 8px;">
                <button class="btn-primary" onclick="CalendarView.saveEvent()">Save Event</button>
                <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            </div>
        `;

        this.openModal('New Event', html);

        // Set default dates
        if (start) {
            const dateStr = new Date(start).toISOString().slice(0, 16);
            document.getElementById('eventStart').value = dateStr;
        }
        if (end) {
            const dateStr = new Date(end).toISOString().slice(0, 16);
            document.getElementById('eventEnd').value = dateStr;
        }

        // Show/hide tech source based on type
        document.getElementById('eventType').addEventListener('change', (e) => {
            const techGroup = document.getElementById('techSourceGroup');
            techGroup.style.display = e.target.value === 'technology' ? 'block' : 'none';
        });
    },

    /**
     * Save new/edit event
     */
    saveEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const type = document.getElementById('eventType').value;
        const start = document.getElementById('eventStart').value;
        const budget = parseFloat(document.getElementById('eventBudget').value) || 0;

        if (!title || !start) {
            App.showToast('Please fill in required fields');
            return;
        }

        // For routine type, save as routine object
        if (type === 'routine') {
            this.saveRoutineFromCalendar(start);
            return;
        }

        const attendeesSelect = document.getElementById('eventAttendees');
        const attendees = Array.from(attendeesSelect.selectedOptions).map(opt => opt.value);

        const event = {
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: title,
            type: type,
            source: type === 'technology' ? document.getElementById('eventSource').value : null,
            start: new Date(start).toISOString(),
            end: document.getElementById('eventEnd').value ? new Date(document.getElementById('eventEnd').value).toISOString() : null,
            description: document.getElementById('eventDescription').value,
            priority: document.getElementById('eventPriority').value,
            externalUrl: document.getElementById('eventUrl').value,
            attendees: attendees,
            color: this.getEventTypeColor(type),
            cost: budget > 0 ? { currency: 'USD', budget: budget } : null,
            isRecurring: document.getElementById('eventRecurring').value !== 'none',
            recurrenceRule: document.getElementById('eventRecurring').value !== 'none' ? document.getElementById('eventRecurring').value : null,
            createdAt: new Date().toISOString()
        };

        // Save directly to localStorage via storage function
        saveCalendarEvent(event);

        // Close modal first
        App.closeModal();
        
        // Refresh calendar with slight delay to ensure modal is closed
        setTimeout(() => {
            this.refreshCalendar();
            App.showToast('Event saved successfully');
        }, 100);
    },

    /**
     * Save a routine from calendar form data
     */
    saveRoutineFromCalendar(start, existingRoutine = null) {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        
        const title = document.getElementById('eventTitle').value.trim();
        const description = document.getElementById('eventDescription').value.trim();
        const priority = document.getElementById('eventPriority').value;
        const budget = parseFloat(document.getElementById('eventBudget').value) || 0;
        const recurringValue = document.getElementById('eventRecurring').value;
        const isRecurring = recurringValue !== 'none';
        
        // Get assigned persons from attendees dropdown
        const attendeesSelect = document.getElementById('eventAttendees');
        const selectedAttendees = Array.from(attendeesSelect.selectedOptions).map(opt => opt.value);
        
        // Build assignedPersons array from contacts
        const assignedPersons = selectedAttendees.map((contactId, index) => ({
            contactId: contactId,
            role: index === 0 ? 'organizer' : 'participant',
            confirmed: false
        }));

        // Build locationStops (empty for now, user can edit in routine wizard)
        const locationStops = existingRoutine?.locationStops || [];

        const routineData = {
            id: existingRoutine ? existingRoutine.id : `routine-${Date.now()}`,
            name: title,
            category: existingRoutine?.category || 'Daily',
            description: description,
            status: existingRoutine?.status || 'active',
            totalDuration: existingRoutine?.totalDuration || 0,
            startDate: new Date(start).toISOString(),
            endDate: document.getElementById('eventEnd').value ? new Date(document.getElementById('eventEnd').value).toISOString() : new Date(start).toISOString(),
            isRecurring: isRecurring,
            recurrencePattern: isRecurring ? recurringValue : 'daily',
            locationStops: locationStops,
            assignedPersons: assignedPersons,
            tags: existingRoutine?.tags || [],
            cost: budget > 0 ? { currency: 'USD', budget: budget, actual: 0 } : null,
            steps: existingRoutine?.steps || [],
            completedSteps: existingRoutine?.completedSteps || [],
            createdAt: existingRoutine?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save as routine
        saveRoutine(routineData);

        // Close modal first
        App.closeModal();
        
        // Refresh calendar with slight delay to ensure modal is closed
        setTimeout(() => {
            this.refreshCalendar();
            App.showToast('Routine saved successfully');
        }, 100);
    },

    /**
     * Edit event (handles both routines and calendar events)
     */
    editEvent(eventId, eventType = 'external') {
        App.closeModal();
        
        setTimeout(() => {
            // Check if it's a routine first
            if (eventType === 'routine') {
                const routine = getRoutine(eventId);
                if (routine) {
                    this.editRoutineFromCalendar(routine);
                    return;
                }
                // Fall back to calendar event if routine not found
                const event = getCalendarEvent(eventId);
                if (!event) {
                    App.showToast('Event not found');
                    return;
                }
                this.editCalendarEvent(event);
            } else {
                const event = getCalendarEvent(eventId);
                if (!event) {
                    App.showToast('Event not found');
                    return;
                }
                this.editCalendarEvent(event);
            }
        }, 100);
    },

    /**
     * Edit a routine from calendar
     */
    editRoutineFromCalendar(routine) {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        
        const contactOptions = contacts.map(c => 
            `<option value="${c.id}">${c.name} (${c.role})</option>`
        ).join('');

        const html = `
            <div class="event-form">
                <div class="form-group">
                    <label>Routine Title *</label>
                    <input type="text" id="eventTitle" placeholder="Enter routine title" value="${routine.name || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Event Type *</label>
                    <select id="eventType" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="routine" selected>Routine</option>
                        <option value="activity">Activity</option>
                        <option value="technology">Technology</option>
                        <option value="economic">Economic</option>
                        <option value="political">Political</option>
                        <option value="international">International</option>
                        <option value="external">External</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="routineCategory" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="Daily" ${routine.category === 'Daily' ? 'selected' : ''}>Daily</option>
                        <option value="Work" ${routine.category === 'Work' ? 'selected' : ''}>Work</option>
                        <option value="Health" ${routine.category === 'Health' ? 'selected' : ''}>Health</option>
                        <option value="Transport" ${routine.category === 'Transport' ? 'selected' : ''}>Transport</option>
                        <option value="Family" ${routine.category === 'Family' ? 'selected' : ''}>Family</option>
                        <option value="Education" ${routine.category === 'Education' ? 'selected' : ''}>Education</option>
                        <option value="Leisure" ${routine.category === 'Leisure' ? 'selected' : ''}>Leisure</option>
                        <option value="Other" ${routine.category === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Start Date & Time *</label>
                    <input type="datetime-local" id="eventStart" value="${routine.startDate ? new Date(routine.startDate).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>End Date & Time</label>
                    <input type="datetime-local" id="eventEnd" value="${routine.endDate ? new Date(routine.endDate).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="eventPriority" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="low">Low</option>
                        <option value="medium" ${routine.status === 'inactive' ? '' : 'selected'}>Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="eventDescription" rows="3" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">${routine.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Attendees</label>
                    <select id="eventAttendees" multiple style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; min-height: 80px;">
                        ${contactOptions}
                    </select>
                    <small>Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div class="form-group">
                    <label>Budget (USD)</label>
                    <input type="number" id="eventBudget" placeholder="0.00" value="${routine.cost?.budget || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Recurring</label>
                    <select id="eventRecurring" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="none" ${!routine.isRecurring ? 'selected' : ''}>Not Recurring</option>
                        <option value="daily" ${routine.isRecurring && routine.recurrencePattern === 'daily' ? 'selected' : ''}>Daily</option>
                        <option value="weekly" ${routine.isRecurring && routine.recurrencePattern === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="monthly" ${routine.isRecurring && routine.recurrencePattern === 'monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="yearly" ${routine.isRecurring && routine.recurrencePattern === 'yearly' ? 'selected' : ''}>Yearly</option>
                    </select>
                </div>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 8px;">
                <button class="btn-primary" onclick="CalendarView.saveRoutineEdit('${routine.id}')">Save Routine</button>
                <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            </div>
        `;

        this.openModal('Edit Routine', html);

        // Populate attendees after modal is shown
        setTimeout(() => {
            const attendeesSelect = document.getElementById('eventAttendees');
            const assignedIds = routine.assignedPersons ? routine.assignedPersons.map(ap => ap.contactId) : [];
            Array.from(attendeesSelect.options).forEach(option => {
                option.selected = assignedIds.includes(option.value);
            });
        }, 50);
    },

    /**
     * Edit a calendar event
     */
    editCalendarEvent(event) {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        
        const contactOptions = contacts.map(c => 
            `<option value="${c.id}">${c.name} (${c.role})</option>`
        ).join('');

        const html = `
            <div class="event-form">
                <div class="form-group">
                    <label>Event Title *</label>
                    <input type="text" id="eventTitle" placeholder="Enter event title" value="${event.title || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Event Type *</label>
                    <select id="eventType" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="routine">Routine</option>
                        <option value="activity" ${event.type === 'activity' ? 'selected' : ''}>Activity</option>
                        <option value="technology" ${event.type === 'technology' ? 'selected' : ''}>Technology</option>
                        <option value="economic" ${event.type === 'economic' ? 'selected' : ''}>Economic</option>
                        <option value="political" ${event.type === 'political' ? 'selected' : ''}>Political</option>
                        <option value="international" ${event.type === 'international' ? 'selected' : ''}>International</option>
                        <option value="external" ${event.type === 'external' ? 'selected' : ''}>External</option>
                    </select>
                </div>
                <div class="form-group" id="techSourceGroup" style="display: ${event.type === 'technology' ? 'block' : 'none'};">
                    <label>Technology Source</label>
                    <select id="eventSource" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="">Select Source</option>
                        <option value="apple" ${event.source === 'apple' ? 'selected' : ''}>Apple</option>
                        <option value="microsoft" ${event.source === 'microsoft' ? 'selected' : ''}>Microsoft</option>
                        <option value="ibm" ${event.source === 'ibm' ? 'selected' : ''}>IBM</option>
                        <option value="nvidia" ${event.source === 'nvidia' ? 'selected' : ''}>NVIDIA</option>
                        <option value="openai" ${event.source === 'openai' ? 'selected' : ''}>OpenAI</option>
                        <option value="tesla" ${event.source === 'tesla' ? 'selected' : ''}>Tesla</option>
                        <option value="gartner" ${event.source === 'gartner' ? 'selected' : ''}>Gartner</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Start Date & Time *</label>
                    <input type="datetime-local" id="eventStart" value="${event.start ? new Date(event.start).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>End Date & Time</label>
                    <input type="datetime-local" id="eventEnd" value="${event.end ? new Date(event.end).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="eventPriority" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="low">Low</option>
                        <option value="medium" ${event.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${event.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="critical" ${event.priority === 'critical' ? 'selected' : ''}>Critical</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="eventDescription" rows="3" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">${event.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>External URL</label>
                    <input type="url" id="eventUrl" placeholder="https://" value="${event.externalUrl || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Attendees</label>
                    <select id="eventAttendees" multiple style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; min-height: 80px;">
                        ${contactOptions}
                    </select>
                    <small>Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div class="form-group">
                    <label>Budget (USD)</label>
                    <input type="number" id="eventBudget" placeholder="0.00" value="${event.cost?.budget || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>Recurring</label>
                    <select id="eventRecurring" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <option value="none" ${!event.isRecurring ? 'selected' : ''}>Not Recurring</option>
                        <option value="daily" ${event.isRecurring && event.recurrenceRule === 'daily' ? 'selected' : ''}>Daily</option>
                        <option value="weekly" ${event.isRecurring && event.recurrenceRule === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="monthly" ${event.isRecurring && event.recurrenceRule === 'monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="yearly" ${event.isRecurring && event.recurrenceRule === 'yearly' ? 'selected' : ''}>Yearly</option>
                    </select>
                </div>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 8px;">
                <button class="btn-primary" onclick="CalendarView.saveEventEdit('${event.id}')">Save Event</button>
                <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            </div>
        `;

        this.openModal('Edit Event', html);

        // Populate attendees after modal is shown
        setTimeout(() => {
            const attendeesSelect = document.getElementById('eventAttendees');
            const attendeeIds = event.attendees || [];
            Array.from(attendeesSelect.options).forEach(option => {
                option.selected = attendeeIds.includes(option.value);
            });

            // Show/hide tech source based on type
            document.getElementById('eventType').addEventListener('change', (e) => {
                const techGroup = document.getElementById('techSourceGroup');
                techGroup.style.display = e.target.value === 'technology' ? 'block' : 'none';
            });
        }, 50);
    },

    /**
     * Save edited routine
     */
    saveRoutineEdit(existingRoutineId) {
        const start = document.getElementById('eventStart').value;
        if (!start) {
            App.showToast('Please fill in start date');
            return;
        }

        // Get the existing routine to preserve data
        const existingRoutine = getRoutine(existingRoutineId);
        this.saveRoutineFromCalendar(start, existingRoutine);
    },

    /**
     * Save edited calendar event
     */
    saveEventEdit(eventId) {
        const event = getCalendarEvent(eventId);
        if (!event) {
            App.showToast('Event not found');
            return;
        }

        const title = document.getElementById('eventTitle').value.trim();
        const type = document.getElementById('eventType').value;
        const start = document.getElementById('eventStart').value;

        if (!title || !start) {
            App.showToast('Please fill in required fields');
            return;
        }

        const attendeesSelect = document.getElementById('eventAttendees');
        const attendees = Array.from(attendeesSelect.selectedOptions).map(opt => opt.value);

        // Update the event
        const updatedEvent = {
            ...event,
            title: title,
            type: type,
            source: type === 'technology' ? document.getElementById('eventSource').value : null,
            start: new Date(start).toISOString(),
            end: document.getElementById('eventEnd').value ? new Date(document.getElementById('eventEnd').value).toISOString() : null,
            description: document.getElementById('eventDescription').value,
            priority: document.getElementById('eventPriority').value,
            externalUrl: document.getElementById('eventUrl').value,
            attendees: attendees,
            cost: document.getElementById('eventBudget').value ? { currency: 'USD', budget: parseFloat(document.getElementById('eventBudget').value) } : null,
            isRecurring: document.getElementById('eventRecurring').value !== 'none',
            recurrenceRule: document.getElementById('eventRecurring').value !== 'none' ? document.getElementById('eventRecurring').value : null
        };

        saveCalendarEvent(updatedEvent);
        App.closeModal();
        
        setTimeout(() => {
            this.refreshCalendar();
            App.showToast('Event updated successfully');
        }, 100);
    },

    /**
     * Delete event (handles both routines and calendar events)
     */
    deleteEvent(eventId, eventType = 'external') {
        if (!confirm('Are you sure you want to delete this event?')) return;

        if (eventType === 'routine') {
            deleteRoutine(eventId);
            App.showToast('Routine deleted');
        } else {
            deleteCalendarEvent(eventId);
            App.showToast('Event deleted');
        }
        
        this.refreshCalendar();
        App.closeModal();
    },

    /**
     * Refresh calendar with latest data from localStorage
     */
    refreshCalendar() {
        console.log('[CalendarView] refreshCalendar() called');
        
        if (!this.calendar) {
            console.log('[CalendarView] refreshCalendar() - calendar instance not found');
            return;
        }

        // Read directly from localStorage via storage functions
        const calendarEvents = getCalendarEvents();
        const routines = getWorkspaceData()?.routines || [];
        
        console.log('[CalendarView] refreshCalendar() - calendarEvents from localStorage:', calendarEvents.length);

        const routineEvents = this.routinesToEvents(routines);
        const allEvents = [...calendarEvents, ...routineEvents];

        console.log('[CalendarView] refreshCalendar() - total events:', allEvents.length);

        // Clear existing events
        this.calendar.getEvents().forEach(e => e.remove());
        console.log('[CalendarView] refreshCalendar() - cleared existing events');
        
        // Add updated events
        allEvents.forEach(event => {
            this.calendar.addEvent(event);
        });
        
        console.log('[CalendarView] refreshCalendar() - added all events to calendar');
        this.calendar.render();

        this.currentEvents = allEvents;
    },

    /**
     * Get event type color
     */
    getEventTypeColor(type) {
        const colors = {
            routine: '#4CAF50',
            activity: '#2196F3',
            technology: '#FF9800',
            economic: '#9C27B0',
            political: '#F44336',
            international: '#00BCD4',
            external: '#607D8B'
        };
        return colors[type] || '#4a90d9';
    },

    /**
     * Get event type label
     */
    getEventTypeLabel(type) {
        const labels = {
            routine: 'Routine',
            activity: 'Activity',
            technology: 'Technology',
            economic: 'Economic',
            political: 'Political',
            international: 'International',
            external: 'External'
        };
        return labels[type] || type;
    },

    /**
     * Get source label for technology events
     */
    getSourceLabel(source) {
        const labels = {
            apple: 'Apple',
            microsoft: 'Microsoft',
            ibm: 'IBM',
            nvidia: 'NVIDIA',
            openai: 'OpenAI',
            tesla: 'Tesla',
            gartner: 'Gartner'
        };
        return labels[source] || source;
    },

    /**
     * Open modal helper
     */
    openModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    /**
     * Reload events from localStorage and refresh calendar
     */
    reloadAndRefresh() {
        // Read directly from localStorage via storage functions
        const calendarEvents = getCalendarEvents();
        const routines = getWorkspaceData()?.routines || [];

        const routineEvents = this.routinesToEvents(routines);
        const allEvents = [...calendarEvents, ...routineEvents];

        // Clear existing events
        if (this.calendar) {
            this.calendar.getEvents().forEach(e => e.remove());
        }
        
        // Add updated events
        allEvents.forEach(event => {
            if (this.calendar) {
                this.calendar.addEvent(event);
            }
        });

        this.currentEvents = allEvents;
    },

    /**
     * Handle view load
     */
    onViewLoad(view) {
        // Update page title based on view
        const titleEl = document.querySelector('.calendar-header h2');
        if (titleEl) {
            titleEl.textContent = '📅 Calendar - ' + view.title;
        }
    }
};