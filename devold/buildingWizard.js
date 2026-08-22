/**
 * buildingWizard.js - Building & Floor Management Wizard
 * Phase 3.2: Full CRUD UI for Buildings, Floors, and Rooms
 * Provides modal forms for adding/editing buildings, floors, and rooms
 */

const BuildingWizard = {
    /**
     * Open the "Add Building" wizard
     */
    openAdd() {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Add New Building';

        body.innerHTML = `
            <form id="buildingForm">
                <div class="form-group">
                    <label for="buildingName">Building Name *</label>
                    <input type="text" id="buildingName" required 
                           placeholder="e.g., Family Residence, Corporate Office Tower">
                </div>

                <div class="form-group">
                    <label for="buildingAddress">Address</label>
                    <input type="text" id="buildingAddress" 
                           placeholder="e.g., 123 Main Street, Residential District">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="buildingLat">Latitude</label>
                        <input type="number" id="buildingLat" step="any" 
                               placeholder="e.g., 24.7136">
                    </div>
                    <div class="form-group">
                        <label for="buildingLng">Longitude</label>
                        <input type="number" id="buildingLng" step="any" 
                               placeholder="e.g., 46.6753">
                    </div>
                </div>

                <div class="form-group">
                    <label for="buildingTags">Tags (comma-separated)</label>
                    <input type="text" id="buildingTags" 
                           placeholder="e.g., residential, family">
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelBuildingBtn">Cancel</button>
                    <button type="submit" class="btn-primary">Add Building</button>
                </div>
            </form>
        `;

        this._setupBuildingFormListeners();
        modal.style.display = 'flex';
    },

    /**
     * Open the "Edit Building" wizard
     */
    openEdit(building) {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Edit Building';

        const coordinates = building.coordinates || {};
        const tagsStr = building.tags ? building.tags.join(', ') : '';

        body.innerHTML = `
            <form id="buildingForm">
                <input type="hidden" id="buildingId" value="${building.id}">
                
                <div class="form-group">
                    <label for="buildingName">Building Name *</label>
                    <input type="text" id="buildingName" required value="${building.name}">
                </div>

                <div class="form-group">
                    <label for="buildingAddress">Address</label>
                    <input type="text" id="buildingAddress" value="${building.address || ''}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="buildingLat">Latitude</label>
                        <input type="number" id="buildingLat" step="any" value="${coordinates.lat || ''}">
                    </div>
                    <div class="form-group">
                        <label for="buildingLng">Longitude</label>
                        <input type="number" id="buildingLng" step="any" value="${coordinates.lng || ''}">
                    </div>
                </div>

                <div class="form-group">
                    <label for="buildingTags">Tags (comma-separated)</label>
                    <input type="text" id="buildingTags" value="${tagsStr}">
                </div>

                <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="margin: 0;">Floors (${(building.floors || []).length})</h3>
                    <button type="button" class="btn-secondary" id="addFloorBtn">+ Add Floor</button>
                </div>

                <div id="floorsContainer">
                    ${this._generateFloorsHTML(building)}
                </div>

                <div class="form-actions" style="margin-top: 20px;">
                    <button type="button" class="btn-secondary" id="cancelBuildingBtn">Cancel</button>
                    <button type="submit" class="btn-primary">Save Building</button>
                </div>
            </form>
        `;

        this._setupEditFormListeners(building);
        modal.style.display = 'flex';
    },

    /**
     * Generate HTML for floors in the edit form
     */
    _generateFloorsHTML(building) {
        if (!building.floors || building.floors.length === 0) {
            return '<p style="color: var(--text-secondary); font-style: italic; text-align: center; padding: 20px;">No floors yet. Click "Add Floor" to create one.</p>';
        }

        let html = '';
        building.floors.forEach((floor, floorIndex) => {
            html += `
                <div class="floor-card" data-floor-index="${floorIndex}" style="border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; overflow: hidden;">
                    <div class="floor-header" style="background: var(--bg-tertiary); padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <strong>Floor ${floor.number || floor.name}</strong>
                            <span style="margin-left: 12px; color: var(--text-secondary); font-size: 0.85rem;">${floor.name || ''}</span>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button type="button" class="btn-secondary" style="font-size: 0.75rem; padding: 4px 8px;" 
                                    onclick="BuildingWizard.editFloor(${floorIndex})">✏️ Edit</button>
                            <button type="button" class="btn-remove" style="padding: 4px 8px;" 
                                    onclick="BuildingWizard.removeFloor(${floorIndex})">🗑️</button>
                        </div>
                    </div>
                    <div class="floor-content" style="padding: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h4 style="margin: 0; font-size: 0.9rem;">Rooms (${(floor.rooms || []).length})</h4>
                            <button type="button" class="btn-secondary" style="font-size: 0.75rem; padding: 4px 8px;" 
                                    id="addRoomBtn-${floorIndex}">+ Add Room</button>
                        </div>
                        <div id="roomsContainer-${floorIndex}" class="rooms-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;">
                            ${this._generateRoomsHTML(floor)}
                        </div>
                    </div>
                </div>
            `;
        });
        return html;
    },

    /**
     * Generate HTML for rooms in a floor
     */
    _generateRoomsHTML(floor) {
        if (!floor.rooms || floor.rooms.length === 0) {
            return '<p style="color: var(--text-muted); font-style: italic; grid-column: 1/-1; font-size: 0.85rem;">No rooms yet.</p>';
        }

        let html = '';
        floor.rooms.forEach((room, roomIndex) => {
            const icon = this._getRoomIcon(room.type);
            html += `
                <div class="room-item" data-room-index="${roomIndex}" style="border: 1px solid var(--border); border-radius: 6px; padding: 10px;">
                    <div style="display: flex; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 1.1rem;">${icon}</span>
                        <div style="margin-left: 6px; font-weight: 500; font-size: 0.85rem;">${room.name}</div>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">
                        Type: ${room.type || 'N/A'} | Cap: ${room.capacity || '-'}
                    </div>
                    ${room.area ? `<div style="font-size: 0.75rem; color: var(--text-secondary);">Area: ${room.area}</div>` : ''}
                    <div style="margin-top: 8px; display: flex; gap: 4px;">
                        <button type="button" class="btn-secondary" style="flex: 1; font-size: 0.7rem; padding: 3px 6px;" 
                                onclick="BuildingWizard.editRoom(${roomIndex})">✏️</button>
                        <button type="button" class="btn-remove" style="padding: 3px 6px;" 
                                onclick="BuildingWizard.removeRoom(${roomIndex})">🗑️</button>
                    </div>
                </div>
            `;
        });
        return html;
    },

    /**
     * Get room icon based on type
     */
    _getRoomIcon(type) {
        const icons = {
            'bedroom': '🛏️',
            'kitchen': '🍳',
            'bathroom': '🚿',
            'living': '🛋️',
            'office': '💼',
            'meeting': '🤝',
            'common': '🏠',
            'utility': '🔧',
            'outdoor': '🌳',
            'secure': '🔒',
            'work': '💻'
        };
        return icons[type] || '🚪';
    },

    /**
     * Setup listeners for the "Add Building" form
     */
    _setupBuildingFormListeners() {
        document.getElementById('cancelBuildingBtn').addEventListener('click', () => {
            this.close();
        });

        document.getElementById('buildingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('buildingName').value.trim();
            const address = document.getElementById('buildingAddress').value.trim();
            const lat = parseFloat(document.getElementById('buildingLat').value) || null;
            const lng = parseFloat(document.getElementById('buildingLng').value) || null;
            const tagsStr = document.getElementById('buildingTags').value.trim();
            const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

            const building = {
                id: `building-${Date.now()}`,
                name: name,
                address: address,
                coordinates: { lat: lat, lng: lng },
                tags: tags,
                floors: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            saveBuilding(building);
            this.close();
            App.refreshCurrentView();
            App.showToast(`Building "${name}" added successfully!`);
        });
    },

    /**
     * Setup listeners for the "Edit Building" form
     */
    _setupEditFormListeners(building) {
        document.getElementById('cancelBuildingBtn').addEventListener('click', () => {
            this.close();
        });

        document.getElementById('addFloorBtn').addEventListener('click', () => {
            this._addFloorInline(building);
        });

        document.getElementById('buildingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('buildingId').value;
            const name = document.getElementById('buildingName').value.trim();
            const address = document.getElementById('buildingAddress').value.trim();
            const lat = parseFloat(document.getElementById('buildingLat').value) || null;
            const lng = parseFloat(document.getElementById('buildingLng').value) || null;
            const tagsStr = document.getElementById('buildingTags').value.trim();
            const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

            // Collect floors from the form
            const floorCards = document.querySelectorAll('.floor-card');
            const floors = [];
            
            floorCards.forEach(card => {
                const floorIndex = parseInt(card.dataset.floorIndex);
                const rooms = [];
                
                // Collect rooms for this floor
                const roomItems = card.querySelectorAll('.room-item');
                roomItems.forEach(roomItem => {
                    const roomIndex = parseInt(roomItem.dataset.roomIndex);
                    // Get room data from the original building
                    if (building.floors && building.floors[floorIndex] && building.floors[floorIndex].rooms && building.floors[floorIndex].rooms[roomIndex]) {
                        rooms.push({...building.floors[floorIndex].rooms[roomIndex]});
                    }
                });

                // Get floor number and name from the card
                const header = card.querySelector('.floor-header strong');
                const floorNameSpan = card.querySelector('.floor-header span');
                const floorNumberText = header ? header.textContent.replace('Floor ', '') : '';
                const floorName = floorNameSpan ? floorNameSpan.textContent.trim() : '';

                floors.push({
                    id: building.floors[floorIndex]?.id || `floor-${Date.now()}-${floorIndex}`,
                    name: floorName || `Floor ${floorNumberText}`,
                    number: parseInt(floorNumberText) || floorIndex + 1,
                    rooms: rooms
                });
            });

            const updatedBuilding = {
                ...building,
                id: id,
                name: name,
                address: address,
                coordinates: { lat: lat, lng: lng },
                tags: tags,
                floors: floors,
                updatedAt: new Date().toISOString()
            };

            saveBuilding(updatedBuilding);
            this.close();
            App.refreshCurrentView();
            App.showToast(`Building "${name}" updated successfully!`);
        });
    },

    /**
     * Add a new floor inline in the edit form
     */
    _addFloorInline(building) {
        const container = document.getElementById('floorsContainer');
        
        // Remove placeholder if exists
        const placeholder = container.querySelector('p');
        if (placeholder) placeholder.remove();

        const floorIndex = container.querySelectorAll('.floor-card').length;
        const floorId = `floor-${Date.now()}`;

        const floorHTML = `
            <div class="floor-card" data-floor-index="${floorIndex}" style="border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; overflow: hidden;">
                <div class="floor-header" style="background: var(--bg-tertiary); padding: 10px 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <input type="number" class="floor-number-input" value="${floorIndex + 1}" min="0" 
                               style="width: 60px; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px;">
                        <input type="text" class="floor-name-input" placeholder="Floor name" 
                               style="margin-left: 8px; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; width: 150px;">
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="btn-remove" style="padding: 4px 8px;" 
                                onclick="BuildingWizard.cancelNewFloor(${floorIndex})">✕</button>
                    </div>
                </div>
                <div class="floor-content" style="padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; font-size: 0.9rem;">Rooms (0)</h4>
                        <button type="button" class="btn-secondary" style="font-size: 0.75rem; padding: 4px 8px;" 
                                id="addRoomBtn-${floorIndex}">+ Add Room</button>
                    </div>
                    <div id="roomsContainer-${floorIndex}" class="rooms-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;">
                        <p style="color: var(--text-muted); font-style: italic; grid-column: 1/-1; font-size: 0.85rem;">No rooms yet. Click "Add Room" to create one.</p>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', floorHTML);

        // Setup add room button
        setTimeout(() => {
            const addRoomBtn = document.getElementById(`addRoomBtn-${floorIndex}`);
            if (addRoomBtn) {
                addRoomBtn.addEventListener('click', () => {
                    this._addRoomInline(floorIndex, floorId);
                });
            }
        }, 50);
    },

    /**
     * Cancel adding a new floor
     */
    cancelNewFloor(floorIndex) {
        const floorCard = document.querySelector(`.floor-card[data-floor-index="${floorIndex}"]`);
        if (floorCard) {
            floorCard.remove();
            this._reindexFloors();
        }
    },

    /**
     * Add a new room inline to a floor
     */
    _addRoomInline(floorIndex, floorId) {
        const container = document.getElementById(`roomsContainer-${floorIndex}`);
        
        // Remove placeholder if exists
        const placeholder = container.querySelector('p');
        if (placeholder) placeholder.remove();

        const roomIndex = container.querySelectorAll('.room-item').length;
        const roomId = `room-${Date.now()}`;

        const roomHTML = `
            <div class="room-item" data-room-index="${roomIndex}" style="border: 1px solid var(--border); border-radius: 6px; padding: 10px;">
                <div class="form-group" style="margin-bottom: 8px;">
                    <input type="text" class="room-name-input" placeholder="Room name" required
                           style="width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; font-weight: 500;">
                </div>
                <div class="form-row" style="margin-bottom: 8px;">
                    <div class="form-group" style="flex: 1; margin-bottom: 4px;">
                        <select class="room-type-input" style="width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 0.8rem;">
                            <option value="common">Common</option>
                            <option value="bedroom">Bedroom</option>
                            <option value="kitchen">Kitchen</option>
                            <option value="bathroom">Bathroom</option>
                            <option value="office">Office</option>
                            <option value="meeting">Meeting</option>
                            <option value="utility">Utility</option>
                            <option value="outdoor">Outdoor</option>
                            <option value="secure">Secure</option>
                            <option value="work">Work</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 0.8; margin-bottom: 4px;">
                        <input type="number" class="room-capacity-input" placeholder="Cap." min="0"
                               style="width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 0.8rem;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 8px;">
                    <input type="text" class="room-area-input" placeholder="Area (e.g., 20m²)"
                           style="width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 0.8rem;">
                </div>
                <div class="form-group" style="margin-bottom: 8px;">
                    <input type="text" class="room-tags-input" placeholder="Tags (comma-separated)"
                           style="width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 0.8rem;">
                </div>
                <div class="form-group" style="margin-bottom: 8px;">
                    <input type="text" class="room-equipment-input" placeholder="Equipment (comma-separated)"
                           style="width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 0.8rem;">
                </div>
                <div style="display: flex; gap: 4px;">
                    <button type="button" class="btn-secondary" style="flex: 1; font-size: 0.7rem; padding: 3px 6px;" 
                            onclick="BuildingWizard.saveNewRoom(${floorIndex}, '${roomId}')">💾 Save</button>
                    <button type="button" class="btn-remove" style="padding: 3px 6px;" 
                            onclick="BuildingWizard.cancelNewRoom(${floorIndex})">🗑️</button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', roomHTML);
    },

    /**
     * Save a new room being added inline
     */
    saveNewRoom(floorIndex, roomId) {
        const roomItem = document.querySelector(`.room-item[data-room-index="${floorIndex}"] .room-item:last-child`);
        // Find the last room item
        const allRooms = document.querySelectorAll(`#roomsContainer-${floorIndex} .room-item`);
        const lastRoom = allRooms[allRooms.length - 1];
        
        if (!lastRoom) return;

        const name = lastRoom.querySelector('.room-name-input').value.trim();
        if (!name) {
            App.showToast('Please enter a room name');
            return;
        }

        const type = lastRoom.querySelector('.room-type-input').value;
        const capacity = parseInt(lastRoom.querySelector('.room-capacity-input').value) || 0;
        const area = lastRoom.querySelector('.room-area-input').value.trim();
        const tagsStr = lastRoom.querySelector('.room-tags-input').value.trim();
        const equipmentStr = lastRoom.querySelector('.room-equipment-input').value.trim();

        const room = {
            id: roomId,
            name: name,
            type: type,
            capacity: capacity,
            area: area,
            tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [],
            equipment: equipmentStr ? equipmentStr.split(',').map(e => e.trim()).filter(e => e) : [],
            assignedContacts: [],
            status: 'active'
        };

        // Replace the form with a display card
        const icon = this._getRoomIcon(type);
        lastRoom.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 1.1rem;">${icon}</span>
                <div style="margin-left: 6px; font-weight: 500; font-size: 0.85rem;">${name}</div>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">
                Type: ${type} | Cap: ${capacity || '-'}
            </div>
            ${area ? `<div style="font-size: 0.75rem; color: var(--text-secondary);">Area: ${area}</div>` : ''}
            <div style="margin-top: 8px; display: flex; gap: 4px;">
                <button type="button" class="btn-secondary" style="flex: 1; font-size: 0.7rem; padding: 3px 6px;" 
                        onclick="BuildingWizard.editRoom(${floorIndex}, '${roomId}')">✏️</button>
                <button type="button" class="btn-remove" style="padding: 3px 6px;" 
                        onclick="BuildingWizard.removeRoom(${floorIndex}, '${roomId}')">🗑️</button>
            </div>
        `;
    },

    /**
     * Cancel adding a new room
     */
    cancelNewRoom(floorIndex) {
        const container = document.getElementById(`roomsContainer-${floorIndex}`);
        const allRooms = container.querySelectorAll('.room-item');
        if (allRooms.length > 0) {
            allRooms[allRooms.length - 1].remove();
        }
    },

    /**
     * Edit a floor (opens floor edit modal)
     */
    editFloor(floorIndex) {
        // This is handled by the building edit form - show floor rooms
        const floorCard = document.querySelector(`.floor-card[data-floor-index="${floorIndex}"]`);
        const content = floorCard.querySelector('.floor-content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
        } else {
            content.style.display = 'block'; // Always show since it's inline
        }
    },

    /**
     * Remove a floor
     */
    removeFloor(floorIndex) {
        if (confirm('Are you sure you want to delete this floor and all its rooms?')) {
            const floorCard = document.querySelector(`.floor-card[data-floor-index="${floorIndex}"]`);
            if (floorCard) {
                floorCard.remove();
                this._reindexFloors();
                App.showToast('Floor deleted');
            }
        }
    },

    /**
     * Edit a room (opens room edit modal)
     */
    editRoom(floorIndex, roomId) {
        const workspace = getWorkspaceData();
        const buildings = workspace?.buildings || [];
        
        // Find the building being edited
        const buildingId = document.getElementById('buildingId')?.value;
        const building = buildings.find(b => b.id === buildingId);
        if (!building || !building.floors || !building.floors[floorIndex]) return;

        const floor = building.floors[floorIndex];
        let room;
        
        if (roomId) {
            room = floor.rooms?.find(r => r.id === roomId);
        } else {
            // Editing a new room that hasn't been saved yet
            room = {
                id: `room-${Date.now()}`,
                name: '',
                type: 'common',
                capacity: 0,
                area: '',
                tags: [],
                equipment: [],
                assignedContacts: [],
                status: 'active'
            };
        }

        if (!room) return;

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Edit Room';

        const contacts = workspace?.contacts || [];
        const contactOptions = contacts.map(c => {
            const isSelected = (room.assignedContacts || []).includes(c.id);
            return `<option value="${c.id}" ${isSelected ? 'selected' : ''}>${c.name} (${c.role})</option>`;
        }).join('');

        body.innerHTML = `
            <form id="roomForm">
                <input type="hidden" id="roomFloorIndex" value="${floorIndex}">
                <input type="hidden" id="roomOriginalId" value="${room.id}">
                
                <div class="form-group">
                    <label for="roomName">Room Name *</label>
                    <input type="text" id="roomName" value="${room.name}" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="roomType">Type</label>
                        <select id="roomType">
                            <option value="common" ${room.type === 'common' ? 'selected' : ''}>Common</option>
                            <option value="bedroom" ${room.type === 'bedroom' ? 'selected' : ''}>Bedroom</option>
                            <option value="kitchen" ${room.type === 'kitchen' ? 'selected' : ''}>Kitchen</option>
                            <option value="bathroom" ${room.type === 'bathroom' ? 'selected' : ''}>Bathroom</option>
                            <option value="office" ${room.type === 'office' ? 'selected' : ''}>Office</option>
                            <option value="meeting" ${room.type === 'meeting' ? 'selected' : ''}>Meeting</option>
                            <option value="utility" ${room.type === 'utility' ? 'selected' : ''}>Utility</option>
                            <option value="outdoor" ${room.type === 'outdoor' ? 'selected' : ''}>Outdoor</option>
                            <option value="secure" ${room.type === 'secure' ? 'selected' : ''}>Secure</option>
                            <option value="work" ${room.type === 'work' ? 'selected' : ''}>Work</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="roomCapacity">Capacity</label>
                        <input type="number" id="roomCapacity" value="${room.capacity || ''}" min="0" max="100">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="roomArea">Area</label>
                    <input type="text" id="roomArea" value="${room.area || ''}" placeholder="e.g., 20m²">
                </div>
                
                <div class="form-group">
                    <label for="roomTags">Tags (comma-separated)</label>
                    <input type="text" id="roomTags" value="${room.tags ? room.tags.join(', ') : ''}">
                </div>
                
                <div class="form-group">
                    <label for="roomEquipment">Equipment (comma-separated)</label>
                    <input type="text" id="roomEquipment" value="${room.equipment ? room.equipment.join(', ') : ''}" placeholder="e.g., TV, Sofa, AC">
                </div>
                
                <div class="form-group">
                    <label>Assigned Contacts (Multi-select)</label>
                    <select id="roomContacts" multiple style="height: 120px;">
                        ${contactOptions}
                    </select>
                    <small style="color: var(--text-secondary);">Hold Ctrl/Cmd to select multiple</small>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelRoomBtn">Cancel</button>
                    <button type="submit" class="btn-primary">Save Room</button>
                </div>
            </form>
        `;

        document.getElementById('cancelRoomBtn').addEventListener('click', () => {
            this.close();
        });

        document.getElementById('roomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._saveRoomFromModal(floorIndex);
        });

        modal.style.display = 'flex';
    },

    /**
     * Save room from modal edit
     */
    _saveRoomFromModal(floorIndex) {
        const name = document.getElementById('roomName').value.trim();
        if (!name) {
            App.showToast('Please enter a room name');
            return;
        }

        const type = document.getElementById('roomType').value;
        const capacity = parseInt(document.getElementById('roomCapacity').value) || 0;
        const area = document.getElementById('roomArea').value.trim();
        const tagsStr = document.getElementById('roomTags').value.trim();
        const equipmentStr = document.getElementById('roomEquipment').value.trim();
        const selectedContacts = Array.from(document.getElementById('roomContacts').selectedOptions)
            .map(opt => opt.value);

        const room = {
            id: document.getElementById('roomOriginalId').value,
            name: name,
            type: type,
            capacity: capacity,
            area: area,
            tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [],
            equipment: equipmentStr ? equipmentStr.split(',').map(e => e.trim()).filter(e => e) : [],
            assignedContacts: selectedContacts,
            status: 'active'
        };

        // Update the room in the building's floor data
        const workspace = getWorkspaceData();
        const buildings = workspace?.buildings || [];
        const buildingId = document.getElementById('buildingId')?.value;
        const buildingIndex = buildings.findIndex(b => b.id === buildingId);
        
        if (buildingIndex >= 0 && buildings[buildingIndex].floors[floorIndex]) {
            const originalId = document.getElementById('roomOriginalId').value;
            const floor = buildings[buildingIndex].floors[floorIndex];
            
            // Check if room exists, otherwise add it
            const existingIndex = floor.rooms?.findIndex(r => r.id === originalId);
            if (existingIndex >= 0) {
                floor.rooms[existingIndex] = room;
            } else {
                floor.rooms.push(room);
            }

            saveBuilding(buildings[buildingIndex]);
            this.close();
            App.refreshCurrentView();
            App.showToast('Room updated successfully!');
        }
    },

    /**
     * Remove a room
     */
    removeRoom(floorIndex, roomId) {
        if (confirm('Are you sure you want to delete this room?')) {
            const workspace = getWorkspaceData();
            const buildings = workspace?.buildings || [];
            const buildingId = document.getElementById('buildingId')?.value;
            const buildingIndex = buildings.findIndex(b => b.id === buildingId);
            
            if (buildingIndex >= 0 && buildings[buildingIndex].floors[floorIndex]) {
                const floor = buildings[buildingIndex].floors[floorIndex];
                if (roomId) {
                    floor.rooms = floor.rooms?.filter(r => r.id !== roomId) || [];
                } else {
                    // Remove by index (for unsaved rooms)
                    const allRooms = document.querySelectorAll(`#roomsContainer-${floorIndex} .room-item`);
                    if (allRooms.length > 0) {
                        allRooms[allRooms.length - 1].remove();
                    }
                }
                saveBuilding(buildings[buildingIndex]);
                App.refreshCurrentView();
                App.showToast('Room deleted');
            }
        }
    },

    /**
     * Re-index floor cards after deletion
     */
    _reindexFloors() {
        const floorCards = document.querySelectorAll('.floor-card');
        floorCards.forEach((card, index) => {
            card.dataset.floorIndex = index;
            // Update room container IDs
            const oldRoomsContainer = document.getElementById(`roomsContainer-${index - 1}`);
            const newRoomsContainerId = `roomsContainer-${index}`;
            if (oldRoomsContainer) {
                oldRoomsContainer.id = newRoomsContainerId;
            }
            // Update add room button ID
            const oldAddBtn = document.getElementById(`addRoomBtn-${index - 1}`);
            const newAddBtnId = `addRoomBtn-${index}`;
            if (oldAddBtn) {
                oldAddBtn.id = newAddBtnId;
                const newIndex = index;
                oldAddBtn.onclick = () => {
                    this._addRoomInline(newIndex, card.dataset.floorId || `floor-${Date.now()}`);
                };
            }
        });
    },

    /**
     * Close the wizard modal
     */
    close() {
        document.getElementById('modalOverlay').style.display = 'none';
    }
};