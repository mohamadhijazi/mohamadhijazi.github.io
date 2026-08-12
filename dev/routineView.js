/**
 * routineView.js - Execution Checklist View (Lite BPMN Wrapper)
 * Phase 3.1: Renders BPMN process models as clean, interactive card checklists with progress bars
 * v3.0: Polymorphic visualization - shows location stops, assigned persons, and multi-person connections
 */

const RoutineView = {
    /**
     * Render the routines list view with polymorphic connections
     */
    render() {
        const workspace = getWorkspaceData();
        const routines = workspace?.routines || [];
        const contacts = workspace?.contacts || [];
        const pins = workspace?.mapPins || [];

        if (routines.length === 0) {
            return `
                <div class="text-center" style="padding: 60px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">📋</div>
                    <h2 style="color: var(--text-secondary); margin-bottom: 8px;">No Routines Yet</h2>
                    <p style="color: var(--text-muted); margin-bottom: 24px;">Create your first routine to get started</p>
                    <button class="btn-primary" onclick="RoutineWizard.openEdit()">+ Create Routine</button>
                </div>
            `;
        }

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Routines (${routines.length})</h2>
                <button class="btn-primary" onclick="RoutineWizard.openEdit()">+ New Routine</button>
            </div>
            <div class="routine-list">
        `;

        routines.forEach(routine => {
            const completedSteps = (routine.completedSteps?.length || 0);
            const totalSteps = (routine.steps?.length || 0);
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

            // Get polymorphic connection data
            const locationStops = routine.locationStops || [];
            const assignedPersons = routine.assignedPersons || [];
            
            const stopNames = locationStops.map(s => {
                if (s.locationId) {
                    const pin = pins.find(p => p.id === s.locationId);
                    return pin ? pin.name : s.stopName;
                }
                return s.stopName;
            }).join(', ');

            const personNames = assignedPersons.map(p => {
                const contact = contacts.find(c => c.id === p.contactId);
                return contact ? contact.name + ' (' + p.role + ')' : 'Unknown';
            }).join(', ');

            // Build location stops HTML
            let locationStopsHTML = '';
            if (locationStops.length > 0) {
                locationStopsHTML = `
                    <div style="margin-bottom: 12px; padding: 8px; background: var(--bg-secondary); border-radius: 6px;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">📍 LOCATION STOPS (${locationStops.length})</div>
                        <div style="font-size: 0.85rem; color: var(--text);">${stopNames}</div>
                    </div>
                `;
            }

            // Build assigned persons HTML
            let assignedPersonsHTML = '';
            if (assignedPersons.length > 0) {
                assignedPersonsHTML = `
                    <div style="margin-bottom: 12px; padding: 8px; background: var(--bg-secondary); border-radius: 6px;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">👥 ASSIGNED PERSONS (${assignedPersons.length})</div>
                        <div style="font-size: 0.85rem; color: var(--text);">${personNames}</div>
                    </div>
                `;
            }

            html += `
                <div class="routine-card" data-routine-id="${routine.id}">
                    <div class="routine-card-header">
                        <div>
                            <div class="routine-card-title">${routine.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                                ${routine.category || 'General'} · ${totalSteps} steps · ${routine.totalDuration || 0} min
                            </div>
                        </div>
                        <span class="routine-card-category">${routine.category || 'General'}</span>
                    </div>
                    
                    ${routine.description ? '<p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">' + routine.description + '</p>' : ''}
                    
                    ${locationStopsHTML}
                    ${assignedPersonsHTML}
                    
                    <div class="routine-steps">
            `;

            // Show up to 5 steps in preview
            const previewSteps = routine.steps?.slice(0, 5) || [];
            previewSteps.forEach((step, idx) => {
                const isCompleted = routine.completedSteps?.includes(step.id);
                html += `
                    <div class="routine-step">
                        <input type="checkbox" class="routine-step-checkbox" 
                               ${isCompleted ? 'checked' : ''} 
                               onchange="RoutineView.toggleStep('${routine.id}', '${step.id}')"
                               data-step-id="${step.id}">
                        <span class="routine-step-text ${isCompleted ? 'completed' : ''}">${step.name}</span>
                        <span class="routine-step-time">${step.repeatCount || 1}x</span>
                    </div>
                `;
            });

            if (totalSteps > 5) {
                html += `
                    <div style="font-size: 0.8rem; color: var(--text-muted); padding: 8px 0; text-align: center;">
                        +${totalSteps - 5} more steps...
                    </div>
                `;
            }

            html += `
                    </div>
                    
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${progress}% complete (${completedSteps}/${totalSteps})</div>
                    
                    <div style="display: flex; gap: 8px; margin-top: 16px;">
                        <button class="btn-secondary" style="flex: 1; font-size: 0.8rem;" onclick="RoutineView.expandRoutine('${routine.id}')">
                            Full View
                        </button>
                        <button class="btn-secondary" style="font-size: 0.8rem;" onclick="RoutineWizard.openEdit(getRoutine('${routine.id}'))">
                            ✏️
                        </button>
                        <button class="btn-remove-row" onclick="RoutineView.deleteRoutine('${routine.id}')" style="padding: 4px 8px;">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    },

    /**
     * Toggle a step's completed status
     */
    toggleStep(routineId, stepId) {
        const routine = getRoutine(routineId);
        if (!routine) return;

        if (!routine.completedSteps) {
            routine.completedSteps = [];
        }

        const stepIndex = routine.completedSteps.indexOf(stepId);
        if (stepIndex >= 0) {
            routine.completedSteps.splice(stepIndex, 1);
        } else {
            routine.completedSteps.push(stepId);
        }

        routine.updatedAt = new Date().toISOString();
        saveRoutine(routine);
        
        // Refresh the view
        App.showRoutines();
    },

    /**
     * Expand routine to full view mode with polymorphic connections
     */
    expandRoutine(routineId) {
        const routine = getRoutine(routineId);
        if (!routine) return;

        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const pins = workspace?.mapPins || [];
        const buildings = workspace?.buildings || [];

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = routine.name;

        const completedSteps = routine.completedSteps?.length || 0;
        const totalSteps = routine.steps?.length || 0;
        const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

        // Polymorphic: Location stops with details
        const locationStops = routine.locationStops || [];
        const assignedPersons = routine.assignedPersons || [];

        let html = `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 0.9rem; color: var(--text-secondary);">Progress</span>
                    <span style="font-size: 0.9rem; font-weight: 600;">${progress}% (${completedSteps}/${totalSteps})</span>
                </div>
                <div class="progress-bar-container" style="height: 10px;">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <span style="font-size: 0.8rem; padding: 4px 12px; background: var(--bg-tertiary); border-radius: 12px;">
                    ${routine.category || 'General'}
                </span>
        `;

        // Add recurrence badge
        if (routine.isRecurring) {
            html += `<span style="font-size: 0.8rem; padding: 4px 12px; background: #e8f5e9; border-radius: 12px; margin-left: 4px;">🔄 ${routine.recurrencePattern}</span>`;
        }

        // Add tags
        if (routine.tags) {
            routine.tags.forEach(t => {
                html += `<span style="font-size: 0.75rem; padding: 3px 10px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; margin-left: 4px;">${t}</span>`;
            });
        }

        html += '</div>';

        // Polymorphic: Location Stops Section
        if (locationStops.length > 0) {
            html += `
                <div style="margin-bottom: 20px; padding: 16px; background: var(--bg-secondary); border-radius: 8px;">
                    <h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--text-secondary);">📍 Location Stops (${locationStops.length})</h3>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
            `;

            locationStops.forEach((stop, idx) => {
                let stopLocationName = stop.stopName;
                let stopBuildingInfo = '';
                
                if (stop.locationId) {
                    const pin = pins.find(p => p.id === stop.locationId);
                    if (pin) {
                        stopLocationName = pin.name;
                        // Check for connected building
                        if (pin.connectedBuilding) {
                            const building = buildings.find(b => b.id === pin.connectedBuilding);
                            if (building) {
                                stopBuildingInfo = ' → ' + building.name;
                            }
                        }
                    }
                }

                html += `
                    <div style="padding: 10px; background: var(--bg-tertiary); border-radius: 6px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted); min-width: 24px;">${idx + 1}.</span>
                        <span style="flex: 1; font-size: 0.9rem;">${stopLocationName}${stopBuildingInfo}</span>
                        <span style="font-size: 0.75rem; padding: 2px 8px; background: var(--bg-secondary); border-radius: 8px;">${stop.estimatedDuration || 0} min</span>
                `;
                
                if (stop.description) {
                    html += '<span style="font-size: 0.75rem; color: var(--text-secondary);">' + stop.description + '</span>';
                }
                
                html += '</div>';
            });

            html += '</div></div>';
        }

        // Polymorphic: Assigned Persons Section
        if (assignedPersons.length > 0) {
            html += `
                <div style="margin-bottom: 20px; padding: 16px; background: var(--bg-secondary); border-radius: 8px;">
                    <h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--text-secondary);">👥 Assigned Persons (${assignedPersons.length})</h3>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
            `;

            assignedPersons.forEach(person => {
                const contact = contacts.find(c => c.id === person.contactId);
                if (contact) {
                    const roleBg = person.role === 'organizer' ? '#ffc107' : '#e9ecef';
                    const confirmedHTML = person.confirmed 
                        ? '<span style="font-size: 0.75rem; color: #28a745;">✓ Confirmed</span>' 
                        : '<span style="font-size: 0.75rem; color: var(--text-muted);">Pending</span>';

                    html += `
                        <div style="padding: 10px; background: var(--bg-tertiary); border-radius: 6px; display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.2rem;">👤</span>
                            <div style="flex: 1;">
                                <div style="font-size: 0.9rem; font-weight: 600;">${contact.name}</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">${contact.role}</div>
                            </div>
                            <span style="font-size: 0.75rem; padding: 2px 8px; background: ${roleBg}; border-radius: 8px;">${person.role}</span>
                            ${confirmedHTML}
                        </div>
                    `;
                }
            });

            html += '</div></div>';
        }

        // Steps section
        html += '<h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--text-secondary);">Steps/Activities</h3>';

        routine.steps?.forEach((step, idx) => {
            const isCompleted = routine.completedSteps?.includes(step.id);
            html += `
                <div class="routine-step" style="padding: 12px; margin-bottom: 8px; background: var(--bg-secondary); border-radius: var(--border-radius);">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                        <input type="checkbox" class="routine-step-checkbox" 
                               ${isCompleted ? 'checked' : ''} 
                               onchange="RoutineView.toggleStep('${routineId}', '${step.id}')"
                               style="width: 20px; height: 20px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted); min-width: 24px;">${idx + 1}.</span>
                        <span class="routine-step-text ${isCompleted ? 'completed' : ''}" style="flex: 1;">${step.name}</span>
                        <span style="font-size: 0.75rem; padding: 2px 8px; background: var(--bg-tertiary); border-radius: 8px;">${step.type}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${step.repeatCount || 1}x</span>
                    </div>
                </div>
            `;
        });

        // Total time calculation
        const totalTime = routine.totalDuration || routine.steps?.reduce((sum, s) => sum + (s.estimatedDuration || 0), 0) || 0;
        html += `
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <span style="font-size: 0.85rem; color: var(--text-secondary);">
                    Total estimated time: <strong>${totalTime} minutes</strong> (${Math.floor(totalTime / 60)}h ${totalTime % 60}m)
                </span>
            </div>
        `;

        body.innerHTML = html;
        modal.style.display = 'flex';
    },

    /**
     * Delete a routine
     */
    deleteRoutine(routineId) {
        if (confirm('Are you sure you want to delete this routine?')) {
            deleteRoutine(routineId);
            App.showRoutines();
            App.showToast('Routine deleted');
        }
    }
};