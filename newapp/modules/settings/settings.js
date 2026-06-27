import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const SettingsModule = {
  template: `
    <div class="settings-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Settings</h2>
        <button class="btn btn-primary" @click="saveSettings">Save</button>
      </div>
      <div class="grid gap-4">
        <div class="card">
          <h3 class="text-lg mb-2">Preferences</h3>
          <label class="block mb-2">Theme
            <select v-model="settings.theme" class="input w-full mt-1">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label class="block mb-2">Language
            <input v-model="settings.language" class="input w-full mt-1" />
          </label>
          <label class="block mb-2">Notifications
            <select v-model="settings.notificationMode" class="input w-full mt-1">
              <option value="all">All</option>
              <option value="reminders">Reminders</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
        <div class="card">
          <h3 class="text-lg mb-2">Cloud Storage Consent</h3>
          <label class="block mb-2">Provider
            <select v-model="settings.storageProvider" class="input w-full mt-1">
              <option value="none">None</option>
              <option value="google">Google Drive</option>
              <option value="microsoft">Microsoft OneDrive</option>
            </select>
          </label>
          <label class="block mb-2">
            <input type="checkbox" v-model="settings.consentGranted" />
            I consent to using my selected cloud folder for app data.
          </label>
          <label class="block mb-2">Folder ID
            <input v-model="settings.folderId" class="input w-full mt-1" placeholder="Optional folder identifier" />
          </label>
          <div class="flex gap-2 mb-2">
            <button class="btn" @click="connectGoogle">Connect Google</button>
            <button class="btn" @click="connectMicrosoft">Connect Microsoft</button>
          </div>
          <div class="text-sm text-muted">Explicit consent is required for Drive and OneDrive folder access.</div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      settings: { theme: 'light', language: 'en', notificationMode: 'all', consentGranted: false, storageProvider: 'none', consentScope: 'files.readwrite', folderId: '' }
    };
  },
  mounted() {
    this.loadSettings();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadSettings());
  },
  unmounted() { if (this.sub) this.sub(); },
  methods: {
    async loadSettings() {
      try { const data = await apiClient.get('/settings?userId=u1'); this.settings = { ...this.settings, ...data }; } catch (err) { console.error('Failed to load settings', err); }
    },
    async saveSettings() {
      try { await apiClient.request('/settings', { method: 'PUT', body: JSON.stringify({ ...this.settings, userId: 'u1' }) }); } catch (err) { console.error('Failed to save settings', err); }
    },
    async connectGoogle() {
      try {
        this.settings.storageProvider = 'google';
        this.settings.consentGranted = true;
        await apiClient.post('/settings/integrations/google/connect', {});
        await this.saveSettings();
        alert('Google Drive consent enabled.');
      } catch (err) { console.error('Failed to connect Google', err); }
    },
    async connectMicrosoft() {
      try {
        this.settings.storageProvider = 'microsoft';
        this.settings.consentGranted = true;
        await apiClient.post('/settings/integrations/microsoft/connect', {});
        await this.saveSettings();
        alert('Microsoft OneDrive consent enabled.');
      } catch (err) { console.error('Failed to connect Microsoft', err); }
    }
  }
};
