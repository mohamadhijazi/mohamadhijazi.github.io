/**
 * spatialView.js - 1-Click Floor Plan Selector (Lite Blueprint3d Wrapper)
 * Phase 3.2: Displays pre-configured room layouts with dropdown selector controls
 * v3.0: Polymorphic spatial hierarchy - Buildings → Floors → Rooms with contact associations
 */

const SpatialView = {
    currentView: 'buildings', // 'buildings' or 'floorplans'
    currentBuildingId: null,
    currentFloorId: null,

    /**
     * Render the spatial view with building hierarchy and floor plans tabs
     */
    render() {
        const workspace = getWorkspaceData();
        const buildings = workspace?.buildings || [];
        const floorPlans = workspace?.floorPlans || [];

        let html = `
            <div class="spatial-view-tabs" style="margin-bottom: 20px;">
                <button class="spatial-tab ${this.currentView === 'buildings' ? 'active' : ''}" 
                        onclick="SpatialView.switchView('buildings')"
                        style="padding: 8px 16px; margin-right: 8px; cursor: pointer; border: none; background: ${this.currentView === 'buildings' ? 'var(--primary)' : 'var(--bg-tertiary)'}; color: ${this.currentView === 'buildings' ? 'white' : 'var(--text)'}; border-radius: 4px;">
                    🏢 Buildings (Spatial Hierarchy)
                </button>
                <button class="spatial-tab ${this.currentView === 'floorplans' ? 'active' : ''}" 
                        onclick="SpatialView.switchView('floorplans')"
                        style="padding: 8px 16px; cursor: pointer; border: none; background: ${this.currentView === 'floorplans' ? 'var(--primary)' : 'var(--bg-tertiary)'}; color: ${this.currentView === 'floorplans' ? 'white' : 'var(--text)'}; border-radius: 4px;">
                    📐 Floor Plans
                </button>
            </div>
        `;

        if (this.currentView === 'buildings') {
            html += this._renderBuildingsView(buildings);
        } else {
            html += this._renderFloorPlansView(floorPlans);
        }

        return html;
    },

    /**
     * Render the buildings view with hierarchical structure
     */
    _renderBuildingsView(buildings) {
        let html = '<div class="buildings-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">';
        html += '<h2 style="margin: 0;">Buildings</h2>';
        html += '<button class="btn-primary" onclick="BuildingWizard.openAdd()" style="padding: 8px 16px;">+ Add Building</button>';
        html += '</div>';

        if (buildings.length === 0) {
            html += `
                <div class="text-center" style="padding: 60px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🏢</div>
                    <h2 style="color: var(--text-secondary); margin-bottom: 8px;">No Buildings Yet</h2>
                    <p style="color: var(--text-muted); margin-bottom: 24px;">Click "Add Building" to create your first building</p>
                </div>
            `;
            return html;
        }

        html += '<div class="buildings-list">';
        
        buildings.forEach(building => {
            const connectedPins = (getWorkspaceData()?.mapPins || []).filter(p => p.connectedBuilding === building.id);
            const assignedContacts = this._getContactsForBuilding(building);

            html += `
                <div class="building-card" style="border: 1px solid var(--border); border-radius: 8px; margin-bottom: 16px; overflow: hidden;">
                    <div class="building-header" style="background: var(--bg-tertiary); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="cursor: pointer; flex: 1;" onclick="SpatialView.toggleBuilding('${building.id}')">
                            <h3 style="margin: 0;">🏢 ${building.name}</h3>
                            <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 0.85rem;">${building.address || 'No address'}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 0.85rem; color: var(--text-muted);">${building.floors?.length || 0} floors</span>
                            <span id="building-toggle-${building.id}" style="font-size: 1.2rem; cursor: pointer;">▼</span>
                        </div>
                    </div>
                    <div class="building-actions" style="background: var(--bg-secondary); padding: 8px 16px; display: flex; gap: 8px; border-bottom: 1px solid var(--border);">
                        <button class="btn-secondary" style="font-size: 0.8rem; padding: 4px 12px;" 
                                onclick="event.stopPropagation(); BuildingWizard.openEdit(getBuildings().find(b => b.id === '${building.id}'))">
                            ✏️ Edit Building
                        </button>
                        <button class="btn-remove" style="font-size: 0.8rem; padding: 4px 12px;" 
                                onclick="event.stopPropagation(); SpatialView.deleteBuilding('${building.id}')">
                            🗑️ Delete
                        </button>
                    </div>
                    <div id="building-content-${building.id}" style="display: none;">
            `;

            // Building metadata
            html += `
                <div style="padding: 12px 16px; border-bottom: 1px solid var(--border);">
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${building.tags ? building.tags.map(t => `<span style="font-size: 0.75rem; padding: 3px 10px; background: var(--bg-secondary); border-radius: 10px;">${t}</span>`).join('') : ''}
                    </div>
                    ${connectedPins.length > 0 ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px;">📍 Connected: ${connectedPins.map(p => p.name).join(', ')}</p>` : ''}
                    ${assignedContacts.length > 0 ? `<p style="font-size: 0.85rem; color: var(--text-secondary);">👥 Assigned: ${assignedContacts.map(c => c.name).join(', ')}</p>` : ''}
                </div>
            `;

            // Render floors
            if (building.floors && building.floors.length > 0) {
                building.floors.forEach(floor => {
                    html += `
                        <div class="floor-section" style="border-bottom: 1px solid var(--border);">
                            <div class="floor-header" style="background: var(--bg-secondary); padding: 10px 16px; cursor: pointer; display: flex; justify-content: space-between;"
                                 onclick="SpatialView.toggleFloor('${building.id}', '${floor.id}')">
                                <span>📋 Floor ${floor.number || floor.name}</span>
                                <span id="floor-toggle-${building.id}-${floor.id}" style="font-size: 1rem;">▼</span>
                            </div>
                            <div id="floor-content-${building.id}-${floor.id}" style="display: none; padding: 12px;">
                    `;

                    // Render rooms for this floor
                    if (floor.rooms && floor.rooms.length > 0) {
                        html += '<div class="rooms-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">';
                        
                        floor.rooms.forEach(room => {
                            const roomContacts = (room.assignedContacts || [])
                                .map(id => getWorkspaceData()?.contacts?.find(c => c.id === id))
                                .filter(Boolean);

                            html += `
                                <div class="room-card" data-room-id="${room.id}" style="border: 1px solid var(--border); border-radius: 6px; padding: 12px;">
                                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                        <span style="font-size: 1.2rem;">${this._getRoomIcon(room.type)}</span>
                                        <div class="room-card-name" style="margin-left: 8px;">${room.name}</div>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                                        Type: ${room.type || 'N/A'} | Capacity: ${room.capacity || 'N/A'}
                                    </div>
                                    ${room.area ? `<div style="font-size: 0.8rem; color: var(--text-muted);">Area: ${room.area}</div>` : ''}
                                    ${roomContacts.length > 0 ? `<div style="font-size: 0.75rem; color: #007bff; margin-top: 4px;">👥 ${roomContacts.map(c => c.name).join(', ')}</div>` : ''}
                                    ${room.equipment && room.equipment.length > 0 ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">🔧 ${room.equipment.join(', ')}</div>` : ''}
                                    <div style="margin-top: 8px; display: flex; gap: 6px;">
                                        <button class="btn-secondary" style="flex: 1; font-size: 0.75rem; padding: 4px 8px;" 
                                                onclick="SpatialView.editRoom('${building.id}', '${floor.id}', '${room.id}')">
                                            ✏️ Edit
                                        </button>
                                        <button class="btn-remove-row" style="padding: 4px 8px;" 
                                                onclick="SpatialView.toggleRoomStatus('${building.id}', '${floor.id}', '${room.id}')">
                                            ${room.status === 'active' ? '⏸️' : '▶️'}
                                        </button>
                                    </div>
                                </div>
                            `;
                        });
                        
                        html += '</div>';
                    } else {
                        html += '<p style="color: var(--text-muted); font-style: italic;">No rooms on this floor</p>';
                    }

                    html += `
                                    </div>
                                </div>
                            `;
                });
            } else {
                html += '<p style="padding: 12px 16px; color: var(--text-muted); font-style: italic;">No floors in this building</p>';
            }

            html += `
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    },

    /**
     * Render the floor plans view (legacy)
     */
    _renderFloorPlansView(floorPlans) {
        if (floorPlans.length === 0) {
            return `
                <div class="text-center" style="padding: 60px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">📐</div>
                    <h2 style="color: var(--text-secondary); margin-bottom: 8px;">No Floor Plans Yet</h2>
                    <p style="color: var(--text-muted); margin-bottom: 24px;">Add your first floor plan to get started</p>
                </div>
            `;
        }

        let html = `
            <div class="floorplan-selector">
                <h2 style="margin-bottom: 16px;">Floor Plans</h2>
                <select id="floorPlanSelector" onchange="SpatialView.selectPlan('${floorPlans[0].id}')">
        `;

        floorPlans.forEach(plan => {
            html += `<option value="${plan.id}" ${plan.id === floorPlans[0].id ? 'selected' : ''}>${plan.name}</option>`;
        });

        html += `
                </select>
            </div>
            <div id="floorPlanContent">
        `;

        // Render the first plan by default
        html += this._renderFloorPlanContent(floorPlans[0]);
        html += '</div>';

        return html;
    },

    /**
     * Render content for a specific floor plan (legacy)
     */
    _renderFloorPlanContent(plan) {
        let html = `
            <div style="margin-bottom: 20px;">
                <h3>${plan.name}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${plan.description || ''}</p>
                <div style="margin-top: 8px;">
                    ${plan.tags ? plan.tags.map(t => `<span style="font-size: 0.75rem; padding: 3px 10px; background: var(--bg-tertiary); border-radius: 10px; margin-right: 4px;">${t}</span>`).join('') : ''}
                </div>
            </div>
            
            <div class="floorplan-grid">
        `;

        plan.rooms?.forEach(room => {
            html += `
                <div class="room-card" data-room-id="${room.id}">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span class="room-status ${room.status || 'active'}"></span>
                        <div class="room-card-name">${room.name}</div>
                    </div>
                    <div class="room-card-tags">
                        ${room.tags ? room.tags.map(t => `<span class="room-tag">${t}</span>`).join('') : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">
                        ${room.area || 'N/A'}
                    </div>
                    <div style="margin-top: 12px; display: flex; gap: 6px;">
                        <button class="btn-secondary" style="flex: 1; font-size: 0.75rem; padding: 4px 8px;" 
                                onclick="SpatialView.editRoomName('${plan.id}', '${room.id}')">
                            ✏️ Edit
                        </button>
                        <button class="btn-remove-row" style="padding: 4px 8px;" 
                                onclick="SpatialView.toggleRoomStatusPlan('${plan.id}', '${room.id}')">
                            ${room.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    },

    /**
     * Get contacts associated with a building (via rooms)
     */
    _getContactsForBuilding(building) {
        const contactIds = new Set();
        
        if (building.floors) {
            building.floors.forEach(floor => {
                if (floor.rooms) {
                    floor.rooms.forEach(room => {
                        if (room.assignedContacts) {
                            room.assignedContacts.forEach(id => contactIds.add(id));
                        }
                    });
                }
            });
        }

        return (getWorkspaceData()?.contacts || [])
            .filter(c => contactIds.has(c.id))
            .slice(0, 5); // Limit to 5 for display
    },

    /**
     * Get room icon based on room type
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
            'secure': '🔒'
        };
        return icons[type] || '🚪';
    },

    /**
     * Switch between views (buildings vs floor plans)
     */
    switchView(view) {
        this.currentView = view;
        App.refreshCurrentView();
    },

    /**
     * Toggle building expansion
     */
    toggleBuilding(buildingId) {
        const content = document.getElementById(`building-content-${buildingId}`);
        const toggle = document.getElementById(`building-toggle-${buildingId}`);
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.textContent = '▲';
        } else {
            content.style.display = 'none';
            toggle.textContent = '▼';
        }
    },

    /**
     * Toggle floor expansion
     */
    toggleFloor(buildingId, floorId) {
        const content = document.getElementById(`floor-content-${buildingId}-${floorId}`);
        const toggle = document.getElementById(`floor-toggle-${buildingId}-${floorId}`);
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.textContent = '▲';
        } else {
            content.style.display = 'none';
            toggle.textContent = '▼';
        }
    },

    /**
     * Handle floor plan selection from dropdown (legacy)
     */
    selectPlan(planId) {
        const workspace = getWorkspaceData();
        const plan = workspace?.floorPlans?.find(f => f.id === planId);
        if (plan) {
            document.getElementById('floorPlanContent').innerHTML = this._renderFloorPlanContent(plan);
        }
    },

    /**
     * Edit room name via quick modal (from building hierarchy)
     */
    editRoom(buildingId, floorId, roomId) {
        const building = getBuildings().find(b => b.id === buildingId);
        if (!building) return;

        const floor = building.floors?.find(f => f.id === floorId);
        if (!floor) return;

        const room = floor.rooms?.find(r => r.id === roomId);
        if (!room) return;

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Edit Room';

        // Get contact options for assignment
        const contacts = getWorkspaceData()?.contacts || [];
        const contactOptions = contacts.map(c => {
            const isSelected = (room.assignedContacts || []).includes(c.id);
            return `<option value="${c.id}" ${isSelected ? 'selected' : ''}>${c.name} (${c.role})</option>`;
        }).join('');

        body.innerHTML = `
            <form id="editRoomForm">
                <div class="form-group">
                    <label for="roomNameInput">Room Name</label>
                    <input type="text" id="roomNameInput" value="${room.name}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="roomTypeInput">Type</label>
                        <select id="roomTypeInput">
                            <option value="common" ${room.type === 'common' ? 'selected' : ''}>Common</option>
                            <option value="bedroom" ${room.type === 'bedroom' ? 'selected' : ''}>Bedroom</option>
                            <option value="kitchen" ${room.type === 'kitchen' ? 'selected' : ''}>Kitchen</option>
                            <option value="bathroom" ${room.type === 'bathroom' ? 'selected' : ''}>Bathroom</option>
                            <option value="office" ${room.type === 'office' ? 'selected' : ''}>Office</option>
                            <option value="meeting" ${room.type === 'meeting' ? 'selected' : ''}>Meeting</option>
                            <option value="utility" ${room.type === 'utility' ? 'selected' : ''}>Utility</option>
                            <option value="outdoor" ${room.type === 'outdoor' ? 'selected' : ''}>Outdoor</option>
                            <option value="secure" ${room.type === 'secure' ? 'selected' : ''}>Secure</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="roomCapacityInput">Capacity</label>
                        <input type="number" id="roomCapacityInput" value="${room.capacity || ''}" min="0" max="100">
                    </div>
                </div>
                <div class="form-group">
                    <label for="roomAreaInput">Area</label>
                    <input type="text" id="roomAreaInput" value="${room.area || ''}" placeholder="e.g., 20m²">
                </div>
                <div class="form-group">
                    <label for="roomTagsInput">Tags (comma-separated)</label>
                    <input type="text" id="roomTagsInput" value="${room.tags ? room.tags.join(', ') : ''}">
                </div>
                <div class="form-group">
                    <label for="roomEquipmentInput">Equipment (comma-separated)</label>
                    <input type="text" id="roomEquipmentInput" value="${room.equipment ? room.equipment.join(', ') : ''}" placeholder="e.g., TV, Sofa, AC">
                </div>
                <div class="form-group">
                    <label>Assigned Contacts (Multi-select)</label>
                    <select id="roomContactsInput" multiple style="height: 120px;">
                        ${contactOptions}
                    </select>
                    <small style="color: var(--text-secondary);">Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelRoomEdit">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `;

        document.getElementById('cancelRoomEdit').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('editRoomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('roomNameInput').value.trim();
            const newType = document.getElementById('roomTypeInput').value;
            const newCapacity = parseInt(document.getElementById('roomCapacityInput').value) || 0;
            const newArea = document.getElementById('roomAreaInput').value.trim();
            const newTags = document.getElementById('roomTagsInput').value.trim();
            const newEquipment = document.getElementById('roomEquipmentInput').value.trim();
            const selectedContacts = Array.from(document.getElementById('roomContactsInput').selectedOptions)
                .map(opt => opt.value);

            if (newName) {
                room.name = newName;
                room.type = newType;
                room.capacity = newCapacity;
                room.area = newArea;
                room.tags = newTags ? newTags.split(',').map(t => t.trim()).filter(t => t) : [];
                room.equipment = newEquipment ? newEquipment.split(',').map(e => e.trim()).filter(e => e) : [];
                room.assignedContacts = selectedContacts;
                room.status = 'active';

                // Save the building (which contains the floor and room)
                saveBuilding(building);
                this.toggleBuilding(buildingId); // Refresh
                App.showToast('Room updated successfully!');
            }
        });

        modal.style.display = 'flex';
    },

    /**
     * Edit room name via quick modal (legacy floor plan)
     */
    editRoomName(planId, roomId) {
        const workspace = getWorkspaceData();
        const plan = workspace?.floorPlans?.find(f => f.id === planId);
        if (!plan) return;

        const room = plan.rooms?.find(r => r.id === roomId);
        if (!room) return;

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = 'Edit Room Name';

        body.innerHTML = `
            <form id="editRoomForm">
                <div class="form-group">
                    <label for="roomNameInput">Room Name</label>
                    <input type="text" id="roomNameInput" value="${room.name}" required>
                </div>
                <div class="form-group">
                    <label for="roomAreaInput">Area</label>
                    <input type="text" id="roomAreaInput" value="${room.area || ''}" placeholder="e.g., 20m²">
                </div>
                <div class="form-group">
                    <label for="roomTagsInput">Tags (comma-separated)</label>
                    <input type="text" id="roomTagsInput" value="${room.tags ? room.tags.join(', ') : ''}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelRoomEdit">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        `;

        document.getElementById('cancelRoomEdit').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('editRoomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('roomNameInput').value.trim();
            const newArea = document.getElementById('roomAreaInput').value.trim();
            const newTags = document.getElementById('roomTagsInput').value.trim();

            if (newName) {
                room.name = newName;
                room.area = newArea;
                room.tags = newTags ? newTags.split(',').map(t => t.trim()).filter(t => t) : [];
                saveFloorPlan(plan);
                this.selectPlan(planId);
                App.showToast('Room updated successfully!');
            }
        });

        modal.style.display = 'flex';
    },

    /**
     * Toggle room active status (from building hierarchy)
     */
    toggleRoomStatus(buildingId, floorId, roomId) {
        const building = getBuildings().find(b => b.id === buildingId);
        if (!building) return;

        const floor = building.floors?.find(f => f.id === floorId);
        if (!floor) return;

        const room = floor.rooms?.find(r => r.id === roomId);
        if (room) {
            room.status = room.status === 'active' ? 'inactive' : 'active';
            saveBuilding(building);
            this.toggleBuilding(buildingId); // Refresh
        }
    },

    /**
     * Toggle room active status (legacy floor plan)
     */
    toggleRoomStatusPlan(planId, roomId) {
        const workspace = getWorkspaceData();
        const plan = workspace?.floorPlans?.find(f => f.id === planId);
        if (!plan) return;

        const room = plan.rooms?.find(r => r.id === roomId);
        if (room) {
            room.status = room.status === 'active' ? 'inactive' : 'active';
            saveFloorPlan(plan);
            this.selectPlan(planId);
        }
    },

    /**
     * Delete a floor plan
     */
    deleteFloorPlan(planId) {
        if (confirm('Are you sure you want to delete this floor plan?')) {
            deleteFloorPlan(planId);
            App.showFloorPlans();
            App.showToast('Floor plan deleted');
        }
    },

    /**
     * Delete a building
     */
    deleteBuilding(buildingId) {
        const building = getBuildings().find(b => b.id === buildingId);
        if (building && confirm(`Are you sure you want to delete "${building.name}" and all its floors and rooms?`)) {
            deleteBuilding(buildingId);
            App.refreshCurrentView();
            App.showToast('Building deleted');
        }
    }
};
