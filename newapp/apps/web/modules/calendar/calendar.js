import { apiClient } from '../../shared/apiClient.js';
import { eventBus } from '../../shared/eventBus.js';

export const CalendarModule = {
  template: `
    <div class="calendar-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl">Calendar</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Event</button>
      </div>
      <div id="full-calendar" style="margin-bottom: 24px;"></div>
      <div v-if="loading" class="text-muted">Loading events...</div>
      <div v-else>
        <h3 class="text-lg font-bold mb-3">Recent Events</h3>
        <ul class="event-list">
          <li v-for="e in events" :key="e.id" class="event-card">
            <div style="font-weight: 600">{{ e.title }}</div>
            <div class="text-muted text-sm">{{ new Date(e.startDate).toLocaleString() }} - {{ new Date(e.endDate).toLocaleString() }}</div>
            <p class="mt-2">{{ e.description }}</p>
          </li>
        </ul>
      </div>
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
      newEvent: { title: '', description: '', startDate: '', endDate: '' },
      calendar: null
    };
  },
  mounted() {
    this.initCalendar();
    this.loadEvents();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadEvents());
  },
  unmounted() {
    if (this.sub) this.sub();
    if (this.calendar) {
      this.calendar.destroy();
    }
  },
  methods: {
    initCalendar() {
      // Initialize FullCalendar
      const calendarEl = document.getElementById('full-calendar');
      this.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: []
      });
      this.calendar.render();
    },
    async loadEvents() {
      this.loading = true;
      try {
        this.events = await apiClient.get('/calendar/events?workspaceId=w1');
        // Update FullCalendar events
        if (this.calendar) {
          const fcEvents = this.events.map(e => ({
            id: e.id,
            title: e.title,
            start: e.startDate,
            end: e.endDate
          }));
          this.calendar.removeAllEvents();
          this.calendar.addEventSource(fcEvents);
        }
      } catch (err) {
        console.error('Failed to load events', err);
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
        // Update FullCalendar with new event
        if (this.calendar) {
          this.calendar.addEvent({
            id: saved.id,
            title: saved.title,
            start: saved.startDate,
            end: saved.endDate
          });
        }
        this.showAddModal = false;
        this.newEvent = { title: '', description: '', startDate: '', endDate: '' };
      } catch (err) {
        console.error('Failed to save event', err);
      }
    }
  }
};
