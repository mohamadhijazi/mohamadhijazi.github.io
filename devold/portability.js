/**
 * portability.js - JSON Import/Export Portability Tool
 * Phase 5.1: Single-click state downloads and restoration
 */

const Portability = {
    SCHEMA_VERSION: '2.0',
    EXPORT_FILENAME: 'pwa-workspace-export',

    /**
     * Export workspace as downloadable JSON file
     */
    exportWorkspace() {
        const workspace = getWorkspaceData();
        if (!workspace) {
            App.showToast('No workspace data to export');
            return;
        }

        // Create JSON blob
        const json = JSON.stringify(workspace, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.EXPORT_FILENAME}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        App.showToast('Workspace exported successfully!');
    },

    /**
     * Import workspace from JSON file upload
     */
    importWorkspace(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.json')) {
            App.showToast('Please select a valid JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.validateAndImport(data);
            } catch (error) {
                console.error('Import error:', error);
                App.showToast('Invalid JSON file. Import failed.');
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    },

    /**
     * Validate schema version and import data
     */
    validateAndImport(data) {
        // Check schema version
        if (data.version) {
            const versionCompare = this.compareVersions(data.version, this.SCHEMA_VERSION);
            
            if (versionCompare < 0) {
                // Older version - attempt migration
                if (!confirm(`Your export is from version ${data.version}. The current version is ${this.SCHEMA_VERSION}. Do you want to import and migrate?`)) {
                    return;
                }
                this.migrateAndSave(data);
            } else if (versionCompare > 0) {
                // Newer version - warn user
                if (!confirm(`Your export is from version ${data.version}, which is newer than the current version ${this.SCHEMA_VERSION}. This may cause compatibility issues. Continue anyway?`)) {
                    return;
                }
                this.migrateAndSave(data);
            } else {
                // Same version - direct import
                this.migrateAndSave(data);
            }
        } else {
            // No version - assume old format
            if (!confirm('This file has no version info. It may be from an older version. Import and migrate?')) {
                return;
            }
            this.migrateAndSave(data);
        }
    },

    /**
     * Migrate data if needed and save to localStorage
     */
    migrateAndSave(data) {
        // Ensure required structure
        const workspace = {
            version: this.SCHEMA_VERSION,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            routines: data.routines || [],
            floorPlans: data.floorPlans || [],
            contacts: data.contacts || [],
            mapPins: data.mapPins || [],
            alerts: data.alerts || [],
            preferences: data.preferences || {
                mode: 'lite',
                theme: 'light',
                sidebarCollapsed: false
            }
        };

        // Save to localStorage
        localStorage.setItem('pwa_workspace', JSON.stringify(workspace));
        
        App.showToast('Workspace imported successfully! Reloading...');
        
        // Reload page to apply changes
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    },

    /**
     * Compare versions: returns -1, 0, or 1
     */
    compareVersions(a, b) {
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
};