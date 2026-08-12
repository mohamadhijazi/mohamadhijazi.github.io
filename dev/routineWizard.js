/**
 * routineWizard.js - Routine/Trip Wizard (Form → BPMN JSON Compiler with Polymorphic v3.0 Model)
 * Phase 2.2: Form where users create routines/trips with multi-stop locations and multi-person assignments
 */

const RoutineWizard = {
    /**
     * Open the routine wizard modal
     */
    openEdit(routine = null) {
        const isEdit = routine !== null;
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = isEdit ? 'Edit Routine/Trip' : 'Create New Routine/Trip';

        // Get workspace data for location and contact references
        const workspace = getWorkspaceData();
        const mapPins = workspace?.mapPins || [];
        const contacts = workspace?.contacts || [];
        const buildings = workspace?.buildings || [];

        // Existing data for edit mode
        const locationStops = isEdit ? (routine.locationStops || []) : [];
        const assignedPersons = isEdit ? (routine.assignedPersons || []) : [];

        body.innerHTML = `
            <form id="routineForm">
                <div class="form-group">
                    <label for="routineName">Routine/Trip Name *</label>
                    <input type="text" id="routineName" required 
                           value="${isEdit ? routine.name : ''}" 
                           placeholder="e.g., Morning Commute, Family Weekend Trip">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="routineCategory">Category</label>
                        <select id="routineCategory">
                            <option value="Daily" ${isEdit && routine.category === 'Daily' ? 'selected' : ''}>Daily</option>
                            <option value="Work" ${isEdit && routine.category === 'Work' ? 'selected' : ''}>Work</option>
                            <option value="Health" ${isEdit && routine.category === 'Health' ? 'selected' : ''}>Health</option>
                            <option value="Transport" ${isEdit && routine.category === 'Transport' ? 'selected' : ''}>Transport</option>
                            <option value="Family" ${isEdit && routine.category === 'Family' ? 'selected' : ''}>Family</option>
                            <option value="Education" ${isEdit && routine.category === 'Education' ? 'selected' : ''}>Education</option>
                            <option value="Leisure" ${isEdit && routine.category === 'Leisure' ? 'selected' : ''}>Leisure</option>
                            <option value="Other" ${isEdit && routine.category === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="routineStatus">Status</label>
                        <select id="routineStatus">
                            <option value="active" ${isEdit && routine.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${isEdit && routine.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="completed" ${isEdit && routine.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="routineTotalDuration">Total Duration (minutes)</label>
                        <input type="number" id="routineTotalDuration" 
                               value="${isEdit ? (routine.totalDuration || '') : ''}" 
                               min="1" max="10080" placeholder="e.g., 60">
                    </div>
                    <div class="form-group">
                        <label for="routineRecurrence">Recurrence</label>
                        <select id="routineRecurrence">
                            <option value="none" ${!isEdit || !routine.isRecurring ? 'selected' : ''}>No Recurrence</option>
                            <option value="daily" ${isEdit && routine.isRecurring && routine.recurrencePattern === 'daily' ? 'selected' : ''}>Daily</option>
                            <option value="weekly" ${isEdit && routine.isRecurring && routine.recurrencePattern === 'weekly' ? 'selected' : ''}>Weekly</option>
                            <option value="monthly" ${isEdit && routine.isRecurring && routine.recurrencePattern === 'monthly' ? 'selected' : ''}>Monthly</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea id="routineDescription" rows="2" 
                              placeholder="Brief description of this routine/trip...">${isEdit ? routine.description || '' : ''}</textarea>
                </div>

                <div class="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" id="routineTags" 
                           value="${isEdit && routine.tags ? routine.tags.join(', ') : ''}" 
                           placeholder="e.g., commute, daily, family">
                </div>

                <!-- Multi-Stop Location Section -->
                <div class="form-group">
                    <label>Location Stops (Polymorphic)</label>
                    <p style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 10px;">
                        Add geographic stops for this trip/routine. Each stop can be a map pin or custom location.
                    </p>
                    <div id="locationStopsContainer">
                        ${locationStops.map((stop, i) => this._renderLocationStopInput(stop, i, mapPins)).join('')}
                    </div>
                    <button type="button" class="btn-add-row" id="addStopBtn">+ Add Location Stop</button>
                </div>

                <!-- Multi-Person Assignment Section -->
                <div class="form-group">
                    <label>Assigned Persons (Polymorphic)</label>
                    <p style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 10px;">
                        Assign persons to this routine/trip with specific roles.
                    </p>
                    <div id="assignedPersonsContainer">
                        ${assignedPersons.map((person, i) => this._renderAssignedPersonInput(person, i, contacts)).join('')}
                    </div>
                    <button type="button" class="btn-add-row" id="addPersonBtn">+ Add Person</button>
                </div>

                <!-- Steps Section (for routine activities) -->
                <div class="form-group">
                    <label>Steps/Activities</label>
                    <div id="stepsContainer">
                        ${isEdit && routine.steps ? routine.steps.map((step, i) => this._renderStepInput(step, i)).join('') : ''}
                    </div>
                    <button type="button" class="btn-add-row" id="addStepBtn">+ Add Step</button>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelRoutineBtn">Cancel</button>
                    <button type="submit" class="btn-primary" id="saveRoutineBtn">
                        ${isEdit ? 'Update' : 'Save'} Routine/Trip
                    </button>
                </div>
            </form>
        `;

        // Add event listeners
        document.getElementById('addStopBtn').addEventListener('click', () => {
            const container = document.getElementById('locationStopsContainer');
            const stopCount = container.children.length;
            const div = document.createElement('div');
            div.innerHTML = this._renderLocationStopInput(null, stopCount, mapPins);
            container.appendChild(div.firstElementChild);
        });

        document.getElementById('addPersonBtn').addEventListener('click', () => {
            const container = document.getElementById('assignedPersonsContainer');
            const personCount = container.children.length;
            const div = document.createElement('div');
            div.innerHTML = this._renderAssignedPersonInput(null, personCount, contacts);
            container.appendChild(div.firstElementChild);
        });

        document.getElementById('addStepBtn').addEventListener('click', () => {
            const container = document.getElementById('stepsContainer');
            const stepCount = container.children.length;
            const div = document.createElement('div');
            div.innerHTML = this._renderStepInput(null, stepCount);
            container.appendChild(div.firstElementChild);
        });

        document.getElementById('cancelRoutineBtn').addEventListener('click', () => {
            this.close();
        });

        document.getElementById('routineForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleSubmit(isEdit, routine);
        });

        modal.style.display = 'flex';
    },

    /**
     * Render a location stop input row
     */
    _renderLocationStopInput(stop = null, index = 0, mapPins = []) {
        const s = stop || { stopName: '', locationId: '', locationType: 'mapPin', estimatedDuration: 15, description: '' };
        const mapPinOptions = (mapPins || []).map(pin => 
            `<option value="${pin.id}" ${s.locationId === pin.id ? 'selected' : ''}>${pin.name} (${pin.address || 'No address'})</option>`
        ).join('');

        return `
            <div class="location-stop-input" data-stop-index="${index}">
                <div class="form-row">
                    <input type="text" placeholder="Stop name" class="stop-name" 
                           value="${s.stopName}" required style="flex:2;">
                    <select class="stop-location" style="flex:3;">
                        <option value="">-- Select Map Pin --</option>
                        ${mapPinOptions}
                    </select>
                    <input type="number" placeholder="Mins" class="stop-duration" 
                           value="${s.estimatedDuration}" min="1" max="10080" style="width:70px;">
                    <button type="button" class="btn-remove-row" data-remove-stop="${index}">&times;</button>
                </div>
                <input type="text" placeholder="Description (optional)" class="stop-description" 
                       value="${s.description || ''}" style="margin-top: 5px;">
            </div>
        `;
    },

    /**
     * Render an assigned person input row
     */
    _renderAssignedPersonInput(person = null, index = 0, contacts = []) {
        const p = person || { contactId: '', role: 'participant', confirmed: false };
        const contactOptions = (contacts || []).map(c => 
            `<option value="${c.id}" ${p.contactId === c.id ? 'selected' : ''}>${c.name} (${c.role})</option>`
        ).join('');

        return `
            <div class="assigned-person-input" data-person-index="${index}">
                <div class="form-row">
                    <select class="person-contact" style="flex:3;">
                        <option value="">-- Select Contact --</option>
                        ${contactOptions}
                    </select>
                    <select class="person-role" style="flex:2;">
                        <option value="organizer" ${p.role === 'organizer' ? 'selected' : ''}>Organizer</option>
                        <option value="participant" ${p.role === 'participant' ? 'selected' : ''}>Participant</option>
                        <option value="observer" ${p.role === 'observer' ? 'selected' : ''}>Observer</option>
                    </select>
                    <label style="flex:1; display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" class="person-confirmed" ${p.confirmed ? 'checked' : ''}> Confirmed
                    </label>
                    <button type="button" class="btn-remove-row" data-remove-person="${index}">&times;</button>
                </div>
            </div>
        `;
    },

    /**
     * Render a single step input row
     */
    _renderStepInput(step = null, index = 0) {
        const s = step || { name: '', type: 'Action', order: index + 1, tags: [], repeatCount: 1 };
        return `
            <div class="routine-step-input" data-step-index="${index}">
                <input type="text" placeholder="Step name" class="step-name" 
                       value="${s.name}" required style="flex:2;">
                <select class="step-type" style="width:100px;">
                    <option value="Action" ${s.type === 'Action' ? 'selected' : ''}>Action</option>
                    <option value="Check" ${s.type === 'Check' ? 'selected' : ''}>Check</option>
                    <option value="Decision" ${s.type === 'Decision' ? 'selected' : ''}>Decision</option>
                    <option value="Event" ${s.type === 'Event' ? 'selected' : ''}>Event</option>
                </select>
                <input type="number" placeholder="Repeat" class="step-repeat" 
                       value="${s.repeatCount || 1}" min="1" max="100" style="width:60px;">
                <button type="button" class="btn-remove-row" data-remove-step="${index}">&times;</button>
            </div>
        `;
    },

    /**
     * Handle form submission - compile to polymorphic v3.0 JSON
     */
    _handleSubmit(isEdit, existingRoutine) {
        const name = document.getElementById('routineName').value.trim();
        const category = document.getElementById('routineCategory').value;
        const status = document.getElementById('routineStatus').value;
        const description = document.getElementById('routineDescription').value.trim();
        const totalDuration = parseInt(document.getElementById('routineTotalDuration').value) || 0;
        const recurrencePattern = document.getElementById('routineRecurrence').value;
        const tagsStr = document.getElementById('routineTags').value.trim();
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

        const isRecurring = recurrencePattern !== 'none';

        // Collect location stops
        const locationStops = [];
        const stopInputs = document.querySelectorAll('#locationStopsContainer .location-stop-input');
        stopInputs.forEach((input, index) => {
            const stopName = input.querySelector('.stop-name').value.trim();
            const locationId = input.querySelector('.stop-location').value;
            const estimatedDuration = parseInt(input.querySelector('.stop-duration').value) || 15;
            const description = input.querySelector('.stop-description').value.trim();

            if (stopName) {
                locationStops.push({
                    id: `stop-${Date.now()}-${index}`,
                    order: index + 1,
                    stopName: stopName,
                    locationId: locationId,
                    locationType: locationId ? 'mapPin' : 'custom',
                    estimatedArrival: new Date().toISOString(),
                    estimatedDuration: estimatedDuration,
                    description: description,
                    tags: []
                });
            }
        });

        // Collect assigned persons
        const assignedPersons = [];
        const personInputs = document.querySelectorAll('#assignedPersonsContainer .assigned-person-input');
        personInputs.forEach((input, index) => {
            const contactId = input.querySelector('.person-contact').value;
            const role = input.querySelector('.person-role').value;
            const confirmed = input.querySelector('.person-confirmed').checked;

            if (contactId) {
                assignedPersons.push({
                    contactId: contactId,
                    role: role,
                    confirmed: confirmed
                });
            }
        });

        // Collect steps
        const stepInputs = document.querySelectorAll('#stepsContainer .routine-step-input');
        const steps = [];
        stepInputs.forEach((input, index) => {
            const name = input.querySelector('.step-name').value.trim();
            const type = input.querySelector('.step-type').value;
            const repeatCount = parseInt(input.querySelector('.step-repeat').value) || 1;
            
            if (name) {
                steps.push({
                    id: `step-${Date.now()}-${index}`,
                    name: name,
                    type: type,
                    order: index + 1,
                    tags: [],
                    repeatCount: repeatCount
                });
            }
        });

        // Build BPMN structure
        const bpmn = {
            definitionId: `bpmn-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-v1`,
            name: name,
            version: '1.0',
            startEvent: { id: 'start', name: 'Begin' },
            tasks: steps.map(s => ({
                id: s.id,
                name: s.name,
                type: s.type,
                repeatCount: s.repeatCount
            })),
            endEvent: { id: 'end', name: 'Complete' }
        };

        const routineData = {
            id: isEdit ? existingRoutine.id : `routine-${Date.now()}`,
            name: name,
            category: category,
            description: description,
            status: status,
            totalDuration: totalDuration,
            startDate: isEdit ? existingRoutine.startDate : new Date().toISOString(),
            endDate: isEdit ? existingRoutine.endDate : new Date().toISOString(),
            isRecurring: isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : 'daily',
            locationStops: locationStops,
            assignedPersons: assignedPersons,
            tags: tags,
            bpmn: bpmn,
            steps: steps,
            completedSteps: isEdit ? (existingRoutine.completedSteps || []) : [],
            createdAt: isEdit ? existingRoutine.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to storage
        saveRoutine(routineData);
        this.close();
        
        // Refresh current view
        App.showRoutines();

        // Show success feedback
        App.showToast(`Routine/Trip "${name}" saved successfully!`);
    },

    /**
     * Close the wizard modal
     */
    close() {
        document.getElementById('modalOverlay').style.display = 'none';
    }
};

// Auto-close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        RoutineWizard.close();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        RoutineWizard.close();
    }
});