/**
 * contactWizard.js - Quick Contact Form (Form → OrgChart JSON Compiler)
 * Phase 2.3: Simple inputs to add family members or staff with polymorphic location associations
 */

// Helper function to get a flat list of contacts for dropdown (must be defined before ContactWizard)
function getContactsList() {
    const workspace = getWorkspaceData();
    return workspace?.contacts || [];
}

const ContactWizard = {
    /**
     * Open the contact wizard modal
     */
    openEdit(contact = null) {
        const isEdit = contact !== null;
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = isEdit ? 'Edit Contact' : 'Add New Contact';

        // Get all contacts for the "Reports To" dropdown
        const allContacts = getContactsList();
        const reportsToOptions = this._generateReportsToOptions(allContacts, contact);
        
        // Get all map pins for location association dropdown
        const mapPins = getWorkspaceData()?.mapPins || [];
        const buildings = getWorkspaceData()?.buildings || [];
        const locationOptions = this._generateLocationOptions(mapPins, buildings);
        
        // Get existing location associations for pre-population
        const existingAssociations = isEdit ? (contact.locationAssociations || []) : [];
        const associationsHTML = this._generateLocationAssociationsHTML(existingAssociations, mapPins, buildings);

        body.innerHTML = `
            <form id="contactForm">
                <div class="form-group">
                    <label for="contactName">Full Name *</label>
                    <input type="text" id="contactName" required 
                           value="${isEdit ? contact.name : ''}" 
                           placeholder="e.g., John Doe, Jane Smith">
                </div>
                
                <div class="form-group">
                    <label for="contactRole">Role / Relationship *</label>
                    <input type="text" id="contactRole" required 
                           value="${isEdit ? contact.role : ''}" 
                           placeholder="e.g., Father, Software Engineer, Marketing Director">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="contactReportsTo">Reports To / Parent Entity</label>
                        <select id="contactReportsTo">
                            <option value="">-- None (Top Level) --</option>
                            ${reportsToOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contactCategory">Category</label>
                        <select id="contactCategory">
                            <option value="family" ${isEdit && contact.category === 'family' ? 'selected' : ''}>Family</option>
                            <option value="corporate" ${isEdit && contact.category === 'corporate' ? 'selected' : ''}>Corporate</option>
                            <option value="friend" ${isEdit && contact.category === 'friend' ? 'selected' : ''}>Friend</option>
                            <option value="other" ${isEdit && contact.category === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="contactTags">Tags (comma-separated)</label>
                    <input type="text" id="contactTags" 
                           value="${isEdit && contact.tags ? contact.tags.join(', ') : ''}" 
                           placeholder="e.g., family, provider, management">
                </div>

                <div class="form-group">
                    <label for="contactSkills">Primary Skills/Tags (comma-separated)</label>
                    <input type="text" id="contactSkills" 
                           value="${isEdit && contact.skillTags ? contact.skillTags.join(', ') : ''}" 
                           placeholder="e.g., leadership, coding, teaching">
                </div>

                <div class="form-group">
                    <label>Location Associations (Polymorphic)</label>
                    <p style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 10px;">
                        Connect this contact to locations: map pins, buildings, floors, or rooms
                    </p>
                    <div id="locationAssociationsContainer">
                        ${associationsHTML}
                    </div>
                    <button type="button" class="btn-secondary" id="addLocationBtn" style="margin-top: 10px;">
                        + Add Location Association
                    </button>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelContactBtn">Cancel</button>
                    <button type="submit" class="btn-primary" id="saveContactBtn">
                        ${isEdit ? 'Update' : 'Add'} Contact
                    </button>
                </div>
            </form>
        `;

        // Add event listeners
        document.getElementById('cancelContactBtn').addEventListener('click', () => {
            this.close();
        });

        document.getElementById('addLocationBtn').addEventListener('click', () => {
            this._addLocationAssociationRow(mapPins, buildings);
        });

        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleSubmit(isEdit, contact);
        });

        modal.style.display = 'flex';
    },

    /**
     * Generate options for "Reports To" dropdown
     */
    _generateReportsToOptions(contacts, currentContact = null) {
        // Filter out self from options when editing
        const filtered = currentContact 
            ? contacts.filter(c => c.id !== currentContact.id)
            : contacts;
        
        return filtered.map(c => {
            const selected = currentContact && currentContact.reportsTo === c.id ? 'selected' : '';
            return `<option value="${c.id}" ${selected}>${c.name} (${c.role})</option>`;
        }).join('');
    },

    /**
     * Generate location options for polymorphic location selector
     */
    _generateLocationOptions(mapPins, buildings) {
        let options = '<option value="">-- Select Location --</option>';
        
        // Map pins section
        options += '<optgroup label="Map Pins">';
        mapPins.forEach(pin => {
            options += `<option value="${pin.id}" data-type="mapPin">${pin.name} (${pin.address || 'No address'})</option>`;
        });
        options += '</optgroup>';
        
        // Buildings section
        options += '<optgroup label="Buildings">';
        buildings.forEach(b => {
            options += `<option value="${b.id}" data-type="building">${b.name}</option>`;
        });
        options += '</optgroup>';
        
        // Floors and rooms will be dynamically added when a building is selected
        options += '<optgroup label="Floors & Rooms" id="floorRoomOptions" style="display:none;">';
        options += '</optgroup>';
        
        return options;
    },

    /**
     * Generate HTML for existing location associations
     */
    _generateLocationAssociationsHTML(associations, mapPins, buildings) {
        if (!associations || associations.length === 0) {
            return '<p style="color: var(--text-secondary); font-style: italic;">No location associations yet. Click "Add Location Association" to connect this contact to a location.</p>';
        }

        let html = '<div class="location-associations-list">';
        associations.forEach((assoc, index) => {
            let locationName = 'Unknown';
            let locationType = assoc.locationType;
            
            if (locationType === 'mapPin') {
                const pin = mapPins.find(p => p.id === assoc.locationId);
                locationName = pin ? pin.name : 'Unknown Pin';
            } else if (locationType === 'building') {
                const building = buildings.find(b => b.id === assoc.locationId);
                locationName = building ? building.name : 'Unknown Building';
            }

            const associationTypes = ['home', 'work', 'frequent', 'temporary'];
            const typeOptions = associationTypes.map(t => 
                `<option value="${t}" ${assoc.associationType === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`
            ).join('');

            html += `
                <div class="location-association-item" data-index="${index}">
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;">
                            <small>Location</small>
                            <input type="text" value="${locationName}" disabled style="opacity: 0.7;">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <small>Type</small>
                            <select class="assoc-type" data-index="${index}">
                                ${typeOptions}
                            </select>
                        </div>
                        <div class="form-group" style="flex: 0.5;">
                            <small>&nbsp;</small>
                            <button type="button" class="btn-remove assoc-remove" data-index="${index}">✕</button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    /**
     * Add a location association row to the form
     */
    _addLocationAssociationRow(mapPins, buildings) {
        const container = document.getElementById('locationAssociationsContainer');
        
        // Remove placeholder if exists
        const placeholder = container.querySelector('p');
        if (placeholder) placeholder.remove();

        const index = container.querySelectorAll('.location-association-item').length;
        
        const mapPinOptions = (mapPins || []).map(pin => 
            `<option value="${pin.id}" data-type="mapPin">${pin.name} (${pin.address || 'No address'})</option>`
        ).join('');

        const buildingOptions = (buildings || []).map(b => 
            `<option value="${b.id}" data-type="building">${b.name}</option>`
        ).join('');

        const itemHTML = `
            <div class="location-association-item" data-index="${index}">
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>Location</label>
                        <select class="assoc-location" data-index="${index}">
                            <option value="">-- Select --</option>
                            <optgroup label="Map Pins">
                                ${mapPinOptions}
                            </optgroup>
                            <optgroup label="Buildings">
                                ${buildingOptions}
                            </optgroup>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Association Type</label>
                        <select class="assoc-type" data-index="${index}">
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="frequent">Frequent</option>
                            <option value="temporary">Temporary</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 0.5;">
                        <label>&nbsp;</label>
                        <button type="button" class="btn-secondary btn-remove assoc-remove" data-index="${index}">✕</button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', itemHTML);

        // Add change listener to location selector for dynamic floor/room loading
        const select = container.querySelector(`.assoc-location[data-index="${index}"]`);
        select.addEventListener('change', (e) => {
            this._handleLocationTypeChange(e, index, mapPins, buildings);
        });

        // Add remove button listener
        container.querySelector(`.assoc-remove[data-index="${index}"]`).addEventListener('click', () => {
            const item = container.querySelector(`.location-association-item[data-index="${index}"]`);
            if (item) item.remove();
        });
    },

    /**
     * Handle location type change - dynamically add floors and rooms
     */
    _handleLocationTypeChange(event, index, mapPins, buildings) {
        const selectedValue = event.target.value;
        const selectedItem = event.target.options[event.target.selectedIndex];
        const locationType = selectedItem.dataset.type;
        
        // If a building is selected, dynamically add floors and rooms
        if (locationType === 'building') {
            const building = buildings.find(b => b.id === selectedValue);
            if (building && building.floors) {
                let floorRoomOptions = '';
                building.floors.forEach(floor => {
                    floorRoomOptions += `<optgroup label="Floor ${floor.number || floor.name}">`;
                    if (floor.rooms) {
                        floor.rooms.forEach(room => {
                            floorRoomOptions += `<option value="${room.id}" data-type="room" data-building="${building.id}" data-floor="${floor.id}">${floor.name} - ${room.name}</option>`;
                        });
                    }
                    floorRoomOptions += '</optgroup>';
                });
                
                // Add to the select options
                const floorRoomGroup = event.target.querySelector('#floorRoomOptions');
                if (floorRoomGroup) {
                    floorRoomGroup.innerHTML = floorRoomOptions;
                    floorRoomGroup.style.display = 'block';
                }
            }
        }
    },

    /**
     * Handle form submission - compile to contact JSON with location associations
     */
    _handleSubmit(isEdit, existingContact) {
        const name = document.getElementById('contactName').value.trim();
        const role = document.getElementById('contactRole').value.trim();
        const reportsTo = document.getElementById('contactReportsTo').value || null;
        const category = document.getElementById('contactCategory').value;
        const tagsStr = document.getElementById('contactTags').value.trim();
        const skillsStr = document.getElementById('contactSkills').value.trim();

        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [category];
        const skillTags = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s) : [];

        // Collect location associations from the form
        const locationAssociations = [];
        const associationItems = document.querySelectorAll('.location-association-item');
        associationItems.forEach(item => {
            const locationSelect = item.querySelector('.assoc-location');
            const typeSelect = item.querySelector('.assoc-type');
            
            if (locationSelect && typeSelect && locationSelect.value) {
                const locationType = locationSelect.options[locationSelect.selectedIndex].dataset.type || 'mapPin';
                locationAssociations.push({
                    locationId: locationSelect.value,
                    locationType: locationType,
                    associationType: typeSelect.value,
                    assignedAt: new Date().toISOString()
                });
            }
        });

        const contactData = {
            id: isEdit ? existingContact.id : `contact-${Date.now()}`,
            name: name,
            role: role,
            tags: tags,
            reportsTo: reportsTo,
            skillTags: skillTags,
            category: category,
            locationAssociations: locationAssociations,
            createdAt: isEdit ? existingContact.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to storage
        saveContact(contactData);
        this.close();
        
        // Refresh current view
        App.showContacts();
        
        // Show success feedback
        App.showToast(`Contact "${name}" ${isEdit ? 'updated' : 'added'} successfully!`);
    },

    /**
     * Close the wizard modal
     */
    close() {
        document.getElementById('modalOverlay').style.display = 'none';
    }
};

