import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const CalendarModule = {
  template: `
    <div class="calendar-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl">Upcoming Events</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Event</button>
      </div>
      
      <div v-if="loading" class="text-muted">Loading events...</div>
      <ul class="event-list" v-else>
        <li v-for="e in events" :key="e.id" class="event-card">
          <div style="font-weight: 600">{{ e.title }}</div>
          <div class="text-muted text-sm">{{ new Date(e.startDate).toLocaleString() }} - {{ new Date(e.endDate).toLocaleString() }}</div>
          <p class="mt-2">{{ e.description }}</p>
        </li>
      </ul>

      <!-- Simple Add Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg">New Event</h3>
          <input v-model="newEvent.title" placeholder="Event Title" class="input mb-2 w-full" />
          <textarea v-model="newEvent.description" placeholder="Description" class="input mb-2 w-full"></textarea>
          <input type="datetime-local" v-model="newEvent.startDate" class="input mb-2 w-full" />
          <input type="datetime-local" v-model="newEvent.endDate" class="input mb-4 w-full" />
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveEvent">Save</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      events: [],
      loading: true,
      showAddModal: false,
      newEvent: { title: '', description: '', startDate: '', endDate: '' }
    };
  },
  mounted() {
    this.loadEvents();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadEvents());
  },
  unmounted() {
    if (this.sub) this.sub();
  },
  methods: {
    async loadEvents() {
      this.loading = true;
      try {
        this.events = await apiClient.get('/calendar/events');
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        this.loading = false;
      }
    },
    async saveEvent() {
      try {
        const payload = {
          ...this.newEvent,
          isRecurring: false,
          workspaceId: 'w1',
          userId: 'u1'
        };
        const saved = await apiClient.post('/calendar/events', payload);
        this.events.push(saved);
        this.showAddModal = false;
        this.newEvent = { title: '', description: '', startDate: '', endDate: '' };
      } catch (err) {
        console.error("Failed to save event", err);
      }
    }
  }
};
