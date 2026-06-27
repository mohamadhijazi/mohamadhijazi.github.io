import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const RiskModule = {
  template: `
    <div class="risk-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Risk Register</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Risk</button>
      </div>
      
      <div v-if="loading" class="text-muted">Loading risk register...</div>
      
      <div v-else>
        <!-- Risk Metrics -->
        <div class="dashboard-grid mb-6">
          <div class="card summary-card border-l-red">
            <h3 class="text-muted text-sm uppercase">High Risks (Score 15+)</h3>
            <div class="text-2xl font-bold text-red">{{ highRisks }}</div>
          </div>
          <div class="card summary-card border-l-yellow">
            <h3 class="text-muted text-sm uppercase">Medium Risks (Score 8-14)</h3>
            <div class="text-2xl font-bold text-yellow">{{ mediumRisks }}</div>
          </div>
          <div class="card summary-card border-l-green">
            <h3 class="text-muted text-sm uppercase">Low Risks (Score < 8)</h3>
            <div class="text-2xl font-bold text-green">{{ lowRisks }}</div>
          </div>
        </div>

        <h3 class="text-lg mb-2">Registered Risks</h3>
        <div class="card p-0 overflow-hidden">
          <table class="risk-table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th class="text-center">Prob (1-5)</th>
                <th class="text-center">Severity (1-5)</th>
                <th class="text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="risks.length === 0">
                <td colspan="5" class="text-center text-muted">No risks registered.</td>
              </tr>
              <tr v-for="r in sortedRisks" :key="r.id">
                <td class="font-bold">{{ r.title }}</td>
                <td>{{ r.category }}</td>
                <td class="text-center">{{ r.probability }}</td>
                <td class="text-center">{{ r.severity }}</td>
                <td class="text-center">
                  <span class="badge" :class="getBadgeClass(r.probability * r.severity)">
                    {{ r.probability * r.severity }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Risk Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg font-bold">New Risk Entry</h3>
          <input v-model="newRisk.title" placeholder="Risk Title" class="input mb-2 w-full" />
          <input v-model="newRisk.category" placeholder="Category (e.g. Financial, Operational)" class="input mb-2 w-full" />
          <div class="flex gap-2 mb-2">
            <div class="w-full">
              <label class="text-sm text-muted">Probability (1-5)</label>
              <input type="number" min="1" max="5" v-model.number="newRisk.probability" class="input w-full" />
            </div>
            <div class="w-full">
              <label class="text-sm text-muted">Severity (1-5)</label>
              <input type="number" min="1" max="5" v-model.number="newRisk.severity" class="input w-full" />
            </div>
          </div>
          <textarea v-model="newRisk.description" placeholder="Description & Mitigation Plan" class="input mb-4 w-full"></textarea>
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveRisk">Save Risk</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      risks: [],
      loading: true,
      showAddModal: false,
      newRisk: { title: '', category: '', probability: 1, severity: 1, description: '' }
    };
  },
  computed: {
    highRisks() { return this.risks.filter(r => (r.probability * r.severity) >= 15).length; },
    mediumRisks() { return this.risks.filter(r => { const s = r.probability * r.severity; return s >= 8 && s < 15; }).length; },
    lowRisks() { return this.risks.filter(r => (r.probability * r.severity) < 8).length; },
    sortedRisks() {
      return [...this.risks].sort((a, b) => (b.probability * b.severity) - (a.probability * a.severity));
    }
  },
  mounted() {
    this.loadRisks();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadRisks());
  },
  unmounted() {
    if (this.sub) this.sub();
  },
  methods: {
    getBadgeClass(score) {
      if (score >= 15) return 'badge-red';
      if (score >= 8) return 'badge-yellow';
      return 'badge-green';
    },
    async loadRisks() {
      this.loading = true;
      try {
        this.risks = await apiClient.get('/risk/items');
      } catch (err) {
        console.error("Failed to load risks", err);
      } finally {
        this.loading = false;
      }
    },
    async saveRisk() {
      try {
        const payload = { ...this.newRisk, workspaceId: 'w1' };
        const saved = await apiClient.post('/risk/items', payload);
        this.risks.push(saved);
        this.showAddModal = false;
        this.newRisk = { title: '', category: '', probability: 1, severity: 1, description: '' };
      } catch (err) {
        console.error("Failed to save risk", err);
      }
    }
  }
};
