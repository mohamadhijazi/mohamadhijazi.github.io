import { apiClient } from '../../shared/apiClient.js';
import { eventBus } from '../../shared/eventBus.js';

export const FinanceModule = {
  template: `
    <div class="finance-module">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Financial Dashboard</h2>
        <button class="btn btn-primary" @click="showAddModal = true">Add Entry</button>
      </div>
      
      <div v-if="loading" class="text-muted">Loading financial data...</div>
      
      <div v-else>
        <div class="dashboard-grid mb-6">
          <div class="card summary-card border-l-green">
            <h3 class="text-muted text-sm uppercase">Total Income</h3>
            <div class="text-2xl font-bold text-green">\${{ totalIncome.toFixed(2) }}</div>
          </div>
          <div class="card summary-card border-l-red">
            <h3 class="text-muted text-sm uppercase">Total Expenses</h3>
            <div class="text-2xl font-bold text-red">\${{ totalExpense.toFixed(2) }}</div>
          </div>
          <div class="card summary-card border-l-blue">
            <h3 class="text-muted text-sm uppercase">Net Balance</h3>
            <div class="text-2xl font-bold" :class="netBalance >= 0 ? 'text-green' : 'text-red'">\${{ netBalance.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Forecast Chart -->
        <div class="card mb-6">
          <h3 class="text-lg font-bold mb-3">Income & Expense Forecast</h3>
          <canvas id="finance-chart"></canvas>
        </div>

        <h3 class="text-lg mb-2">Recent Transactions</h3>
        <div class="card p-0 overflow-hidden">
          <table class="finance-table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="entries.length === 0">
                <td colspan="4" class="text-center text-muted">No transactions found.</td>
              </tr>
              <tr v-for="entry in sortedEntries" :key="entry.id">
                <td>{{ new Date(entry.date).toLocaleDateString() }}</td>
                <td>{{ entry.category }}</td>
                <td>
                  <span class="badge" :class="entry.type === 'Income' ? 'badge-completed' : 'badge-red'">{{ entry.type }}</span>
                </td>
                <td class="text-right font-bold" :class="entry.type === 'Income' ? 'text-green' : 'text-red'">
                  {{ entry.type === 'Income' ? '+' : '-' }}\${{ entry.amount.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Entry Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg font-bold">New Transaction</h3>
          <select v-model="newEntry.type" class="input mb-2 w-full">
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <input type="number" step="0.01" v-model.number="newEntry.amount" placeholder="Amount" class="input mb-2 w-full" />
          <input v-model="newEntry.category" placeholder="Category (e.g. Salary, Groceries)" class="input mb-2 w-full" />
          <input type="date" v-model="newEntry.date" class="input mb-4 w-full" />
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveEntry">Save</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      entries: [],
      loading: true,
      showAddModal: false,
      newEntry: { type: 'Expense', amount: null, category: '', date: new Date().toISOString().split('T')[0] },
      chart: null
    };
  },
  computed: {
    totalIncome() {
      return this.entries.filter(e => e.type === 'Income').reduce((sum, e) => sum + e.amount, 0);
    },
    totalExpense() {
      return this.entries.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0);
    },
    netBalance() {
      return this.totalIncome - this.totalExpense;
    },
    sortedEntries() {
      return [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  mounted() {
    this.loadEntries();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadEntries());
  },
  unmounted() {
    if (this.sub) this.sub();
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    initChart() {
      const ctx = document.getElementById('finance-chart');
      if (!ctx) return;

      // Prepare monthly data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const incomeData = [0, 0, 0, 0, 0, 0];
      const expenseData = [0, 0, 0, 0, 0, 0];
      
      // Populate from entries
      this.entries.forEach(e => {
        const date = new Date(e.date);
        const monthIndex = date.getMonth(); // 0-11
        if (monthIndex < 6) { // Use last 6 months
          if (e.type === 'Income') {
            incomeData[monthIndex] += e.amount;
          } else {
            expenseData[monthIndex] += e.amount;
          }
        }
      });

      // Create chart
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.2)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Expense',
              data: expenseData,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239,68,68,0.2)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    },
    async loadEntries() {
      this.loading = true;
      try {
        this.entries = await apiClient.get('/finance/entries?workspaceId=w1');
        this.$nextTick(() => this.initChart());
      } catch (err) {
        console.error("Failed to load financial entries", err);
      } finally {
        this.loading = false;
      }
    },
    async saveEntry() {
      try {
        const payload = {
          ...this.newEntry,
          date: new Date(this.newEntry.date).toISOString(),
          workspaceId: 'w1'
        };
        const saved = await apiClient.post('/finance/entries', payload);
        this.entries.push(saved);
        this.showAddModal = false;
        this.newEntry = { type: 'Expense', amount: null, category: '', date: new Date().toISOString().split('T')[0] };
        // Refresh chart after adding entry
        if (this.chart) {
          this.chart.destroy();
          this.initChart();
        }
      } catch (err) {
        console.error("Failed to save financial entry", err);
      }
    }
  }
};
