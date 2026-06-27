import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const MapsModule = {
  template: `
    <div class="maps-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Maps & Locations</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Location</button>
      </div>
      <div v-if="loading" class="text-muted">Loading locations...</div>
      <div v-else class="grid gap-3">
        <div v-for="location in locations" :key="location.id" class="card">
          <div class="font-bold">{{ location.name }}</div>
          <div class="text-sm text-muted">{{ location.category }} • {{ location.latitude }}, {{ location.longitude }}</div>
        </div>
      </div>
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg font-bold">New Location</h3>
          <input v-model="newLocation.name" placeholder="Name" class="input mb-2 w-full" />
          <input v-model="newLocation.category" placeholder="Category" class="input mb-2 w-full" />
          <input v-model.number="newLocation.latitude" placeholder="Latitude" class="input mb-2 w-full" />
          <input v-model.number="newLocation.longitude" placeholder="Longitude" class="input mb-4 w-full" />
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveLocation">Save</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      locations: [],
      loading: true,
      showAddModal: false,
      newLocation: { name: '', category: '', latitude: 0, longitude: 0 }
    };
  },
  mounted() {
    this.loadLocations();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadLocations());
  },
  unmounted() { if (this.sub) this.sub(); },
  methods: {
    async loadLocations() {
      this.loading = true;
      try { this.locations = await apiClient.get('/maps/locations?workspaceId=w1'); } catch (err) { console.error('Failed to load locations', err); } finally { this.loading = false; }
    },
    async saveLocation() {
      try {
        const saved = await apiClient.post('/maps/locations', { ...this.newLocation, workspaceId: 'w1' });
        this.locations.push(saved);
        this.showAddModal = false;
        this.newLocation = { name: '', category: '', latitude: 0, longitude: 0 };
      } catch (err) { console.error('Failed to save location', err); }
    }
  }
};
