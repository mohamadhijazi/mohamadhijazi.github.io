import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const DataETLModule = {
  template: `
    <div class="data-etl-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Data ETL</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Source</button>
      </div>
      <div v-if="loading" class="text-muted">Loading connectors...</div>
      <div v-else class="grid gap-4">
        <div v-for="source in sources" :key="source.id" class="card">
          <div class="flex justify-between">
            <div>
              <h3 class="font-bold">{{ source.name }}</h3>
              <div class="text-sm text-muted">{{ source.type }} connector</div>
            </div>
            <button class="btn" @click="runImport(source)">Import</button>
          </div>
        </div>
      </div>
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg font-bold">New Data Source</h3>
          <input v-model="newSource.name" placeholder="Name" class="input mb-2 w-full" />
          <select v-model="newSource.type" class="input mb-2 w-full">
            <option value="REST">REST</option>
            <option value="JSON">JSON</option>
            <option value="Excel">Excel</option>
          </select>
          <textarea v-model="newSource.connectionConfig" placeholder="Connection config" class="input mb-4 w-full"></textarea>
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveSource">Save</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      sources: [],
      loading: true,
      showAddModal: false,
      newSource: { name: '', type: 'REST', connectionConfig: '{}' }
    };
  },
  mounted() {
    this.loadSources();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadSources());
  },
  unmounted() { if (this.sub) this.sub(); },
  methods: {
    async loadSources() {
      this.loading = true;
      try { this.sources = await apiClient.get('/etl/sources?workspaceId=w1'); } catch (err) { console.error('Failed to load ETL sources', err); } finally { this.loading = false; }
    },
    async saveSource() {
      try {
        const saved = await apiClient.post('/etl/sources', { ...this.newSource, workspaceId: 'w1' });
        this.sources.push(saved);
        this.showAddModal = false;
        this.newSource = { name: '', type: 'REST', connectionConfig: '{}' };
      } catch (err) { console.error('Failed to save ETL source', err); }
    },
    async runImport(source) {
      try {
        await apiClient.post('/etl/import', { sourceId: source.id });
        alert(`Import queued for ${source.name}`);
      } catch (err) { console.error('Failed to import data', err); }
    }
  }
};
