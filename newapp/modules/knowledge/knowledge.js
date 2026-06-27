import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const KnowledgeModule = {
  template: `
    <div class="knowledge-module">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Knowledge Base</h2>
        <div class="flex gap-2">
          <input v-model="searchQuery" placeholder="Search knowledge..." class="input" style="min-width: 250px;" />
          <button class="btn btn-primary" @click="showAddModal = true">Add Entry</button>
        </div>
      </div>
      
      <div v-if="loading" class="text-muted">Loading knowledge library...</div>
      
      <div v-else class="knowledge-grid">
        <div v-if="filteredItems.length === 0" class="col-span-full text-center p-8 text-muted border-dashed border-2 rounded">
          No knowledge entries found matching your search.
        </div>
        
        <div v-for="item in filteredItems" :key="item.id" class="card knowledge-card">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg">{{ item.title }}</h3>
            <span class="badge badge-category">{{ item.category }}</span>
          </div>
          <p class="knowledge-content text-muted text-sm mb-4">{{ item.content }}</p>
          <div class="flex gap-1 flex-wrap">
            <span v-for="tag in getTags(item.tags)" :key="tag" class="tag-pill">#{{ tag.trim() }}</span>
          </div>
        </div>
      </div>

      <!-- Add Knowledge Modal -->
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content card" style="max-width: 600px;">
          <h3 class="mb-4 text-lg font-bold">New Knowledge Entry</h3>
          
          <input v-model="newItem.title" placeholder="Title" class="input mb-2 w-full" />
          
          <select v-model="newItem.category" class="input mb-2 w-full">
            <option value="Reflection">Reflection</option>
            <option value="Technical">Technical</option>
            <option value="Family">Family</option>
            <option value="Biography">Biography</option>
            <option value="Other">Other</option>
          </select>
          
          <textarea v-model="newItem.content" placeholder="Content (Markdown supported in future...)" class="input mb-2 w-full" style="min-height: 150px;"></textarea>
          
          <input v-model="newItem.tags" placeholder="Tags (comma separated)" class="input mb-4 w-full" />
          
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="saveItem">Save</button>
            <button class="btn" @click="showAddModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      items: [],
      loading: true,
      searchQuery: '',
      showAddModal: false,
      newItem: { title: '', content: '', category: 'Reflection', tags: '' }
    };
  },
  computed: {
    filteredItems() {
      const q = this.searchQuery.toLowerCase();
      if (!q) return this.items;
      return this.items.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.content.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q)
      );
    }
  },
  mounted() {
    this.loadItems();
    this.sub = eventBus.subscribe('WorkspaceChanged', () => this.loadItems());
  },
  unmounted() {
    if (this.sub) this.sub();
  },
  methods: {
    getTags(tagString) {
      if (!tagString) return [];
      return tagString.split(',').filter(t => t.trim().length > 0);
    },
    async loadItems() {
      this.loading = true;
      try {
        this.items = await apiClient.get('/knowledge/items');
      } catch (err) {
        console.error("Failed to load knowledge items", err);
      } finally {
        this.loading = false;
      }
    },
    async saveItem() {
      try {
        const payload = { ...this.newItem, workspaceId: 'w1' };
        const saved = await apiClient.post('/knowledge/items', payload);
        this.items.push(saved);
        this.showAddModal = false;
        this.newItem = { title: '', content: '', category: 'Reflection', tags: '' };
      } catch (err) {
        console.error("Failed to save knowledge item", err);
      }
    }
  }
};
