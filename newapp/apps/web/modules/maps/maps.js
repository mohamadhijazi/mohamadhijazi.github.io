import { apiClient } from '../../shared/apiClient.js';
import { eventBus } from '../../shared/eventBus.js';

export const MapsModule = {
  template: `
    <div class="maps-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Maps & Locations</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Location</button>
      </div>
      <div id="leaflet-map" style="height: 400px; width: 100%; border-radius: 12px; margin-bottom: 24px;"></div>
      <div v-if="loading" class="text-muted">Loading locations...</div>
      <div v-else class="grid gap-3">
        <div v-for="location in locations" :key="location.id" class="card cursor-pointer" @click="flyToLocation(location)">
          <div class="font-bold">{{ location.name }}</div>
          <div class="text-sm text-muted">{{ location.category }} • {{ location.latitude.toFixed(4) }}, {{ location.longitude.toFixed(4) }}</div>
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
      newLocation: { name: '', category: '', latitude: 0, longitude: 0 },
      map: null,
      markers: []
    };
  },
  mounted() {
    this.initMap();
    this.loadLocations();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadLocations());
  },
  unmounted() {
    if (this.sub) this.sub();
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initMap() {
      // Initialize Leaflet map centered on New York by default
      this.map = L.map('leaflet-map').setView([40.7128, -74.006], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    },
    async loadLocations() {
      this.loading = true;
      try {
        this.locations = await apiClient.get('/maps/locations?workspaceId=w1');
        this.updateMarkers();
      } catch (err) {
        console.error('Failed to load locations', err);
      } finally {
        this.loading = false;
      }
    },
    updateMarkers() {
      // Remove existing markers
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];

      // Add new markers for each location
      if (this.locations.length > 0) {
        this.locations.forEach(location => {
          const marker = L.marker([location.latitude, location.longitude])
            .addTo(this.map)
            .bindPopup(`<b>${location.name}</b><br>${location.category}`);
          this.markers.push(marker);
        });

        // Fit the map to all markers
        const group = L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    },
    async saveLocation() {
      try {
        const saved = await apiClient.post('/maps/locations', { ...this.newLocation, workspaceId: 'w1' });
        this.locations.push(saved);
        this.updateMarkers();
        this.showAddModal = false;
        this.newLocation = { name: '', category: '', latitude: 0, longitude: 0 };
      } catch (err) {
        console.error('Failed to save location', err);
      }
    },
    flyToLocation(location) {
      this.map.flyTo([location.latitude, location.longitude], 15);
    }
  }
};
