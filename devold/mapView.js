/**
 * mapView.js - Simple Address Geocoder & Map Pins (Lite OpenMap Wrapper)
 * Phase 3.3: Text search bar for location tagging using Leaflet.js and OpenStreetMap Nominatim API
 * v3.0: Polymorphic entity connections - shows connected contacts, routines, and buildings
 */

const MapView = {
    map: null,
    markers: [],
    defaultCenter: [24.7136, 46.6753], // Riyadh coordinates as default
    defaultZoom: 12,

    /**
     * Initialize the map view
     */
    init() {
        if (this.map) {
            this.map.invalidateSize();
            return;
        }

        // Initialize Leaflet map
        this.map = L.map('map').setView(this.defaultCenter, this.defaultZoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Load existing pins
        this.loadPins();
    },

    /**
     * Render the map view
     */
    render() {
        return `
            <h2 style="margin-bottom: 16px;">Location Map</h2>
            <div class="map-search">
                <input type="text" id="mapSearchInput" placeholder="Search for a place (e.g., Home, School, Office)...">
                <button id="addPinBtn">Add Pin</button>
            </div>
            <div id="map"></div>
        `;
    },

    /**
     * Load existing pins from storage and display on map (v3.0 with polymorphic connections)
     */
    loadPins() {
        // Clear existing markers
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        const workspace = getWorkspaceData();
        const pins = workspace?.mapPins || [];
        const contacts = workspace?.contacts || [];
        const routines = workspace?.routines || [];
        const buildings = workspace?.buildings || [];

        pins.forEach(pin => {
            if (pin.latitude && pin.longitude) {
                // Build polymorphic connection info
                const connectedContacts = (pin.connectedContacts || [])
                    .map(id => contacts.find(c => c.id === id))
                    .filter(Boolean);
                
                const connectedRoutines = (pin.connectedRoutines || [])
                    .map(id => routines.find(r => r.id === id))
                    .filter(Boolean);
                
                const connectedBuilding = pin.connectedBuilding 
                    ? buildings.find(b => b.id === pin.connectedBuilding) 
                    : null;

                // Build popup content with polymorphic connections
                let popupHTML = `
                    <div style="min-width: 200px;">
                        <strong>${pin.name}</strong><br>
                        <span style="font-size: 0.85rem; color: #666;">${pin.address || ''}</span><br>
                        <span style="font-size: 0.75rem; padding: 2px 6px; background: #e9ecef; border-radius: 4px; margin-top: 4px; display: inline-block;">
                            ${pin.category || 'location'}
                        </span>
                `;

                // Show connected building
                if (connectedBuilding) {
                    popupHTML += `<br><span style="font-size: 0.75rem; color: #6c757d;">🏢 ${connectedBuilding.name}</span>`;
                }

                // Show connected contacts
                if (connectedContacts.length > 0) {
                    popupHTML += `<br><span style="font-size: 0.75rem; color: #007bff;">👥 ${connectedContacts.map(c => c.name).join(', ')}</span>`;
                }

                // Show connected routines
                if (connectedRoutines.length > 0) {
                    popupHTML += `<br><span style="font-size: 0.75rem; color: #28a745;">📋 ${connectedRoutines.map(r => r.name).join(', ')}</span>`;
                }

                popupHTML += `
                        <div style="margin-top: 8px; display: flex; gap: 4px;">
                            <button onclick="MapView.editPin('${pin.id}')" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">Edit</button>
                            <button onclick="MapView.deletePin('${pin.id}')" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
                
                const marker = L.marker([pin.latitude, pin.longitude])
                    .addTo(this.map)
                    .bindPopup(popupHTML);
                
                marker.pinData = pin;
                this.markers.push(marker);
            }
        });

        // Fit map to show all pins
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    },

    /**
     * Handle geocoding search and add pin
     */
    addPinFromSearch() {
        const input = document.getElementById('mapSearchInput').value.trim();
        if (!input) {
            App.showToast('Please enter a location to search');
            return;
        }

        const btn = document.getElementById('addPinBtn');
        btn.textContent = 'Searching...';
        btn.disabled = true;

        // Use OpenStreetMap Nominatim API for geocoding
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);

                    // Create new pin with v3.0 polymorphic fields
                    const pin = {
                        id: `pin-${Date.now()}`,
                        name: input,
                        address: result.display_name || '',
                        latitude: lat,
                        longitude: lon,
                        category: this._categorizeLocation(input),
                        tags: [this._categorizeLocation(input), 'searched'],
                        connectedContacts: [],
                        connectedRoutines: [],
                        connectedBuilding: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    // Save to storage
                    saveMapPin(pin);

                    // Add marker to map
                    const marker = L.marker([lat, lon])
                        .addTo(this.map)
                        .bindPopup(`
                            <div style="min-width: 200px;">
                                <strong>${pin.name}</strong><br>
                                <span style="font-size: 0.85rem; color: #666;">${pin.address}</span><br>
                                <span style="font-size: 0.75rem; padding: 2px 6px; background: #e9ecef; border-radius: 4px; margin-top: 4px; display: inline-block;">
                                    ${pin.category}
                                </span>
                                <div style="margin-top: 8px; display: flex; gap: 4px;">
                                    <button onclick="MapView.editPin('${pin.id}')" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">Edit</button>
                                    <button onclick="MapView.deletePin('${pin.id}')" style="padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">Delete</button>
                                </div>
                            </div>
                        `);
                    
                    marker.pinData = pin;
                    this.markers.push(marker);

                    // Fit map to new pin
                    this.map.setView([lat, lon], 15);

                    // Clear input and show success
                    document.getElementById('mapSearchInput').value = '';
                    App.showToast(`Pin added for "${input}"`);
                } else {
                    App.showToast('Location not found. Try a different search term.');
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                App.showToast('Error searching for location. Please try again.');
            })
            .finally(() => {
                btn.textContent = 'Add Pin';
                btn.disabled = false;
            });
    },

    /**
     * Categorize location based on name
     */
    _categorizeLocation(name) {
        const lower = name.toLowerCase();
        if (lower.includes('home') || lower.includes('house') || lower.includes('apartment')) return 'residential';
        if (lower.includes('work') || lower.includes('office') || lower.includes('company')) return 'work';
        if (lower.includes('school') || lower.includes('university') || lower.includes('college')) return 'education';
        if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('medical')) return 'healthcare';
        if (lower.includes('mall') || lower.includes('store') || lower.includes('shop')) return 'shopping';
        if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food')) return 'dining';
        if (lower.includes('park') || lower.includes('garden') || lower.includes('recreation')) return 'recreation';
        if (lower.includes('mosque') || lower.includes('church') || lower.includes('temple')) return 'religious';
        return 'other';
    },

    /**
     * Edit an existing pin with polymorphic connection options (v3.0)
     */
    editPin(pinId) {
        const pin = getMapPin(pinId);
        if (!pin) return;

        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const routines = workspace?.routines || [];
        const buildings = workspace?.buildings || [];

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Edit Location Pin';

        // Generate contact options for connectedContacts
        const contactOptions = (contacts || []).map(c => 
            `<option value="${c.id}" ${(pin.connectedContacts || []).includes(c.id) ? 'selected' : ''}>${c.name} (${c.role})</option>`
        ).join('');

        // Generate routine options for connectedRoutines
        const routineOptions = (routines || []).map(r => 
            `<option value="${r.id}" ${(pin.connectedRoutines || []).includes(r.id) ? 'selected' : ''}>${r.name} (${r.category})</option>`
        ).join('');

        // Generate building options for connectedBuilding
        const buildingOptions = (buildings || []).map(b => 
            `<option value="${b.id}" ${pin.connectedBuilding === b.id ? 'selected' : ''}>${b.name}</option>`
        ).join('');

        body.innerHTML = `
            <form id="editPinForm">
                <div class="form-group">
                    <label for="pinNameInput">Location Name</label>
                    <input type="text" id="pinNameInput" value="${pin.name}" required>
                </div>
                <div class="form-group">
                    <label for="pinAddressInput">Address</label>
                    <textarea id="pinAddressInput" rows="2">${pin.address || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="pinLatInput">Latitude</label>
                        <input type="number" step="0.000001" id="pinLatInput" value="${pin.latitude}">
                    </div>
                    <div class="form-group">
                        <label for="pinLngInput">Longitude</label>
                        <input type="number" step="0.000001" id="pinLngInput" value="${pin.longitude}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="pinCategoryInput">Category</label>
                    <select id="pinCategoryInput">
                        <option value="residential" ${pin.category === 'residential' ? 'selected' : ''}>Residential</option>
                        <option value="work" ${pin.category === 'work' ? 'selected' : ''}>Work</option>
                        <option value="education" ${pin.category === 'education' ? 'selected' : ''}>Education</option>
                        <option value="healthcare" ${pin.category === 'healthcare' ? 'selected' : ''}>Healthcare</option>
                        <option value="shopping" ${pin.category === 'shopping' ? 'selected' : ''}>Shopping</option>
                        <option value="dining" ${pin.category === 'dining' ? 'selected' : ''}>Dining</option>
                        <option value="recreation" ${pin.category === 'recreation' ? 'selected' : ''}>Recreation</option>
                        <option value="other" ${pin.category === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>

                <!-- Polymorphic Connection: Building -->
                <div class="form-group">
                    <label for="pinBuildingInput">Connected Building</label>
                    <select id="pinBuildingInput">
                        <option value="">-- None --</option>
                        ${buildingOptions}
                    </select>
                </div>

                <!-- Polymorphic Connection: Contacts (Multi-select) -->
                <div class="form-group">
                    <label>Connected Contacts (Multi-select)</label>
                    <select id="pinContactsInput" multiple style="height: 100px;">
                        ${contactOptions}
                    </select>
                    <small style="color: var(--text-secondary);">Hold Ctrl/Cmd to select multiple</small>
                </div>

                <!-- Polymorphic Connection: Routines (Multi-select) -->
                <div class="form-group">
                    <label>Connected Routines/Trips (Multi-select)</label>
                    <select id="pinRoutinesInput" multiple style="height: 100px;">
                        ${routineOptions}
                    </select>
                    <small style="color: var(--text-secondary);">Hold Ctrl/Cmd to select multiple</small>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelPinEdit">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `;

        document.getElementById('cancelPinEdit').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('editPinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            pin.name = document.getElementById('pinNameInput').value.trim();
            pin.address = document.getElementById('pinAddressInput').value.trim();
            pin.latitude = parseFloat(document.getElementById('pinLatInput').value);
            pin.longitude = parseFloat(document.getElementById('pinLngInput').value);
            pin.category = document.getElementById('pinCategoryInput').value;

            // Get selected contacts (multi-select)
            const selectedContacts = Array.from(document.getElementById('pinContactsInput').selectedOptions)
                .map(opt => opt.value);
            pin.connectedContacts = selectedContacts;

            // Get selected routines (multi-select)
            const selectedRoutines = Array.from(document.getElementById('pinRoutinesInput').selectedOptions)
                .map(opt => opt.value);
            pin.connectedRoutines = selectedRoutines;

            // Get selected building
            pin.connectedBuilding = document.getElementById('pinBuildingInput').value || null;

            saveMapPin(pin);
            this.loadPins();
            modal.style.display = 'none';
            App.showToast('Location updated successfully!');
        });

        modal.style.display = 'flex';
    },

    /**
     * Delete a pin (cascades to connected entities)
     */
    deletePin(pinId) {
        if (confirm('Are you sure you want to delete this location pin? This will also remove it from connected contacts and routines.')) {
            deleteMapPin(pinId);
            this.loadPins();
            App.showToast('Location pin deleted');
        }
    }
};

// Initialize map view event listeners when DOM is ready
document.addEventListener('click', (e) => {
    if (e.target.id === 'addPinBtn' && MapView.map) {
        MapView.addPinFromSearch();
    }
});

// Also handle Enter key in search input
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'mapSearchInput' && MapView.map) {
        MapView.addPinFromSearch();
    }
});