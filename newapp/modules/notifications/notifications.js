import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const NotificationsModule = {
  template: `
    <div class="notifications-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Notifications</h2>
        <button class="btn btn-primary" @click="sendReminder">Send Test Reminder</button>
      </div>
      <div v-if="loading" class="text-muted">Loading notifications...</div>
      <div v-else class="space-y-2">
        <div v-for="notification in notifications" :key="notification.id" class="card">
          <div class="font-bold">{{ notification.type }}</div>
          <div class="text-sm text-muted">{{ notification.message }}</div>
          <div class="text-xs text-muted mt-1">{{ new Date(notification.createdAt).toLocaleString() }}</div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      notifications: [],
      loading: true
    };
  },
  mounted() {
    this.loadNotifications();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadNotifications());
  },
  unmounted() { if (this.sub) this.sub(); },
  methods: {
    async loadNotifications() {
      this.loading = true;
      try { this.notifications = await apiClient.get('/notifications?recipient=u1'); } catch (err) { console.error('Failed to load notifications', err); } finally { this.loading = false; }
    },
    async sendReminder() {
      try {
        await apiClient.post('/notifications/send', { type: 'Reminder', message: 'A reminder has been generated.', recipient: 'u1', status: 'Unread' });
        this.loadNotifications();
      } catch (err) { console.error('Failed to send reminder', err); }
    }
  }
};
