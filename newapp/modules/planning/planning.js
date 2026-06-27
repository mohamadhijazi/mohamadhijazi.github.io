import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const PlanningModule = {
  template: `
    <div class="planning-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Strategic Goals</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Goal</button>
      </div>
      
      <div v-if="loading" class="text-muted">Loading goals...</div>
      
      <div class="kanban-board" v-else>
        <!-- Column 1: Planned -->
        <div class="kanban-column">
          <h3 class="column-title">Planned</h3>
          <div class="kanban-cards">
            <div class="card goal-card" v-for="g in plannedGoals" :key="g.id">
              <div class="font-bold mb-1">{{ g.title }}</div>
              <p class="text-sm text-muted mb-2">{{ g.description }}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="badge badge-planned">{{ g.status }}</span>
                <button class="btn btn-small" @click="updateStatus(g, 'InProgress')">Start</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: In Progress -->
        <div class="kanban-column">
          <h3 class="column-title">In Progress</h3>
          <div class="kanban-cards">
            <div class="card goal-card border-l-blue" v-for="g in inProgressGoals" :key="g.id">
              <div class="font-bold mb-1">{{ g.title }}</div>
              <p class="text-sm text-muted mb-2">{{ g.description }}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="badge badge-inprogress">{{ g.status }}</span>
                <button class="btn btn-small" @click="updateStatus(g, 'Completed')">Complete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3: Completed -->
        <div class="kanban-column opacity-75">
          <h3 class="column-title">Completed</h3>
          <div class="kanban-cards">
            <div class="card goal-card border-l-green" v-for="g in completedGoals" :key="g.id">
              <div class="font-bold mb-1">{{ g.title }}</div>
              <p class="text-sm text-muted mb-2">{{ g.description }}</p>
              <div class="mt-2">
                <span class="badge badge-completed">{{ g.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Goal Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg font-bold">New Goal</h3>
          <input v-model="newGoal.title" placeholder="Goal Title" class="input mb-2 w-full" />
          <textarea v-model="newGoal.description" placeholder="Description" class="input mb-4 w-full"></textarea>
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveGoal">Save Goal</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      goals: [],
      loading: true,
      showAddModal: false,
      newGoal: { title: '', description: '' }
    };
  },
  computed: {
    plannedGoals() { return this.goals.filter(g => g.status === 'Planned'); },
    inProgressGoals() { return this.goals.filter(g => g.status === 'InProgress'); },
    completedGoals() { return this.goals.filter(g => g.status === 'Completed'); }
  },
  mounted() {
    this.loadGoals();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadGoals());
  },
  unmounted() {
    if (this.sub) this.sub();
  },
  methods: {
    async loadGoals() {
      this.loading = true;
      try {
        this.goals = await apiClient.get('/planning/goals');
      } catch (err) {
        console.error("Failed to load goals", err);
      } finally {
        this.loading = false;
      }
    },
    async saveGoal() {
      try {
        const payload = {
          ...this.newGoal,
          status: 'Planned',
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          workspaceId: 'w1'
        };
        const saved = await apiClient.post('/planning/goals', payload);
        this.goals.push(saved);
        this.showAddModal = false;
        this.newGoal = { title: '', description: '' };
      } catch (err) {
        console.error("Failed to save goal", err);
      }
    },
    async updateStatus(goal, newStatus) {
      try {
        const updated = { ...goal, status: newStatus };
        await apiClient.request(`/planning/goals/${goal.id}`, {
          method: 'PUT',
          body: JSON.stringify(updated)
        });
        const index = this.goals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          this.goals[index].status = newStatus;
        }
      } catch (err) {
        console.error("Failed to update goal status", err);
      }
    }
  }
};
